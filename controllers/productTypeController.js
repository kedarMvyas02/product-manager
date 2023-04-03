const asyncHandler = require("express-async-handler");
const ProductType = require("../models/productType");
const AppError = require("../middlewares/appError");

const createProductType = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const productType = ProductType.create({
    name,
    user_id: req.user.id,
  });
  if (productType) {
    res.json({
      msg: "Product type successfully created!",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = createProductType;
