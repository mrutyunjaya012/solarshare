import Listing from "../models/Listing.js";
import { rankListings } from "../services/matchingEngine.js";

// @route POST /api/match
export const matchListings = async (req, res, next) => {
  try {
    const kwh = Number(req.body.kwh) || 0;
    const lat = req.body.lat != null ? Number(req.body.lat) : null;
    const lng = req.body.lng != null ? Number(req.body.lng) : null;
    const city = req.body.city?.trim();

    const filter = { status: "active" };
    if (kwh > 0) filter.availableKwh = { $gte: kwh };
    if (city) filter["location.city"] = city;

    const listings = await Listing.find(filter)
      .populate("seller", "name address.city")
      .lean();

    const buyerLocation =
      lat != null && lng != null
        ? { lat, lng }
        : city
          ? { lat: null, lng: null, city }
          : req.user?.address?.city
            ? { lat: null, lng: null, city: req.user.address.city }
            : null;

    const ranked = rankListings(listings, buyerLocation);
    res.json({
      requestedKwh: kwh || null,
      matches: ranked.slice(0, 20),
    });
  } catch (err) {
    next(err);
  }
};
