// src/components/ParkingList/ParkingListView.js

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FlippableParkingCard from '../../components/ParkingCard/FlippableParkingCard';
import { PALETTE, TOKENS, alpha } from '../../constants/theme';
import { debugLogger as logger } from '../../utils/loggers';
import ParkingListItem from '../ParkingList/ParkingListItem';

// simple price parser for sorting
const parsePrice = (price) => {
    if (!price || price === 'FREE') return 0;
    if (typeof price === 'string') {
        const m = price.match(/[\d.]+/);
        return m ? parseFloat(m[0]) : 0;
    }
    return parseFloat(price) || 0;
};

export default function ParkingListView({
    route,
    navigation,
    // or pass as props if not using navigation
    spots = [],
    destinationName = 'Destination',
    onBack,
}) {
    // ui state
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [sortBy, setSortBy] = useState('walking'); // 'walking' | 'price' | 'distance'
    const [filterType, setFilterType] = useState('all'); // 'all' | 'on_street' | 'off_street' | ...

    // enter animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // screen entry
    useEffect(() => {
        logger.log('list view open', { destinationName, totalSpots: spots.length }, 'UI_NAV');

        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, speed: 12, bounciness: 8, useNativeDriver: true }),
        ]).start();

        return () => {
            logger.log('list view close', { hadSelection: !!selectedSpot }, 'UI_NAV');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // sort logic
    const sortedSpots = useMemo(() => {
        const copy = [...spots];
        switch (sortBy) {
            case 'walking':
                copy.sort((a, b) => (a.walkingTime || 0) - (b.walkingTime || 0));
                break;
            case 'price':
                copy.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                break;
            case 'distance':
                copy.sort((a, b) => (a.distance || 0) - (b.distance || 0));
                break;
            default:
                break;
        }
        return copy;
    }, [spots, sortBy]);

    // filter logic
    const filteredSpots = useMemo(() => {
        const out =
            filterType === 'all'
                ? sortedSpots
                : sortedSpots.filter((s) => s.spot_type === filterType);

        // log only when list becomes empty or recovers
        if (out.length === 0 && sortedSpots.length > 0) {
            logger.log(
                'list filtered empty',
                { sortBy, filterType, total: sortedSpots.length },
                'DATA_VIEW'
            );
        }
        return out;
    }, [sortedSpots, filterType, sortBy]);

    // log sort/filter changes
    useEffect(() => {
        logger.log('sort changed', { sortBy }, 'UI_FILTER');
    }, [sortBy]);

    useEffect(() => {
        logger.log('type filter changed', { filterType }, 'UI_FILTER');
    }, [filterType]);

    // handlers
    const handleSpotPress = (spot, opts) => {
        setSelectedSpot(spot);
        logger.log(
            'spot selected',
            { spotId: spot?.id, address: spot?.address, fromList: true },
            'UI_EVENT'
        );
        if (!opts?.stayInList) setShowDetails(true);
    };

    const handleViewOnMap = (spot) => {
        logger.log('view on map', { spotId: spot?.id }, 'UI_EVENT');
        navigation?.navigate('Map', { centerOnSpot: spot, highlightSpot: spot?.id });
    };

    const handleOpenDetails = (spot) => {
        setSelectedSpot(spot);
        setShowDetails(true);
        logger.log('open details', { spotId: spot?.id }, 'UI_EVENT');
    };

    const handleNavigate = () => {
        if (!selectedSpot) return;
        // note: actual linking handled by FlippableParkingCard or map screen
        logger.log('navigate request', { spotId: selectedSpot?.id }, 'UI_EVENT');
    };

    const handleBack = () =>
        navigation?.goBack?.() || onBack?.();

    const handleToggleMap = () => {
        logger.log('toggle map from list', {}, 'UI_NAV');
        navigation?.navigate?.('Map');
    };

    // header
    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color={TOKENS.text} />
            </TouchableOpacity>

            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Parking Near</Text>
                <Text style={styles.destinationName} numberOfLines={1}>
                    {destinationName}
                </Text>
            </View>

            <TouchableOpacity style={styles.mapToggle} onPress={handleToggleMap}>
                <MaterialCommunityIcons name="map" size={24} color={TOKENS.primary} />
            </TouchableOpacity>
        </View>
    );

    // filters
    const renderFilters = () => (
        <View style={styles.filtersContainer}>
            {/* sort options */}
            <View style={styles.sortContainer}>
                <Text style={styles.filterLabel}>Sort by:</Text>
                <View style={styles.sortButtons}>
                    {[
                        { key: 'walking', label: 'Walk Time', icon: 'walk' },
                        { key: 'price', label: 'Price', icon: 'currency-usd' },
                        { key: 'distance', label: 'Distance', icon: 'map-marker' },
                    ].map((sort) => (
                        <TouchableOpacity
                            key={sort.key}
                            style={[styles.sortButton, sortBy === sort.key && styles.sortButtonActive]}
                            onPress={() => setSortBy(sort.key)}
                        >
                            <MaterialCommunityIcons
                                name={sort.icon}
                                size={14}
                                color={sortBy === sort.key ? '#fff' : TOKENS.textMuted}
                            />
                            <Text
                                style={[styles.sortButtonText, sortBy === sort.key && styles.sortButtonTextActive]}
                            >
                                {sort.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* type filter */}
            <View style={styles.typeFilterContainer}>
                <Text style={styles.filterLabel}>Type:</Text>
                <View style={styles.typeFilters}>
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'on_street', label: 'Street' },
                        { key: 'off_street', label: 'Lot' },
                        { key: 'residential', label: 'Residential' },
                    ].map((type) => (
                        <TouchableOpacity
                            key={type.key}
                            style={[styles.typeButton, filterType === type.key && styles.typeButtonActive]}
                            onPress={() => setFilterType(type.key)}
                        >
                            <Text
                                style={[styles.typeButtonText, filterType === type.key && styles.typeButtonTextActive]}
                            >
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    // summary
    const renderSummary = () => (
        <View style={styles.summaryBar}>
            <Text style={styles.summaryText}>
                {filteredSpots.length} parking {filteredSpots.length === 1 ? 'spot' : 'spots'} found
            </Text>
            {selectedSpot && (
                <View style={styles.selectedIndicator}>
                    <View style={styles.selectedDot} />
                    <Text style={styles.selectedText}>{selectedSpot.address} selected</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {renderHeader()}
                {renderFilters()}
                {renderSummary()}

                <FlatList
                    data={filteredSpots}
                    keyExtractor={(item) => item.id || `${item.latitude}-${item.longitude}`}
                    renderItem={({ item }) => (
                        <ParkingListItem
                            spot={item}
                            price={item.price || item.rate}
                            onPress={handleSpotPress}
                            onViewOnMap={handleViewOnMap}
                            onOpenDetails={handleOpenDetails}
                            showActions={true}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="parking" size={48} color={alpha(TOKENS.text, 0.3)} />
                            <Text style={styles.emptyText}>No parking spots found</Text>
                            <Text style={styles.emptySubtext}>Try adjusting your filters or search area</Text>
                        </View>
                    )}
                    onEndReachedThreshold={0.6}
                    onEndReached={() => {
                        // log for future infinite scroll
                        logger.log('list end reached', { count: filteredSpots.length }, 'DATA_VIEW');
                    }}
                />
            </Animated.View>

            {/* floating actions for selected spot */}
            {selectedSpot && (
                <Animated.View style={styles.floatingActions}>
                    <TouchableOpacity style={styles.fabDetails} onPress={() => setShowDetails(true)}>
                        <MaterialCommunityIcons name="information" size={20} color="#fff" />
                        <Text style={styles.fabText}>Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.fabNavigate} onPress={handleNavigate}>
                        <MaterialCommunityIcons name="navigation" size={20} color="#fff" />
                        <Text style={styles.fabText}>Navigate</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* details card */}
            <FlippableParkingCard
                visible={showDetails}
                spot={selectedSpot}
                position={{ x: 200, y: 400 }} // approximate center
                onClose={() => setShowDetails(false)}
                onNavigate={handleNavigate}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: PALETTE.vanilla[800] },
    content: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: PALETTE.vanilla[600],
    },
    backButton: { padding: 8 },
    headerContent: { flex: 1, marginHorizontal: 12 },
    headerTitle: { fontSize: 12, color: TOKENS.textMuted, marginBottom: 2 },
    destinationName: { fontSize: 16, fontWeight: '600', color: TOKENS.text },
    mapToggle: { padding: 8 },

    filtersContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: PALETTE.vanilla[600],
    },
    sortContainer: { marginBottom: 12 },
    filterLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: TOKENS.textMuted,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sortButtons: { flexDirection: 'row', gap: 8 },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: PALETTE.vanilla[700],
        gap: 4,
    },
    sortButtonActive: { backgroundColor: TOKENS.primary },
    sortButtonText: { fontSize: 12, fontWeight: '500', color: TOKENS.textMuted },
    sortButtonTextActive: { color: '#fff' },

    typeFilterContainer: { flexDirection: 'row', alignItems: 'center' },
    typeFilters: { flex: 1, flexDirection: 'row', gap: 6, marginLeft: 12 },
    typeButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: PALETTE.vanilla[700],
    },
    typeButtonActive: { backgroundColor: PALETTE.earth_yellow[300] },
    typeButtonText: { fontSize: 12, fontWeight: '500', color: TOKENS.textMuted },
    typeButtonTextActive: { color: '#fff' },

    summaryBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: PALETTE.vanilla[900],
    },
    summaryText: { fontSize: 12, color: TOKENS.textMuted },
    selectedIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    selectedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: PALETTE.straw[500] },
    selectedText: { fontSize: 11, color: PALETTE.straw[700], fontWeight: '500' },

    listContent: { paddingBottom: 100 },
    separator: { height: 0 },

    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 16, fontWeight: '600', color: TOKENS.text, marginTop: 16 },
    emptySubtext: { fontSize: 14, color: TOKENS.textMuted, marginTop: 4 },

    floatingActions: {
        position: 'absolute',
        bottom: 24,
        right: 16,
        flexDirection: 'row',
        gap: 12,
        elevation: 8,
        shadowColor: PALETTE.bistre[800],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    fabDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.earth_yellow[400],
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 6,
    },
    fabNavigate: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: TOKENS.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 6,
    },
    fabText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
