import { memo } from 'react';
import { Animated, View } from 'react-native';
import { Circle, Marker } from 'react-native-maps';
import { TOKENS, alpha } from '../../../constants/theme';
import { styles } from '../styles';

function MapOverlays({
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
                        searchMode === 'pinned' ? TOKENS.textMuted : TOKENS.primary,
                        0.06
                    )}
                    strokeColor={alpha(
                        searchMode === 'pinned' ? TOKENS.textMuted : TOKENS.primary,
                        0.22
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
                const isSelected = selectedSpot?.id === spot.id;

                return (
                    <Marker
                        key={spot.id}
                        coordinate={coords}
                        onPress={() => onSelectSpot(spot)}
                        tracksViewChanges={false}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={styles.marker}>
                            <View
                                style={[
                                    isSelected ? styles.markerDotSelected : styles.markerDot,
                                    !isSelected && spot.no_stopping && { backgroundColor: TOKENS.danger },
                                ]}
                            />
                        </View>
                    </Marker>
                );
            })}
        </>
    );
}

export default memo(MapOverlays);
