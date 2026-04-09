import { StyleSheet } from 'react-native';
import { TOKENS } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    header: {
        backgroundColor: TOKENS.surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: TOKENS.strokeLight,
    },
    mainHeader: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 10,
    },

    locationSection: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 52,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
        backgroundColor: TOKENS.surfaceMuted,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
    },
    locationSectionPressed: {
        backgroundColor: TOKENS.strokeLight,
    },
    locationIcon: {
        marginRight: 10,
    },
    locationInfo: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 12,
        color: TOKENS.textLight,
        letterSpacing: 0.2,
        marginBottom: 2,
        fontWeight: '600',
    },
    locationText: {
        fontSize: 18,
        fontWeight: '700',
        color: TOKENS.text,
        letterSpacing: -0.35,
    },

    quickInfoBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 8,
        backgroundColor: TOKENS.surfaceAccent,
        borderRadius: 18,
    },
    quickInfoItem: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
        flexShrink: 1,
    },
    quickInfoValue: {
        fontSize: 26,
        fontWeight: '700',
        color: TOKENS.text,
        letterSpacing: -0.7,
        fontVariant: ['tabular-nums'],
    },
    quickInfoLabel: {
        fontSize: 13,
        color: TOKENS.textMuted,
        flexShrink: 1,
    },
    quickInfoMeta: {
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    quickInfoMetaLabel: {
        fontSize: 11,
        color: TOKENS.textLight,
        fontWeight: '600',
    },
    quickInfoMetaValue: {
        fontSize: 13,
        color: TOKENS.primaryAlt,
        fontWeight: '700',
    },
    statsRow: {
        display: 'none',
    },

    filterBar: {
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 14,
        backgroundColor: TOKENS.surface,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
        flexWrap: 'wrap',
    },
    filterChip: {
        minHeight: 40,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 16,
        backgroundColor: TOKENS.surfaceMuted,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
    },
    filterChipActive: {
        backgroundColor: TOKENS.primary,
        borderColor: TOKENS.primary,
    },
    filterChipPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.98 }],
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: TOKENS.textMuted,
    },
    filterChipTextActive: {
        color: TOKENS.surface,
    },
    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 2,
        flexWrap: 'wrap',
    },
    distanceLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: TOKENS.textMuted,
        letterSpacing: 0.2,
    },
    distanceOptions: {
        flex: 1,
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
    },
    distanceOption: {
        minHeight: 38,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: TOKENS.surfaceMuted,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
    },
    distanceOptionActive: {
        backgroundColor: TOKENS.primary,
        borderColor: TOKENS.primary,
    },
    distanceOptionPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.98 }],
    },
    distanceOptionText: {
        fontSize: 12,
        fontWeight: '600',
        color: TOKENS.textMuted,
    },
    distanceOptionTextActive: {
        color: TOKENS.surface,
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 6,
    },
    statusBannerInfo: {
        backgroundColor: TOKENS.primarySoft,
    },
    statusBannerWarning: {
        backgroundColor: TOKENS.warningSoft,
    },
    statusBannerText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        color: TOKENS.textMuted,
        fontWeight: '500',
    },
});
