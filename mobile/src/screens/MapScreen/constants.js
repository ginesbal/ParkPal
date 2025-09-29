import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Collapsed shows just the drag handle + "spots nearby" header
// 80px provides enough space for handle + header with proper spacing
const SHEET_MIN_HEIGHT = 80;

export { SCREEN_HEIGHT, SCREEN_WIDTH, SHEET_MIN_HEIGHT };