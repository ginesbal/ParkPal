export class ParkingDataProcessor {
  static groupByType(spots) {
    return spots.reduce((acc, spot) => {
      const type = spot.spot_type || 'unknown';
      if (!acc[type]) acc[type] = [];
      acc[type].push(spot);
      return acc;
    }, {});
  }

  static sortByDistance(spots) {
    return [...spots].sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  static filterByAvailability(spots, minAvailable = 1) {
    return spots.filter(spot => (spot.available || 0) >= minAvailable);
  }

  static calculateStats(spots) {
    if (!spots.length) return null;

    const stats = {
      total: spots.length,
      free: spots.filter(s => s.isFree).length,
      available: spots.reduce((sum, s) => sum + (s.available || 0), 0),
      averageDistance: Math.round(
        spots.reduce((sum, s) => sum + (s.distance || 0), 0) / spots.length
      ),
      averageWalkTime: Math.round(
        spots.reduce((sum, s) => sum + (s.walkingTime || 0), 0) / spots.length
      ),
      byType: this.groupByType(spots),
    };

    return stats;
  }

  static getBestOption(spots, preferences = {}) {
    const { maxDistance = 500, preferFree = false, minSpots = 1 } = preferences;

    let filtered = spots.filter(
      s => (s.distance || 0) <= maxDistance && (s.available || 0) >= minSpots
    );

    if (preferFree) {
      const free = filtered.filter(s => s.isFree);
      if (free.length > 0) filtered = free;
    }

    return this.sortByDistance(filtered)[0] || null;
  }
}
