import { suggestPrice, getMarketSnapshot } from "../services/pricingEngine.js";

// @route GET /api/pricing/suggest?city=
export const getSuggestedPrice = async (req, res, next) => {
  try {
    const data = await suggestPrice({ city: req.query.city?.trim() });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/pricing/market
export const getMarketPricing = async (req, res, next) => {
  try {
    const data = await getMarketSnapshot();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
