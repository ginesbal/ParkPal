import { StyleSheet } from 'react-native';
import { TOKENS, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },

    header: {
        alignItems: 'center',
        marginBottom: 28,
    },
    iconContainer: {
        width: 64,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: TOKENS.text,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 14,
        color: TOKENS.textMuted,
        marginTop: 6,
    },

    // Card container → just a surface with hairline border, no shadow
    setupCard: {
        backgroundColor: TOKENS.surface,
        borderRadius: 10,
        padding: 20,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
    },

    setupSection: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    stepIndicator: {
        width: 28,
        height: 28,
        borderRadius: 12,
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        marginTop: 2,
    },
    stepNumber: {
        fontSize: 13,
        fontWeight: '600',
        color: TOKENS.primary,
    },
    setupContent: {
        flex: 1,
    },
    setupLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: TOKENS.textMuted,
        marginBottom: 12,
        letterSpacing: 0,
    },

    plateInput: {
        minHeight: 48,
        borderRadius: 10,
        backgroundColor: TOKENS.surfaceMuted,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
        paddingHorizontal: 16,
        fontSize: 18,
        fontWeight: '500',
        color: TOKENS.text,
        letterSpacing: 2,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontVariant: ['tabular-nums'],
    },

    durationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 8,
    },
    durationOption: {
        width: '48%',
        minHeight: 60,
        borderRadius: 10,
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    durationOptionActive: {
        backgroundColor: 'transparent',
        borderColor: TOKENS.primary,
    },
    durationTime: {
        fontSize: 16,
        fontWeight: '500',
        color: TOKENS.text,
        marginBottom: 4,
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
    },
    durationTimeActive: {
        color: TOKENS.primary,
        fontWeight: '600',
    },
    durationCost: {
        fontSize: 12,
        color: TOKENS.textMuted,
        fontWeight: '500',
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
    },
    durationCostActive: {
        color: TOKENS.primary,
    },

    rateOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    rateOption: {
        flex: 1,
        minHeight: 44,
        borderRadius: 10,
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rateOptionActive: {
        backgroundColor: 'transparent',
        borderColor: TOKENS.primary,
    },
    rateText: {
        fontSize: 12,
        fontWeight: '500',
        color: TOKENS.textMuted,
        fontVariant: ['tabular-nums'],
    },
    rateTextActive: {
        color: TOKENS.primary,
        fontWeight: '600',
    },

    // Summary → hairline divider rows, no bg
    summaryBox: {
        paddingVertical: 14,
        marginBottom: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: TOKENS.hairline,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: TOKENS.hairline,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 13,
        color: TOKENS.textMuted,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
        color: TOKENS.text,
        fontVariant: ['tabular-nums'],
    },
    summaryValueLarge: {
        fontSize: 20,
        fontWeight: '500',
        color: TOKENS.primary,
        fontVariant: ['tabular-nums'],
    },
    summaryDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: TOKENS.hairline,
        marginVertical: 10,
    },

    primaryButton: {
        minHeight: 52,
        borderRadius: 10,
        backgroundColor: TOKENS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonDisabled: {
        backgroundColor: alpha(TOKENS.textMuted, 0.2),
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
