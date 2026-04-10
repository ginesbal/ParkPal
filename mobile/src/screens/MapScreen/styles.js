import { StyleSheet } from 'react-native';
import { TOKENS, alpha } from '../../constants/theme';
import { SHEET_MIN_HEIGHT } from './constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: TOKENS.bg
    },

    map: {
        flex: 1,
    },

    // Unified Navigation Bar
    topNavigation: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        paddingHorizontal: 14,
        paddingBottom: 12,
        zIndex: 1000,
    },

    searchSection: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 10,
        gap: 10,
        backgroundColor: TOKENS.surfaceOverlay,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
    },
    searchSectionCompact: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    searchSectionStandalone: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },

    searchContainer: {
        flex: 1,
    },

    searchMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    searchModePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
    },

    searchModeText: {
        fontSize: 12,
        fontWeight: '500',
        color: TOKENS.textMuted,
        letterSpacing: 0,
    },

    searchInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    quickActions: {
        flexDirection: 'row',
        gap: 8,
    },

    quickAction: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: TOKENS.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
        justifyContent: 'center',
        alignItems: 'center',
    },

    quickActionActive: {
        backgroundColor: TOKENS.surface,
        borderColor: TOKENS.primary,
    },

    quickActionPressed: {
        opacity: 0.6,
    },

    // simple filter layout
    filterBar: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 12,
        gap: 12,
        backgroundColor: TOKENS.surfaceOverlay,
        borderWidth: StyleSheet.hairlineWidth,
        borderTopWidth: 0,
        borderColor: TOKENS.hairline,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: -1,
    },

    controlGroup: {
        gap: 7,
    },

    controlLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: TOKENS.textFaint,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
    },

    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },

    filterChip: {
        minHeight: 44,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
        justifyContent: 'center',
    },

    filterChipActive: {
        backgroundColor: 'transparent',
        borderColor: TOKENS.primary,
    },

    filterChipText: {
        fontSize: 13,
        fontWeight: '500',
        color: TOKENS.textMuted,
    },

    filterChipTextActive: {
        color: TOKENS.primary,
        fontWeight: '600',
    },
    filterChipPressed: {
        opacity: 0.6,
    },

    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    distanceSegmented: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 0,
        gap: 6,
        borderWidth: 0,
    },

    distanceSegment: {
        flex: 1,
        minHeight: 44,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
    },

    distanceSegmentActive: {
        borderColor: TOKENS.primary,
    },
    distanceSegmentPressed: {
        opacity: 0.6,
    },

    distanceSegmentText: {
        fontSize: 13,
        fontWeight: '500',
        color: TOKENS.textMuted,
    },

    distanceSegmentTextActive: {
        fontWeight: '600',
        color: TOKENS.primary,
    },

    // Tooltip
    tooltip: {
        position: 'absolute',
        left: 16,
        backgroundColor: alpha(TOKENS.text, 0.96),
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        zIndex: 999,
    },

    tooltipArrow: {
        position: 'absolute',
        top: -6,
        left: 20,
        width: 12,
        height: 12,
        backgroundColor: alpha(TOKENS.text, 0.96),
        transform: [{ rotate: '45deg' }],
    },

    tooltipText: {
        fontSize: 12,
        color: '#fff',
        lineHeight: 16,
    },

    // Markers — solid circle + white ring, no shadow
    marker: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    markerDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: TOKENS.primary,
        borderWidth: 2,
        borderColor: '#fff',
    },

    markerDotSelected: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: TOKENS.primary,
        borderWidth: 2,
        borderColor: '#fff',
    },

    markerSelected: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    markerPulse: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: alpha(TOKENS.primary, 0.12),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: alpha(TOKENS.primary, 0.22),
    },

    // Pin marker
    pinMarker: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 50,
    },

    pinHead: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: TOKENS.primary,
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    pinInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },

    pinStem: {
        width: 2,
        height: 14,
        backgroundColor: TOKENS.primary,
        marginTop: -2,
    },

    // FABs
    fabContainer: {
        position: 'absolute',
        right: 16,
        bottom: SHEET_MIN_HEIGHT + 16,
        gap: 10,
        zIndex: 500,
    },

    fab: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: TOKENS.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },

    fabPrimary: {
        backgroundColor: TOKENS.primary,
    },

    fabPressed: {
        opacity: 0.6,
    },

    // Bottom sheet card (height is controlled by top/left/right/bottom, not a fixed value)
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: TOKENS.surface,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: TOKENS.hairline,
        zIndex: 100,
    },

    sheetHandle: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 6,
    },

    handleBar: {
        width: 36,
        height: 3,
        backgroundColor: alpha(TOKENS.text, 0.12),
        borderRadius: 2,
    },

    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: TOKENS.hairline,
    },

    sheetStats: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },

    sheetTitle: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: -0.3,
        color: TOKENS.text,
    },

    sheetSubtitle: {
        fontSize: 14,
        color: TOKENS.textMuted,
    },

    modeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 4,
    },

    modeBadgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: TOKENS.primary,
    },

    // ===== Top Map/List toggle inside the sheet, above the list =====
    topToggleBar: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: TOKENS.hairline,
        backgroundColor: '#fff',
        zIndex: 1,
    },
    topToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
    },
    topToggleActive: {
        borderColor: TOKENS.primary,
    },
    topTogglePressed: {
        opacity: 0.6,
    },
    topToggleText: {
        fontSize: 12,
        fontWeight: '500',
        color: TOKENS.textMuted,
    },
    topToggleTextActive: {
        color: TOKENS.primary,
        fontWeight: '600',
    },

    sheetContent: {
        flex: 1,
    },

    listView: {
        paddingBottom: 20,
    },

    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: TOKENS.text,
        marginTop: 12,
    },

    emptyText: {
        fontSize: 13,
        color: TOKENS.textMuted,
        textAlign: 'center',
        marginTop: 4,
    },
});
