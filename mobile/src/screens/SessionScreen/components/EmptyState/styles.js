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
        fontSize: 22,
        fontWeight: '700',
        color: TOKENS.primaryDeep,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 14,
        color: TOKENS.textMuted,
        marginTop: 6,
    },

    // Card container — soft corners, tinted background, visible separation
    setupCard: {
        backgroundColor: TOKENS.surface,
        borderRadius: 22,
        padding: 22,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.primaryHairline,
        shadowColor: TOKENS.primaryDeep,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 2,
    },

    setupSection: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    stepIndicator: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: TOKENS.primaryTint,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.primaryHairline,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        marginTop: 2,
    },
    stepNumber: {
        fontSize: 13,
        fontWeight: '700',
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
        minHeight: 50,
        borderRadius: 14,
        backgroundColor: TOKENS.surfaceTint,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.primaryHairline,
        paddingHorizontal: 16,
        fontSize: 18,
        fontWeight: '600',
        color: TOKENS.primaryDeep,
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
        borderRadius: 14,
        backgroundColor: TOKENS.surfaceTint,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.primaryHairline,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    durationOptionActive: {
        backgroundColor: TOKENS.primaryTint,
        borderColor: TOKENS.primary,
    },
    durationTime: {
        fontSize: 16,
        fontWeight: '600',
        color: TOKENS.primaryAlt,
        marginBottom: 4,
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
    },
    durationTimeActive: {
        color: TOKENS.primaryDeep,
        fontWeight: '700',
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
        fontWeight: '600',
    },

    rateOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    rateOption: {
        flex: 1,
        minHeight: 44,
        borderRadius: 14,
        backgroundColor: TOKENS.surfaceTint,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.primaryHairline,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rateOptionActive: {
        backgroundColor: TOKENS.primary,
        borderColor: TOKENS.primary,
    },
    rateText: {
        fontSize: 12,
        fontWeight: '600',
        color: TOKENS.primaryAlt,
        fontVariant: ['tabular-nums'],
    },
    rateTextActive: {
        color: '#fff',
        fontWeight: '700',
    },

    // Summary → hairline divider rows, no bg
    summaryBox: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderRadius: 14,
        backgroundColor: TOKENS.surfaceTint,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.primaryHairline,
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
        fontWeight: '700',
        color: TOKENS.primaryDeep,
        fontVariant: ['tabular-nums'],
    },
    summaryValueLarge: {
        fontSize: 20,
        fontWeight: '700',
        color: TOKENS.primary,
        fontVariant: ['tabular-nums'],
    },
    summaryDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: TOKENS.primaryHairline,
        marginVertical: 10,
    },

    primaryButton: {
        minHeight: 54,
        borderRadius: 16,
        backgroundColor: TOKENS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: TOKENS.primaryDeep,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
        elevation: 4,
    },
    primaryButtonDisabled: {
        backgroundColor: alpha(TOKENS.textMuted, 0.2),
        shadowOpacity: 0,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
