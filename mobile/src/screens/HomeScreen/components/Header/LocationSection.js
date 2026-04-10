import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { TOKENS } from '../../../../constants/theme';
import { styles } from './styles';

/**
 * LocationSection - Minimal location display (Redesigned for clarity)
 */
const LocationSection = ({ locationName, onPress }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.locationSection,
                pressed && styles.locationSectionPressed,
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Current location: ${locationName}. Tap to view map`}
        >
            <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color={TOKENS.primary}
                style={styles.locationIcon}
            />

            <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Current area</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                    {locationName}
                </Text>
            </View>

            <MaterialCommunityIcons
                name="chevron-right"
                size={18}
                color={TOKENS.textLight}
            />
        </Pressable>
    );
};

export default LocationSection;
