import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { TOKENS } from '../../../../constants/theme';
import { formatEndTime, formatTime } from '../../../../utils/formatters';
import { styles } from './styles';

/**
 * SessionDetails - Displays detailed session information
 * Shows vehicle, location, and timing details
 */
const SessionDetails = ({ session, elapsedTime }) => {
    const startTime = new Date(session.startedAt);

    const details = [
        {
            icon: 'car',
            label: 'Vehicle',
            value: session.vehiclePlate,
            subvalue: null,
        },
        {
            icon: 'map-marker',
            label: 'Location',
            value: session.locationAddress,
            subvalue: session.spotId,
        },
        {
            icon: 'clock-start',
            label: 'Started',
            value: `${formatEndTime(startTime)} • ${formatTime(elapsedTime)} ago`,
            subvalue: null,
        },
    ];

    return (
        <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Session Details</Text>

            {details.map((detail, index) => (
                <View key={index} style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <MaterialCommunityIcons
                            name={detail.icon}
                            size={16}
                            color={TOKENS.textMuted}
                        />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>{detail.label}</Text>
                        <Text style={styles.detailValue}>{detail.value}</Text>
                        {detail.subvalue && (
                            <Text style={styles.detailSubvalue}>{detail.subvalue}</Text>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

export default SessionDetails;