import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { PALETTE, TOKENS } from '../constants/theme';

export default function FilterBar({ filters, onChange }) {
    const radiusOptions = [250, 500, 1000, 2000];
    const typeOptions = [
        { value: null, label: 'All', icon: 'parking' },
        { value: 'on_street', label: 'Street', icon: 'car' },
        { value: 'off_street', label: 'Lot', icon: 'office-building' },
        { value: 'residential', label: 'Residential', icon: 'home' }
    ];

    return (
        <View style={styles.container}>
            {/* row 1: parking type */}
            <View style={styles.row}>
                <View style={styles.label}>
                    <MaterialCommunityIcons
                        name="format-list-bulleted-type"
                        size={14}
                        color={PALETTE.bistre[600]}
                    />
                    <Text style={styles.labelText}>Type</Text>
                </View>
                <View style={styles.options}>
                    {typeOptions.map(type => {
                        const isActive = filters.type === type.value;
                        return (
                            <TouchableOpacity
                                key={type.value || 'all'}
                                style={[
                                    styles.chip,
                                    isActive && styles.chipActive
                                ]}
                                onPress={() => onChange({ ...filters, type: type.value })}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name={type.icon}
                                    size={16}
                                    color={isActive ? PALETTE.vanilla[900] : PALETTE.bistre[500]}
                                />
                                <Text style={[
                                    styles.chipText,
                                    isActive && styles.chipTextActive
                                ]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* row 2: distance */}
            <View style={styles.row}>
                <View style={styles.label}>
                    <MaterialCommunityIcons
                        name="map-marker-radius"
                        size={14}
                        color={PALETTE.bistre[600]}
                    />
                    <Text style={styles.labelText}>Distance</Text>
                </View>
                <View style={styles.options}>
                    {radiusOptions.map(radius => {
                        const isActive = filters.radius === radius;
                        return (
                            <TouchableOpacity
                                key={radius}
                                style={[
                                    styles.chip,
                                    isActive && styles.chipDistanceActive
                                ]}
                                onPress={() => onChange({ ...filters, radius })}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.chipText,
                                    styles.chipTextDistance,
                                    isActive && styles.chipTextActive
                                ]}>
                                    {radius < 1000 ? `${radius}m` : `${radius / 1000}km`}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* row 3: special filters */}
            {filters.free !== undefined && (
                <View style={styles.row}>
                    <View style={styles.label}>
                        <MaterialCommunityIcons
                            name="filter-variant"
                            size={14}
                            color={PALETTE.bistre[600]}
                        />
                        <Text style={styles.labelText}>Options</Text>
                    </View>
                    <View style={styles.options}>
                        <TouchableOpacity
                            style={[
                                styles.chip,
                                filters.free && styles.chipSpecialActive
                            ]}
                            onPress={() => onChange({ ...filters, free: !filters.free })}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons
                                name={filters.free ? "cash-off" : "cash"}
                                size={16}
                                color={filters.free ? PALETTE.vanilla[900] : PALETTE.bistre[500]}
                            />
                            <Text style={[
                                styles.chipText,
                                filters.free && styles.chipTextActive
                            ]}>
                                Free Only
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        marginBottom: 8,
        paddingHorizontal: 16,
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minWidth: 70,
    },
    labelText: {
        fontSize: 12,
        fontWeight: '600',
        color: TOKENS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    options: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        flexWrap: 'wrap',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: TOKENS.surfaceMuted,
        gap: 5,
        minHeight: 34,
    },
    chipActive: {
        backgroundColor: TOKENS.primary,
        shadowColor: TOKENS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 2,
    },
    chipDistanceActive: {
        backgroundColor: TOKENS.accent,
        shadowColor: TOKENS.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 2,
    },
    chipSpecialActive: {
        backgroundColor: PALETTE.straw.DEFAULT,
        shadowColor: PALETTE.straw.DEFAULT,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 2,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        color: TOKENS.text,
        letterSpacing: -0.1,
    },
    chipTextDistance: {
        fontSize: 12,
        fontWeight: '700',
    },
    chipTextActive: {
        color: TOKENS.surfaceMuted,
    },
});