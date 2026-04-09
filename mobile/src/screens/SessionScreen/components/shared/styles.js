import { StyleSheet } from 'react-native';
import { TOKENS, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: TOKENS.primarySoft,
    },
    statusBadgeWarning: {
        backgroundColor: TOKENS.warningSoft,
    },
    statusBadgeDanger: {
        backgroundColor: TOKENS.dangerSoft,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: TOKENS.primary,
    },
    statusDotWarning: {
        backgroundColor: TOKENS.warning,
    },
    statusDotDanger: {
        backgroundColor: TOKENS.danger,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: TOKENS.primary,
        letterSpacing: 0.2,
    },
    statusTextWarning: {
        color: TOKENS.warning,
    },
    statusTextDanger: {
        color: TOKENS.danger,
    },

    infoCard: {
        backgroundColor: TOKENS.surfaceMuted,
        borderRadius: 16,
        padding: 16,
        marginTop: 18,
        flexDirection: 'row',
        gap: 12,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
    },
    infoCardWarning: {
        backgroundColor: TOKENS.warningSoft,
        borderColor: alpha(TOKENS.warning, 0.18),
    },
    infoCardError: {
        backgroundColor: TOKENS.dangerSoft,
        borderColor: alpha(TOKENS.danger, 0.18),
    },
    infoIcon: {
        color: TOKENS.primary,
    },
    infoIconWarning: {
        color: TOKENS.warning,
    },
    infoIconError: {
        color: TOKENS.danger,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        color: TOKENS.textMuted,
    },
});
