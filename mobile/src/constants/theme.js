
export const PALETTE = {
    vanilla: {
        DEFAULT: '#ece4b7',
        100: '#423b12',
        200: '#847623',
        300: '#c6b035',
        400: '#dacb74',
        500: '#ece4b7',
        600: '#f0e9c5',
        700: '#f3efd3',
        800: '#f7f4e2',
        900: '#fbfaf0',
    },
    straw: {
        DEFAULT: '#d9dd92',
        100: '#363812',
        200: '#6c7023',
        300: '#a2a735',
        400: '#c5cb5b',
        500: '#d9dd92',
        600: '#e1e4a8',
        700: '#e8eabe',
        800: '#f0f1d4',
        900: '#f7f8e9',
    },
    earth_yellow: {
        DEFAULT: '#eabe7c',
        100: '#3d290a',
        200: '#7b5214',
        300: '#b87b1e',
        400: '#e09f3e',
        500: '#eabe7c',
        600: '#eecb96',
        700: '#f2d8b0',
        800: '#f6e5ca',
        900: '#fbf2e5',
    },
    flame: {
        DEFAULT: '#dd6031',
        100: '#2e1208',
        200: '#5d240f',
        300: '#8b3617',
        400: '#ba481e',
        500: '#dd6031',
        600: '#e47f5a',
        700: '#eb9f83',
        800: '#f2bfad',
        900: '#f8dfd6',
    },
    bistre: {
        DEFAULT: '#311e10',
        100: '#0a0603',
        200: '#140c06',
        300: '#1e120a',
        400: '#28180d',
        500: '#311e10',
        600: '#754726',
        700: '#b8703c',
        800: '#d49f79',
        900: '#e9cfbc',
    },
};

export const TOKENS = {
    bg: '#fafafa', // Cleaner, lighter background
    surface: '#ffffff',
    surfaceMuted: PALETTE.vanilla[900], // More subtle
    surfaceRaised: '#ffffff',
    stroke: '#e5e5e5', // Neutral gray for dividers
    strokeLight: '#f5f5f5', // Even lighter divider
    text: '#1a1a1a', // Higher contrast for readability
    textMuted: '#737373', // Neutral gray instead of warm brown
    textLight: '#a3a3a3', // For secondary info
    primary: PALETTE.flame.DEFAULT,
    primaryAlt: PALETTE.flame[300],
    accent: PALETTE.earth_yellow.DEFAULT,
    accentAlt: PALETTE.straw.DEFAULT,
    danger: PALETTE.flame.DEFAULT,
    success: '#10b981', // More standard green for success
    warning: PALETTE.earth_yellow.DEFAULT,
};

export const alpha = (hex, a) => {
    const h = hex.replace('#', '');
    const n = parseInt(h, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

