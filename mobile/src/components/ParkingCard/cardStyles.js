// =====================================
// FILE: src/components/ParkingCard/cardStyles.js
// IMPROVED: Enhanced visual hierarchy with theme alignment
// =====================================
import { StyleSheet } from 'react-native';
import { PALETTE, TOKENS, alpha } from '../../constants/theme';
import { CARD_WIDTH, CARD_HEIGHT } from './cardConstants';

export const styles = StyleSheet.create({
  // Subtle overlay for focus
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: alpha(PALETTE.bistre.DEFAULT, 0.2),
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
    backgroundColor: TOKENS.surface,
    borderRadius: 20,
    elevation: 16,
    shadowColor: PALETTE.bistre.DEFAULT,
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    backfaceVisibility: 'hidden',
  },

  cardFront: {
    padding: 18,
    zIndex: 2,
  },

  cardBack: {
    padding: 18,
    zIndex: 1,
  },

  // Front header - cleaner design
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: alpha(PALETTE.earth_yellow[400], 0.15),
  },

  // Back header - improved layout
  cardHeaderBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: alpha(PALETTE.earth_yellow[400], 0.15),
    gap: 10,
  },

  // Spot type tag - better visual weight
  spotTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: alpha(PALETTE.vanilla[600], 0.4),
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: alpha(PALETTE.earth_yellow[400], 0.2),
  },

  // Page title for back - matches front style
  pageTitleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(PALETTE.vanilla[600], 0.4),
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: alpha(PALETTE.earth_yellow[400], 0.2),
  },

  spotTypeText: {
    fontSize: 13,
    fontWeight: '700',
    color: TOKENS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  // Action buttons - more prominent
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PALETTE.vanilla[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: alpha(PALETTE.earth_yellow[400], 0.15),
  },

  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PALETTE.flame[600],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Front content - better spacing
  frontContent: {
    flex: 1,
    marginTop: 4,
  },

  address: {
    fontSize: 18,
    fontWeight: '700',
    color: TOKENS.text,
    marginBottom: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  // Quick stats - visual hierarchy improvement
  quickStatsLarge: {
    backgroundColor: alpha(PALETTE.vanilla[700], 0.5),
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: alpha(PALETTE.earth_yellow[400], 0.1),
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: TOKENS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: alpha(PALETTE.earth_yellow[400], 0.15),
  },

  statLabelLeft: {
    fontSize: 13,
    fontWeight: '600',
    color: TOKENS.textMuted,
    letterSpacing: 0.3,
  },

  statValueRight: {
    fontSize: 17,
    fontWeight: '700',
    color: TOKENS.text,
    textAlign: 'right',
    marginLeft: 12,
    flexShrink: 0,
    letterSpacing: -0.2,
  },

  statValuePrimary: {
    color: TOKENS.primary,
  },

  statDividerLarge: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: alpha(PALETTE.earth_yellow[400], 0.1),
    marginVertical: 2,
  },

  // Badges - improved design
  badgesLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  badgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
  },

  // Badge variants with theme colors
  badgeDefault: {
    backgroundColor: alpha(PALETTE.vanilla[500], 0.15),
    borderColor: alpha(PALETTE.vanilla[500], 0.3),
  },

  badgeWarning: {
    backgroundColor: alpha(PALETTE.earth_yellow.DEFAULT, 0.15),
    borderColor: alpha(PALETTE.earth_yellow.DEFAULT, 0.3),
  },

  badgeInfo: {
    backgroundColor: alpha(PALETTE.straw.DEFAULT, 0.15),
    borderColor: alpha(PALETTE.straw.DEFAULT, 0.3),
  },

  badgeDanger: {
    backgroundColor: alpha(PALETTE.flame.DEFAULT, 0.15),
    borderColor: alpha(PALETTE.flame.DEFAULT, 0.3),
  },

  badgeTextLarge: {
    fontSize: 12,
    fontWeight: '600',
  },

  badgeTextDefault: { color: PALETTE.bistre[700] },
  badgeTextWarning: { color: PALETTE.earth_yellow[300] },
  badgeTextInfo: { color: PALETTE.straw[300] },
  badgeTextDanger: { color: PALETTE.flame.DEFAULT },

  // Actions - better visual hierarchy
  actionsLarge: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: alpha(PALETTE.earth_yellow[400], 0.15),
  },

  detailsBtnLarge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.vanilla[700],
    paddingVertical: 13,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: alpha(PALETTE.earth_yellow[400], 0.2),
  },

  detailsBtnTextLarge: {
    fontSize: 14,
    fontWeight: '600',
    color: TOKENS.text,
  },

  navBtnLarge: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TOKENS.primary,
    paddingVertical: 13,
    borderRadius: 14,
    gap: 6,
    // Add subtle shadow for primary button
    shadowColor: TOKENS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  navBtnTextLarge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Back (details) styles - improved
  pagesContainer: {
    flex: 1,
    marginTop: 8,
  },

  detailPage: {
    paddingHorizontal: 4,
    paddingTop: 4,
    flexShrink: 0,
  },

  detailsListLarge: {
    flex: 1,
    marginBottom: 10,
  },

  detailsContent: {
    paddingBottom: 14,
    rowGap: 6,
  },

  // Detail rows - cleaner design
  detailRowLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: alpha(PALETTE.vanilla[800], 0.3),
    marginBottom: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: alpha(PALETTE.earth_yellow[400], 0.08),
  },

  detailRowHighlightLarge: {
    backgroundColor: alpha(PALETTE.earth_yellow[500], 0.08),
    borderColor: alpha(PALETTE.earth_yellow[400], 0.2),
  },

  detailLabelLarge: {
    fontSize: 13,
    lineHeight: 18,
    color: TOKENS.textMuted,
    flex: 1.15,
    fontWeight: '500',
    letterSpacing: 0.1,
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
    flex: 1,
    textAlign: 'right',
    paddingLeft: 12,
  },

  detailValueHighlight: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: PALETTE.flame[600],
  },

  // Pager controls - much clearer
  pagerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: alpha(PALETTE.vanilla[700], 0.3),
    marginHorizontal: -18,
    marginBottom: -18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: alpha(PALETTE.earth_yellow[400], 0.15),
  },

  pagerArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PALETTE.vanilla[800],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: alpha(PALETTE.earth_yellow[400], 0.2),
  },

  pagerArrowDisabled: {
    opacity: 0.4,
    backgroundColor: PALETTE.vanilla[900],
  },

  pagerDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  pagerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: alpha(PALETTE.bistre.DEFAULT, 0.2),
  },

  pagerDotActive: {
    width: 24,
    backgroundColor: TOKENS.primary,
  },

  pagerMeta: {
    backgroundColor: alpha(PALETTE.flame[600], 0.1),
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: alpha(PALETTE.flame[600], 0.2),
  },

  pagerMetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.flame[600],
    letterSpacing: 0.3,
  },

  linkText: {
    textDecorationLine: 'underline',
    color: PALETTE.flame[600],
  },

  noDataText: {
    fontSize: 14,
    color: TOKENS.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },

  // Back actions - consistent with front
  backActionsLarge: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: alpha(PALETTE.earth_yellow[400], 0.15),
  },

  navBtnFullLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TOKENS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 6,
    // Consistent shadow with front
    shadowColor: TOKENS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});