import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParkingListItem from '../../../components/ParkingList/ParkingListItem';
import { PALETTE, TOKENS } from '../../../constants/theme';

export default function MapBottomSheet({
    topOffset,
    tabBarHeight = 100,
    bottomSheetTranslateY,
    panHandlers,
    spots,
    searchMode,
    getCurrentPrice,
    onItemPress,
    isExpanded = false,
    onToggle,
}) {
    const insets = useSafeAreaInsets();

    const headerOpacity = bottomSheetTranslateY.interpolate({
        inputRange: [0, 150],
        outputRange: [0.3, 1],
        extrapolate: 'clamp'
    });

    const expandedContentOpacity = bottomSheetTranslateY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    const chevronRotate = bottomSheetTranslateY.interpolate({
        inputRange: [0, 150],
        outputRange: ['180deg', '0deg'],
        extrapolate: 'clamp'
    });

    const [buttonScale] = React.useState(new Animated.Value(1));
    const handlePressIn = () => {
        Animated.timing(buttonScale, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
    };
    const handlePressOut = () => {
        Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }).start();
    };

    const containerBottom = isExpanded ? 0 : tabBarHeight;
    const listBottomPad = (isExpanded ? insets.bottom : 0) + 24;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: bottomSheetTranslateY }],
                    top: topOffset,
                    bottom: containerBottom,
                },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.dragArea} {...panHandlers}>
                    <View style={styles.dragIndicator} />
                </View>

                {/* Main Interactive Area */}
                <TouchableOpacity
                    onPress={onToggle}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                    style={styles.touchableArea}
                >
                    <Animated.View
                        style={[styles.headerContent, { transform: [{ scale: buttonScale }] }]}
                    >
                        <View style={styles.headerLeft}>
                            <View style={styles.resultsContainer}>
                                <Text style={styles.countNumber}>{spots.length}</Text>
                                <View>
                                    <Text style={styles.countLabel}>Parking</Text>
                                    <Text style={styles.countSublabel}>spots</Text>
                                </View>
                            </View>

                            <Animated.View style={{ opacity: headerOpacity }}>
                                <View style={styles.statusPill}>
                                    {searchMode === 'pinned' ? (
                                        <>
                                            <View style={styles.statusDot} />
                                            <Text style={styles.statusText}>Pin location</Text>
                                        </>
                                    ) : (
                                        <>
                                            <View style={[styles.statusDot, styles.statusDotActive]} />
                                            <Text style={styles.statusText}>Your location</Text>
                                        </>
                                    )}
                                </View>
                            </Animated.View>
                        </View>

                        <View style={styles.controlContainer}>
                            <Animated.View
                                style={[styles.chevronButton, { transform: [{ rotate: chevronRotate }] }]}
                            >
                                <MaterialCommunityIcons name="chevron-up" size={28} color={TOKENS.primary} />
                            </Animated.View>
                        </View>
                    </Animated.View>
                </TouchableOpacity>

                <Animated.View
                    style={[styles.expandedInfo, { opacity: expandedContentOpacity }]}
                    pointerEvents={isExpanded ? 'auto' : 'none'}
                >
                    <Text style={styles.expandedTitle}>Available Parking</Text>
                    <Text style={styles.expandedSubtitle}>
                        {spots.length === 0
                            ? 'No spots in this area'
                            : `${spots.length} spots within ${searchMode === 'pinned' ? 'pinned area' : 'your area'
                            }`}
                    </Text>
                </Animated.View>
            </View>

            <View style={styles.separator} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: listBottomPad }]}
                showsVerticalScrollIndicator={true}
                scrollEnabled={isExpanded}
                bounces={isExpanded}
            >
                {spots.length === 0 ? (
                    <View style={[styles.emptyState, isExpanded && styles.emptyStateExpanded]}>
                        <View style={styles.emptyIcon}>
                            <MaterialCommunityIcons name="car-off" size={64} color={PALETTE.vanilla[400]} />
                        </View>
                        <Text style={styles.emptyTitle}>No parking available</Text>
                        <Text style={styles.emptyDescription}>
                            We couldn't find any parking spots in this area. Try expanding your search radius or
                            changing the location.
                        </Text>
                        <TouchableOpacity style={styles.emptyButton}>
                            <MaterialCommunityIcons name="refresh" size={20} color={TOKENS.primary} />
                            <Text style={styles.emptyButtonText}>Search again</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {spots.map((spot, index) => (
                            <View key={spot.id}>
                                <ParkingListItem
                                    spot={spot}
                                    price={getCurrentPrice(spot)}
                                    onPress={() => onItemPress(spot)}
                                />
                                {index < spots.length - 1 && <View style={styles.itemSeparator} />}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    dragArea: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 20,
    },
    dragIndicator: {
        width: 36,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
    },
    touchableArea: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    resultsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    countNumber: {
        fontSize: 36,
        fontWeight: '700',
        color: TOKENS.primary,
        lineHeight: 40,
    },
    countLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        lineHeight: 16,
    },
    countSublabel: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666666',
        lineHeight: 16,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: PALETTE.flame[500],
    },
    statusDotActive: {
        backgroundColor: '#4CAF50',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666666',
    },
    controlContainer: {
        marginLeft: 'auto',
    },
    chevronButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F7FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedInfo: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    expandedTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: PALETTE.bistre[600],
        marginBottom: 4,
    },
    expandedSubtitle: {
        fontSize: 12,
        color: PALETTE.bistre[800],
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 24, // augmented at runtime via listBottomPad
    },
    listContainer: {
        gap: 0,
    },
    itemSeparator: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginVertical: 12,
        marginHorizontal: 4,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 24,
    },
    emptyStateExpanded: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F0F7FF',
        borderRadius: 20,
    },
    emptyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: TOKENS.primary,
    },
});
