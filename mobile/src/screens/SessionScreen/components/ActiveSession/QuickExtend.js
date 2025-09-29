import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { EXTENSION_OPTIONS } from '../../../../constants/session';
import { formatMoney } from '../../../../utils/formatters';
import { styles } from './styles';

const QuickExtend = ({ onExtend, hourlyRate, disabled }) => {
    const confirmExtend = (minutes) => {
        if (disabled) return;

        const rateStr = `${formatMoney(hourlyRate)}/hr`;
        Alert.alert(
            'Extend parking?',
            `Add ${minutes} min at ${rateStr}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Add Time',
                    style: 'default',
                    onPress: () => onExtend(minutes),
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>Quick Extend</Text>

            <View style={styles.extendGrid}>
                {EXTENSION_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option.minutes}
                        onPress={() => confirmExtend(option.minutes)}
                        activeOpacity={0.85}
                        style={[
                            styles.extendButton,
                            option.highlight && styles.extendButtonHighlight,
                            disabled && styles.extendButtonDisabled,
                        ]}
                        disabled={disabled}
                        accessibilityRole="button"
                        accessibilityLabel={`Extend parking by ${option.minutes} minutes`}
                        accessibilityHint={`Adds ${option.minutes} minutes at ${formatMoney(hourlyRate)} per hour`}
                        accessibilityState={{ disabled }}
                    >
                        {/* Row 1: Minutes */}
                        <Text
                            style={[
                                styles.extendButtonText,
                                disabled && styles.extendButtonTextDisabled,
                            ]}
                            numberOfLines={1}
                        >
                            {option.minutes} min
                        </Text>

                        {/* Row 2: Hourly rate */}
                        <Text
                            style={[
                                styles.extendButtonCost,
                                disabled && styles.extendButtonCostDisabled,
                            ]}
                            numberOfLines={1}
                        >
                            {formatMoney(hourlyRate)}/hr
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default QuickExtend;
