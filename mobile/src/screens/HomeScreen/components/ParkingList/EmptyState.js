import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../../../constants/theme';
import { styles } from './styles';

/**
 * EmptyState - Shown when no parking spots are available or loading fails
 */
const EmptyState = ({ onExpandSearch, onViewMap, onRetry, errorMessage }) => {
    const isError = Boolean(errorMessage);

    return (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, isError && styles.emptyIconError]}>
                <MaterialCommunityIcons
                    name={isError ? 'wifi-alert' : 'parking'}
                    size={64}
                    color={isError ? TOKENS.danger : alpha(PALETTE.yale?.[600] ?? '#333', 0.15)}
                />
            </View>

            <Text style={styles.emptyText}>
                {isError ? 'Live parking data is unavailable' : 'No parking spots found'}
            </Text>
            <Text style={styles.emptySubtext}>
                {isError
                    ? `${errorMessage} Retry now or switch to the map to inspect another area.`
                    : `We couldn't find parking in this area yet. Widen the radius or switch to the map to explore the next block.`}
            </Text>

            <View style={styles.emptyActions}>
                <Pressable
                    style={({ pressed }) => [
                        styles.emptyButton,
                        pressed && styles.emptyButtonPressed,
                    ]}
                    onPress={isError ? onRetry : onExpandSearch}
                    accessibilityRole="button"
                    accessibilityLabel={isError ? 'Retry loading parking spots' : 'Expand search radius'}
                >
                    <MaterialCommunityIcons
                        name={isError ? 'refresh' : 'radar'}
                        size={16}
                        color="#fff"
                    />
                    <Text style={styles.emptyButtonText}>
                        {isError ? 'Retry' : 'Expand search'}
                    </Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.emptyButton,
                        styles.emptyButtonSecondary,
                        pressed && styles.emptyButtonPressed,
                    ]}
                    onPress={onViewMap}
                    accessibilityRole="button"
                    accessibilityLabel="View parking map"
                >
                    <MaterialCommunityIcons
                        name="map-search-outline"
                        size={16}
                        color={TOKENS.text}
                    />
                    <Text style={[styles.emptyButtonText, styles.emptyButtonTextSecondary]}>
                        View Map
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default EmptyState;
