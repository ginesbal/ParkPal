import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Collapsed shows just the drag handle + "spots nearby" header
// 80px provides enough space for handle + header with proper spacing
const SHEET_MIN_HEIGHT = 80;

// Header dimensions for proper spacing
// Search section: 68px, Filter bar: 77px
const HEADER_CONTENT_HEIGHT = 145;

export { SCREEN_HEIGHT, SCREEN_WIDTH, SHEET_MIN_HEIGHT, HEADER_CONTENT_HEIGHT };