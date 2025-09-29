// =====================================
// FILE: src/screens/HomeScreen/index.js
// =====================================
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, RefreshControl } from 'react-native';

import Header from './components/Header';
import ParkingList from './components/ParkingList';
import LoadingState from './components/ParkingList/LoadingState';
import EmptyState from './components/ParkingList/EmptyState';
import MapFAB from './components/MapFAB';

import { useParkingSpots } from '../../hooks/useParkingSpots';
import { useLocationManager } from '../../hooks/useLocationManager';
import { useFilterState } from '../../hooks/useFilterState';

import { TOKENS } from '../../constants/theme';
import { styles } from './HomeScreen.styles';

/**
 * HomeScreen - Main parking spots list view
 * Tapping a spot navigates to Map and opens the flippable card there.
 */
export default function HomeScreen({ navigation }) {
  // Location & filter state
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

  // Spots & UI state
  const {
    spots,
    loading,
    refreshing,
    quickInfo,
    lastRefresh,
    onRefresh,
    fadeAnim,
    slideAnim,
  } = useParkingSpots({
    location,
    activeFilter,
    searchRadius,
  });

  // Navigation handlers
  const handleMapPress = () => navigation.navigate('Map');

  // Send the selected spot to Map so it can open the FlippableParkingCard
  const handleSpotPress = (spot) => {
    navigation.navigate('Map', {
      initialSpot: spot,
      fromList: true,
    });
  };

  const handleExpandSearch = () => {
    setSearchRadius(1000);
    setActiveFilter('all');
  };

  // Initial loading state
  if ((loading && !refreshing) || isLoadingLocation) {
    return <LoadingState searchRadius={searchRadius} />;
  }

  // Render each parking spot item
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
              toggleFilters={toggleFilters}
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
              onRefresh={onRefresh}
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
          contentContainerStyle={spots.length === 0 ? styles.emptyList : null}
        />

        {/* Floating action button to open Map */}
        <MapFAB onPress={handleMapPress} />
      </SafeAreaView>
    </>
  );
}
