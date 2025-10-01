// src/screens/MapScreen/index.js

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

// shared components
import FlippableParkingCard from '../../components/ParkingCard/FlippableParkingCard';

// app constants/services
import { DEFAULT_LOCATION } from '../../constants/config';
import { TOKENS } from '../../constants/theme';
import { parkingAPI } from '../../services/api';

// logs
import { debugLogger as logger } from '../../utils/loggers';

// files specific to this screen
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

    // tab bar sizing to keep ui elements clear
    const TAB_BAR_HEIGHT = 80;
    const BOTTOM_UI_OFFSET = TAB_BAR_HEIGHT + (insets.bottom || 0) + 14;
    const CARD_ESTIMATED_HEIGHT = 220;

    // available space for the sheet
    const SHEET_AVAILABLE_SPACE = SCREEN_HEIGHT - NAVIGATION_HEIGHT - TAB_BAR_HEIGHT - insets.bottom;
    const SHEET_COLLAPSED_OFFSET = SHEET_AVAILABLE_SPACE - SHEET_MIN_HEIGHT;

    // refs
    const mapRef = useRef(null);
    const lastMapInteraction = useRef(null);
    const hideControlsTimer = useRef(null);

    // bottom sheet
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
        toggleSheet,
    } = useBottomSheet({ collapsedOffset: SHEET_COLLAPSED_OFFSET });

    // map padding reacts to sheet position
    const [mapPaddingBottom, setMapPaddingBottom] = useState(SHEET_MIN_HEIGHT + 20);

    useEffect(() => {
        const listener = bottomSheetTranslateY.addListener(({ value }) => {
            const visibleHeight = SHEET_AVAILABLE_SPACE - value;
            const paddingValue = Math.max(20, Math.min(SHEET_AVAILABLE_SPACE, visibleHeight + 20));
            setMapPaddingBottom(paddingValue);
        });

        setMapPaddingBottom(SHEET_MIN_HEIGHT + 20);

        return () => bottomSheetTranslateY.removeListener(listener);
    }, [SHEET_AVAILABLE_SPACE, bottomSheetTranslateY]);

    // data state
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState(DEFAULT_LOCATION);
    const [userLocation, setUserLocation] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [searchRadius, setSearchRadius] = useState(150);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // pin state
    const [pinnedLocation, setPinnedLocation] = useState(null);
    const [searchMode, setSearchMode] = useState('current'); // 'current' | 'pinned'
    const [showPinInstructions, setShowPinInstructions] = useState(false);

    // flippable card state
    const [flippableCardVisible, setFlippableCardVisible] = useState(false);
    const [flippableCardPosition, setFlippableCardPosition] = useState({ x: 0, y: 0 });
    const [flippableCardSpot, setFlippableCardSpot] = useState(null);

    // get initial location and record permission outcome
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                // important: permission result explains empty data scenarios
                logger.log('location_permission', { status }, 'INFO');

                if (status !== 'granted') {
                    setUserLocation(DEFAULT_LOCATION);
                    setRegion(DEFAULT_LOCATION);
                    // important: fallback location to keep app usable
                    logger.log('location_fallback_default', DEFAULT_LOCATION, 'WARN');
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
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
                // important: capture starting coordinates for debugging
                logger.log('location_acquired', { lat: coords.latitude, lng: coords.longitude }, 'INFO');
            } catch {
                setUserLocation(DEFAULT_LOCATION);
                setRegion(DEFAULT_LOCATION);
                // important: catch-all failure path with fallback
                logger.log('location_error_fallback_default', DEFAULT_LOCATION, 'ERROR');
            }
        })();

        return () => {
            if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        };
    }, []);

    // trigger search when prerequisites change
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

    // long press to drop pin and switch mode
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
        // important: record pin placement and mode shift
        logger.log('Pin dropped', coordinate, 'UI_EVENT');
        logger.log('search_mode_changed', { to: 'pinned' }, 'INFO');
    };

    // perform nearby search and summarize results
    const searchArea = async () => {
        const searchLocation =
            (searchMode === 'pinned' && pinnedLocation) ? pinnedLocation : userLocation;
        if (!searchLocation) return;

        setLoading(true);
        try {
            const params = filterType !== 'all' ? { type: filterType } : {};

            // important: record search parameters to reproduce issues
            logger.log('Searching for parking spots', {
                mode: searchMode,
                latitude: searchLocation.latitude,
                longitude: searchLocation.longitude,
                radius: searchRadius,
                filterType,
                params,
            }, 'API_CALL');

            const res = await parkingAPI.findNearbySpots(
                searchLocation.latitude,
                searchLocation.longitude,
                searchRadius,
                params
            );

            const list = res?.data || [];
            setSpots(list);

            // important: quick result sanity to catch empty/short lists
            logger.log('api_parking_spots_result', {
                count: Array.isArray(list) ? list.length : 0,
                sampleIds: Array.isArray(list) ? list.slice(0, 3).map(s => s?.id) : [],
            }, 'API_RESPONSE');
        } catch (e) {
            logger.log('Search error', e, 'ERROR');
            console.error('Search error:', e);
        } finally {
            setLoading(false);
        }
    };

    const selectSpot = async (spot, fromList = false) => {
        // important: deep snapshot of the chosen spot for diagnostics
        logger.logSpotData(spot, `Selected from ${fromList ? 'LIST' : 'MAP'}`);
        setSelectedSpot(spot);
        setFlippableCardVisible(false);

        if (spot?.coordinates) {
            const lat = spot.coordinates.coordinates[1];
            const lng = spot.coordinates.coordinates[0];

            await centerCamera(mapRef, region, lat, lng, 140);
            // important: confirm camera move for traceability
            logger.log('camera_centered_on_spot', { id: spot?.id, lat, lng }, 'INFO');

            setTimeout(async () => {
                const delay = fromList ? 400 : 200;
                setTimeout(async () => {
                    const screenPos = await getMarkerScreenPosition(mapRef, spot);
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
            // important: record external handoff to maps
            logger.log('open_external_navigation', { lat, lng, provider: 'google' }, 'UI_EVENT');
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

            {/* header */}
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
                    // important: track mode changes from the header controls
                    setSearchMode={(mode) => {
                        logger.log('search_mode_changed', { to: mode }, 'INFO');
                        setSearchMode(mode);
                    }}
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
                            logger.log('search_mode_changed', { to: 'pinned' }, 'INFO');
                            searchArea();
                        }
                    }}
                />
            </View>

            {/* pin instruction tooltip */}
            {showPinInstructions && !pinnedLocation && (
                <Animated.View style={dynamicStyles.tooltip}>
                    <View style={styles.tooltipArrow} />
                    <Text style={styles.tooltipText}>
                        Press and hold anywhere on the map to search that location
                    </Text>
                </Animated.View>
            )}

            {/* map */}
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

            {/* floating actions above collapsed sheet */}
            <Animated.View
                style={[
                    styles.fabContainer,
                    {
                        opacity: controlsOpacity,
                        transform: [{ translateY: Animated.multiply(controlsTranslateY, -1) }],
                        bottom: SHEET_MIN_HEIGHT + TAB_BAR_HEIGHT + 16,
                    }
                ]}
                pointerEvents={isSheetExpanded ? 'none' : 'auto'}
            >
                <Pressable
                    style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                    onPress={() => {
                        // important: explicit user-driven refresh for analytics
                        logger.log('ui_refresh_pressed', { radius: searchRadius, filterType }, 'UI_EVENT');
                        searchArea();
                    }}
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
                        // important: users often tap recenter when lost
                        logger.log('ui_recenter_pressed', { mode: searchMode }, 'UI_EVENT');

                        const targetLocation =
                            (searchMode === 'pinned' && pinnedLocation) ? pinnedLocation : userLocation;

                        if (targetLocation) {
                            mapRef.current?.animateCamera(
                                { center: { latitude: targetLocation.latitude, longitude: targetLocation.longitude } },
                                { duration: 180 }
                            );
                            setSelectedSpot(null);
                            setFlippableCardVisible(false);
                        }
                    }}
                >
                    <MaterialCommunityIcons
                        name={searchMode === 'pinned' ? 'map-marker' : 'crosshairs-gps'}
                        size={22}
                        color="#fff"
                    />
                </Pressable>
            </Animated.View>

            {/* bottom sheet */}
            <MapBottomSheet
                topOffset={NAVIGATION_HEIGHT}
                tabBarHeight={TAB_BAR_HEIGHT + insets.bottom}
                bottomSheetTranslateY={bottomSheetTranslateY}
                panHandlers={panHandlers}
                spots={spots}
                searchMode={searchMode}
                getCurrentPrice={getCurrentPrice}
                onItemPress={(spot) => {
                    selectSpot(spot, true);
                    collapseSheet();
                }}
                isExpanded={isSheetExpanded}
                onToggle={toggleSheet}
            />

            {/* flippable card */}
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
