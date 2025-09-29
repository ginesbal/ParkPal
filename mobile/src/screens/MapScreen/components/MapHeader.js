import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import PlacesSearchBar from '../../../components/PlacesAutocomplete/PlacesSearchBar';
import { PALETTE, TOKENS } from '../../../constants/theme';
import { styles } from '../styles';

export default function MapHeader({
    insetsTop,
    NAVIGATION_HEIGHT,
    isSearchFocused, setIsSearchFocused,
    pinnedLocation, setPinnedLocation,
    showPinInstructions, setShowPinInstructions,
    searchMode, setSearchMode,
    filterType, setFilterType,
    searchRadius, setSearchRadius,
    onPlaceSelected,
}) {
    return (
        <>
            {/* Search Section */}
            <View style={styles.searchSection}>
                <PlacesSearchBar
                    onPlaceSelected={onPlaceSelected}
                    onFocusChange={setIsSearchFocused}
                    containerStyle={styles.searchContainer}
                />

                {/* Quick Actions - Only show when search not focused */}
                {!isSearchFocused && (
                    <View style={styles.quickActions}>
                        {pinnedLocation ? (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.quickAction,
                                    searchMode === 'pinned' && styles.quickActionActive,
                                    pressed && styles.quickActionPressed
                                ]}
                                onPress={() => setSearchMode(searchMode === 'pinned' ? 'current' : 'pinned')}
                            >
                                <MaterialCommunityIcons
                                    name="map-marker"
                                    size={18}
                                    color={searchMode === 'pinned' ? '#fff' : PALETTE.flame[500]}
                                />
                            </Pressable>
                        ) : (
                            <Pressable
                                style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
                                onPress={() => setShowPinInstructions(!showPinInstructions)}
                            >
                                <MaterialCommunityIcons name="map-marker-plus" size={18} color={TOKENS.text} />
                            </Pressable>
                        )}
                    </View>
                )}
            </View>

            {/* Filter Pills - Horizontally scrollable */}
            <Animated.View
                style={[styles.filterSection, { opacity: isSearchFocused ? 0 : 1 }]}
                pointerEvents={isSearchFocused ? 'none' : 'auto'}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {[
                        { type: 'all', icon: 'apps', label: 'All' },
                        { type: 'on_street', icon: 'car', label: 'Street' },
                        { type: 'off_street', icon: 'parking', label: 'Lots' },
                        { type: 'residential', icon: 'home', label: 'Permit' },
                        { type: 'school', icon: 'school', label: 'School' }
                    ].map(f => (
                        <Pressable
                            key={f.type}
                            style={({ pressed }) => [
                                styles.filterPill,
                                filterType === f.type && styles.filterPillActive,
                                pressed && styles.filterPillPressed
                            ]}
                            onPress={() => setFilterType(f.type)}
                        >
                            <MaterialCommunityIcons
                                name={f.icon}
                                size={14}
                                color={filterType === f.type ? '#fff' : TOKENS.text}
                            />
                            <Text style={[styles.filterText, filterType === f.type && styles.filterTextActive]}>
                                {f.label}
                            </Text>
                        </Pressable>
                    ))}

                    {/* Distance selector integrated into filter row */}
                    <View style={styles.distanceDivider} />
                    {[150, 300, 500].map(r => (
                        <Pressable
                            key={r}
                            style={({ pressed }) => [
                                styles.distancePill,
                                searchRadius === r && styles.distancePillActive,
                                pressed && styles.filterPillPressed
                            ]}
                            onPress={() => setSearchRadius(r)}
                        >
                            <MaterialCommunityIcons
                                name="map-marker-radius"
                                size={14}
                                color={searchRadius === r ? '#fff' : TOKENS.textMuted}
                            />
                            <Text style={[
                                styles.distanceText,
                                searchRadius === r && styles.distanceTextActive
                            ]}>
                                {r}m
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </Animated.View>
        </>
    );
}
