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

// @route GET /api/listings/stats/mine
export const getMyListingStats = async (req, res, next) => {
  try {
    const stats = await Listing.aggregate([
      { $match: { seller: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalKwh: { $sum: "$availableKwh" },
        },
      },
    ]);
    res.json({
      byStatus: Object.fromEntries(stats.map((s) => [s._id, { count: s.count, totalKwh: s.totalKwh }])),
      totalListings: stats.reduce((n, s) => n + s.count, 0),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/listings/:id
export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "seller",
      "name email address.city solarPanel.capacityKw isVerified"
    );
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/listings/:id
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (String(listing.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }
    if (!["active"].includes(listing.status)) {
      return res.status(400).json({ message: "Only active listings can be updated" });
    }

    const { availableKwh, pricePerKwh, availableUntil, location } = req.body;
    if (availableKwh !== undefined) {
      const kwh = Number(availableKwh);
      if (!Number.isFinite(kwh) || kwh <= 0) {
        return res.status(400).json({ message: "availableKwh must be a positive number" });
      }
      listing.availableKwh = kwh;
    }
    if (pricePerKwh !== undefined) {
      const price = Number(pricePerKwh);
      if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({ message: "pricePerKwh must be a positive number" });
      }
      listing.pricePerKwh = price;
    }
    if (availableUntil !== undefined) listing.availableUntil = availableUntil;
    if (location !== undefined) {
      listing.location = { ...(listing.location?.toObject?.() || listing.location || {}), ...location };
    }

    await listing.save();
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/listings/:id/cancel
export const cancelListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (String(listing.seller) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to cancel this listing" });
    }
    if (listing.status !== "active") {
      return res.status(400).json({ message: "Only active listings can be cancelled" });
    }
    listing.status = "cancelled";
    await listing.save();
    res.json({ message: "Listing cancelled", listing });
  } catch (err) {
    next(err);
  }
};
