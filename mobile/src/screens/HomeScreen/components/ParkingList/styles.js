import { StyleSheet, Platform } from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    // Loading State
    fullScreenBg: {
        flex: 1,
        backgroundColor: PALETTE.vanilla[800]
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingIcon: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: alpha(PALETTE.earth_yellow[300], 0.1),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '600',
        color: TOKENS.text,
        marginBottom: 2
    },
    loadingSubtext: {
        fontSize: 13,
        color: TOKENS.textMuted
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: alpha(PALETTE.vanilla[600], 0.3),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24
    },
    emptyText: { 
        fontSize: 18, 
        fontWeight: '800', 
        color: TOKENS.text, 
        marginBottom: 8 
    },
    emptySubtext: {
        fontSize: 14,
        color: TOKENS.textMuted,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20
    },
    emptyActions: { 
        flexDirection: 'row', 
        gap: 12 
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: TOKENS.primary,
        borderRadius: 20,
        gap: 6
    },
    emptyButtonSecondary: {
        backgroundColor: PALETTE.vanilla[700],
        borderWidth: 1,
        borderColor: alpha(PALETTE.earth_yellow[400], 0.2)
    },
    emptyButtonText: { 
        fontSize: 14, 
        fontWeight: '800', 
        color: '#fff' 
    },
    emptyButtonTextSecondary: { 
        color: TOKENS.text, 
        fontWeight: '800' 
    }
});