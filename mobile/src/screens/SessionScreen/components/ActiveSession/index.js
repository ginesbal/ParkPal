import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBadge from '../shared/StatusBadge';
import QuickExtend from './QuickExtend';
import SessionDetails from './SessionDetails';
import { styles } from './styles';
import TimerCard from './TimerCard';

/**
 * ActiveSession - Displays and manages an active parking session
 * Shows timer, quick extend options, and session details
 */
const ActiveSession = ({
    session,
    sessionState,
    timeRemaining,
    elapsedTime,
    progress,
    totalCost,
    endTime,
    onExtend,
    onEnd,
}) => {
    return (
        <>
            {/* Fixed Header with Status */}
            <View style={styles.header}>
                <View style={styles.statusBar}>
                    <StatusBadge state={sessionState} />
                    <Text style={styles.locationText}>
                        {session.spotId} • {session.locationName}
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Timer Display */}
                <TimerCard
                    sessionState={sessionState}
                    timeRemaining={timeRemaining}
                    progress={progress}
                    endTime={endTime}
                    totalCost={totalCost}
                />

                {/* Quick Extension Options */}
                <QuickExtend
                    onExtend={onExtend}
                    hourlyRate={session.hourlyRate}
                    disabled={sessionState === 'expired'}
                />

                {/* Session Details */}
                <SessionDetails
                    session={session}
                    elapsedTime={elapsedTime}
                />
            </ScrollView>

            {/* Fixed Bottom Action */}
            <SafeAreaView edges={['bottom']} style={styles.bottomActions}>
                <TouchableOpacity
                    onPress={onEnd}
                    activeOpacity={0.9}
                    style={styles.endButton}
                    accessibilityRole="button"
                    accessibilityLabel="End parking session"
                    accessibilityHint="Stops your current parking session"
                >
                    <MaterialCommunityIcons
                        name="stop-circle"
                        size={20}
                        color="#fff"
                    />
                    <Text style={styles.endButtonText}>End Parking Session</Text>
                </TouchableOpacity>
                <Text style={styles.bottomHint}>
                    Ending early? No refund for unused time in demo mode.
                </Text>
            </SafeAreaView>
        </>
    );
};

export default ActiveSession;