// Kept inside index via Animated.View container for simplicity.
// If you want this as its own component, here’s a drop-in equivalent:

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Animated, Pressable } from 'react-native';
import { TOKENS } from '../../../constants/theme';
import { styles } from '../styles';

export default function MapFABs({
    loading,
    controlsOpacity,
    controlsTranslateY,
    onRefresh,
    onRecenter,
    searchMode,
}) {
    return (
        <Animated.View
            style={[
                styles.fabContainer,
                { opacity: controlsOpacity, transform: [{ translateY: Animated.multiply(controlsTranslateY, -1) }] }
            ]}
            pointerEvents="auto"
        >
            <Pressable style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]} onPress={onRefresh}>
                {loading ? (
                    <ActivityIndicator color={TOKENS.primary} size="small" />
                ) : (
                    <MaterialCommunityIcons name="refresh" size={22} color={TOKENS.primary} />
                )}
            </Pressable>

            <Pressable
                style={({ pressed }) => [styles.fab, styles.fabPrimary, pressed && styles.fabPressed]}
                onPress={onRecenter}
            >
                <MaterialCommunityIcons
                    name={searchMode === 'pinned' ? "map-marker" : "crosshairs-gps"}
                    size={22}
                    color="#fff"
                />
            </Pressable>
        </Animated.View>
    );
}
