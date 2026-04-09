import { Platform, StyleSheet } from 'react-native';
import { SHADOWS, TOKENS } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    mapFab: {
        position: 'absolute',
        bottom: 24,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        backgroundColor: TOKENS.primary,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: TOKENS.primaryAlt,
        ...Platform.select({
            ios: SHADOWS.md,
            android: {
                elevation: 8,
            }
        })
    },
    mapFabPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.94,
    },
    mapFabLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.2
    }
});
