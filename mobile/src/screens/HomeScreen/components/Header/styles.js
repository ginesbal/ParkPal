import { StyleSheet, Platform } from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../../../constants/theme';

export const styles = StyleSheet.create({
    // Header Container
    header: {
        backgroundColor: TOKENS.surface,
        borderBottomWidth: 0
    },
    mainHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12
    },

    // Location Section
    locationSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: alpha(PALETTE.vanilla[700], 0.5),
        padding: 12,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: alpha(PALETTE.earth_yellow[400], 0.15)
    },
    locationIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: alpha(TOKENS.primary, 0.1),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    locationInfo: { 
        flex: 1 
    },
    locationLabel: {
        fontSize: 12,
        color: TOKENS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 2
    },
    locationText: {
        fontSize: 15,
        fontWeight: '700',
        color: TOKENS.text
    },

    // Quick Info Bar
    quickInfoBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(PALETTE.straw[500], 0.08),
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: alpha(PALETTE.straw[500], 0.2)
    },
    quickInfoItem: { 
        alignItems: 'center', 
        paddingHorizontal: 12 
    },
    quickInfoValue: {
        fontSize: 16,
        fontWeight: '800',
        color: PALETTE.straw[300]
    },
    quickInfoUnit: {
        fontSize: 13,
        fontWeight: '600',
        color: TOKENS.textMuted
    },
    quickInfoLabel: {
        fontSize: 12,
        color: TOKENS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        marginTop: 2
    },
    quickInfoDivider: {
        width: 1,
        height: 24,
        backgroundColor: alpha(PALETTE.straw[500], 0.2)
    },

    // Filter Bar
    filterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: alpha(PALETTE.vanilla[700], 0.3)
    },
    filterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: TOKENS.surface,
        borderWidth: 1,
        borderColor: alpha(PALETTE.earth_yellow[400], 0.2),
        gap: 6
    },
    filterToggleText: {
        fontSize: 13,
        fontWeight: '700',
        color: TOKENS.text
    },
    filterBadge: {
        minWidth: 16,
        height: 16,
        paddingHorizontal: 3,
        borderRadius: 8,
        backgroundColor: TOKENS.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterBadgeText: { 
        fontSize: 10, 
        fontWeight: '800', 
        color: '#fff' 
    },
    activeFilterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        backgroundColor: alpha(PALETTE.flame?.[500] ?? TOKENS.primary, 0.08),
        borderWidth: 1,
        borderColor: alpha(PALETTE.flame?.[500] ?? TOKENS.primary, 0.2),
        gap: 6
    },
    activeFilterText: {
        fontSize: 12,
        fontWeight: '700',
        color: PALETTE.flame?.[600] ?? TOKENS.primary,
        textTransform: 'capitalize'
    },
    updateText: { 
        fontSize: 12, 
        color: TOKENS.textMuted 
    },

    // Filter Content
    filterContent: {
        padding: 16,
        backgroundColor: alpha(PALETTE.vanilla[600], 0.3),
        borderTopWidth: 1,
        borderTopColor: alpha(PALETTE.earth_yellow[400], 0.1)
    },
    filterGroup: { 
        marginBottom: 16 
    },
    filterGroupLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: TOKENS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 18,
        backgroundColor: PALETTE.vanilla[700],
        borderWidth: 1,
        borderColor: alpha(PALETTE.earth_yellow[400], 0.15),
        gap: 8
    },
    filterOptionActive: {
        backgroundColor: TOKENS.primary,
        borderColor: TOKENS.primary
    },
    filterOptionText: {
        fontSize: 13,
        fontWeight: '700',
        color: TOKENS.text
    },
    filterOptionTextActive: { 
        color: '#fff' 
    },
    distanceOptions: { 
        flexDirection: 'row', 
        gap: 8 
    },
    distanceOption: {
        flex: 1,
        paddingVertical: 9,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: PALETTE.vanilla[700],
        borderWidth: 1,
        borderColor: alpha(PALETTE.earth_yellow[400], 0.15)
    },
    distanceOptionActive: {
        backgroundColor: PALETTE.earth_yellow[400],
        borderColor: PALETTE.earth_yellow[400]
    },
    distanceOptionText: { 
        fontSize: 13, 
        fontWeight: '700', 
        color: TOKENS.text 
    },
    distanceOptionTextActive: { 
        color: '#fff' 
    }
});