const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ProductType = require("../models/productType");
const AppError = require("../middlewares/appError");

const createProduct = asyncHandler(async (req, res, next) => {
  const { name, size, color, photo, productType } = req.body;

  const productTypeCheck = await ProductType.findOne({ name: productType });
  if (!productTypeCheck) {
    return next(new AppError("This product type does not exists", 403));
  }

  const created = await Product.create({
    name,
    size,
    color,
    photo,
    productType: productTypeCheck._id,
    user_id: req.user.id,
  });

  if (created) {
    res.json({
      msg: "Product successfully created!",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = createProduct;
