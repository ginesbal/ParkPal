// src/components/ParkingList/ParkingListItem.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../constants/theme';
import { logger } from '../../utils/loggers';

// local config
const PARKING_CONFIG = {
    on_street: {
        color: PALETTE.cerulean[600],
        bgColor: alpha(PALETTE.cerulean[600], 0.08),
        icon: 'car',
        label: 'Street',
    },
    off_street: {
        color: PALETTE.yale[600],
        bgColor: alpha(PALETTE.yale[600], 0.06),
        icon: 'parking',
        label: 'Lot',
    },
    residential: {
        color: PALETTE.amber[400],
        bgColor: alpha(PALETTE.amber[400], 0.08),
        icon: 'home-group',
        label: 'Resident',
    },
    school: {
        color: PALETTE.cream[400],
        bgColor: alpha(PALETTE.cream[400], 0.08),
        icon: 'school',
        label: 'Campus',
    },
};

export default function ParkingListItem({
    spot,
    price,
    onPress,
    isSelected = false,
}) {
    // press feedback animation
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const config = PARKING_CONFIG[spot.spot_type] || PARKING_CONFIG.on_street;

    // simple price formatting
    const formatPrice = (val) => {
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
    };

    const displayPrice = formatPrice(price);
    const isFree = displayPrice === 'FREE';
    const isCheckSigns = displayPrice === 'Check signs';

    // log notable price flags once per render change
    useEffect(() => {
        if (isFree) {
            logger.log('list item price flag', { spotId: spot?.id, price: 'FREE' }, 'DATA_FLAG');
        } else if (isCheckSigns) {
            logger.log('list item price flag', { spotId: spot?.id, price: 'Check signs' }, 'DATA_FLAG');
        }
    }, [isFree, isCheckSigns, spot?.id]);

    // log low capacity hint
    const lowCapacity = spot.capacity > 0 && spot.capacity <= 5;
    useEffect(() => {
        if (lowCapacity) {
            logger.log('list item low capacity', { spotId: spot?.id, capacity: spot.capacity }, 'DATA_FLAG');
        }
    }, [lowCapacity, spot?.id, spot?.capacity]);

    // press handlers (log user intent)
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            speed: 24,
            bounciness: 0,
            useNativeDriver: true,
        }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            speed: 16,
            bounciness: 0,
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
            <Pressable
                onPress={handleRowPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                android_ripple={{ color: alpha(TOKENS.text, 0.04), borderless: false }}
                style={[styles.container, isSelected && styles.containerSelected]}
                accessibilityRole="button"
                accessibilityLabel={`Parking at ${spot.address}, ${spot.distance} meters away, ${isFree ? 'free' : `price ${displayPrice} per hour`}`}
                hitSlop={6}
            >
                <View style={[styles.card, isSelected && styles.cardSelected]}>
                    {/* Walking time badge */}
                    <View
                        style={[styles.walkingTimeBadge, isSelected && styles.walkingTimeBadgeSelected]}
                        accessibilityLabel={`${spot.walkingTime} minutes walk`}
                    >
                        <Text style={styles.walkingTimeValue}>{spot.walkingTime}</Text>
                        <Text style={styles.walkingTimeUnit}>MIN</Text>
                    </View>

                    {/* Main content */}
                    <View style={styles.content}>
                        <Text style={styles.address} numberOfLines={1}>
                            {spot.address}
                        </Text>

                        <View style={styles.metaRow}>
                            <View style={[styles.typeIndicator, { backgroundColor: config.bgColor }]}>
                                <MaterialCommunityIcons name={config.icon} size={13} color={config.color} />
                                <Text style={[styles.typeText, { color: config.color }]}>{config.label}</Text>
                            </View>

                            <View style={styles.distanceContainer}>
                                <Text style={styles.distance}>{spot.distance}m</Text>
                            </View>

                            {lowCapacity && (
                                <View style={styles.lowCapacityWarning} accessibilityLabel={`${spot.capacity} spots left`}>
                                    <View style={styles.warningDot} />
                                    <Text style={styles.warningText}>{spot.capacity} left</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Price */}
                    <View style={styles.priceContainer}>
                        {isFree ? (
                            <View style={styles.freeBadge}>
                                <Text style={styles.freeLabel}>FREE</Text>
                            </View>
                        ) : (
                            <>
                                <Text
                                    style={[styles.priceValue, isCheckSigns && styles.priceNote]}
                                    numberOfLines={1}
                                >
                                    {isCheckSigns ? displayPrice : displayPrice.replace('/hr', '')}
                                </Text>
                                {!isCheckSigns && <Text style={styles.priceUnit}>/hr</Text>}
                            </>
                        )}
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 2,
        backgroundColor: 'transparent',
    },
    containerSelected: {
        paddingTop: 8,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 88,
        backgroundColor: TOKENS.surface,
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
        borderWidth: 1,
        borderColor: TOKENS.strokeLight,
    },
    cardSelected: {
        backgroundColor: TOKENS.surfaceRaised,
        borderColor: TOKENS.focus,
        shadowColor: TOKENS.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
    },

    walkingTimeBadge: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 56,
        minHeight: 56,
        paddingHorizontal: 8,
        borderRadius: 16,
        backgroundColor: TOKENS.surfaceMuted,
    },
    walkingTimeBadgeSelected: {
        backgroundColor: TOKENS.primarySoft,
    },
    walkingTimeValue: {
        fontSize: 24,
        fontWeight: '800',
        color: TOKENS.text,
        lineHeight: 28,
        letterSpacing: -0.5,
        fontVariant: ['tabular-nums'],
    },
    walkingTimeUnit: {
        fontSize: 10,
        fontWeight: '600',
        color: TOKENS.textMuted,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginTop: -2,
    },

    content: {
        flex: 1,
        gap: 8,
    },
    address: {
        fontSize: 15,
        fontWeight: '700',
        color: TOKENS.text,
        letterSpacing: -0.3,
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
    },

    typeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    typeText: {
        fontSize: 12,
        color: TOKENS.textMuted,
        fontWeight: '600',
    },

    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    distance: {
        fontSize: 12,
        color: TOKENS.textMuted,
        fontWeight: '600',
    },

    lowCapacityWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: TOKENS.warningSoft,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    warningDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: TOKENS.warning,
    },
    warningText: {
        fontSize: 11,
        color: PALETTE.amber[700],
        fontWeight: '600',
        letterSpacing: 0.2,
    },

    priceContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 72,
    },
    priceValue: {
        fontSize: 18,
        fontWeight: '800',
        color: TOKENS.text,
        letterSpacing: -0.35,
        fontVariant: ['tabular-nums'],
    },
    priceUnit: {
        fontSize: 11,
        fontWeight: '600',
        color: TOKENS.textMuted,
        marginTop: -2,
    },
    freeBadge: {
        backgroundColor: TOKENS.successSoft,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
    },
    freeLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: TOKENS.success,
        letterSpacing: 0.3,
    },
    priceNote: {
        fontSize: 11,
        fontWeight: '600',
        color: TOKENS.textMuted,
        textAlign: 'right',
    },
});
