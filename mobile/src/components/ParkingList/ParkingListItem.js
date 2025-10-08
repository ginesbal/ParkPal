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
                                {/* type indicator - moved inline for cleaner layout */}
                                <View style={styles.typeIndicator}>
                                    <MaterialCommunityIcons name={config.icon} size={14} color="#a3a3a3" />
                                    <Text style={styles.typeText}>{config.label}</Text>
                                </View>

                                <Text style={styles.distance}>• {spot.distance}m</Text>

                                {lowCapacity && (
                                    <View style={styles.lowCapacityWarning} accessibilityLabel={`${spot.capacity} spots left`}>
                                        <View style={styles.warningDot} />
                                        <Text style={styles.warningText}>{spot.capacity} left</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* price badge - simplified */}
                        <View style={[styles.priceContainer, isFree && styles.freeContainer]}>
                            {isFree ? (
                                <>
                                    <MaterialCommunityIcons
                                        name="gift"
                                        size={16}
                                        color="#10b981"
                                        style={{ marginBottom: 2 }}
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
                                    {!isCheckSigns && <Text style={styles.priceUnit}>/hr</Text>}
                                </>
                            )}
                        </View>
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

// Redesigned styles - Cleaner, list-based layout with less visual noise
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },

    priorityStripe: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },

    content: {
        flex: 1,
        paddingLeft: 12,
    },

    primaryRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },

    walkingTimeBadge: {
        alignItems: 'center',
        marginRight: 16,
        minWidth: 48,
    },
    walkingTimeValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1a1a1a',
        lineHeight: 36,
        letterSpacing: -1,
    },
    walkingTimeUnit: {
        fontSize: 11,
        fontWeight: '600',
        color: '#737373',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginTop: 0,
    },

    primaryInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    address: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 6,
        letterSpacing: -0.2,
        lineHeight: 22,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
    },
    distance: {
        fontSize: 13,
        color: '#737373',
        fontWeight: '500',
    },
    lowCapacityWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: alpha(PALETTE.flame[500], 0.08),
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    warningDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: PALETTE.flame[500],
    },
    warningText: {
        fontSize: 11,
        color: PALETTE.flame[600],
        fontWeight: '600',
    },

    priceContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        minWidth: 60,
    },
    freeContainer: {
        // No special background
    },
    priceValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        letterSpacing: -0.3,
    },
    priceUnit: {
        fontSize: 11,
        fontWeight: '500',
        color: '#a3a3a3',
        marginTop: 2,
    },
    freeLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#10b981',
        letterSpacing: 0.5,
    },
    priceNote: {
        fontSize: 11,
        fontWeight: '500',
        color: '#737373',
        textAlign: 'center',
    },

    typeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 0,
    },
    typeText: {
        fontSize: 12,
        color: '#a3a3a3',
        fontWeight: '500',
    },

    moreBtn: {
        display: 'none', // Removed for cleaner design
    },
});
