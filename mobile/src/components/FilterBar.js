import { Ionicons } from '@expo/vector-icons';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function FilterBar({ filters, onChange }) {
    const radiusOptions = [250, 500, 1000, 2000];
    const typeOptions = [
        { value: null, label: 'All' },
        { value: 'on_street', label: 'Street' },
        { value: 'off_street', label: 'Lot' },
        { value: 'residential', label: 'Residential' }
    ];

    return (
        <ScrollView
            horizontal
            style={styles.container}
            showsHorizontalScrollIndicator={false}
        >
            <View style={styles.filterGroup}>
                <Text style={styles.label}>Radius:</Text>
                {radiusOptions.map(radius => (
                    <TouchableOpacity
                        key={radius}
                        style={[
                            styles.chip,
                            filters.radius === radius && styles.chipActive
                        ]}
                        onPress={() => onChange({ ...filters, radius })}
                    >
                        <Text style={[
                            styles.chipText,
                            filters.radius === radius && styles.chipTextActive
                        ]}>
                            {radius < 1000 ? `${radius}m` : `${radius / 1000}km`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.filterGroup}>
                <Text style={styles.label}>Type:</Text>
                {typeOptions.map(type => (
                    <TouchableOpacity
                        key={type.value || 'all'}
                        style={[
                            styles.chip,
                            filters.type === type.value && styles.chipActive
                        ]}
                        onPress={() => onChange({ ...filters, type: type.value })}
                    >
                        <Text style={[
                            styles.chipText,
                            filters.type === type.value && styles.chipTextActive
                        ]}>
                            {type.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[
                    styles.chip,
                    filters.free && styles.chipActive
                ]}
                onPress={() => onChange({ ...filters, free: !filters.free })}
            >
                <Ionicons
                    name="cash-outline"
                    size={16}
                    color={filters.free ? 'white' : '#666'}
                />
                <Text style={[
                    styles.chipText,
                    filters.free && styles.chipTextActive
                ]}>
                    Free Only
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    filterGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    label: {
        fontSize: 12,
        color: '#999',
        marginRight: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: '#2563eb',
    },
    chipText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    chipTextActive: {
        color: 'white',
    },
});