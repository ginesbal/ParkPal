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
import { debugLogger as logger } from '../../utils/loggers';

// local config
const PARKING_CONFIG = {
    on_street: {
        color: PALETTE.flame[600],
        bgColor: alpha(PALETTE.flame[600], 0.08),
        icon: 'car',
        label: 'Street',
    },
    off_street: {
        color: PALETTE.bistre[700],
        bgColor: alpha(PALETTE.bistre[700], 0.06),
        icon: 'parking',
        label: 'Lot',
    },
    residential: {
        color: PALETTE.earth_yellow[300],
        bgColor: alpha(PALETTE.earth_yellow[300], 0.08),
        icon: 'home-group',
        label: 'Resident',
    },
    school: {
        color: PALETTE.straw[300],
        bgColor: alpha(PALETTE.straw[300], 0.08),
        icon: 'school',
        label: 'Campus',
    },
};

export default function ParkingListItem({
    spot,
    price,
    onPress,
    onViewOnMap,
    onOpenDetails,    // kept for api compatibility (not used here)
    showActions = true, // kept for api compatibility (not used here)
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
            toValue: 0.98,
            speed: 20,
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

    const handleMorePress = (e) => {
        e.stopPropagation();
        logger.log(
            'list item view on map',
            { spotId: spot?.id, address: spot?.address },
            'UI_EVENT'
        );
        onViewOnMap?.(spot);
    };

    // walking-time color ramp
    const getWalkingColor = (minutes) => {
        if (minutes <= 2) return PALETTE.flame[300];
        if (minutes <= 5) return PALETTE.earth_yellow[300];
        return PALETTE.straw[300];
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPress={handleRowPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                android_ripple={{ color: alpha(TOKENS.text, 0.06), borderless: false }}
                style={styles.container}
                accessibilityRole="button"
                accessibilityLabel={`Parking at ${spot.address}, ${spot.distance} meters away, ${isFree ? 'free' : `price ${displayPrice} per hour`}`}
                hitSlop={6}
            >
                {/* priority stripe (walking time) */}
                <View
                    style={[styles.priorityStripe, { backgroundColor: getWalkingColor(spot.walkingTime) }]}
                />

                {/* main content */}
                <View style={styles.content}>
                    {/* row: time badge • address/distance • price */}
                    <View style={styles.primaryRow}>
                        {/* time */}
                        <View style={styles.walkingTimeBadge} accessibilityLabel={`${spot.walkingTime} minutes walk`}>
                            <Text style={styles.walkingTimeValue}>{spot.walkingTime}</Text>
                            <Text style={styles.walkingTimeUnit}>MIN</Text>
                        </View>

                        {/* address + meta */}
                        <View style={styles.primaryInfo}>
                            <Text style={styles.address} numberOfLines={1}>
                                {spot.address}
                            </Text>

                            <View style={styles.metaRow}>
                                <Text style={styles.distance}>{spot.distance}m</Text>

                                {lowCapacity && (
                                    <View style={styles.lowCapacityWarning} accessibilityLabel={`${spot.capacity} spots left`}>
                                        <View style={styles.warningDot} />
                                        <Text style={styles.warningText}>{spot.capacity} left</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* price badge */}
                        <View style={[styles.priceContainer, isFree && styles.freeContainer]}>
                            {isFree ? (
                                <>
                                    <MaterialCommunityIcons
                                        name="gift"
                                        size={14}
                                        color={PALETTE.straw[200]}
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text style={styles.freeLabel}>FREE</Text>
                                </>
                            ) : (
                                <>
                                    <Text
                                        style={[styles.priceValue, isCheckSigns && styles.priceNote]}
                                        numberOfLines={1}
                                    >
                                        {isCheckSigns ? displayPrice : displayPrice.replace('/hr', '')}
                                    </Text>
                                    {!isCheckSigns && <Text style={styles.priceUnit}>/HR</Text>}
                                </>
                            )}
                        </View>
                    </View>

                    {/* type indicator */}
                    <View style={styles.typeIndicator}>
                        <MaterialCommunityIcons name={config.icon} size={12} color={alpha(config.color, 0.6)} />
                        <Text style={styles.typeText}>{config.label}</Text>
                    </View>
                </View>

                {/* optional: trailing action button
        <Pressable onPress={handleMorePress} hitSlop={8} style={styles.moreBtn}>
          <MaterialCommunityIcons name="dots-horizontal" size={18} color={alpha(TOKENS.text, 0.5)} />
        </Pressable>
        */}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 8,
        marginVertical: 2,
        borderRadius: 14,
        overflow: 'hidden',
        // subtle elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },

    priorityStripe: {
        width: 3,
    },

    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    primaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    walkingTimeBadge: {
        alignItems: 'center',
        marginRight: 14,
        minWidth: 40,
    },
    walkingTimeValue: {
        fontSize: 22,
        fontWeight: '800',
        color: PALETTE.bistre[700],
        lineHeight: 24,
        letterSpacing: 0.2,
    },
    walkingTimeUnit: {
        fontSize: 10,
        fontWeight: '700',
        color: alpha(TOKENS.primary, 0.6),
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        lineHeight: 12,
        marginTop: 2,
    },

    primaryInfo: {
        flex: 1,
    },
    address: {
        fontSize: 14,
        fontWeight: '700',
        color: TOKENS.text,
        marginBottom: 4,
        letterSpacing: -0.1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    distance: {
        fontSize: 12,
        color: alpha(TOKENS.text, 0.6),
    },
    lowCapacityWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    warningDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: PALETTE.flame[500],
    },
    warningText: {
        fontSize: 11,
        color: PALETTE.flame[600],
        fontWeight: '700',
        letterSpacing: 0.2,
    },

    priceContainer: {
        backgroundColor: PALETTE.vanilla[800],
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'baseline',
        marginLeft: 12,
        minWidth: 64,
        justifyContent: 'center',
    },
    freeContainer: {
        backgroundColor: alpha(PALETTE.straw[500], 0.15),
        alignItems: 'center',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '800',
        color: PALETTE.flame[300],
        letterSpacing: 0.2,
    },
    priceUnit: {
        fontSize: 10,
        fontWeight: '700',
        color: alpha(TOKENS.primaryAlt, 0.5),
        marginLeft: 3,
        letterSpacing: 0.4,
    },
    freeLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: PALETTE.straw[200],
        letterSpacing: 0.6,
    },
    // smaller style for "check signs"
    priceNote: {
        fontSize: 12,
        fontWeight: '700',
        color: TOKENS.textMuted,
    },

    typeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: PALETTE.vanilla[600],
    },
    typeText: {
        fontSize: 11,
        color: alpha(TOKENS.text, 0.55),
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        fontWeight: '700',
    },

    // optional trailing action
    moreBtn: {
        position: 'absolute',
        right: 6,
        top: 6,
        padding: 8,
        borderRadius: 10,
    },
});
