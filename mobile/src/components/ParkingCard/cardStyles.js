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
    backgroundColor: alpha(TOKENS.shadow, 0.18),
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
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
    elevation: 2,
    backfaceVisibility: 'hidden',
  },

  cardFront: {
    padding: 24,
    zIndex: 2,
  },

  cardBack: {
    padding: 24,
    zIndex: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  cardHeaderBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },

  spotTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
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
    fontWeight: '500',
    color: TOKENS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TOKENS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },

  frontContent: {
    flex: 1,
  },

  address: {
    fontSize: 18,
    fontWeight: '600',
    color: TOKENS.text,
    marginBottom: 24,
    lineHeight: 25,
    letterSpacing: -0.3,
  },

  quickStatsLarge: {
    marginBottom: 24,
    gap: 14,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
    flex: 1,
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    fontWeight: '500',
    color: TOKENS.text,
    textAlign: 'right',
    marginLeft: 12,
    flexShrink: 0,
    fontVariant: ['tabular-nums'],
  },

  statValuePrimary: {
    color: TOKENS.primary,
  },

  statDividerLarge: {
    display: 'none',
  },

  badgesLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  badgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 4,
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

  actionsLarge: {
    flexDirection: 'row',
    gap: 12,
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
    paddingVertical: 15,
    borderRadius: 10,
    gap: 6,
  },

  detailsBtnTextLarge: {
    fontSize: 15,
    fontWeight: '500',
    color: TOKENS.text,
  },

  navBtnLarge: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TOKENS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    gap: 7,
  },

  navBtnTextLarge: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },

  // horizontal pager
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
    marginBottom: 12,
  },

  detailsContent: {
    gap: 0,
  },

  detailRowLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.hairline,
  },

  detailRowHighlightLarge: {
    backgroundColor: 'transparent',
  },

  detailLabelLarge: {
    fontSize: 14,
    lineHeight: 20,
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
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: TOKENS.primary,
  },

  pagerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingTop: 14,
    paddingBottom: 0,
    marginHorizontal: 0,
    marginBottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TOKENS.hairline,
  },

  pagerArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    width: 20,
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
    paddingVertical: 16,
    borderRadius: 10,
    gap: 8,
  },
});
