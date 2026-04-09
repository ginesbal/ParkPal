// src/components/ParkingCard/cardStyles.js

import { StyleSheet } from 'react-native';
import { PALETTE, SHADOWS, TOKENS, alpha } from '../../constants/theme';
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
    backgroundColor: TOKENS.surfaceOverlay,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: TOKENS.strokeLight,
    elevation: 20,
    ...SHADOWS.lg,
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
    fontSize: 12,
    fontWeight: '600',
    color: TOKENS.primaryAlt,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TOKENS.surfaceMuted,
    borderWidth: 1,
    borderColor: TOKENS.strokeLight,
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
    fontWeight: '700',
    color: TOKENS.text,
    marginBottom: 24,
    lineHeight: 25,
    letterSpacing: -0.4,
  },

  quickStatsLarge: {
    marginBottom: 24,
    gap: 16,
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
    backgroundColor: TOKENS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabelLeft: {
    fontSize: 14,
    fontWeight: '500',
    color: TOKENS.textMuted,
    letterSpacing: -0.2,
  },

  statValueRight: {
    fontSize: 16,
    fontWeight: '700',
    color: TOKENS.text,
    textAlign: 'right',
    marginLeft: 12,
    flexShrink: 0,
    letterSpacing: -0.3,
  },

  statValuePrimary: {
    color: TOKENS.primaryAlt,
  },

  statDividerLarge: {
    display: 'none',
  },

  badgesLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  badgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 6,
  },

  badgeDefault: {
    backgroundColor: TOKENS.primarySoft,
  },

  badgeWarning: {
    backgroundColor: TOKENS.warningSoft,
  },

  badgeInfo: {
    backgroundColor: TOKENS.surfaceMuted,
  },

  badgeDanger: {
    backgroundColor: TOKENS.dangerSoft,
  },

  badgeTextLarge: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  badgeTextDefault: { color: TOKENS.primaryAlt },
  badgeTextWarning: { color: PALETTE.amber[700] },
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
    backgroundColor: TOKENS.surfaceMuted,
    paddingVertical: 15,
    borderRadius: 16,
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
    paddingVertical: 15,
    borderRadius: 16,
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
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.strokeLight,
  },

  detailRowHighlightLarge: {
    backgroundColor: 'transparent',
  },

  detailLabelLarge: {
    fontSize: 14,
    lineHeight: 20,
    color: TOKENS.textMuted,
    flex: 1,
    fontWeight: '500',
    letterSpacing: -0.1,
  },

  detailLabelHighlight: {
    color: TOKENS.text,
    fontWeight: '600',
  },

  detailValueLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: TOKENS.text,
    textAlign: 'right',
    paddingLeft: 16,
    flexShrink: 0,
  },

  detailValueHighlight: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: TOKENS.primaryAlt,
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
    borderTopWidth: 1,
    borderTopColor: TOKENS.strokeLight,
  },

  pagerArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: TOKENS.surfaceMuted,
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
    backgroundColor: TOKENS.primarySoft,
  },

  pagerDotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: TOKENS.primary,
  },

  pagerMeta: {
    backgroundColor: TOKENS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  pagerMetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: TOKENS.primaryAlt,
    letterSpacing: 0.3,
  },

  linkText: {
    textDecorationLine: 'underline',
    color: TOKENS.primaryAlt,
  },

  noDataText: {
    fontSize: 14,
    color: TOKENS.textMuted,
    textAlign: 'center',
    paddingVertical: 32,
    fontStyle: 'italic',
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
    borderRadius: 16,
    gap: 8,
  },
});
