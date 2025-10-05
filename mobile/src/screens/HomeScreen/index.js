import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { FlatList, RefreshControl, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from './components/Header';
import MapFAB from './components/MapFAB';
import ParkingList from './components/ParkingList';
import EmptyState from './components/ParkingList/EmptyState';
import LoadingState from './components/ParkingList/LoadingState';

import { useFilterState } from '../../hooks/useFilterState';
import { useLocationManager } from '../../hooks/useLocationManager';
import { useParkingSpots } from '../../hooks/useParkingSpots';

import { logger } from '../../utils/loggers';
import { calculateQuickInfo } from '../../utils/parkingHelpers';

import { TOKENS } from '../../constants/theme';
import { styles } from './HomeScreen.styles';

export default function HomeScreen({ navigation }) {
  // location & filter state
  const { location, isLoadingLocation } = useLocationManager();

  const {
    activeFilter,
    setActiveFilter,
    searchRadius,
    setSearchRadius,
    showFilters,
    toggleFilters,
    filterHeight,
    hasActiveFilters,
  } = useFilterState();

  // data fetching hook
  const { spots, loading, error } = useParkingSpots(
    location,
    searchRadius,
    activeFilter
  );

  // local UI state
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(null);

  // animations (UI concern, not data concern)
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // calculate stats from spots
  const quickInfo = useMemo(() => {
    return calculateQuickInfo(spots);
  }, [spots]);

  // first screen mount + key inputs snapshot
  React.useEffect(() => {
    logger.log('home_mount', {
      hasLocation: !!location,
      activeFilter,
      searchRadius
    });
  }, []);

  // log when list transitions from empty->has data
  const prevCountRef = React.useRef(0);
  React.useEffect(() => {
    const count = Array.isArray(spots) ? spots.length : 0;
    if (count > 0 && prevCountRef.current === 0) {
      logger.log('spots_loaded', {
        count,
        filter: activeFilter,
        radius: searchRadius
      });
    }
    prevCountRef.current = count;
  }, [spots, activeFilter, searchRadius]);

  // capture empty-state scenarios
  React.useEffect(() => {
    if (!loading && !refreshing && Array.isArray(spots) && spots.length === 0) {
      logger.log('spots_empty', {
        hasLocation: !!location,
        filter: activeFilter,
        radius: searchRadius,
        lastRefresh
      });
    }
  }, [loading, refreshing, spots, location, activeFilter, searchRadius, lastRefresh]);

  // navigation handlers
  const handleMapPress = () => {
    logger.log('nav_to_map_from_home', { source: 'fab_or_header' });
    navigation.navigate('Map');
  };

  const handleSpotPress = (spot) => {
    logger.log('spot_selected_from_home', {
      spotId: spot?.id,
      address: spot?.address
    });

    navigation.navigate('Map', {
      initialSpot: spot,
      fromList: true,
    });
  };

  const handleExpandSearch = () => {
    logger.log('expand_search', {
      oldRadius: searchRadius,
      newRadius: 1000
    });

    setSearchRadius(1000);
    setActiveFilter('all');
  };

  const handleRefresh = useCallback(() => {
    logger.log('home_refresh', {
      filter: activeFilter,
      radius: searchRadius
    });
    
    setRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setLastRefresh(new Date());
    
    // reset refreshing after delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [activeFilter, searchRadius]);

  // filter/radius changes
  React.useEffect(() => {
    if (activeFilter) {
      logger.log('filter_changed', { filter: activeFilter });
    }
  }, [activeFilter]);

  React.useEffect(() => {
    if (searchRadius) {
      logger.log('radius_changed', { radius: searchRadius });
    }
  }, [searchRadius]);

  const handleToggleFilters = useCallback(() => {
    logger.log('filters_toggled', { to: !showFilters });
    toggleFilters();
  }, [showFilters, toggleFilters]);

  // initial loading state
  if ((loading && !refreshing) || isLoadingLocation) {
    logger.log('home_loading_state', {
      loading,
      refreshing,
      isLoadingLocation
    });
    return <LoadingState searchRadius={searchRadius} />;
  }

  const renderSpot = ({ item }) => (
    <ParkingList.Item
      spot={item}
      onPress={() => handleSpotPress(item)}
      fadeAnim={fadeAnim}
      slideAnim={slideAnim}
    />
  );

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: TOKENS.surface }} />
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
        <FlatList
          data={spots}
          renderItem={renderSpot}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={
            <Header
              location={location}
              spots={spots}
              quickInfo={quickInfo}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              searchRadius={searchRadius}
              setSearchRadius={setSearchRadius}
              showFilters={showFilters}
              toggleFilters={handleToggleFilters}
              filterHeight={filterHeight}
              hasActiveFilters={hasActiveFilters}
              lastRefresh={lastRefresh}
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
              onLocationPress={handleMapPress}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={TOKENS.primary}
              colors={[TOKENS.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              onExpandSearch={handleExpandSearch}
              onViewMap={handleMapPress}
            />
          }
          contentContainerStyle={Array.isArray(spots) && spots.length === 0 ? styles.emptyList : null}
        />

        <MapFAB onPress={handleMapPress} />
      </SafeAreaView>
    </>
  );
}