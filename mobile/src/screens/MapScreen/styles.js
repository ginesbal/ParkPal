import { Platform, StyleSheet } from 'react-native';
import { PALETTE, SHADOWS, TOKENS, alpha } from '../../constants/theme';
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
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
        ...Platform.select({
            ios: SHADOWS.md,
            android: {
                elevation: 6,
            },
        }),
    },
    searchSectionCompact: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    searchSectionStandalone: {
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
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
        borderRadius: 999,
        backgroundColor: TOKENS.surfaceMuted,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
    },

    searchModeText: {
        fontSize: 12,
        fontWeight: '600',
        color: TOKENS.textMuted,
        letterSpacing: -0.1,
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
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: TOKENS.surface,
        borderWidth: 1,
        borderColor: TOKENS.strokeStrong,
        justifyContent: 'center',
        alignItems: 'center',
    },

    quickActionActive: {
        backgroundColor: TOKENS.primary,
        borderColor: TOKENS.primary,
    },

    quickActionPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.97 }],
    },

    // simple filter layout
    filterBar: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 12,
        gap: 12,
        backgroundColor: TOKENS.surfaceOverlay,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: TOKENS.strokeLight,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        marginTop: -1,
        ...Platform.select({
            ios: {
                shadowColor: TOKENS.shadow,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 18,
            },
            android: {
                elevation: 6,
            },
        }),
    },

    controlGroup: {
        gap: 7,
    },

    controlLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: TOKENS.textLight,
        letterSpacing: 0.45,
        textTransform: 'uppercase',
    },

    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },

    filterChip: {
        minHeight: 38,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: TOKENS.surface,
        borderWidth: 1,
        borderColor: TOKENS.stroke,
    },

    filterChipActive: {
        backgroundColor: TOKENS.primarySoft,
        borderColor: TOKENS.focus,
    },

    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: TOKENS.textMuted,
    },

    filterChipTextActive: {
        color: TOKENS.primaryAlt,
    },
    filterChipPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.97 }],
    },

    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    distanceSegmented: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: TOKENS.surfaceMuted,
        borderRadius: 18,
        padding: 4,
        gap: 4,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
    },

    distanceSegment: {
        flex: 1,
        minHeight: 40,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
    },

    distanceSegmentActive: {
        backgroundColor: TOKENS.surface,
        ...Platform.select({
            ios: SHADOWS.sm,
            android: {
                elevation: 1,
            },
        }),
    },
    distanceSegmentPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.98 }],
    },

    distanceSegmentText: {
        fontSize: 13,
        fontWeight: '500',
        color: TOKENS.textMuted,
    },

    distanceSegmentTextActive: {
        fontWeight: '700',
        color: TOKENS.primaryAlt,
    },

    // Tooltip
    tooltip: {
        position: 'absolute',
        left: 16,
        backgroundColor: alpha(PALETTE.prussian[500], 0.96),
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        zIndex: 999,
        elevation: 5,
    },

    tooltipArrow: {
        position: 'absolute',
        top: -6,
        left: 20,
        width: 12,
        height: 12,
        backgroundColor: alpha(PALETTE.prussian[500], 0.96),
        transform: [{ rotate: '45deg' }],
    },

    tooltipText: {
        fontSize: 12,
        color: '#fff',
        lineHeight: 16,
    },

    // Markers - simplified for better performance
    marker: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    markerDot: {
        width: 13,
        height: 13,
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
        borderWidth: 3,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: alpha(TOKENS.primary, 0.25),
        borderWidth: 2,
        borderColor: alpha(TOKENS.primary, 0.4),
    },

    // Pin marker
    pinMarker: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 50,
    },

    pinHead: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: TOKENS.primaryAlt,
        borderWidth: 3,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: SHADOWS.sm,
            android: {
                elevation: 4,
            },
        }),
    },

    pinInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },

    pinStem: {
        width: 2,
        height: 16,
        backgroundColor: TOKENS.primaryAlt,
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
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: TOKENS.surface,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        ...Platform.select({
            ios: SHADOWS.sm,
            android: {
                elevation: 4,
            },
        }),
    },

    fabPrimary: {
        backgroundColor: TOKENS.primary,
    },

    fabPressed: {
        transform: [{ scale: 0.92 }],
    },

    // Bottom sheet card (height is controlled by top/left/right/bottom, not a fixed value)
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
            },
            android: {
                elevation: 8,
            },
        }),
    },

    sheetHandle: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 6,
    },

    handleBar: {
        width: 36,
        height: 4,
        backgroundColor: alpha(PALETTE.yale[500], 0.2),
        borderRadius: 2,
    },

    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: alpha(PALETTE.yale[500], 0.12),
    },

    sheetStats: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },

    sheetTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: TOKENS.text,
    },

    sheetSubtitle: {
        fontSize: 14,
        color: TOKENS.textMuted,
    },

    modeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: alpha(PALETTE.cerulean[500], 0.08),
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        gap: 4,
    },

    modeBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: PALETTE.cerulean[600],
    },

    // ===== Top Map/List toggle inside the sheet, above the list =====
    topToggleBar: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: alpha(PALETTE.yale[500], 0.12),
        backgroundColor: '#fff',
        zIndex: 1,
    },
    topToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: TOKENS.bg,
    },
    topToggleActive: {
        backgroundColor: TOKENS.primary,
    },
    topTogglePressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    topToggleText: {
        fontSize: 12,
        fontWeight: '600',
        color: TOKENS.text,
    },
    topToggleTextActive: {
        color: '#fff',
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
