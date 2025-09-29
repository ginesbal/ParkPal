import { Platform, StyleSheet } from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    // Container
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },

    // Header Section
    header: {
        alignItems: 'center',
        marginBottom: 26,
    },
    iconContainer: {
        width: 64,
        height: 36,
        borderRadius: 20,
        backgroundColor: alpha(TOKENS.primary, 0.1),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: TOKENS.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        color: TOKENS.textMuted,
        marginTop: 4,
    },

    // Setup Card
    setupCard: {
        backgroundColor: TOKENS.surface,
        borderRadius: 24,
        padding: 16,
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

    // Setup Sections
    setupSection: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    stepIndicator: {
        width: 28,
        height: 18,
        borderRadius: 14,
        backgroundColor: alpha(TOKENS.primary, 0.1),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '800',
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
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Plate Input
    plateInput: {
        height: 45,
        borderRadius: 16,
        backgroundColor: PALETTE.vanilla[900],
        borderWidth: 2,
        borderColor: alpha(TOKENS.stroke, 0.3),
        paddingHorizontal: 16,
        fontSize: 18,
        fontWeight: '700',
        color: TOKENS.text,
        letterSpacing: 2,
        textAlign: 'center',
        textTransform: 'uppercase',
    },

    // Duration Grid
durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: -5, // Compensate for gap
},
durationOption: {
    width: '48%', // 2 columns with gap
    height: 60,
    borderRadius: 16,
    backgroundColor: PALETTE.vanilla[900],
    borderWidth: 2,
    borderColor: alpha(TOKENS.stroke, 0.3),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
},
durationOptionActive: {
    backgroundColor: alpha(TOKENS.primary, 0.1),
    borderColor: TOKENS.primary,
},
durationTime: {
    fontSize: 16,
    fontWeight: '700',
    color: TOKENS.text,
    marginBottom: 3,
    textAlign: 'center',
},
durationTimeActive: {
    color: TOKENS.primary,
},
durationCost: {
    fontSize: 12,
    color: TOKENS.textMuted,
    fontWeight: '600',
    textAlign: 'center',
},
durationCostActive: {
    color: TOKENS.primary,
},

    // Rate Options
    rateOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    rateOption: {
        flex: 1,
        height: 40,
        borderRadius: 16,
        backgroundColor: PALETTE.vanilla[900],
        borderWidth: 2,
        borderColor: alpha(TOKENS.stroke, 0.3),
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
    },
    rateTextActive: {
        color: '#fff',
    },

    // Summary Box
    summaryBox: {
        backgroundColor: alpha(PALETTE.straw[300], 0.1),
        borderRadius: 16,
        padding: 18,
        paddingHorizontal: 24,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: alpha(PALETTE.straw[300], 0.2),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        color: TOKENS.textMuted,
        fontWeight: '800',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '800',
        color: TOKENS.text,
    },
    summaryValueLarge: {
        fontSize: 18,
        fontWeight: '800',
        color: TOKENS.primary,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: alpha(TOKENS.stroke, 0.4),
        marginVertical: 6,
    },

    // Primary Button
    primaryButton: {
        height: 50,
        borderRadius: 16,
        backgroundColor: TOKENS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: TOKENS.primary,
                shadowOpacity: 0.3,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
            },
            android: {
                elevation: 4,
            },
        }),
    },
    primaryButtonDisabled: {
        backgroundColor: alpha(TOKENS.textMuted, 0.3),
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryButtonText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.3,
    },
});