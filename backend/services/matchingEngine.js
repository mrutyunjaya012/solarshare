// Scores active listings for a given buyer request and returns them ranked
// best-to-worst. Not "AI" — a transparent weighted-sum score, which is easier
// to defend in a viva than a black box and is a legitimate design choice for
// a real marketplace too.

const WEIGHTS = { price: 0.5, distance: 0.3, rating: 0.2 };

const haversineKm = (a, b) => {
  if (!a || !b || a.lat == null || b.lat == null) return 0;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const normalize = (value, min, max, invert = false) => {
  if (max === min) return 1;
  const n = (value - min) / (max - min);
  return invert ? 1 - n : n;
};

export const rankListings = (listings, buyerLocation) => {
  if (!listings.length) return [];

  const distances = listings.map((l) => haversineKm(buyerLocation, l.location));
  const prices = listings.map((l) => l.pricePerKwh);
  const ratings = listings.map((l) => l.seller?.rating || 3);

  return listings
    .map((listing, i) => {
      const priceScore = normalize(prices[i], Math.min(...prices), Math.max(...prices), true);
      const distanceScore = normalize(distances[i], Math.min(...distances), Math.max(...distances), true);
      const ratingScore = normalize(ratings[i], 1, 5);

      const matchScore =
        WEIGHTS.price * priceScore + WEIGHTS.distance * distanceScore + WEIGHTS.rating * ratingScore;

      return {
        listing,
        distanceKm: Number(distances[i].toFixed(2)),
        matchScore: Number((matchScore * 100).toFixed(1)), // as a 0-100 "match %"
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};
