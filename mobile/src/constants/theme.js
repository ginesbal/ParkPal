export function alpha(hex, a) {
    const h = hex.replace('#', '');
    const n = parseInt(h, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export const PALETTE = {
    amber: {
        DEFAULT: '#b8832d',
        50: '#fbf6eb',
        100: '#f4e9cf',
        200: '#ead4a2',
        300: '#dbb66b',
        400: '#c99740',
        500: '#b8832d',
        600: '#986b24',
        700: '#78531d',
        800: '#594016',
        900: '#3c2b10',
    },
    cream: {
        DEFAULT: '#e4ebf4',
        50: '#f7f9fc',
        100: '#eff3f8',
        200: '#e4ebf4',
        300: '#d5e0ec',
        400: '#bdcddd',
        500: '#a2b6ca',
        600: '#8096ac',
        700: '#60758c',
        800: '#45586c',
        900: '#2b3746',
    },
    cerulean: {
        DEFAULT: '#1d6d8b',
        50: '#edf6f9',
        100: '#d7ebf2',
        200: '#b3d6e4',
        300: '#83bad0',
        400: '#549bb8',
        500: '#1d6d8b',
        600: '#185a74',
        700: '#15495d',
        800: '#103746',
        900: '#0c2833',
    },
    yale: {
        DEFAULT: '#45627d',
        50: '#eff3f6',
        100: '#dbe4ec',
        200: '#c2d1de',
        300: '#9db3c7',
        400: '#758fa8',
        500: '#45627d',
        600: '#365067',
        700: '#2b4255',
        800: '#1e303e',
        900: '#14222e',
    },
    prussian: {
        DEFAULT: '#17324a',
        50: '#ecf2f7',
        100: '#d3deea',
        200: '#aec1d3',
        300: '#80a0ba',
        400: '#587a97',
        500: '#17324a',
        600: '#142c42',
        700: '#112539',
        800: '#0c1c2c',
        900: '#09131d',
    },
};

export const TOKENS = {
    bg: '#f4f7fb',
    surface: '#ffffff',
    surfaceMuted: '#edf2f7',
    surfaceRaised: '#ffffff',
    surfaceOverlay: 'rgba(255, 255, 255, 0.96)',
    surfaceAccent: alpha(PALETTE.cerulean[500], 0.08),
    stroke: '#dbe3ec',
    strokeStrong: '#c7d3e0',
    strokeLight: '#ebf0f5',
    text: PALETTE.prussian[500],
    textMuted: PALETTE.yale[500],
    textLight: PALETTE.yale[400],
    primary: PALETTE.cerulean[500],
    primaryAlt: PALETTE.cerulean[700],
    primarySoft: alpha(PALETTE.cerulean[500], 0.1),
    accent: PALETTE.cerulean[500],
    accentAlt: PALETTE.cerulean[400],
    danger: '#c55d54',
    dangerSoft: 'rgba(197, 93, 84, 0.12)',
    success: '#27806f',
    successSoft: 'rgba(39, 128, 111, 0.12)',
    warning: PALETTE.amber[500],
    warningSoft: alpha(PALETTE.amber[500], 0.12),
    shadow: PALETTE.prussian[900],
    focus: alpha(PALETTE.cerulean[500], 0.18),
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
};

export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const SHADOWS = {
    sm: {
        shadowColor: TOKENS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    md: {
        shadowColor: TOKENS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 5,
    },
    lg: {
        shadowColor: TOKENS.shadow,
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.1,
        shadowRadius: 28,
        elevation: 8,
    },
};
