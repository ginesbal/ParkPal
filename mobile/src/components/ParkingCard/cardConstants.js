import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// card size
export const CARD_WIDTH = Math.min(SCREEN_WIDTH - 16, 420);
export const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.6, 520);

// back content padding & width (used for exact page sizing)
export const CONTENT_PAD = 16;
export const CONTENT_WIDTH = CARD_WIDTH - CONTENT_PAD * 2;

export { SCREEN_WIDTH, SCREEN_HEIGHT };