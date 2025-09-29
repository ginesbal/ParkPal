import { StyleSheet } from 'react-native';
import { PALETTE } from '../../constants/theme';

/**
 * Main SessionScreen container styles
 * Minimal styles as most styling is handled by child components
 */
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.vanilla[800], // Light background color
    },
});