import { StyleSheet, Platform } from 'react-native';
import { TOKENS, PALETTE, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    mapFab: {
        position: 'absolute',
        bottom: 24,
        right: 16,
        alignItems: 'center'
    },
    mapFabInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: TOKENS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        ...Platform.select({
            ios: {
                shadowColor: PALETTE.bistre?.[800] ?? '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            }
        })
    },
    mapFabLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: TOKENS.primary,
        backgroundColor: alpha('#FFFFFF', 0.9),
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10
    }
});
