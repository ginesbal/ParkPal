// src/components/ParkingCard/cardStyles.js

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
    shadowOffset: { width: 0, height: 8 },
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
    marginBottom: 16,
  },

  cardHeaderBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 18,
    lineHeight: 24,
    letterSpacing: -0.3,
  },

  // Stat rows — clean flat layout, no containers
  quickStatsLarge: {
    marginBottom: 16,
    gap: 0,
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
    gap: 10,
    minWidth: 0,
    flex: 1,
  },

  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
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

  statDividerLarge: {
    display: 'none',
  },

  // Badges — simple inline text
  badgesLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  badgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 2,
    borderRadius: 0,
    gap: 6,
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

  // Action buttons
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
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
    paddingVertical: 14,
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
    backgroundColor: TOKENS.primary,
    paddingVertical: 14,
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
    marginTop: 0,
  },

  detailPage: {
    paddingHorizontal: 0,
    paddingTop: 0,
    flexShrink: 0,
  },

  detailsListLarge: {
    flex: 1,
    marginBottom: 8,
  },

  detailsContent: {
    gap: 0,
  },

  detailRowLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
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

  // Pager nav
  pagerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
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

  pagerMeta: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

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
    paddingTop: 0,
  },

  navBtnFullLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TOKENS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
});
