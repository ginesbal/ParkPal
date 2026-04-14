// src/components/ParkingList/ParkingListItem.js

import { useRef } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { TOKENS, TYPOGRAPHY, alpha } from '../../constants/theme';
import { logger } from '../../utils/loggers';

const TYPE_LABELS = {
    on_street: 'Street',
    off_street: 'Lot',
    residential: 'Resident',
    school: 'Campus',
};

function formatPrice(val) {
    if (!val || val === '0' || val === 0 || val === 'FREE') return 'FREE';
    if (typeof val === 'string') {
        const match = val.match(/[\d.]+/);
        if (match) {
            const num = parseFloat(match[0]);
            return Number.isNaN(num) ? val : `$${num.toFixed(2)}`;
        }
        return val;
    }
    const num = parseFloat(val);
    return Number.isNaN(num) ? 'FREE' : `$${num.toFixed(2)}`;
}

export default function ParkingListItem({
    spot,
    price,
    onPress,
    isSelected = false,
}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const typeLabel = TYPE_LABELS[spot.spot_type] || 'Street';
    const displayPrice = formatPrice(price);
    const isFree = displayPrice === 'FREE';
    const isCheckSigns = displayPrice === 'Check signs';
    const lowCapacity = spot.capacity > 0 && spot.capacity <= 5;

    const handlePressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 120,
            useNativeDriver: true,
        }).start();
    };
    const handlePressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleRowPress = () => {
        logger.log(
            'list item tap',
            {
                spotId: spot?.id,
                address: spot?.address,
                distance: spot?.distance,
                walkingTime: spot?.walkingTime,
                price: displayPrice,
            },
            'UI_EVENT'
        );
        onPress?.(spot, { stayInList: true });
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            {/* Selected stripe — a 3px primary ink rail on the leading edge.
                Emil: "Color is a signal. Make it earn its place." Selection needs
                to register at a glance without tinting the whole row. */}
            {isSelected && <View style={styles.selectedStripe} pointerEvents="none" />}
            <Pressable
                onPress={handleRowPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                android_ripple={{ color: alpha(TOKENS.text, 0.04), borderless: false }}
                style={[styles.row, isSelected && styles.rowSelected]}
                accessibilityRole="button"
                accessibilityLabel={`Parking at ${spot.address}, ${spot.distance} meters away, ${isFree ? 'free' : `price ${displayPrice} per hour`}`}
                hitSlop={4}
            >
                {/* Walking time */}
                <View style={styles.walkBlock}>
                    <Text style={styles.walkValue}>{spot.walkingTime}</Text>
                    <Text style={styles.walkUnit}>min</Text>
                </View>

                {/* Primary content */}
                <View style={styles.content}>
                    <Text style={styles.address} numberOfLines={1}>
                        {spot.address}
                    </Text>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>{typeLabel}</Text>
                        <Text style={styles.metaDivider}>·</Text>
                        <Text style={styles.metaTextNum}>{spot.distance}m</Text>

                        {lowCapacity && (
                            <>
                                <Text style={styles.metaDivider}>·</Text>
                                <View style={styles.typeGroup}>
                                    <View style={[styles.typeDot, styles.typeDotWarning]} />
                                    <Text style={styles.metaTextWarning}>
                                        {spot.capacity} left
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Price */}
                <View style={styles.priceBlock}>
                    {isFree ? (
                        <Text style={styles.freeLabel}>FREE</Text>
                    ) : isCheckSigns ? (
                        <Text style={styles.priceNote} numberOfLines={1}>
                            Check signs
                        </Text>
                    ) : (
                        <Text style={styles.priceValue} numberOfLines={1}>
                            {displayPrice}
                            <Text style={styles.priceUnit}> /hr</Text>
                        </Text>
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 64,
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 14,
        backgroundColor: TOKENS.surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: TOKENS.divider,
    },
    // Selection bg tint bumped 0.05 → 0.08 so it reads at a glance without shouting.
    rowSelected: {
        backgroundColor: alpha(TOKENS.primary, 0.08),
    },
    // 3px primary rail on the leading edge — the real selection signal.
    selectedStripe: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: TOKENS.primary,
        zIndex: 1,
    },

    walkBlock: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
    },
    // Equalized with priceValue at 18px so neither side dominates.
    walkValue: {
        ...TYPOGRAPHY.numMedium,
        fontSize: 18,
        lineHeight: 20,
        color: TOKENS.text,
    },
    walkUnit: {
        fontSize: 11,
        fontWeight: '500',
        color: TOKENS.textMuted,
        marginTop: 1,
    },

    content: {
        flex: 1,
        gap: 4,
    },
    address: {
        fontSize: 15,
        fontWeight: '600',
        color: TOKENS.text,
        letterSpacing: -0.1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
    },
    metaText: {
        fontSize: 13,
        fontWeight: '400',
        color: TOKENS.textMuted,
    },
    // Distance needs tabular alignment so values don't jitter as users scroll.
    metaTextNum: {
        fontSize: 13,
        fontWeight: '400',
        color: TOKENS.textMuted,
        fontVariant: ['tabular-nums'],
    },
    metaTextWarning: {
        fontSize: 13,
        fontWeight: '500',
        color: TOKENS.warning,
    },
    metaDivider: {
        fontSize: 13,
        color: TOKENS.textFaint,
    },

    // Kept for the warning dot only — decorative type dots were removed.
    typeGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    typeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    typeDotWarning: {
        backgroundColor: TOKENS.warning,
    },

    priceBlock: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 60,
    },
    priceValue: {
        fontSize: 18,
        fontWeight: '600',
        color: TOKENS.text,
        letterSpacing: -0.2,
        fontVariant: ['tabular-nums'],
    },
    priceUnit: {
        fontSize: 12,
        fontWeight: '400',
        color: TOKENS.textMuted,
    },
    freeLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: TOKENS.success,
        letterSpacing: 0.2,
    },
    priceNote: {
        fontSize: 12,
        fontWeight: '500',
        color: TOKENS.textMuted,
    },
});
