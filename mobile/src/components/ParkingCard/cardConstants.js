import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CARD_WIDTH = Math.min(SCREEN_WIDTH - 20, 420);
export const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.6, 520);

// for horizontal page sizing
export const CONTENT_PAD = 24;
export const CONTENT_WIDTH = CARD_WIDTH - CONTENT_PAD * 2;

export { SCREEN_HEIGHT, SCREEN_WIDTH };
