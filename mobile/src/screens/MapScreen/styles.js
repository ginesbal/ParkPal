import { Platform, StyleSheet } from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../constants/theme';
import { SHEET_MIN_HEIGHT } from './constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
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
        backgroundColor: '#fff',
        zIndex: 100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    searchSection: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    searchContainer: {
        flex: 1,
    },

    quickActions: {
        flexDirection: 'row',
        gap: 6,
    },

    quickAction: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },

    quickActionActive: {
        backgroundColor: PALETTE.flame[500],
    },

    quickActionPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },

    // simple filter layout
    filterBar: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#fff',
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

    // Tooltip
    tooltip: {
        position: 'absolute',
        left: 16,
        backgroundColor: alpha(PALETTE.bistre[800], 0.95),
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        zIndex: 99,
        elevation: 5,
    },

    tooltipArrow: {
        position: 'absolute',
        top: -6,
        left: 20,
        width: 12,
        height: 12,
        backgroundColor: alpha(PALETTE.bistre[800], 0.95),
        transform: [{ rotate: '45deg' }],
    },

    tooltipText: {
        fontSize: 12,
        color: '#fff',
        lineHeight: 16,
    },

    // Markers
    marker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },

    markerSelected: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 3,
        ...Platform.select({
            ios: {
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
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
        backgroundColor: PALETTE.flame[500],
        borderWidth: 3,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
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
        backgroundColor: PALETTE.flame[500],
        marginTop: -2,
    },

    // FABs
    fabContainer: {
        position: 'absolute',
        right: 16,
        bottom: SHEET_MIN_HEIGHT + 16,
        gap: 10,
    },

    fab: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
            },
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
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
            },
            android: {
                elevation: 20,
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
        backgroundColor: PALETTE.vanilla[800],
        borderRadius: 2,
    },

    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: PALETTE.vanilla[700],
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
        backgroundColor: alpha(PALETTE.flame[500], 0.08),
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        gap: 4,
    },

    modeBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: PALETTE.flame[600],
    },

    // ===== Top Map/List toggle inside the sheet, above the list =====
    topToggleBar: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: PALETTE.vanilla[700],
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
        backgroundColor: '#f5f5f5',
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
