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
    backgroundColor: alpha(TOKENS.shadow, 0.22),
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
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.primaryHairline,
    backfaceVisibility: 'hidden',
    shadowColor: TOKENS.primaryDeep,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },

  cardFront: {
    padding: 22,
    zIndex: 2,
  },

  cardBack: {
    padding: 22,
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
    alignSelf: 'flex-start',
    marginRight: 12,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: TOKENS.primaryTint,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.primaryHairline,
    flex: 0,
  },

  pageTitleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: TOKENS.primaryTint,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.primaryHairline,
  },

  spotTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: TOKENS.primaryAlt,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: TOKENS.primaryTint,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.primaryHairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: TOKENS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: TOKENS.primaryDeep,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },

  frontContent: {
    flex: 1,
  },

  address: {
    fontSize: 20,
    fontWeight: '700',
    color: TOKENS.primaryDeep,
    marginBottom: 20,
    lineHeight: 26,
    letterSpacing: -0.4,
  },

  quickStatsLarge: {
    marginBottom: 20,
    gap: 8,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: TOKENS.surfaceTint,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.primaryHairline,
  },

  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
    flex: 1,
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: TOKENS.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.primaryHairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabelLeft: {
    fontSize: 13,
    fontWeight: '600',
    color: TOKENS.textMuted,
    letterSpacing: -0.1,
  },

  statValueRight: {
    fontSize: 16,
    fontWeight: '700',
    color: TOKENS.primaryDeep,
    textAlign: 'right',
    marginLeft: 12,
    flexShrink: 0,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.2,
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
    gap: 10,
    marginTop: 'auto',
  },

  detailsBtnLarge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TOKENS.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.primaryBorder,
    paddingVertical: 15,
    borderRadius: 14,
    gap: 6,
  },

  detailsBtnTextLarge: {
    fontSize: 15,
    fontWeight: '700',
    color: TOKENS.primaryAlt,
    letterSpacing: -0.1,
  },

  navBtnLarge: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TOKENS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    gap: 7,
    shadowColor: TOKENS.primaryDeep,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },

  navBtnTextLarge: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.1,
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
    gap: 8,
    paddingBottom: 4,
  },

  detailRowLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: TOKENS.surfaceTint,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.primaryHairline,
  },

  detailRowHighlightLarge: {
    backgroundColor: TOKENS.primaryTint,
    borderColor: TOKENS.primaryBorder,
  },

  detailLabelLarge: {
    fontSize: 13,
    lineHeight: 18,
    color: TOKENS.textMuted,
    flex: 1,
    fontWeight: '600',
  },

  detailLabelHighlight: {
    color: TOKENS.primaryAlt,
    fontWeight: '700',
  },

  detailValueLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: TOKENS.primaryDeep,
    textAlign: 'right',
    paddingLeft: 16,
    flexShrink: 0,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.1,
  },

  detailValueHighlight: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
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
    borderTopColor: TOKENS.primaryHairline,
  },

  pagerArrow: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: TOKENS.primaryTint,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.primaryHairline,
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
    borderRadius: 14,
    gap: 8,
    shadowColor: TOKENS.primaryDeep,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
});
