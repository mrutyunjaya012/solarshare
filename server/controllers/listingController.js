import Listing from "../models/Listing.js";

// @route POST /api/listings   (prosumer)
export const createListing = async (req, res) => {
  try {
    const { availableKwh, pricePerKwh, availableUntil, location } = req.body;
    const kwh = Number(availableKwh);
    const price = Number(pricePerKwh);
    if (!Number.isFinite(kwh) || kwh <= 0 || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ message: "Available energy and price must be positive numbers" });
    }
    if (availableUntil && new Date(availableUntil) <= new Date()) {
      return res.status(400).json({ message: "Listing expiry must be in the future" });
    }
    const listing = await Listing.create({
      seller: req.user._id,
      availableKwh: kwh,
      pricePerKwh: price,
      availableUntil,
      location,
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: "Could not create listing", error: err.message });
  }
};

// @route GET /api/listings   (marketplace browse - supports ?minPrice&maxPrice&city&sort)
export const getListings = async (req, res) => {
  try {
    const { minPrice, maxPrice, city, sort } = req.query;
    const filter = { status: "active" };
    if (minPrice || maxPrice) {
      filter.pricePerKwh = {};
      if (minPrice) filter.pricePerKwh.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerKwh.$lte = Number(maxPrice);
    }
    if (city) filter["location.city"] = city;

    let query = Listing.find(filter).populate("seller", "name address.city");
    if (sort === "price_asc") query = query.sort({ pricePerKwh: 1 });
    if (sort === "price_desc") query = query.sort({ pricePerKwh: -1 });
    if (sort === "newest") query = query.sort({ createdAt: -1 });

    const listings = await query;
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch listings", error: err.message });
  }
};

// @route GET /api/listings/mine   (prosumer's own listings)
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch your listings", error: err.message });
  }
};
