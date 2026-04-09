import { Platform, StyleSheet } from 'react-native';
import { SHADOWS, TOKENS, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },

    header: {
        alignItems: 'center',
        marginBottom: 28,
    },
    iconContainer: {
        width: 72,
        height: 44,
        borderRadius: 22,
        backgroundColor: TOKENS.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: TOKENS.text,
        letterSpacing: -0.6,
    },
    subtitle: {
        fontSize: 13,
        color: TOKENS.textMuted,
        marginTop: 6,
    },

    setupCard: {
        backgroundColor: TOKENS.surface,
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
        ...Platform.select({
            ios: SHADOWS.md,
            android: {
                elevation: 5,
            },
        }),
    },

    setupSection: {
        flexDirection: 'row',
        marginBottom: 22,
    },
    stepIndicator: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: TOKENS.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        marginTop: 2,
    },
    stepNumber: {
        fontSize: 13,
        fontWeight: '800',
        color: TOKENS.primary,
    },
    setupContent: {
        flex: 1,
    },
    setupLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: TOKENS.textMuted,
        marginBottom: 12,
        letterSpacing: 0.2,
    },

    plateInput: {
        minHeight: 48,
        borderRadius: 16,
        backgroundColor: TOKENS.surfaceMuted,
        borderWidth: 1,
        borderColor: TOKENS.stroke,
        paddingHorizontal: 16,
        fontSize: 18,
        fontWeight: '700',
        color: TOKENS.text,
        letterSpacing: 2,
        textAlign: 'center',
        textTransform: 'uppercase',
    },

    durationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 10,
    },
    durationOption: {
        width: '48%',
        minHeight: 64,
        borderRadius: 16,
        backgroundColor: TOKENS.surface,
        borderWidth: 1,
        borderColor: TOKENS.stroke,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    durationOptionActive: {
        backgroundColor: TOKENS.primarySoft,
        borderColor: TOKENS.primary,
    },
    durationTime: {
        fontSize: 16,
        fontWeight: '700',
        color: TOKENS.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    durationTimeActive: {
        color: TOKENS.primaryAlt,
    },
    durationCost: {
        fontSize: 12,
        color: TOKENS.textMuted,
        fontWeight: '600',
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
    },
    durationCostActive: {
        color: TOKENS.primaryAlt,
    },

    rateOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    rateOption: {
        flex: 1,
        minHeight: 44,
        borderRadius: 16,
        backgroundColor: TOKENS.surface,
        borderWidth: 1,
        borderColor: TOKENS.stroke,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rateOptionActive: {
        backgroundColor: TOKENS.primary,
        borderColor: TOKENS.primary,
    },
    rateText: {
        fontSize: 12,
        fontWeight: '800',
        color: TOKENS.text,
        fontVariant: ['tabular-nums'],
    },
    rateTextActive: {
        color: '#fff',
    },

    summaryBox: {
        backgroundColor: TOKENS.surfaceMuted,
        borderRadius: 18,
        padding: 18,
        paddingHorizontal: 20,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        color: TOKENS.textMuted,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '800',
        color: TOKENS.text,
        fontVariant: ['tabular-nums'],
    },
    summaryValueLarge: {
        fontSize: 20,
        fontWeight: '800',
        color: TOKENS.primaryAlt,
        fontVariant: ['tabular-nums'],
    },
    summaryDivider: {
        height: 1,
        backgroundColor: alpha(TOKENS.stroke, 0.6),
        marginVertical: 8,
    },

    primaryButton: {
        minHeight: 52,
        borderRadius: 16,
        backgroundColor: TOKENS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: TOKENS.shadow,
                shadowOpacity: 0.16,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 8 },
            },
            android: {
                elevation: 4,
            },
        }),
    },
    primaryButtonDisabled: {
        backgroundColor: alpha(TOKENS.textMuted, 0.28),
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.2,
    },
});
