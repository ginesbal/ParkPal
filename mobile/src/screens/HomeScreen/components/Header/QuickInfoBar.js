import React from 'react';
import { View, Text } from 'react-native';
import { formatPrice } from '../../../../utils/parkingHelpers';
import { styles } from './styles';

/**
 * QuickInfoBar - Displays key parking statistics
 */
const QuickInfoBar = ({ quickInfo }) => {
    if (!quickInfo) return null;
    
    return (
        <View style={styles.quickInfoBar}>
            <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoValue}>{quickInfo.total}</Text>
                <Text style={styles.quickInfoLabel}>spots nearby</Text>
            </View>

            {quickInfo.nearest && (
                <>
                    <View style={styles.quickInfoDivider} />
                    <View style={styles.quickInfoItem}>
                        <Text style={styles.quickInfoValue}>
                            {quickInfo.nearest.walkingTime ?? '—'}
                            <Text style={styles.quickInfoUnit}> min</Text>
                        </Text>
                        <Text style={styles.quickInfoLabel}>to nearest</Text>
                    </View>
                </>
            )}

            {quickInfo.averagePrice !== null && (
                <>
                    <View style={styles.quickInfoDivider} />
                    <View style={styles.quickInfoItem}>
                        <Text style={styles.quickInfoValue}>
                            {formatPrice(quickInfo.averagePrice)}
                        </Text>
                        <Text style={styles.quickInfoLabel}>avg price</Text>
                    </View>
                </>
            )}
        </View>
    );
};

export default QuickInfoBar;
