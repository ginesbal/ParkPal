import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    Linking,
    Pressable,
    StatusBar,
    Text,
    View,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Your existing shared components
import FlippableParkingCard from '../../components/ParkingCard/FlippableParkingCard';

// App constants/services
import { DEFAULT_LOCATION } from '../../constants/config';
import { TOKENS } from '../../constants/theme';
import { parkingAPI } from '../../services/api';
import { logger } from '../../utils/DebugLogger';

// Local refactor pieces
import MapBottomSheet from './components/MapBottomSheet';
import MapHeader from './components/MapHeader';
import MapOverlays from './components/MapOverlays';
import { SCREEN_HEIGHT, SCREEN_WIDTH, SHEET_MIN_HEIGHT } from './constants';
import { useBottomSheet } from './hooks/useBottomSheet';
import { styles } from './styles';
import { centerCamera, getMarkerScreenPosition } from './utils/camera';
import { getCurrentPrice } from './utils/pricing';

function MapScreen() {
    const insets = useSafeAreaInsets();
    const NAVIGATION_HEIGHT = 100 + insets.top;

    // Tab bar configuration
    const TAB_BAR_HEIGHT = 80; // must match your App.js tabBarStyle.height
    const BOTTOM_UI_OFFSET = TAB_BAR_HEIGHT + (insets.bottom || 0) + 14;
    const CARD_ESTIMATED_HEIGHT = 220; // adjust if your card is taller/shorter

    // Calculate available space for the sheet (between header and tab bar)
    const SHEET_AVAILABLE_SPACE = SCREEN_HEIGHT - NAVIGATION_HEIGHT - TAB_BAR_HEIGHT - insets.bottom;
    
    // Calculate how much the sheet needs to move down when collapsed
    const SHEET_COLLAPSED_OFFSET = SHEET_AVAILABLE_SPACE - SHEET_MIN_HEIGHT;

    // Refs
    const mapRef = useRef(null);
    const lastMapInteraction = useRef(null);
    const hideControlsTimer = useRef(null);

    // Initialize the bottom sheet hook with updated configuration
    const {
        isSheetExpanded,
        setIsSheetExpanded,
        viewMode,
        setViewMode,
        bottomSheetTranslateY,
        controlsOpacity,
        controlsTranslateY,
        selectedAnim,
        pinDropAnim,
        expandSheet,
        collapseSheet,
        showControls,
        hideControls,
        panHandlers,
        toggleSheet,  // New toggle function from updated hook
    } = useBottomSheet({ collapsedOffset: SHEET_COLLAPSED_OFFSET });

    // Calculate dynamic map padding based on sheet position
    const [mapPaddingBottom, setMapPaddingBottom] = useState(SHEET_MIN_HEIGHT + 20);
    
    useEffect(() => {
        const listener = bottomSheetTranslateY.addListener(({ value }) => {
            // Calculate visible sheet height
            const visibleHeight = SHEET_AVAILABLE_SPACE - value;
            // Add some padding above the sheet
            const paddingValue = Math.max(20, Math.min(SHEET_AVAILABLE_SPACE, visibleHeight + 20));
            setMapPaddingBottom(paddingValue);
        });
        
        // Initialize the padding
        setMapPaddingBottom(SHEET_MIN_HEIGHT + 20);
        
        return () => bottomSheetTranslateY.removeListener(listener);
    }, [SHEET_AVAILABLE_SPACE, bottomSheetTranslateY]);

    // Data state
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState(DEFAULT_LOCATION);
    const [userLocation, setUserLocation] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [searchRadius, setSearchRadius] = useState(150);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Pin state
    const [pinnedLocation, setPinnedLocation] = useState(null);
    const [searchMode, setSearchMode] = useState('current'); // 'current' | 'pinned'
    const [showPinInstructions, setShowPinInstructions] = useState(false);

    // Flippable card state
    const [flippableCardVisible, setFlippableCardVisible] = useState(false);
    const [flippableCardPosition, setFlippableCardPosition] = useState({ x: 0, y: 0 });
    const [flippableCardSpot, setFlippableCardSpot] = useState(null);

    // Initialize location
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setUserLocation(DEFAULT_LOCATION);
                    setRegion(DEFAULT_LOCATION);
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced
                });
                const coords = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setUserLocation(coords);
                setRegion(coords);
                await AsyncStorage.setItem('userLocation', JSON.stringify(coords));
            } catch {
                setUserLocation(DEFAULT_LOCATION);
                setRegion(DEFAULT_LOCATION);
            }
        })();

        return () => {
            if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        };
    }, []);

    // Search when ready/filters change
    useEffect(() => {
        if (userLocation || pinnedLocation) searchArea();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLocation, filterType, searchRadius, searchMode, pinnedLocation]);

    const handleMapInteraction = useCallback(() => {
        lastMapInteraction.current = Date.now();
        showControls();
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        hideControlsTimer.current = setTimeout(() => {
            if (Date.now() - lastMapInteraction.current >= 3000 && !isSheetExpanded) {
                hideControls();
            }
        }, 3000);
    }, [hideControls, isSheetExpanded, showControls]);

    // Long press: drop pin
    const handleMapLongPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setPinnedLocation({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });

        pinDropAnim.setValue(0);
        Animated.spring(pinDropAnim, {
            toValue: 1,
            tension: 40,
            friction: 6,
            useNativeDriver: true,
        }).start();

        setSearchMode('pinned');
        setShowPinInstructions(false);
        logger.log('Pin dropped', coordinate, 'UI_EVENT');
    };

    const searchArea = async () => {
        const searchLocation =
            (searchMode === 'pinned' && pinnedLocation) ? pinnedLocation : userLocation;
        if (!searchLocation) return;

        setLoading(true);
        try {
            const params = filterType !== 'all' ? { type: filterType } : {};

            logger.log('Searching for parking spots', {
                mode: searchMode,
                latitude: searchLocation.latitude,
                longitude: searchLocation.longitude,
                radius: searchRadius,
                filterType,
                params
            }, 'API_CALL');

            const res = await parkingAPI.findNearbySpots(
                searchLocation.latitude,
                searchLocation.longitude,
                searchRadius,
                params
            );

            setSpots(res?.data || []);
        } catch (e) {
            logger.log('Search error', e, 'ERROR');
            console.error('Search error:', e);
        } finally {
            setLoading(false);
        }
    };

    const selectSpot = async (spot, fromList = false) => {
        logger.logSpotData(spot, `Selected from ${fromList ? 'LIST' : 'MAP'}`);
        setSelectedSpot(spot);
        setFlippableCardVisible(false);

        if (spot?.coordinates) {
            const lat = spot.coordinates.coordinates[1];
            const lng = spot.coordinates.coordinates[0];

            await centerCamera(mapRef, region, lat, lng, 140);

            setTimeout(async () => {
                const delay = fromList ? 400 : 200;
                setTimeout(async () => {
                    const screenPos = await getMarkerScreenPosition(mapRef, spot);

                    // Clamp the card's Y so it never sits under the tab bar
                    const yCap = SCREEN_HEIGHT - BOTTOM_UI_OFFSET - CARD_ESTIMATED_HEIGHT;

                    if (screenPos) {
                        setFlippableCardPosition({
                            x: screenPos.x,
                            y: Math.min(screenPos.y, yCap),
                        });
                        setFlippableCardSpot(spot);
                        setFlippableCardVisible(true);
                    } else {
                        setFlippableCardPosition({
                            x: SCREEN_WIDTH / 2,
                            y: Math.min(SCREEN_HEIGHT / 3, yCap),
                        });
                        setFlippableCardSpot(spot);
                        setFlippableCardVisible(true);
                    }
                }, delay);
            }, 0);
        }

        selectedAnim.setValue(0);
        Animated.timing(selectedAnim, {
            toValue: 1,
            duration: 240,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
        }).start();
    };

    const onNavigate = (spot) => {
        if (!spot) return;
        const lat = spot?.coordinates?.coordinates?.[1];
        const lng = spot?.coordinates?.coordinates?.[0];
        if (typeof lat === 'number' && typeof lng === 'number') {
            Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
        }
    };

    const searchCenter = useMemo(() => (
        (searchMode === 'pinned' && pinnedLocation) ? pinnedLocation : userLocation
    ), [pinnedLocation, searchMode, userLocation]);

    const selScale = selectedAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.92, 1.12, 1]
    });
    const selTranslateY = selectedAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [6, 0]
    });

    const dynamicStyles = useMemo(() => ({
        topNavigation: { ...styles.topNavigation, paddingTop: insets.top },
        map: { ...styles.map, marginTop: NAVIGATION_HEIGHT },
        tooltip: { ...styles.tooltip, top: NAVIGATION_HEIGHT + 14 }
    }), [NAVIGATION_HEIGHT, insets.top]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={dynamicStyles.topNavigation}>
                <MapHeader
                    insetsTop={insets.top}
                    NAVIGATION_HEIGHT={NAVIGATION_HEIGHT}
                    isSearchFocused={isSearchFocused}
                    setIsSearchFocused={setIsSearchFocused}
                    pinnedLocation={pinnedLocation}
                    setPinnedLocation={setPinnedLocation}
                    showPinInstructions={showPinInstructions}
                    setShowPinInstructions={setShowPinInstructions}
                    searchMode={searchMode}
                    setSearchMode={setSearchMode}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    searchRadius={searchRadius}
                    setSearchRadius={setSearchRadius}
                    onPlaceSelected={(place) => {
                        if (place?.lat && place?.lng) {
                            const newRegion = {
                                latitude: place.lat,
                                longitude: place.lng,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            };
                            setRegion(newRegion);
                            mapRef.current?.animateToRegion(newRegion, 300);
                            setPinnedLocation(newRegion);
                            setSearchMode('pinned');
                            searchArea();
                        }
                    }}
                />
            </View>

            {/* Pin instruction tooltip */}
            {showPinInstructions && !pinnedLocation && (
                <Animated.View style={dynamicStyles.tooltip}>
                    <View style={styles.tooltipArrow} />
                    <Text style={styles.tooltipText}>
                        Press and hold anywhere on the map to search that location
                    </Text>
                </Animated.View>
            )}

            {/* Map */}
            <MapView
                ref={mapRef}
                style={dynamicStyles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                onRegionChangeComplete={setRegion}
                onPanDrag={() => {
                    handleMapInteraction();
                    setFlippableCardVisible(false);
                }}
                onPress={() => {
                    setSelectedSpot(null);
                    setFlippableCardVisible(false);
                    // Optionally collapse sheet when map is tapped
                    if (isSheetExpanded) {
                        collapseSheet();
                    }
                }}
                onLongPress={handleMapLongPress}
                showsUserLocation
                showsMyLocationButton={false}
                showsCompass={false}
                paddingAdjustmentBehavior="always"
                mapPadding={{ 
                    left: 0, 
                    right: 0, 
                    top: 0, 
                    bottom: mapPaddingBottom 
                }}
            >
                <MapOverlays
                    searchCenter={searchCenter}
                    searchRadius={searchRadius}
                    searchMode={searchMode}
                    pinnedLocation={pinnedLocation}
                    pinDropAnim={pinDropAnim}
                    spots={spots}
                    selectedSpot={selectedSpot}
                    selScale={selScale}
                    selTranslateY={selTranslateY}
                    onSelectSpot={selectSpot}
                />
            </MapView>

            {/* FAB Controls - positioned above the collapsed sheet */}
            <Animated.View
                style={[
                    styles.fabContainer,
                    {
                        opacity: controlsOpacity,
                        transform: [{ translateY: Animated.multiply(controlsTranslateY, -1) }],
                        // Position FABs above the collapsed sheet and tab bar
                        bottom: SHEET_MIN_HEIGHT + TAB_BAR_HEIGHT + 16,  // Reduced from 20 to 16 for tighter spacing
                    }
                ]}
                pointerEvents={isSheetExpanded ? 'none' : 'auto'}
            >
                <Pressable
                    style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                    onPress={searchArea}
                >
                    {loading ? (
                        <ActivityIndicator color={TOKENS.primary} size="small" />
                    ) : (
                        <MaterialCommunityIcons name="refresh" size={22} color={TOKENS.primary} />
                    )}
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.fab, styles.fabPrimary, pressed && styles.fabPressed]}
                    onPress={() => {
                        const targetLocation =
                            (searchMode === 'pinned' && pinnedLocation) ? pinnedLocation : userLocation;

                        if (targetLocation) {
                            mapRef.current?.animateCamera(
                                { center: { 
                                    latitude: targetLocation.latitude, 
                                    longitude: targetLocation.longitude 
                                }},
                                { duration: 180 }
                            );
                            setSelectedSpot(null);
                            setFlippableCardVisible(false);
                        }
                    }}
                >
                    <MaterialCommunityIcons
                        name={searchMode === 'pinned' ? "map-marker" : "crosshairs-gps"}
                        size={22}
                        color="#fff"
                    />
                </Pressable>
            </Animated.View>

            {/* Bottom Sheet - properly positioned above tab bar */}
            <MapBottomSheet
                topOffset={NAVIGATION_HEIGHT}
                tabBarHeight={TAB_BAR_HEIGHT + insets.bottom}  // Changed from bottomOffset
                bottomSheetTranslateY={bottomSheetTranslateY}
                panHandlers={panHandlers}
                spots={spots}
                searchMode={searchMode}
                getCurrentPrice={getCurrentPrice}
                onItemPress={(spot) => {
                    selectSpot(spot, true);
                    collapseSheet();
                }}
                isExpanded={isSheetExpanded}  // Added
                onToggle={toggleSheet}         // Added
            />

            {/* Flippable card */}
            <FlippableParkingCard
                visible={flippableCardVisible}
                spot={flippableCardSpot}
                position={flippableCardPosition}
                onClose={() => {
                    setFlippableCardVisible(false);
                    setSelectedSpot(null);
                }}
                onNavigate={() => onNavigate(flippableCardSpot)}
            />
        </View>
    );
}

export default MapScreen;