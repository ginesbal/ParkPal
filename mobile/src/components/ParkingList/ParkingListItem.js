// src/components/ParkingList/ParkingListItem.js
//
// Minimalist row redesign driven by .agents/skills/:
//   distill  → card chrome removed, divide-y row pattern, one semantic dot (no type pills)
//   quieter  → one accent; type indicator is a single primary dot, all others muted
//   arrange  → tight grouping within rows, hairline divider between rows, space as hierarchy
//   typeset  → numLarge / body / caption from TYPOGRAPHY tokens, tabular-nums, 3 weights only
//   polish   → 200ms ease-out press feedback, 44x44 hit target

import { useRef } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SPACING, TOKENS, TYPOGRAPHY, alpha } from '../../constants/theme';
import { logger } from '../../utils/loggers';

// Two semantic roles only: "street" (primary accent) vs everything else (muted).
// Replaces the old 4-way colored-pill config that pulled from amber/cream/yale ramps.
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
    const isPrimaryType = spot.spot_type === 'on_street';
    const displayPrice = formatPrice(price);
    const isFree = displayPrice === 'FREE';
    const isCheckSigns = displayPrice === 'Check signs';
    const lowCapacity = spot.capacity > 0 && spot.capacity <= 5;

    // 200ms ease-out feedback — polish skill, consistent across Pressables.
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
                {/* Walking time — bare numeric, no background */}
                <View style={styles.walkBlock}>
                    <Text style={styles.walkValue}>{spot.walkingTime}</Text>
                    <Text style={styles.walkUnit}>MIN</Text>
                </View>

                {/* Primary content */}
                <View style={styles.content}>
                    <Text style={styles.address} numberOfLines={1}>
                        {spot.address}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.typeGroup}>
                            <View
                                style={[
                                    styles.typeDot,
                                    isPrimaryType ? styles.typeDotPrimary : styles.typeDotMuted,
                                ]}
                            />
                            <Text style={styles.metaText}>{typeLabel}</Text>
                        </View>

                        <Text style={styles.metaDivider}>·</Text>
                        <Text style={styles.metaText}>{spot.distance}m</Text>

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

                {/* Price — inline, tabular-nums, no badge background */}
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
        minHeight: 72,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        gap: SPACING.lg,
        backgroundColor: TOKENS.surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: TOKENS.hairline,
    },
    rowSelected: {
        backgroundColor: TOKENS.primarySoft,
    },

    walkBlock: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 52,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderRadius: 10,
        backgroundColor: TOKENS.primaryTint,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: TOKENS.primaryHairline,
    },
    walkValue: {
        ...TYPOGRAPHY.numMedium,
        fontSize: 22,
        lineHeight: 24,
        color: TOKENS.primaryAlt,
    },
    walkUnit: {
        ...TYPOGRAPHY.caption,
        color: TOKENS.primary,
        marginTop: 1,
    },

    content: {
        flex: 1,
        gap: 4,
    },
    address: {
        ...TYPOGRAPHY.subheading,
        fontSize: 15,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
    },
    metaText: {
        ...TYPOGRAPHY.body,
        fontSize: 13,
        color: TOKENS.textMuted,
    },
    metaTextWarning: {
        ...TYPOGRAPHY.body,
        fontSize: 13,
        color: TOKENS.warning,
    },
    metaDivider: {
        ...TYPOGRAPHY.body,
        fontSize: 13,
        color: TOKENS.textFaint,
    },

    typeGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    typeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    typeDotPrimary: {
        backgroundColor: TOKENS.primary,
    },
    typeDotMuted: {
        backgroundColor: TOKENS.textFaint,
    },
    typeDotWarning: {
        backgroundColor: TOKENS.warning,
    },

    priceBlock: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 64,
    },
    priceValue: {
        ...TYPOGRAPHY.numMedium,
        fontSize: 16,
        lineHeight: 20,
        color: TOKENS.primaryAlt,
    },
    priceUnit: {
        fontSize: 12,
        fontWeight: '400',
        color: TOKENS.textMuted,
    },
    freeLabel: {
        ...TYPOGRAPHY.caption,
        color: TOKENS.success,
    },
    priceNote: {
        ...TYPOGRAPHY.caption,
        color: TOKENS.textMuted,
    },
});
