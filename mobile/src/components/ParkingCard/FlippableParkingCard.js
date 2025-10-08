// src/components/ParkingCard/FlippableParkingCard.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { PALETTE, TOKENS } from '../../constants/theme';
import logger from '../../utils/loggers/DebugLogger';
import {
    CARD_HEIGHT,
    CARD_WIDTH,
    CONTENT_WIDTH,
    SCREEN_HEIGHT,
    SCREEN_WIDTH
} from './cardConstants';
import {
    getCurrentPrice,
    getDetailsPages,
    getSpotType,
    parseMetadata,
    parseZoneInfo,
} from './cardHelpers';
import { styles } from './cardStyles';

function FlippableParkingCard({
    visible = false,
    spot = null,
    position = { x: 0, y: 0 },
    onClose = () => { },
    onNavigate = () => { },
}) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const flipAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const pagesScrollRef = useRef(null);
    const pageWidth = CONTENT_WIDTH;

    const scrollToPage = (i) => {
        const safe = Math.max(0, Math.min(i, detailsPages.length - 1));
        setCurrentPage(safe);
        pagesScrollRef.current?.scrollTo({ x: safe * pageWidth, y: 0, animated: true });
    };

    const goPrev = () => scrollToPage(currentPage - 1);
    const goNext = () => scrollToPage(currentPage + 1);

    useEffect(() => {
        if (visible && spot) {
            logger.logSpotData(spot, 'FlippableParkingCard opened');

            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 60,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else if (!visible) {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
            setTimeout(() => {
                setIsFlipped(false);
                setCurrentPage(0);
                flipAnim.setValue(0);
            }, 200);
        }
    }, [visible, spot, scaleAnim, fadeAnim]);

    const flip = () => {
        const toValue = isFlipped ? 0 : 1;

        if (!isFlipped) {
            pagesScrollRef.current?.scrollTo({ x: 0, y: 0, animated: false });
            setCurrentPage(0);
        }

        Animated.spring(flipAnim, {
            toValue,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
        }).start();
        setIsFlipped(!isFlipped);
    };

    if (!visible || !spot) return null;

    const cardX = Math.min(Math.max(10, position.x - CARD_WIDTH / 2), SCREEN_WIDTH - CARD_WIDTH - 10);
    const cardY = Math.max(
        60,
        Math.min(position.y - CARD_HEIGHT - 40, SCREEN_HEIGHT - CARD_HEIGHT - 140)
    );

    const frontRotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
    const backRotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
    const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
    const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

    const zoneInfo = parseZoneInfo(spot);
    const metadata = parseMetadata(spot);
    const detailsPages = getDetailsPages(spot);
    const priceDisplay = getCurrentPrice(spot, zoneInfo);

    const getStatusColor = () => {
        if (spot.no_stopping) return PALETTE.flame.DEFAULT;
        if (spot.permit_zone || zoneInfo.permit_zone) return PALETTE.earth_yellow[300];
        if (spot.status === 'available') return PALETTE.straw[300];
        return PALETTE.bistre[700];
    };

    const statusColor = getStatusColor();

    const getBadgeStyle = (type) => {
        switch (type) {
            case 'danger': return [styles.badgeLarge, styles.badgeDanger];
            case 'warning': return [styles.badgeLarge, styles.badgeWarning];
            case 'info': return [styles.badgeLarge, styles.badgeInfo];
            default: return [styles.badgeLarge, styles.badgeDefault];
        }
    };

    const getBadgeTextStyle = (type) => {
        switch (type) {
            case 'danger': return [styles.badgeTextLarge, styles.badgeTextDanger];
            case 'warning': return [styles.badgeTextLarge, styles.badgeTextWarning];
            case 'info': return [styles.badgeTextLarge, styles.badgeTextInfo];
            default: return [styles.badgeTextLarge, styles.badgeTextDefault];
        }
    };

    return (
        <>
            {visible && (
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                    <View />
                </TouchableOpacity>
            )}

            <Animated.View
                style={[
                    styles.container,
                    {
                        position: 'absolute',
                        left: cardX,
                        top: cardY,
                        transform: [{ scale: scaleAnim }],
                        opacity: fadeAnim,
                    },
                ]}
                pointerEvents="box-none"
            >
                {/* front of card */}
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardFront,
                        {
                            opacity: frontOpacity,
                            transform: [{ perspective: 1000 }, { rotateY: frontRotateY }],
                        },
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.spotTypeTag}>
                            <MaterialCommunityIcons
                                name={
                                    spot.spot_type === 'on_street'
                                        ? 'car'
                                        : spot.spot_type === 'off_street'
                                            ? 'parking'
                                            : spot.spot_type === 'residential'
                                                ? 'home'
                                                : 'school'
                                }
                                size={16}
                                color={statusColor}
                            />
                            <Text style={styles.spotTypeText}>{getSpotType(spot)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={onClose}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.frontContent}>
                        <Text style={styles.address} numberOfLines={2}>
                            {spot.address || spot.address_desc || 'Parking Spot'}
                        </Text>

                        <View style={styles.quickStatsLarge}>
                            <View style={styles.statRow}>
                                <View style={styles.statLeft}>
                                    <View style={styles.statIcon}>
                                        <MaterialCommunityIcons name="walk" size={20} color={PALETTE.earth_yellow[300]} />
                                    </View>
                                    <Text style={styles.statLabelLeft}>Walk Time</Text>
                                </View>
                                <Text style={styles.statValueRight}>{spot.walkingTime || 0} min</Text>
                            </View>

                            <View style={styles.statDividerLarge} />

                            <View style={styles.statRow}>
                                <View style={styles.statLeft}>
                                    <View style={styles.statIcon}>
                                        <MaterialCommunityIcons name="map-marker-distance" size={20} color={PALETTE.straw[300]} />
                                    </View>
                                    <Text style={styles.statLabelLeft}>Distance</Text>
                                </View>
                                <Text style={styles.statValueRight}>{spot.distance || 0} m</Text>
                            </View>

                            <View style={styles.statDividerLarge} />

                            {/* rate */}
                            <View style={styles.statRow}>
                                <View style={styles.statLeft}>
                                    <View style={styles.statIcon}>
                                        <MaterialCommunityIcons name="currency-usd" size={20} color={TOKENS.primary} />
                                    </View>
                                    <Text style={styles.statLabelLeft}>Rate</Text>
                                </View>
                                <Text style={[styles.statValueRight, styles.statValuePrimary]}>
                                    {priceDisplay}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.badgesLarge}>
                            {(spot.camera || metadata.camera) && (
                                <View style={getBadgeStyle('default')}>
                                    <MaterialCommunityIcons name="cctv" size={14} color={PALETTE.bistre[700]} />
                                    <Text style={getBadgeTextStyle('default')}>Camera</Text>
                                </View>
                            )}
                            {(spot.permit_zone || zoneInfo.permit_zone) && (
                                <View style={getBadgeStyle('warning')}>
                                    <MaterialCommunityIcons name="card-account-details" size={14} color={PALETTE.earth_yellow[300]} />
                                    <Text style={getBadgeTextStyle('warning')}>Permit Zone</Text>
                                </View>
                            )}
                            {(spot.max_time || metadata.max_time) && (
                                <View style={getBadgeStyle('info')}>
                                    <MaterialCommunityIcons name="clock-outline" size={14} color={PALETTE.straw[300]} />
                                    <Text style={getBadgeTextStyle('info')}>{spot.max_time || metadata.max_time}</Text>
                                </View>
                            )}
                            {spot.no_stopping && (
                                <View style={getBadgeStyle('danger')}>
                                    <MaterialCommunityIcons name="cancel" size={14} color={PALETTE.flame.DEFAULT} />
                                    <Text style={getBadgeTextStyle('danger')}>No Stopping</Text>
                                </View>
                            )}
                            {spot.enforceable_time && (
                                <View style={getBadgeStyle('warning')}>
                                    <MaterialCommunityIcons name="police-badge" size={14} color={PALETTE.earth_yellow[300]} />
                                    <Text style={getBadgeTextStyle('warning')}>Enforced</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.actionsLarge}>
                        <TouchableOpacity style={styles.detailsBtnLarge} onPress={flip}>
                            <MaterialCommunityIcons name="information-outline" size={18} color={TOKENS.text} />
                            <Text style={styles.detailsBtnTextLarge}>Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navBtnLarge} onPress={onNavigate}>
                            <MaterialCommunityIcons name="navigation" size={20} color="#FFFFFF" />
                            <Text style={styles.navBtnTextLarge}>Navigate</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* back of card */}
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardBack,
                        {
                            opacity: backOpacity,
                            transform: [{ perspective: 1000 }, { rotateY: backRotateY }],
                        },
                    ]}
                >
                    <View style={styles.cardHeaderBack}>
                        <TouchableOpacity
                            onPress={flip}
                            style={styles.backBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialCommunityIcons name="arrow-left" size={20} color={TOKENS.text} />
                        </TouchableOpacity>
                        <View style={styles.pageTitleTag}>
                            <Text style={styles.spotTypeText}>
                                {detailsPages[currentPage]?.title || 'Details'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={onClose}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* horizontal pager for detail pages */}
                    <ScrollView
                        ref={pagesScrollRef}
                        horizontal
                        pagingEnabled
                        decelerationRate="fast"
                        snapToInterval={pageWidth}
                        snapToAlignment="start"
                        disableIntervalMomentum
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const page = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
                            setCurrentPage(page);
                        }}
                        style={styles.pagesContainer}
                    >
                        {detailsPages.map((page, pageIndex) => (
                            <View key={pageIndex} style={[styles.detailPage, { width: CONTENT_WIDTH }]}>
                                <ScrollView
                                    style={styles.detailsListLarge}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.detailsContent}
                                >
                                    {page.items.length > 0 ? (
                                        page.items.map((item, idx) => (
                                            <View
                                                key={idx}
                                                style={[
                                                    styles.detailRowLarge,
                                                    item.highlight && styles.detailRowHighlightLarge
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.detailLabelLarge,
                                                        item.highlight && styles.detailLabelHighlight
                                                    ]}
                                                    numberOfLines={2}
                                                >
                                                    {item.label}
                                                </Text>
                                                {item.link ? (
                                                    <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                                                        <Text
                                                            style={[
                                                                styles.detailValueLarge,
                                                                item.highlight && styles.detailValueHighlight,
                                                                styles.linkText,
                                                            ]}
                                                            numberOfLines={3}
                                                        >
                                                            {item.value || '—'} →
                                                        </Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <Text
                                                        style={[
                                                            styles.detailValueLarge,
                                                            item.highlight && styles.detailValueHighlight
                                                        ]}
                                                        numberOfLines={3}
                                                    >
                                                        {item.value || '—'}
                                                    </Text>
                                                )}
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.noDataText}>No additional information available</Text>
                                    )}
                                </ScrollView>
                            </View>
                        ))}
                    </ScrollView>

                    {detailsPages.length > 1 && (
                        <View style={styles.pagerContainer}>
                            <TouchableOpacity
                                style={[styles.pagerArrow, currentPage === 0 && styles.pagerArrowDisabled]}
                                onPress={goPrev}
                                disabled={currentPage === 0}
                            >
                                <MaterialCommunityIcons
                                    name="chevron-left"
                                    size={20}
                                    color={currentPage === 0 ? TOKENS.textMuted : TOKENS.text}
                                />
                            </TouchableOpacity>

                            <View style={styles.pagerDots}>
                                {detailsPages.map((_, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => scrollToPage(idx)}
                                        style={[styles.pagerDot, currentPage === idx && styles.pagerDotActive]}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Go to page ${idx + 1}`}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.pagerArrow,
                                    currentPage === detailsPages.length - 1 && styles.pagerArrowDisabled,
                                ]}
                                onPress={goNext}
                                disabled={currentPage === detailsPages.length - 1}
                            >
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    size={20}
                                    color={currentPage === detailsPages.length - 1 ? TOKENS.textMuted : TOKENS.text}
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    {detailsPages.length === 1 && (
                        <View style={styles.backActionsLarge}>
                            <TouchableOpacity style={styles.navBtnFullLarge} onPress={onNavigate}>
                                <MaterialCommunityIcons name="navigation-variant" size={20} color="#FFFFFF" />
                                <Text style={styles.navBtnTextLarge}>Navigate to Parking Spot</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
        </>
    );
}

export default FlippableParkingCard;