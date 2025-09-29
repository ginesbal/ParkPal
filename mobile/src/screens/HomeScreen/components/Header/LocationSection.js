import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { TOKENS } from '../../../../constants/theme';

/**
 * LocationSection - Displays current location with map navigation
 */
const LocationSection = ({ locationName, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.locationSection}
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Current location: ${locationName}. Tap to view map`}
        >
            <View style={styles.locationIcon}>
                <MaterialCommunityIcons 
                    name="map-marker" 
                    size={20} 
                    color={TOKENS.primary} 
                />
            </View>
            
            <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Current Location</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                    {locationName}
                </Text>
            </View>
            
            <MaterialCommunityIcons 
                name="map-outline" 
                size={20} 
                color={TOKENS.textMuted} 
            />
        </TouchableOpacity>
    );
};

export default LocationSection;