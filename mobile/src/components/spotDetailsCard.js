// src/components/spotDetailsCard.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  PanResponder,
  Dimensions,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TOKENS, PALETTE } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sheet layout
const MAX_HEIGHT = Math.min(520, SCREEN_HEIGHT * 0.6); // expanded height
const PEEK_HEIGHT = Math.min(260, MAX_HEIGHT - 100);   // collapsed/peek height
const H_MARGIN = 10;                                   // side margins

// Positions (translateY from bottom)
const EXPANDED_Y = 0;
const PEEK_Y = MAX_HEIGHT - PEEK_HEIGHT;
const HIDDEN_Y = MAX_HEIGHT + 48; // off-screen

function parseHtmlZoneRate(html) {
  if (!html) return [];
  const decoded = html
    .replace(/\\u003C/g, '<')
    .replace(/\\u003E/g, '>')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/?b>/g, '');
  const lines = decoded.split('\n').filter((l) => l.trim());
  const out = [];
  let cur = null;
  for (const line of lines) {
    const t = line.trim();
    if (t.includes(':') && !t.includes('$') && !t.toLowerCase().includes('free')) {
      if (cur) out.push(cur);
      cur = { period: t, rate: '' };
    } else if (t.includes('$') || t.toLowerCase().includes('free')) {
      if (cur) {
        cur.rate = t; out.push(cur); cur = null;
      } else {
        out.push({ period: '', rate: t });
      }
    }
  }
  if (cur?.rate) out.push(cur);
  return out;
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={3}>{value ?? '—'}</Text>
    </View>
  );
}

/**
 * Props:
 * - visible
 * - spot
 * - details
 * - loading
 * - error
 * - onClose: () => void   // called after swipe-down or close button
 */
export default function SpotDetailsCard({ visible, spot, details, loading, error, onClose }) {
  // --- Hooks (must be unconditional) ---
  const translateY = useRef(new Animated.Value(HIDDEN_Y)).current;
  const [snap, setSnap] = useState('peek'); // 'peek' | 'expanded'
  const currentYRef = useRef(HIDDEN_Y);
  const dragStartY = useRef(PEEK_Y);

  useEffect(() => {
    const id = translateY.addListener(({ value }) => { currentYRef.current = value; });
    return () => translateY.removeListener(id);
  }, [translateY]);

  // precompute pricing regardless of visibility to keep hook order stable
  const pricing = useMemo(
    () => parseHtmlZoneRate(details?.html_zone_rate || spot?.zone_info?.html_zone_rate),
    [details, spot]
  );

  // show/hide animations
  useEffect(() => {
    if (visible) {
      animateTo(PEEK_Y, 220);
      setSnap('peek');
    } else {
      translateY.setValue(HIDDEN_Y);
      setSnap('peek');
    }
  }, [visible]);

  const animateTo = (to, duration = 200) => {
    Animated.timing(translateY, {
      toValue: to,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeWithAnimation = () => {
    Animated.timing(translateY, {
      toValue: HIDDEN_Y,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  };

  // drag handle only (so ScrollView inside can scroll freely)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderGrant: () => {
        translateY.stopAnimation((cur) => { dragStartY.current = cur ?? PEEK_Y; });
      },
      onPanResponderMove: (_, g) => {
        const next = clamp(dragStartY.current + g.dy, EXPANDED_Y, HIDDEN_Y);
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const finalY = clamp(dragStartY.current + g.dy, EXPANDED_Y, HIDDEN_Y);
        const v = g.vy;

        // dismiss logic
        const dismissThreshold = PEEK_Y + 80;
        if (finalY > dismissThreshold || v > 1) {
          return closeWithAnimation();
        }

        // snap logic
        const mid = (PEEK_Y + EXPANDED_Y) / 2;
        if (finalY <= mid || v < -0.5) {
          setSnap('expanded');
          animateTo(EXPANDED_Y, 220);
        } else {
          setSnap('peek');
          animateTo(PEEK_Y, 200);
        }
      },
    })
  ).current;

  // after all hooks are defined, it's safe to conditionally render
  if (!visible) return null;

  const openInMaps = () => {
    const lng = spot?.coordinates?.coordinates?.[0];
    const lat = spot?.coordinates?.coordinates?.[1];
    if (typeof lat === 'number' && typeof lng === 'number') {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
            height: MAX_HEIGHT,
            shadowOpacity: snap === 'expanded' ? 0.25 : 0.18,
          },
        ]}
        pointerEvents="box-none"
      >
        {/* Drag handle header */}
        <View style={styles.header} {...panResponder.panHandlers}>
          <View style={styles.handleBar} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {spot?.address || 'Parking spot'}
          </Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => (snap === 'peek' ? animateTo(EXPANDED_Y, 220) : animateTo(PEEK_Y, 200))}
              style={styles.headerIconBtn}
              accessibilityRole="button"
              accessibilityLabel={snap === 'peek' ? 'Expand details' : 'Collapse details'}
            >
              <MaterialCommunityIcons
                name={snap === 'peek' ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={TOKENS.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeWithAnimation}
              style={styles.headerIconBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <MaterialCommunityIcons name="close" size={18} color={TOKENS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content area */}
        <View style={styles.contentWrap}>
          {/* Quick stats row */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{spot?.walkingTime || 0}</Text>
              <Text style={styles.statLabel}>min walk</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{spot?.distance || 0}</Text>
              <Text style={styles.statLabel}>meters</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {details?.price_zone || spot?.zone_info?.price_zone
                  ? `Zone ${details?.price_zone || spot?.zone_info?.price_zone}`
                  : '—'}
              </Text>
              <Text style={styles.statLabel}>price zone</Text>
            </View>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {loading ? <Text style={styles.muted}>Loading details…</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Restrictions & Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Restrictions & Info</Text>
              <Row label="Permit Zone" value={details?.permit_zone || spot?.zone_info?.permit_zone} />
              <Row label="Zone Type" value={details?.zone_type || spot?.zone_info?.zone_type} />
              <Row label="Block Side" value={details?.block_side || spot?.metadata?.block_side} />
              <Row label="Max Time" value={details?.max_time || spot?.metadata?.max_time} />
              <Row label="Stall Type" value={details?.stall_type || spot?.metadata?.stall_type} />
              <Row label="Restriction" value={details?.parking_restriction || spot?.metadata?.parking_restriction} />
              <Row label="Restriction Time" value={details?.parking_restrict_time || spot?.metadata?.time_restriction} />
              <Row label="Lot Name" value={details?.lot_name || spot?.metadata?.lot_name} />
              <Row label="Lot #" value={details?.lot_num || spot?.metadata?.lot_num} />
              <Row label="Camera" value={(details?.camera ?? spot?.metadata?.camera) ? 'Yes' : 'No'} />
            </View>

            {/* Pricing */}
            {pricing?.length ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Pricing Schedule</Text>
                {pricing.slice(0, 8).map((p, idx) => (
                  <View key={idx} style={styles.pricingRow}>
                    <Text style={styles.pricingPeriod}>{p.period}</Text>
                    <Text style={styles.pricingRate}>{p.rate}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={closeWithAnimation}>
                <Text style={styles.secondaryText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={openInMaps}>
                <LinearGradient colors={[TOKENS.primary, TOKENS.primaryAlt]} style={styles.primaryGrad}>
                  <MaterialCommunityIcons name="navigation" size={18} color="#fff" />
                  <Text style={styles.primaryText}>Navigate</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

function clamp(v, min, max) {
  'worklet';
  return Math.max(min, Math.min(max, v));
}

const styles = StyleSheet.create({
  // The sheet sits at the bottom and never fills the whole screen.
  sheet: {
    position: 'absolute',
    left: H_MARGIN,
    right: H_MARGIN,
    bottom: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 14,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },

  // Header / drag handle
  header: {
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  handleBar: {
    position: 'absolute',
    top: 6,
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
  },
  headerTitle: {
    flex: 1,
    marginLeft: 4,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '700',
    color: TOKENS.text,
    textAlign: 'left',
  },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerIconBtn: { padding: 6, marginLeft: 2, borderRadius: 8 },

  // Content
  contentWrap: { flex: 1, paddingHorizontal: 12, paddingBottom: Platform.select({ ios: 14, android: 10 }) },

  stats: {
    marginTop: 6,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: PALETTE.vanilla[800],
    borderRadius: 12,
    padding: 12,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '700', color: TOKENS.text },
  statLabel: { fontSize: 11, color: TOKENS.textMuted, marginTop: 2 },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 10 },

  muted: { color: TOKENS.textMuted, marginTop: 6 },
  error: { color: '#b00020', marginTop: 6 },

  card: { marginTop: 10, backgroundColor: PALETTE.vanilla[800], borderRadius: 12, padding: 12 },
  cardTitle: { fontSize: 13, fontWeight: '800', color: TOKENS.text, marginBottom: 8 },

  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: TOKENS.textMuted, fontSize: 12 },
  rowValue: { color: TOKENS.text, fontSize: 12, fontWeight: '600', marginLeft: 12, flexShrink: 1, textAlign: 'right' },

  pricingRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: PALETTE.vanilla[600] },
  pricingPeriod: { fontSize: 12, color: TOKENS.textMuted },
  pricingRate: { fontSize: 14, fontWeight: '700', color: TOKENS.primary, marginTop: 2 },

  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  secondaryBtn: { flex: 1, borderRadius: 12, backgroundColor: PALETTE.vanilla[700], alignItems: 'center', paddingVertical: 12 },
  secondaryText: { color: TOKENS.text, fontWeight: '700' },
  primaryBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  primaryGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6, borderRadius: 12 },
  primaryText: { color: '#fff', fontWeight: '700' },
});
