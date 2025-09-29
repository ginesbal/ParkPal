import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { TOKENS, PALETTE, alpha } from '../../../../constants/theme';

/**
 * EmptyState - Shown when no parking spots found
 */
const EmptyState = ({ onExpandSearch, onViewMap }) => {
    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
                <MaterialCommunityIcons
                    name="parking"
                    size={64}
                    color={alpha(PALETTE.bistre?.[700] ?? '#333', 0.15)}
                />
            </View>
            
            <Text style={styles.emptyText}>No parking spots found</Text>
            <Text style={styles.emptySubtext}>
                We couldn't find any parking in this area.{'\n'}
                Try adjusting your search settings.
            </Text>
            
            <View style={styles.emptyActions}>
                <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={onExpandSearch}
                    activeOpacity={0.9}
                    accessibilityRole="button"
                    accessibilityLabel="Expand search radius"
                >
                    <MaterialCommunityIcons 
                        name="radar" 
                        size={16} 
                        color="#fff" 
                    />
                    <Text style={styles.emptyButtonText}>Expand Search</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.emptyButton, styles.emptyButtonSecondary]}
                    onPress={onViewMap}
                    activeOpacity={0.9}
                    accessibilityRole="button"
                    accessibilityLabel="View parking map"
                >
                    <MaterialCommunityIcons 
                        name="map-search-outline" 
                        size={16} 
                        color={TOKENS.text} 
                    />
                    <Text style={[
                        styles.emptyButtonText, 
                        styles.emptyButtonTextSecondary
                    ]}>
                        View Map
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EmptyState;
