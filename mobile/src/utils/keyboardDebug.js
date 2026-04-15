// Debug helper for diagnosing the "keyboard dismisses instantly on tap" bug.
//
// Install once (from App.js). It:
//   1. Wraps Keyboard.dismiss so every caller is logged with a stack trace —
//      this tells us WHO is dismissing the keyboard when the user taps the
//      search bar.
//   2. Adds listeners for keyboardWillShow / keyboardDidShow / keyboardWillHide /
//      keyboardDidHide so we can see the full native timeline.
//
// All logs are tagged with `kbd_*` so they're easy to grep in the log stream
// or exported AsyncStorage payload.
//
// This module is a no-op in production builds (gated on __DEV__).

import { Keyboard } from 'react-native';
import { logger } from './loggers';

let installed = false;

// Relative-ms timestamp since install — easier to read than absolute ISO.
let t0 = 0;
const ts = () => Date.now() - t0;

function shortStack(skipFrames = 2) {
    // Capture a stack trace and strip the top frames (this function + wrapper)
    // so the "interesting" caller is at the top of the output.
    const raw = new Error().stack || '';
    const lines = raw.split('\n').slice(skipFrames, skipFrames + 6);
    return lines.map((l) => l.trim()).join(' <- ');
}

export function installKeyboardDebug() {
    if (installed || !__DEV__) return;
    installed = true;
    t0 = Date.now();

    // --- wrap Keyboard.dismiss --------------------------------------------
    const originalDismiss = Keyboard.dismiss?.bind(Keyboard);
    if (originalDismiss) {
        Keyboard.dismiss = function patchedDismiss(...args) {
            logger.log('kbd_dismiss_called', {
                t: ts(),
                stack: shortStack(2),
            }, 'KBD');
            return originalDismiss(...args);
        };
    }

    // --- native keyboard lifecycle events ---------------------------------
    const events = [
        'keyboardWillShow',
        'keyboardDidShow',
        'keyboardWillHide',
        'keyboardDidHide',
        'keyboardWillChangeFrame',
    ];
    for (const evt of events) {
        try {
            Keyboard.addListener(evt, (e) => {
                logger.log(`kbd_${evt}`, {
                    t: ts(),
                    endCoordinates: e?.endCoordinates,
                    duration: e?.duration,
                }, 'KBD');
            });
        } catch {
            // some events aren't supported on all platforms — ignore
        }
    }

    logger.log('kbd_debug_installed', { t: 0 }, 'KBD');
}

// Exposed so other modules can piggy-back on the same clock.
export const kbdDebugTs = ts;
