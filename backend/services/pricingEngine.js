import Transaction from "../models/Transaction.js";
import Listing from "../models/Listing.js";

const DEFAULT_MIN = 3;
const DEFAULT_MAX = 12;
const DEFAULT_SUGGEST = 6.5;

/**
 * Suggest a ₹/kWh price from recent completed trades and active listings,
 * bounded by min/max so the marketplace stays realistic.
 */
export const suggestPrice = async ({ city } = {}) => {
  const listingFilter = { status: "active" };
  if (city) listingFilter["location.city"] = city;

  const [listingAgg, tradeAgg] = await Promise.all([
    Listing.aggregate([
      { $match: listingFilter },
      {
        $group: {
          _id: null,
          avg: { $avg: "$pricePerKwh" },
          min: { $min: "$pricePerKwh" },
          max: { $max: "$pricePerKwh" },
          count: { $sum: 1 },
        },
      },
    ]),
    Transaction.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$pricePerKwh" },
          volumeKwh: { $sum: "$kwh" },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const listing = listingAgg[0];
  const trades = tradeAgg[0];
  const raw =
    trades?.avg != null && listing?.avg != null
      ? trades.avg * 0.6 + listing.avg * 0.4
      : trades?.avg ?? listing?.avg ?? DEFAULT_SUGGEST;

  const suggested = Math.min(DEFAULT_MAX, Math.max(DEFAULT_MIN, Number(raw.toFixed(2))));

  return {
    suggestedPricePerKwh: suggested,
    bounds: { min: DEFAULT_MIN, max: DEFAULT_MAX },
    market: {
      activeListings: listing?.count || 0,
      avgListingPrice: listing?.avg ? Number(listing.avg.toFixed(2)) : null,
      avgTradePrice: trades?.avg ? Number(trades.avg.toFixed(2)) : null,
      recentVolumeKwh: trades?.volumeKwh ? Number(trades.volumeKwh.toFixed(2)) : 0,
      recentTradeCount: trades?.count || 0,
    },
  };
};

export const getMarketSnapshot = async () => {
  const [byCity, overall] = await Promise.all([
    Listing.aggregate([
      { $match: { status: "active", "location.city": { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$location.city",
          avgPrice: { $avg: "$pricePerKwh" },
          minPrice: { $min: "$pricePerKwh" },
          maxPrice: { $max: "$pricePerKwh" },
          listings: { $sum: 1 },
          availableKwh: { $sum: "$availableKwh" },
        },
      },
      { $sort: { listings: -1 } },
      { $limit: 20 },
    ]),
    suggestPrice(),
  ]);

  return {
    overall: overall.market,
    suggestedPricePerKwh: overall.suggestedPricePerKwh,
    byCity: byCity.map((c) => ({
      city: c._id,
      avgPrice: Number(c.avgPrice.toFixed(2)),
      minPrice: Number(c.minPrice.toFixed(2)),
      maxPrice: Number(c.maxPrice.toFixed(2)),
      listings: c.listings,
      availableKwh: Number(c.availableKwh.toFixed(2)),
    })),
  };
};
