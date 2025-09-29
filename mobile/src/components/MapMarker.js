// =====================================
// FILE: src/components/MapMarker.jsx
// =====================================
import React, { memo, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TOKENS, PALETTE } from '../constants/theme';

const TYPE_STYLE = {
  on_street:  { color: TOKENS.primary,                 icon: 'car-side',  label: 'Street' },
  off_street: { color: PALETTE.straw.DEFAULT,          icon: 'parking',   label: 'Lot' },
  residential:{ color: PALETTE.earth_yellow.DEFAULT,   icon: 'home-city', label: 'Permit' },
  school:     { color: PALETTE.bistre[600],            icon: 'school',    label: 'School' },
};

function MapMarker({ spot, selected, onPress, lat, lng, lowPerf = false }) {
  const style = TYPE_STYLE[spot.spot_type] || TYPE_STYLE.on_street;
  const latitude  = typeof lat === 'number' ? lat : spot?.coordinates?.coordinates?.[1];
  const longitude = typeof lng === 'number' ? lng : spot?.coordinates?.coordinates?.[0];
  const [track, setTrack] = useState(false);

  useEffect(() => {
    setTrack(true);
    const t = setTimeout(() => setTrack(false), 220);
    return () => clearTimeout(t);
  }, [selected, spot?.capacity]);

  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;

  const accLabel = `${TYPE_STYLE[spot.spot_type]?.label || 'Spot'} at ${spot.address || 'unknown address'}`;

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={onPress}
      tracksViewChanges={track}
      zIndex={selected ? 10 : 1}
      accessibilityLabel={accLabel}
      accessibilityRole="button"
    >
      <View style={[styles.pin, { backgroundColor: style.color }, selected && styles.pinSelected, lowPerf && styles.lowPerfShadow]}>
        <MaterialCommunityIcons name={style.icon} size={selected ? 24 : 20} color="#fff" />
        {!!spot.capacity && (
          <View style={styles.badge}><Text style={styles.badgeText}>{spot.capacity}</Text></View>
        )}
      </View>
    </Marker>
  );
}

export default memo(MapMarker);

const styles = StyleSheet.create({
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  pinSelected: { transform: [{ scale: 1.15 }], shadowOpacity: 0.35 },
  lowPerfShadow: { shadowOpacity: 0.1, elevation: 2 },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: TOKENS.text,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
});
