import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, View } from 'react-native';
import { Circle, Marker } from 'react-native-maps';
import { PALETTE, TOKENS, alpha } from '../../../constants/theme';
import { styles } from '../styles';

export default function MapOverlays({
    searchCenter,
    searchRadius,
    searchMode,
    pinnedLocation,
    pinDropAnim,
    spots,
    selectedSpot,
    selScale,
    selTranslateY,
    onSelectSpot,
}) {
    return (
        <>
            {searchCenter && (
                <Circle
                    center={searchCenter}
                    radius={searchRadius}
                    fillColor={alpha(
                        searchMode === 'pinned' ? PALETTE.flame[500] : PALETTE.earth_yellow.DEFAULT,
                        0.08
                    )}
                    strokeColor={alpha(
                        searchMode === 'pinned' ? PALETTE.flame[500] : PALETTE.earth_yellow.DEFAULT,
                        0.25
                    )}
                    strokeWidth={2}
                    lineDashPattern={searchMode === 'pinned' ? [8, 4] : null}
                />
            )}

            {pinnedLocation && (
                <Marker coordinate={pinnedLocation} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
                    <Animated.View
                        style={[
                            styles.pinMarker,
                            {
                                transform: [
                                    { scale: pinDropAnim },
                                    { translateY: pinDropAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) },
                                ],
                            },
                        ]}
                    >
                        <View style={styles.pinHead}>
                            <View style={styles.pinInner} />
                        </View>
                        <View style={styles.pinStem} />
                    </Animated.View>
                </Marker>
            )}

            {spots.map(spot => {
                if (!spot.coordinates) return null;
                const coords = {
                    latitude: spot.coordinates.coordinates[1],
                    longitude: spot.coordinates.coordinates[0],
                };
                const stylesByType = {
                    on_street: { color: TOKENS.primary, icon: 'car' },
                    off_street: { color: PALETTE.straw.DEFAULT, icon: 'parking' },
                    residential: { color: PALETTE.earth_yellow.DEFAULT, icon: 'home' },
                    school: { color: PALETTE.bistre[600], icon: 'school' },
                };
                const m = stylesByType[spot.spot_type] || stylesByType.on_street;
                const isSelected = selectedSpot?.id === spot.id;

                return (
                    <Marker key={spot.id} coordinate={coords} onPress={() => onSelectSpot(spot)} tracksViewChanges={isSelected}>
                        <Animated.View
                            style={[
                                styles.marker,
                                { backgroundColor: m.color },
                                isSelected && styles.markerSelected,
                                isSelected && { transform: [{ scale: selScale }, { translateY: selTranslateY }] },
                            ]}
                            renderToHardwareTextureAndroid
                        >
                            <MaterialCommunityIcons name={m.icon} size={isSelected ? 20 : 16} color="#fff" />
                        </Animated.View>
                    </Marker>
                );
            })}
        </>
    );
}
