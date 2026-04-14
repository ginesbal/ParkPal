import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParkingListItem from '../../../components/ParkingList/ParkingListItem';
import { TOKENS, alpha } from '../../../constants/theme';
import { SCREEN_HEIGHT } from '../constants';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const SHEET_BOTTOM_OFFSET = 10;
const SHEET_EXPANDED_TOP_GAP = 18;

// Momentum threshold — a quick flick should snap regardless of drag distance.
// Emil: "Don't require dragging past a threshold. If velocity exceeds ~0.11, dismiss."
const VELOCITY_THRESHOLD = 0.11;

// Rubber-band damping factor for over-pull at top boundary.
// Emil: "Things in real life don't suddenly stop; they slow down first."
const RUBBER_BAND_FACTOR = 0.35;

const ParkingBottomSheet = forwardRef(({
    spots,
    selectedSpot,
    searchMode,
    getCurrentPrice,
    onItemPress,
    onClearPin,
    onPeekHeightChange,
    tabBarHeight = 80,
    topInset = 0,
}, ref) => {
    const insets = useSafeAreaInsets();
    const listRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(92);
    const previousPeekY = useRef(null);
    const isDragging = useRef(false);

    const peekHeight = headerHeight;
    const maxHeight = useMemo(() => {
        const availableHeight = Math.max(
            peekHeight,
            SCREEN_HEIGHT - topInset - SHEET_EXPANDED_TOP_GAP - SHEET_BOTTOM_OFFSET
        );
        return Math.min(Math.round(peekHeight + 420), availableHeight);
    }, [peekHeight, topInset]);

    const EXPANDED_Y = 0;
    const PEEK_Y = Math.max(0, maxHeight - peekHeight);
    const HIDDEN_Y = maxHeight + 48;
    const translateY = useRef(new Animated.Value(PEEK_Y)).current;
    const dragStartY = useRef(PEEK_Y);

    // Tighter spring for expand (user is waiting to see content)
    const expandTo = useCallback((velocity = 0) => {
        Animated.spring(translateY, {
            toValue: EXPANDED_Y,
            velocity,
            tension: 68,
            friction: 9,
            useNativeDriver: true,
        }).start();
    }, [translateY, EXPANDED_Y]);

    // Slightly faster spring for collapse — exit should feel snappier than enter
    const collapseTo = useCallback((velocity = 0) => {
        Animated.spring(translateY, {
            toValue: PEEK_Y,
            velocity,
            tension: 76,
            friction: 10,
            useNativeDriver: true,
        }).start();

        // Coordinate scroll-to-top with collapse — slight delay so both
        // motions feel like one gesture, not a jump-then-slide
        setTimeout(() => {
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 80);
    }, [translateY, PEEK_Y]);

    useImperativeHandle(ref, () => ({
        present: () => expandTo(),
        dismiss: () => collapseTo(),
    }));

    const handleHeaderLayout = useCallback((event) => {
        const measuredHeight = Math.max(96, Math.ceil(event.nativeEvent.layout.height));
        setHeaderHeight((currentHeight) => (
            Math.abs(currentHeight - measuredHeight) > 1 ? measuredHeight : currentHeight
        ));
    }, []);

    useEffect(() => {
        onPeekHeightChange?.(peekHeight);
    }, [onPeekHeightChange, peekHeight]);

    useEffect(() => {
        const lastPeekY = previousPeekY.current;

        if (lastPeekY == null) {
            translateY.setValue(PEEK_Y);
            dragStartY.current = PEEK_Y;
            previousPeekY.current = PEEK_Y;
            return;
        }

        translateY.stopAnimation((currentValue) => {
            const isMostlyCollapsed = currentValue >= lastPeekY - 16;

            if (isMostlyCollapsed) {
                translateY.setValue(PEEK_Y);
                dragStartY.current = PEEK_Y;
            } else {
                dragStartY.current = currentValue;
            }

            previousPeekY.current = PEEK_Y;
        });
    }, [PEEK_Y, translateY]);

    // When a marker is tapped, expand the sheet first, then scroll to the item.
    // Without this, the scroll fires behind the collapsed sheet — invisible.
    useEffect(() => {
        if (!selectedSpot?.id || !spots.length) {
            return;
        }

        const selectedIndex = spots.findIndex((spot) => spot?.id === selectedSpot.id);
        if (selectedIndex < 0) {
            return;
        }

        // Expand sheet, then scroll after the spring has mostly settled
        expandTo();
        const timer = setTimeout(() => {
            listRef.current?.scrollToIndex({
                index: selectedIndex,
                animated: true,
                viewPosition: 0.45,
            });
        }, 280);

        return () => clearTimeout(timer);
    }, [selectedSpot?.id, spots, expandTo]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) =>
                Math.abs(g.dy) > 4 && Math.abs(g.dy) > Math.abs(g.dx),
            onPanResponderGrant: () => {
                // Multi-touch protection: ignore if already dragging
                if (isDragging.current) return;
                isDragging.current = true;

                translateY.stopAnimation((cur) => {
                    dragStartY.current = cur ?? PEEK_Y;
                });
            },
            onPanResponderMove: (_, g) => {
                const raw = dragStartY.current + g.dy;

                // Rubber-band damping when pulling past the top boundary
                if (raw < EXPANDED_Y) {
                    const overPull = EXPANDED_Y - raw;
                    const damped = EXPANDED_Y - (overPull * RUBBER_BAND_FACTOR);
                    translateY.setValue(damped);
                } else {
                    translateY.setValue(clamp(raw, EXPANDED_Y, HIDDEN_Y));
                }
            },
            onPanResponderRelease: (_, g) => {
                isDragging.current = false;

                const finalY = clamp(dragStartY.current + g.dy, EXPANDED_Y, HIDDEN_Y);
                const velocity = Math.abs(g.vy);

                // Momentum-based snap: a quick flick should decide regardless of position
                if (velocity > VELOCITY_THRESHOLD) {
                    if (g.vy < 0) {
                        expandTo(g.vy);
                    } else {
                        collapseTo(g.vy);
                    }
                    return;
                }

                // Position-based snap for slow drags
                const mid = (PEEK_Y + EXPANDED_Y) / 2;
                if (finalY <= mid) {
                    expandTo(g.vy);
                } else {
                    collapseTo(g.vy);
                }
            },
        })
    ).current;

    const renderItem = useCallback(({ item }) => (
        <ParkingListItem
            spot={item}
            price={getCurrentPrice(item)}
            isSelected={selectedSpot?.id === item.id}
            onPress={() => onItemPress(item)}
        />
    ), [getCurrentPrice, onItemPress, selectedSpot?.id]);

    return (
        <Animated.View
            style={[
                styles.sheetContainer,
                {
                    bottom: SHEET_BOTTOM_OFFSET,
                    height: maxHeight,
                    transform: [{ translateY }],
                }
            ]}
        >
            <View style={styles.header} onLayout={handleHeaderLayout} {...panResponder.panHandlers}>
                <View style={styles.handle} />

                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <View style={[
                            styles.searchModeIndicator,
                            searchMode === 'pinned' && styles.searchModeIndicatorPinned
                        ]}>
                            <MaterialCommunityIcons
                                name={searchMode === 'pinned' ? 'map-marker' : 'crosshairs-gps'}
                                size={14}
                                color="#fff"
                            />
                        </View>

                        <View style={styles.headerInfo}>
                            <Text style={styles.headerTitle}>
                                {spots.length} {spots.length === 1 ? 'spot' : 'spots'} nearby
                            </Text>
                            <Text style={styles.headerSubtitle} numberOfLines={1}>
                                {selectedSpot?.address
                                    ? `Selected: ${selectedSpot.address}`
                                    : searchMode === 'pinned'
                                        ? 'Around your pinned location'
                                        : 'Near your current location'}
                            </Text>
                        </View>
                    </View>

                    {searchMode === 'pinned' && onClearPin && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.clearButton,
                                pressed && styles.clearButtonPressed
                            ]}
                            onPress={onClearPin}
                            hitSlop={8}
                            accessibilityRole="button"
                            accessibilityLabel="Clear pinned search location"
                        >
                            <MaterialCommunityIcons
                                name="close-circle"
                                size={14}
                                color={TOKENS.textMuted}
                            />
                            <Text style={styles.clearButtonText}>Clear pin</Text>
                        </Pressable>
                    )}
                </View>
            </View>

            <View style={styles.listSeparator} />

            {spots.length === 0 ? (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                        <MaterialCommunityIcons
                            name={searchMode === 'pinned' ? 'map-marker-remove' : 'parking'}
                            size={28}
                            color={TOKENS.textFaint}
                        />
                    </View>
                    <Text style={styles.emptyTitle}>No spots in this area</Text>
                    <Text style={styles.emptyHint}>
                        {searchMode === 'pinned'
                            ? 'Move your pin or widen the radius'
                            : 'Pan or zoom the map to search elsewhere'}
                    </Text>
                </View>
            ) : (
                <Animated.FlatList
                    ref={listRef}
                    data={spots}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={[
                        styles.listContent,
                        { paddingBottom: insets.bottom + tabBarHeight + 16 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    onScrollToIndexFailed={({ index }) => {
                        setTimeout(() => {
                            listRef.current?.scrollToIndex({
                                index,
                                animated: true,
                                viewPosition: 0.45,
                            });
                        }, 120);
                    }}
                />
            )}
        </Animated.View>
    );
});

ParkingBottomSheet.displayName = 'ParkingBottomSheet';

const styles = StyleSheet.create({
    sheetContainer: {
        position: 'absolute',
        left: 10,
        right: 10,
        borderRadius: 18,
        backgroundColor: TOKENS.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
        overflow: 'hidden',
        shadowColor: TOKENS.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
    },
    header: {
        paddingTop: 12,
        paddingBottom: 14,
        backgroundColor: TOKENS.surface,
    },
    handle: {
        alignSelf: 'center',
        backgroundColor: alpha(TOKENS.text, 0.12),
        width: 36,
        height: 3,
        borderRadius: 2,
        marginBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        gap: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 10,
    },
    // Calmer indicator — smaller, less dominant. Color carries the meaning, size doesn't need to.
    searchModeIndicator: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: TOKENS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchModeIndicatorPinned: {
        backgroundColor: TOKENS.primaryAlt,
    },
    headerInfo: {
        gap: 4,
        flex: 1,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: TOKENS.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.hairline,
    },
    // Scale-based press feedback instead of opacity-only.
    // Emil: "Buttons must feel responsive. Add scale(0.97) on active."
    clearButtonPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.8,
    },
    clearButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: TOKENS.textMuted,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: TOKENS.text,
        letterSpacing: -0.2,
    },
    headerSubtitle: {
        fontSize: 13,
        fontWeight: '400',
        color: TOKENS.textMuted,
        lineHeight: 18,
    },
    listSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: TOKENS.divider,
        marginHorizontal: 20,
    },
    listContent: {
        paddingTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: TOKENS.surfaceMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: TOKENS.text,
        marginBottom: 6,
    },
    emptyHint: {
        fontSize: 13,
        lineHeight: 18,
        color: TOKENS.textMuted,
        textAlign: 'center',
        maxWidth: 260,
    },
});

export default ParkingBottomSheet;
