import { Platform, StyleSheet } from 'react-native';
import { SHADOWS, TOKENS, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 184,
    },

    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: TOKENS.strokeLight,
        backgroundColor: TOKENS.surface,
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    locationText: {
        flex: 1,
        fontSize: 13,
        color: TOKENS.textMuted,
        fontWeight: '600',
        textAlign: 'right',
    },

    timerCard: {
        backgroundColor: TOKENS.surface,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
        ...Platform.select({
            ios: SHADOWS.md,
            android: {
                elevation: 5,
            },
        }),
    },
    timerCardWarning: {
        backgroundColor: TOKENS.warningSoft,
        borderColor: alpha(TOKENS.warning, 0.3),
    },
    timerCardDanger: {
        backgroundColor: TOKENS.dangerSoft,
        borderColor: alpha(TOKENS.danger, 0.3),
    },
    timerLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: TOKENS.textMuted,
        letterSpacing: 0.2,
        marginBottom: 8,
    },
    timerValue: {
        fontSize: 48,
        fontWeight: '900',
        color: TOKENS.text,
        letterSpacing: -1.1,
        marginBottom: 20,
        fontVariant: ['tabular-nums'],
    },
    timerValueWarning: {
        color: TOKENS.warning,
    },
    timerValueDanger: {
        color: TOKENS.danger,
    },
    progressContainer: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        backgroundColor: TOKENS.surfaceMuted,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: TOKENS.primary,
        borderRadius: 4,
    },
    progressBarWarning: {
        backgroundColor: TOKENS.warning,
    },
    progressBarDanger: {
        backgroundColor: TOKENS.danger,
    },
    timerMeta: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    timerMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timerMetaText: {
        fontSize: 13,
        color: TOKENS.textMuted,
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },

    quickActions: {
        marginHorizontal: 20,
        marginTop: 24,
    },
    quickActionsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: TOKENS.text,
        marginBottom: 12,
        letterSpacing: 0.2,
    },
    extendGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    extendButton: {
        flex: 1,
        backgroundColor: TOKENS.surface,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: alpha(TOKENS.primary, 0.18),
    },
    extendButtonHighlight: {
        backgroundColor: TOKENS.primarySoft,
        borderColor: TOKENS.primary,
    },
    extendButtonDisabled: {
        opacity: 0.5,
        borderColor: TOKENS.stroke,
    },
    extendTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    extendButtonText: {
        fontSize: 12,
        fontWeight: '800',
        color: TOKENS.primary,
        marginTop: 0,
    },
    extendButtonTextDisabled: {
        color: TOKENS.textMuted,
    },
    extendButtonCost: {
        fontSize: 11,
        color: TOKENS.textMuted,
        marginTop: 2,
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },
    extendButtonCostDisabled: {
        color: alpha(TOKENS.textMuted, 0.5),
    },

    detailsCard: {
        backgroundColor: TOKENS.surface,
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
    },
    detailsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: TOKENS.text,
        marginBottom: 16,
        letterSpacing: 0.2,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    detailIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: TOKENS.surfaceMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        color: TOKENS.textMuted,
        marginBottom: 4,
        letterSpacing: 0.2,
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '700',
        color: TOKENS.text,
    },
    detailSubvalue: {
        fontSize: 13,
        color: TOKENS.textMuted,
        marginTop: 2,
        fontVariant: ['tabular-nums'],
    },

    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: TOKENS.surface,
        borderTopWidth: 1,
        borderTopColor: TOKENS.strokeLight,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    endButton: {
        minHeight: 52,
        borderRadius: 16,
        backgroundColor: TOKENS.danger,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    endButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.2,
    },
    bottomHint: {
        fontSize: 12,
        color: TOKENS.textMuted,
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '500',
        lineHeight: 18,
    },
});
