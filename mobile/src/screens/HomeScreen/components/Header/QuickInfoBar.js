import { Text, View } from 'react-native';
import { styles } from './styles';

const QuickInfoBar = ({ quickInfo }) => {
    if (!quickInfo) return null;

    const showNearest = quickInfo.nearest && quickInfo.nearest.walkingTime;
    const showPrice = quickInfo.averagePrice !== null && quickInfo.averagePrice > 0;

    let displayValue, displayLabel;

    if (showNearest) {
        displayValue = `${quickInfo.nearest.walkingTime}`;
        displayLabel = 'min to closest spot';
    } else if (quickInfo.total > 0) {
        displayValue = `${quickInfo.total}`;
        displayLabel = 'parking spots nearby';
    } else {
        return null;
    }

    return (
        <View style={styles.quickInfoBar}>
            <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoValue}>{displayValue}</Text>
                <Text style={styles.quickInfoLabel}>{displayLabel}</Text>
            </View>
        </View>
    );
};

export default QuickInfoBar;
