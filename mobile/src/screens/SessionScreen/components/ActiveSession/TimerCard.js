import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { TOKENS } from '../../../../constants/theme';
import { formatEndTime, formatMoney } from '../../../../utils/formatters';
import { styles } from './styles';

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const toNumber = (v) => (typeof v === 'number' ? v : new Date(v).getTime() || 0);

const toHMS = (ms) => {
    const totalSeconds = Math.max(0, Math.floor((ms ?? 0) / 1000));
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;
    return [hh, mm, ss].map((n) => String(n).padStart(2, '0')).join(':');
};

export default function TimerCard({
    sessionState,
    timeRemaining,
    timeRemainingMs,
    progress,
    endTime,
    totalCost,
}) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        if (typeof timeRemainingMs === 'number') return;
        if (sessionState === 'expired') return;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [sessionState, timeRemainingMs]);

    // pulse animation when expiring
    useEffect(() => {
        if (sessionState === 'expiring') {
            const anim = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.02, duration: 900, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
                ])
            );
            anim.start();
            return () => anim.stop();
        } else {
            pulseAnim.setValue(1);
        }
    }, [sessionState, pulseAnim]);

    // time remaining in ms
    const endMs = toNumber(endTime);
    const derivedRemaining =
        typeof timeRemainingMs === 'number'
            ? Math.max(0, timeRemainingMs)
            : (endMs ? Math.max(0, endMs - now) : Math.max(0, (timeRemaining ?? 0) * 60000));

    // compute remaining ratio for progress
    const [initialRemaining, setInitialRemaining] = useState(null);
    useEffect(() => {
        // set baseline when we start or when the remaining gets longer
        if (initialRemaining == null || derivedRemaining > initialRemaining) {
            setInitialRemaining(derivedRemaining);
        }
        if (sessionState === 'expired') setInitialRemaining(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [derivedRemaining, sessionState]);

    // use initialRemaining as base, fallback to timeRemaining if not set
    const baseInitial = initialRemaining ?? (derivedRemaining || 0);

    // fallback to timeRemaining if initialRemaining is not set
    const remainingRatioFromTime =
        baseInitial > 0 ? clamp01(derivedRemaining / baseInitial) : undefined;
    const remainingRatio =
        typeof remainingRatioFromTime === 'number'
            ? remainingRatioFromTime
            : clamp01(1 - clamp01(progress || 0));

    // state-driven styles
    const baseStyles = [styles.timerCard];
    const valueStyles = [styles.timerValue];
    const progressStyles = [styles.progressBar];
    if (sessionState === 'expiring') {
        baseStyles.push(styles.timerCardWarning);
        valueStyles.push(styles.timerValueWarning);
        progressStyles.push(styles.progressBarWarning);
    } else if (sessionState === 'expired') {
        baseStyles.push(styles.timerCardDanger);
        valueStyles.push(styles.timerValueDanger);
        progressStyles.push(styles.progressBarDanger);
    }

    // display text
    const timeText = sessionState === 'expired' ? '00:00:00' : toHMS(derivedRemaining);

    return (
        <Animated.View style={[...baseStyles, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.timerLabel}>
                {sessionState === 'expired' ? 'EXPIRED' : 'TIME REMAINING'}
            </Text>

            <Text style={valueStyles}>{timeText}</Text>

            {/* Remaining progress */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBackground} />
                <View style={[...progressStyles, { width: `${(remainingRatio || 0) * 100}%` }]} />
            </View>

            <View style={styles.timerMeta}>
                <View style={styles.timerMetaItem}>
                    <MaterialCommunityIcons name="timer-sand" size={14} color={TOKENS.textMuted} />
                    <Text style={styles.timerMetaText}>Ends at {formatEndTime(endTime)}</Text>
                </View>
                <View style={styles.timerMetaItem}>
                    <MaterialCommunityIcons name="cash" size={14} color={TOKENS.textMuted} />
                    <Text style={styles.timerMetaText}>{formatMoney(totalCost)} total</Text>
                </View>
            </View>
        </Animated.View>
    );
}
