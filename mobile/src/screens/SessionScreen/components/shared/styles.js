import { StyleSheet } from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    // Status Badge Styles
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: alpha(TOKENS.primary, 0.1),
    },
    statusBadgeWarning: {
        backgroundColor: alpha(TOKENS.warning, 0.15),
    },
    statusBadgeDanger: {
        backgroundColor: alpha(TOKENS.danger, 0.15),
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
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusTextWarning: {
        color: TOKENS.warning,
    },
    statusTextDanger: {
        color: TOKENS.danger,
    },

    // Info Card Styles
    infoCard: {
        backgroundColor: alpha(PALETTE.earth_yellow[400], 0.08),
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
        flexDirection: 'row',
        gap: 12,
        borderWidth: 1,
        borderColor: alpha(PALETTE.earth_yellow[400], 0.2),
    },
    infoCardWarning: {
        backgroundColor: alpha(TOKENS.warning, 0.08),
        borderColor: alpha(TOKENS.warning, 0.2),
    },
    infoCardError: {
        backgroundColor: alpha(TOKENS.danger, 0.08),
        borderColor: alpha(TOKENS.danger, 0.2),
    },
    infoIcon: {
        color: PALETTE.earth_yellow[200],
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
        color: PALETTE.bistre[600],
    },
});