

import * as FileSystem from 'expo-file-system';
import { debugLogger } from './DebugLogger';
import simpleLogger from './SimpleLogger';

const FILE_NAME = 'activity-log.txt';
const MAX_BUFFER = 25;

const now = () => new Date().toISOString();

// split long strings so they wrap across lines
function wrapString(str, width = 120) {
    if (typeof str !== 'string') return str;
    if (str.length <= width) return str;
    const parts = [];
    for (let i = 0; i < str.length; i += width) {
        parts.push(str.slice(i, i + width));
    }
    return parts.join('\n');
}

// safe clone with wrapped strings and shallow truncation for big arrays/objects
function normalize(entry) {
    const seen = new WeakSet();
    const MAX_ARRAY_PREVIEW = 50;

    function walk(val, depth = 0) {
        if (val === null || val === undefined) return val;
        if (typeof val === 'string') return wrapString(val, 120);
        if (typeof val === 'number' || typeof val === 'boolean') return val;
        if (typeof val === 'function') return '[Function]';
        if (val instanceof Error) return `${val.name}: ${val.message}`;

        if (Array.isArray(val)) {
            if (val.length > MAX_ARRAY_PREVIEW) {
                return {
                    _type: 'Array',
                    _length: val.length,
                    _preview: val.slice(0, MAX_ARRAY_PREVIEW).map((x) => walk(x, depth + 1)),
                    _note: `truncated to ${MAX_ARRAY_PREVIEW} items`,
                };
            }
            return val.map((x) => walk(x, depth + 1));
        }

        if (typeof val === 'object') {
            if (seen.has(val)) return '[Circular]';
            seen.add(val);
            const out = {};
            Object.keys(val).forEach((k) => { out[k] = walk(val[k], depth + 1); });
            return out;
        }

        try { return String(val); } catch { return '[Unserializable]'; }
    }

    return walk(entry);
}

// pretty print with separators
function formatEntry(entry) {
    const normalized = normalize({
        t: entry?.timestamp || now(),
        type: entry?.type || 'INFO',
        message: entry?.message || entry?.action || entry?.msg || '',
        context: entry?.context || null,
        data: entry?.data ?? null,
        sessionId: entry?.sessionId ?? null,
        source: entry?.source || 'app',
    });

    const json = JSON.stringify(normalized, null, 2); // multi-line
    return [
        '==== log entry ============================================================',
        json,
        '' // trailing newline
    ].join('\n');
}

class LogFile {
    constructor() {
        this.fileUri = `${FileSystem.documentDirectory}${FILE_NAME}`;
        this.buffer = [];
        this.isFlushing = false;
        this.hooked = false;
    }

    record(entry) {
        try {
            this.buffer.push(formatEntry(entry));
            if (this.buffer.length >= MAX_BUFFER) this.flush();
        } catch (_) {
            // never throw from logging
        }
    }

    async ensureFile() {
        const info = await FileSystem.getInfoAsync(this.fileUri);
        if (!info.exists) {
            await FileSystem.writeAsStringAsync(this.fileUri, '', { encoding: FileSystem.EncodingType.UTF8 });
        }
    }

    async flush() {
        if (this.isFlushing || this.buffer.length === 0) return;
        this.isFlushing = true;
        try {
            await this.ensureFile();
            const existing = await FileSystem.readAsStringAsync(this.fileUri, { encoding: FileSystem.EncodingType.UTF8 });
            const chunk = this.buffer.join('\n');
            this.buffer = [];
            await FileSystem.writeAsStringAsync(this.fileUri, existing + chunk, { encoding: FileSystem.EncodingType.UTF8 });
        } catch (_) {
            // best-effort only
        } finally {
            this.isFlushing = false;
        }
    }

    async flushNow() {
        await this.flush();
    }

    getFileUri() {
        return this.fileUri;
    }

    // runtime hooks so no changes needed elsewhere
    hook() {
        if (this.hooked) return;
        this.hooked = true;

        // simplelogger.log(action, data)
        const _simpleLog = simpleLogger.log.bind(simpleLogger);
        simpleLogger.log = (action, data = null, type = 'INFO') => {
            const res = _simpleLog(action, data, type);
            const last = simpleLogger.logs?.[simpleLogger.logs.length - 1];
            this.record(last || {
                timestamp: now(),
                type,
                action,
                data,
                sessionId: simpleLogger.sessionId,
                source: 'simplelogger',
            });
            if ((simpleLogger.logs?.length || 0) % 25 === 0) this.flush();
            return res;
        };

        // debuglogger.addLog(entry)
        const _addLog = debugLogger.addLog.bind(debugLogger);
        debugLogger.addLog = (entry) => {
            const res = _addLog(entry);
            this.record({ ...entry, source: 'debuglogger' });
            if ((debugLogger.logs?.length || 0) % 25 === 0) this.flush();
            return res;
        };

        // console taps
        const originalLog = console.log.bind(console);
        const originalWarn = console.warn.bind(console);
        const originalError = console.error.bind(console);

        const stringifyArgs = (args) => {
            try {
                return args.map((a) => {
                    if (typeof a === 'string') return wrapString(a);
                    if (a instanceof Error) return `${a.name}: ${a.message}`;
                    return normalize(a);
                });
            } catch {
                return '[unserializable console args]';
            }
        };

        console.log = (...args) => {
            try { this.record({ timestamp: now(), type: 'CONSOLE', message: 'console.log', data: stringifyArgs(args), source: 'console.log' }); } catch { }
            originalLog(...args);
        };
        console.warn = (...args) => {
            try { this.record({ timestamp: now(), type: 'WARN', message: 'console.warn', data: stringifyArgs(args), source: 'console.warn' }); } catch { }
            originalWarn(...args);
        };
        console.error = (...args) => {
            try { this.record({ timestamp: now(), type: 'ERROR', message: 'console.error', data: stringifyArgs(args), source: 'console.error' }); } catch { }
            originalError(...args);
        };
    }
}

export const logFile = new LogFile();
export default logFile;
