import { Platform, StyleSheet } from 'react-native';
import { PALETTE, SHADOWS, TOKENS } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    // Loading State
    fullScreenBg: {
        flex: 1,
        backgroundColor: TOKENS.bg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingIcon: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: TOKENS.primarySoft,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '700',
        color: TOKENS.text,
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    loadingSubtext: {
        fontSize: 14,
        color: TOKENS.textMuted,
        marginBottom: 24,
    },
    loadingSkeletonStack: {
        width: '100%',
        gap: 12,
    },
    loadingSkeletonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderRadius: 18,
        backgroundColor: TOKENS.surface,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
        ...Platform.select({
            ios: SHADOWS.sm,
            android: { elevation: 2 },
        }),
    },
    loadingSkeletonBadge: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: TOKENS.surfaceMuted,
    },
    loadingSkeletonContent: {
        flex: 1,
        gap: 8,
    },
    loadingSkeletonLineWide: {
        width: '78%',
        height: 12,
        borderRadius: 6,
        backgroundColor: TOKENS.surfaceMuted,
    },
    loadingSkeletonLine: {
        width: '56%',
        height: 10,
        borderRadius: 5,
        backgroundColor: TOKENS.surfaceMuted,
    },
    loadingSkeletonPrice: {
        width: 54,
        height: 24,
        borderRadius: 12,
        backgroundColor: TOKENS.surfaceMuted,
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 28,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: TOKENS.surfaceMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyIconError: {
        backgroundColor: TOKENS.dangerSoft,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '800',
        color: TOKENS.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    emptySubtext: {
        fontSize: 14,
        color: TOKENS.textMuted,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 21,
    },
    emptyActions: {
        width: '100%',
        gap: 12,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: TOKENS.primary,
        borderRadius: 16,
        gap: 8,
    },
    emptyButtonSecondary: {
        backgroundColor: TOKENS.surface,
        borderWidth: 1,
        borderColor: TOKENS.stroke,
    },
    emptyButtonPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.98 }],
    },
    emptyButtonText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#fff',
    },
    emptyButtonTextSecondary: {
        color: TOKENS.text,
        fontWeight: '800',
    },
});
