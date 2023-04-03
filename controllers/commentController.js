const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const AppError = require("../middlewares/appError");

const comment = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const product = await Product.findOne({ name });
  if (!product) {
    return next(new AppError("Product does not exists", 403));
  }

  await product.comment.push({
    commentByUser: req.body.comment,
  });
  const created = await product.save();

  if (created) {
    res.json({
      msg: "Comment Added Successfully",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = comment;
