import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParkingListItem from '../../../components/ParkingList/ParkingListItem';
import { TOKENS, alpha } from '../../../constants/theme';
import { SCREEN_HEIGHT } from '../constants';

// Helper function to clamp a value between min and max
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const SHEET_BOTTOM_OFFSET = 10;
const SHEET_EXPANDED_TOP_GAP = 18;

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

    // Non-modal bottom sheet implemented with Animated + PanResponder
    // Peek height only shows header (handle + title + subtitle)
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

    useImperativeHandle(ref, () => ({
        present: () => animateTo(EXPANDED_Y),
        dismiss: () => animateTo(PEEK_Y),
    }));

    const animateTo = useCallback((to, velocity = 0) => {
        Animated.spring(translateY, {
            toValue: to,
            velocity,
            tension: 58,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, [translateY]);

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

    useEffect(() => {
        if (!selectedSpot?.id || !spots.length) {
            return;
        }

        const selectedIndex = spots.findIndex((spot) => spot?.id === selectedSpot.id);
        if (selectedIndex < 0) {
            return;
        }

        const timer = setTimeout(() => {
            listRef.current?.scrollToIndex({
                index: selectedIndex,
                animated: true,
                viewPosition: 0.45,
            });
        }, 120);

        return () => clearTimeout(timer);
    }, [selectedSpot?.id, spots]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4 && Math.abs(g.dy) > Math.abs(g.dx),
            onPanResponderGrant: () => {
                translateY.stopAnimation((cur) => { dragStartY.current = cur ?? PEEK_Y; });
            },
            onPanResponderMove: (_, g) => {
                const next = clamp(dragStartY.current + g.dy, EXPANDED_Y, HIDDEN_Y);
                translateY.setValue(next);
            },
            onPanResponderRelease: (_, g) => {
                const finalY = clamp(dragStartY.current + g.dy, EXPANDED_Y, HIDDEN_Y);
                const mid = (PEEK_Y + EXPANDED_Y) / 2;
                if (finalY <= mid || g.vy < -0.5) animateTo(EXPANDED_Y, g.vy);
                else animateTo(PEEK_Y, g.vy);
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
                        {/* Simple icon with solid color */}
                        <View style={[
                            styles.searchModeIndicator,
                            searchMode === 'pinned' && styles.searchModeIndicatorPinned
                        ]}>
                            <MaterialCommunityIcons
                                name={searchMode === 'pinned' ? 'map-marker' : 'crosshairs-gps'}
                                size={16}
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
                                        ? 'Searching around your pinned location'
                                        : 'Searching near your current location'}
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
                            size={40}
                            color={TOKENS.textFaint}
                        />
                    </View>
                    <Text style={styles.emptyTitle}>Nothing here yet</Text>
                    <Text style={styles.emptyHint}>
                        {searchMode === 'pinned'
                            ? 'Move your pin or widen the radius to find spots'
                            : 'Pan or zoom the map to search a different area'}
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
        paddingHorizontal: 18,
        gap: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    searchModeIndicator: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: TOKENS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchModeIndicatorPinned: {
        backgroundColor: TOKENS.primaryAlt,
    },
    headerInfo: {
        gap: 3,
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
    clearButtonPressed: {
        opacity: 0.6,
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
        fontSize: 12,
        fontWeight: '400',
        color: TOKENS.textMuted,
        lineHeight: 16,
    },
    listSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: TOKENS.divider,
        marginHorizontal: 18,
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
        width: 64,
        height: 64,
        borderRadius: 16,
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
