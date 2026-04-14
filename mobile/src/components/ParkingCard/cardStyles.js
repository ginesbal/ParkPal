// src/components/ParkingCard/cardStyles.js
//
// Spacing rhythm: 12px within groups, 14px between sections.
// Per Emil Kowalski's design engineering principles:
//   - Every detail compounds into something that feels right
//   - Consistent spacing rhythm, no mixed values
//   - Buttons must feel responsive (scale on press)
//   - No invisible containers — elements only take the space they need

import { StyleSheet } from 'react-native';
import { TOKENS, alpha } from '../../constants/theme';
import { CARD_HEIGHT, CARD_WIDTH } from './cardConstants';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: alpha(TOKENS.shadow, 0.2),
    zIndex: 1500,
    elevation: 15,
  },

  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    zIndex: 2000,
    elevation: 20,
  },

  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: TOKENS.surface,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
    backfaceVisibility: 'hidden',
    shadowColor: TOKENS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },

  cardFront: {
    padding: 20,
    zIndex: 2,
  },

  cardBack: {
    padding: 20,
    zIndex: 1,
  },

  // --- Header rows (front + back) ---
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  cardHeaderBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },

  spotTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  pageTitleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  spotTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: TOKENS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TOKENS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Front content ---
  frontContent: {
    flex: 1,
  },

  address: {
    fontSize: 18,
    fontWeight: '600',
    color: TOKENS.text,
    marginBottom: 14,
    lineHeight: 24,
    letterSpacing: -0.3,
  },

  // Stat rows — tight rhythm with hairline dividers
  quickStatsLarge: {
    marginBottom: 14,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.divider,
  },

  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    flex: 1,
  },

  // Icon sits inline — no invisible container
  statIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabelLeft: {
    fontSize: 14,
    fontWeight: '400',
    color: TOKENS.textMuted,
  },

  statValueRight: {
    fontSize: 16,
    fontWeight: '600',
    color: TOKENS.text,
    textAlign: 'right',
    marginLeft: 12,
    flexShrink: 0,
    fontVariant: ['tabular-nums'],
  },

  statValuePrimary: {
    color: TOKENS.primary,
    fontWeight: '600',
  },

  // Badges — simple inline text
  badgesLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },

  badgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  badgeDefault: {},
  badgeWarning: {},
  badgeInfo: {},
  badgeDanger: {},

  badgeTextLarge: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
  },

  badgeTextDefault: { color: TOKENS.primary },
  badgeTextWarning: { color: TOKENS.warning },
  badgeTextInfo: { color: TOKENS.textMuted },
  badgeTextDanger: { color: TOKENS.danger },

  // Action buttons — min 48px touch target per accessibility
  actionsLarge: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
  },

  detailsBtnLarge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
    borderRadius: 12,
    gap: 6,
  },

  detailsBtnTextLarge: {
    fontSize: 15,
    fontWeight: '600',
    color: TOKENS.text,
  },

  navBtnLarge: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: TOKENS.primary,
    borderRadius: 12,
    gap: 7,
  },

  navBtnTextLarge: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },

  // --- Back: horizontal pager ---
  pagesContainer: {
    flex: 1,
  },

  detailPage: {
    flexShrink: 0,
  },

  detailsListLarge: {
    flex: 1,
  },

  detailsContent: {
    paddingBottom: 4,
  },

  detailRowLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.divider,
  },

  detailRowHighlightLarge: {
    backgroundColor: 'transparent',
  },

  detailLabelLarge: {
    fontSize: 13,
    lineHeight: 18,
    color: TOKENS.textMuted,
    flex: 1,
    fontWeight: '400',
  },

  detailLabelHighlight: {
    color: TOKENS.text,
    fontWeight: '600',
  },

  detailValueLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: TOKENS.text,
    textAlign: 'right',
    paddingLeft: 16,
    flexShrink: 0,
    fontVariant: ['tabular-nums'],
  },

  detailValueHighlight: {
    fontSize: 14,
    fontWeight: '600',
    color: TOKENS.primary,
  },

  // Pager nav — proper spacing from content
  pagerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TOKENS.divider,
  },

  pagerArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pagerArrowDisabled: {
    opacity: 0.3,
  },

  pagerDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  pagerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TOKENS.hairline,
  },

  pagerDotActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: TOKENS.primary,
  },

  pagerMeta: {},

  pagerMetaText: {
    fontSize: 12,
    fontWeight: '500',
    color: TOKENS.textMuted,
    fontVariant: ['tabular-nums'],
  },

  linkText: {
    textDecorationLine: 'underline',
    color: TOKENS.primary,
  },

  noDataText: {
    fontSize: 14,
    color: TOKENS.textMuted,
    textAlign: 'center',
    paddingVertical: 32,
  },

  backActionsLarge: {
    marginTop: 'auto',
    paddingTop: 12,
  },

  navBtnFullLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: TOKENS.primary,
    borderRadius: 12,
    gap: 8,
  },
});
