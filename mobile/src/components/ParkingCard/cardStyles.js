// src/components/ParkingCard/cardStyles.js

import { StyleSheet } from 'react-native';
import { PALETTE, alpha } from '../../constants/theme';
import { CARD_HEIGHT, CARD_WIDTH } from './cardConstants';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
  },

  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    zIndex: 1001,
    elevation: 1001,
  },

  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: PALETTE.vanilla[900],
    borderRadius: 24,
    elevation: 20,
    shadowColor: PALETTE.bistre[500],
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
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
    color: PALETTE.bistre[600],
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: alpha(PALETTE.vanilla[700], 0.8),
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.bistre[500],
    alignItems: 'center',
    justifyContent: 'center',
  },

  frontContent: {
    flex: 1,
  },

  address: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.bistre[500],
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
    backgroundColor: alpha(PALETTE.vanilla[700], 0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabelLeft: {
    fontSize: 14,
    fontWeight: '500',
    color: PALETTE.bistre[600],
    letterSpacing: -0.2,
  },

  statValueRight: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.bistre[500],
    textAlign: 'right',
    marginLeft: 12,
    flexShrink: 0,
    letterSpacing: -0.3,
  },

  statValuePrimary: {
    color: PALETTE.flame.DEFAULT,
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
    backgroundColor: alpha(PALETTE.vanilla[700], 0.6),
  },

  badgeWarning: {
    backgroundColor: alpha(PALETTE.earth_yellow.DEFAULT, 0.18),
  },

  badgeInfo: {
    backgroundColor: alpha(PALETTE.straw.DEFAULT, 0.18),
  },

  badgeDanger: {
    backgroundColor: alpha(PALETTE.flame.DEFAULT, 0.15),
  },

  badgeTextLarge: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  badgeTextDefault: { color: PALETTE.bistre[600] },
  badgeTextWarning: { color: PALETTE.earth_yellow[100] },
  badgeTextInfo: { color: PALETTE.straw[100] },
  badgeTextDanger: { color: PALETTE.flame[100] },

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
    backgroundColor: alpha(PALETTE.vanilla[700], 0.8),
    paddingVertical: 15,
    borderRadius: 16,
    gap: 6,
  },

  detailsBtnTextLarge: {
    fontSize: 15,
    fontWeight: '600',
    color: PALETTE.bistre[500],
  },

  navBtnLarge: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.flame.DEFAULT,
    paddingVertical: 15,
    borderRadius: 16,
    gap: 7,
  },

  navBtnTextLarge: {
    fontSize: 15,
    fontWeight: '600',
    color: PALETTE.vanilla[900],
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
    borderBottomColor: alpha(PALETTE.earth_yellow[400], 0.12),
  },

  detailRowHighlightLarge: {
    backgroundColor: 'transparent',
  },

  detailLabelLarge: {
    fontSize: 14,
    lineHeight: 20,
    color: PALETTE.bistre[600],
    flex: 1,
    fontWeight: '500',
    letterSpacing: -0.1,
  },

  detailLabelHighlight: {
    color: PALETTE.bistre[500],
    fontWeight: '600',
  },

  detailValueLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: PALETTE.bistre[500],
    textAlign: 'right',
    paddingLeft: 16,
    flexShrink: 0,
  },

  detailValueHighlight: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: PALETTE.flame.DEFAULT,
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
    borderTopColor: alpha(PALETTE.earth_yellow[400], 0.1),
  },

  pagerArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: alpha(PALETTE.vanilla[700], 0.6),
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
    backgroundColor: alpha(PALETTE.earth_yellow[400], 0.3),
  },

  pagerDotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.earth_yellow[400],
  },

  pagerMeta: {
    backgroundColor: alpha(PALETTE.flame[600], 0.1),
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  pagerMetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.flame[600],
    letterSpacing: 0.3,
  },

  linkText: {
    textDecorationLine: 'underline',
    color: PALETTE.flame.DEFAULT,
  },

  noDataText: {
    fontSize: 14,
    color: PALETTE.bistre[700],
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
    backgroundColor: PALETTE.flame.DEFAULT,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
});