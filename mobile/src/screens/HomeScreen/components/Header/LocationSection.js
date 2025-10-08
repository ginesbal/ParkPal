import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { TOKENS } from '../../../../constants/theme';
import { styles } from './styles';

/**
 * LocationSection - Minimal location display (Redesigned for clarity)
 */
const LocationSection = ({ locationName, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.locationSection}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Current location: ${locationName}. Tap to view map`}
        >
            <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color={TOKENS.textMuted}
                style={styles.locationIcon}
            />

            <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>LOCATION</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                    {locationName}
                </Text>
            </View>

            <MaterialCommunityIcons
                name="chevron-right"
                size={18}
                color={TOKENS.textLight}
            />
        </TouchableOpacity>
    );
};

export default LocationSection;