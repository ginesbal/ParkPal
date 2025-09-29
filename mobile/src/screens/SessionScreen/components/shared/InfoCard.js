// components/session/shared/InfoCard.jsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { styles } from './styles';

/**
 * InfoCard - Displays informational messages with icons
 * @param {string} icon - Icon name from MaterialCommunityIcons
 * @param {string} text - Information text to display
 * @param {string} type - 'info', 'warning', or 'error'
 */
export default function InfoCard({ icon = 'information-outline', text, type = 'info' }) {
    const getCardStyles = () => {
        const cardStyles = [styles.infoCard];
        if (type === 'warning') cardStyles.push(styles.infoCardWarning);
        else if (type === 'error') cardStyles.push(styles.infoCardError);
        return cardStyles;
    };

    const getIconColor = () => {
        switch (type) {
            case 'warning':
                return styles.infoIconWarning.color;
            case 'error':
                return styles.infoIconError.color;
            default:
                return styles.infoIcon.color;
        }
    };

    return (
        <View style={getCardStyles()}>
            <MaterialCommunityIcons name={icon} size={18} color={getIconColor()} />
            <Text style={styles.infoText}>{text}</Text>
        </View>
    );
}
