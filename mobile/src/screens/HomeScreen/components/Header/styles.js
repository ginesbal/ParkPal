import { StyleSheet } from 'react-native';
import { PALETTE, TOKENS } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    header: {
        backgroundColor: TOKENS.surface,
        borderBottomWidth: 0
    },
    mainHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12
    },

    locationSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 16,
    },
    locationIcon: {
        marginRight: 8,
    },
    locationInfo: {
        flex: 1
    },
    locationLabel: {
        fontSize: 11,
        color: TOKENS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 2,
        fontWeight: '600',
    },
    locationText: {
        fontSize: 17,
        fontWeight: '700',
        color: TOKENS.text,
        letterSpacing: -0.3,
    },

    quickInfoBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 0,
        marginBottom: 12,
    },
    quickInfoItem: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    quickInfoValue: {
        fontSize: 24,
        fontWeight: '700',
        color: TOKENS.text,
        letterSpacing: -0.5,
    },
    quickInfoUnit: {
        fontSize: 15,
        fontWeight: '600',
        color: TOKENS.textMuted,
    },
    quickInfoLabel: {
        fontSize: 13,
        color: TOKENS.textMuted,
        marginLeft: 6,
    },
    statsRow: {
        display: 'none',
    },

    filterBar: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0',
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 16,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    filterChipActive: {
        backgroundColor: PALETTE.flame[500],
        borderColor: PALETTE.flame[500],
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#888',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    distanceTrack: {
        flex: 1,
        flexDirection: 'row',
        height: 24,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        position: 'relative',
        alignItems: 'center',
        paddingHorizontal: 4,
        justifyContent: 'space-between',
    },
    distanceMarker: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#d0d0d0',
        borderWidth: 2,
        borderColor: '#fff',
    },
    distanceMarkerActive: {
        backgroundColor: PALETTE.flame[500],
        width: 46,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
    },
    distanceValue: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },

    filterContent: {
        display: 'none',
    },
    filterGroup: {
        display: 'none',
    },
    filterGroupLabel: {
        display: 'none',
    },
    filterOptions: {
        display: 'none',
    },
    filterOption: {
        display: 'none',
    },
    filterOptionActive: {
        display: 'none',
    },
    filterOptionText: {
        display: 'none',
    },
    filterOptionTextActive: {
        display: 'none',
    },
    distanceOptions: {
        display: 'none',
    },
    distanceOption: {
        display: 'none',
    },
    distanceOptionActive: {
        display: 'none',
    },
    distanceOptionText: {
        display: 'none',
    },
    distanceOptionTextActive: {
        display: 'none',
    }
});