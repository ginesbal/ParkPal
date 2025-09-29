import { Platform, StyleSheet } from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    // container styles
    scrollContent: {
        paddingBottom: 180,
    },

    // header styles
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: alpha(TOKENS.stroke, 0.2),
        backgroundColor: TOKENS.surface,
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationText: {
        fontSize: 13,
        color: TOKENS.textMuted,
        fontWeight: '600',
    },

    // timer card styles
    timerCard: {
        backgroundColor: TOKENS.surface,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: alpha(TOKENS.stroke, 0.3),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 10 },
            },
            android: {
                elevation: 5,
            },
        }),
    },
    timerCardWarning: {
        backgroundColor: alpha(TOKENS.warning, 0.05),
        borderColor: alpha(TOKENS.warning, 0.3),
    },
    timerCardDanger: {
        backgroundColor: alpha(TOKENS.danger, 0.05),
        borderColor: alpha(TOKENS.danger, 0.3),
    },
    timerLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: TOKENS.textMuted,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    timerValue: {
        fontSize: 48,
        fontWeight: '900',
        color: TOKENS.text,
        letterSpacing: -1,
        marginBottom: 20,
        // optional: helps keep digits aligned if you enabled seconds
        // fontVariant: ['tabular-nums'],
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
        backgroundColor: alpha(TOKENS.stroke, 0.2),
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
        backgroundColor: PALETTE.straw[300],
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
        gap: 20,
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
    },

    // Quick Actions styles
    quickActions: {
        marginHorizontal: 20,
        marginTop: 24,
    },
    quickActionsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: TOKENS.text,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
        borderWidth: 2,
        borderColor: alpha(TOKENS.primary, 0.2),
    },
    extendButtonHighlight: {
        backgroundColor: alpha(TOKENS.primary, 0.05),
        borderColor: TOKENS.primary,
    },
    extendButtonDisabled: {
        opacity: 0.5,
        borderColor: alpha(TOKENS.stroke, 0.3),
    },

    extendTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    // minutes
    extendButtonText: {
        fontSize: 12,
        fontWeight: '800',
        color: TOKENS.primary,
        marginTop: 0,
    },
    extendButtonTextDisabled: {
        color: TOKENS.textMuted,
    },

    // hourly rate
    extendButtonCost: {
        fontSize: 11,
        color: TOKENS.textMuted,
        marginTop: 2,
        fontWeight: '600',
    },
    extendButtonCostDisabled: {
        color: alpha(TOKENS.textMuted, 0.5),
    },

    // details card styles
    detailsCard: {
        backgroundColor: TOKENS.surface,
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: alpha(TOKENS.stroke, 0.3),
    },
    detailsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: TOKENS.text,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    detailIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: alpha(TOKENS.stroke, 0.1),
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
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
    },

    // bottom actions styles
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: TOKENS.surface,
        borderTopWidth: 1,
        borderTopColor: alpha(TOKENS.stroke, 0.2),
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    endButton: {
        height: 52,
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
        letterSpacing: 0.3,
    },
    bottomHint: {
        fontSize: 11,
        color: TOKENS.textMuted,
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '500',
    },
});
