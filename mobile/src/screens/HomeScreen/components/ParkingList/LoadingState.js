
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDistanceLabel } from '../../../../utils/parkingHelpers';
import { styles } from './styles';
import { TOKENS, PALETTE } from '../../../../constants/theme';

/**
 * LoadingState - Initial loading screen
 */
const LoadingState = ({ searchRadius }) => {
    return (
        <SafeAreaView 
            style={styles.fullScreenBg} 
            edges={['top', 'left', 'right', 'bottom']}
        >
            <StatusBar style="dark" />
            <View style={styles.loadingContainer}>
                <View style={styles.loadingIcon}>
                    <MaterialCommunityIcons 
                        name="map-search" 
                        size={40} 
                        color={PALETTE.earth_yellow[500]} 
                    />
                </View>
                
                <ActivityIndicator 
                    size="small" 
                    color={TOKENS.primary} 
                    style={{ marginBottom: 10 }} 
                />
                
                <Text style={styles.loadingText}>Finding parking spots…</Text>
                <Text style={styles.loadingSubtext}>
                    Searching within {getDistanceLabel(searchRadius)}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default LoadingState;