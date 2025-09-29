import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';

/**
 * MapFAB - Floating action button for map navigation
 */
const MapFAB = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={styles.mapFab}
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="View parking map"
        >
            <View style={styles.mapFabInner}>
                <MaterialCommunityIcons 
                    name="map" 
                    size={26} 
                    color="#fff" 
                />
            </View>
            <Text style={styles.mapFabLabel}>Map</Text>
        </TouchableOpacity>
    );
};

export default MapFAB;