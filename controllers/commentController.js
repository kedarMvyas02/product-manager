const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const AppError = require("../middlewares/appError");
const Comment = require("../models/commentModel");

const comment = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const product = await Product.findOne({ name });
  if (!product) {
    return next(new AppError("Product does not exists", 403));
  }

  const addComment = await new Comment({
    user_id: req.user.id,
    product_id: product.id,
    comment: req.body.comment,
  });

  const created = await addComment.save();

  if (created) {
    res.json({
      msg: "Comment Added Successfully",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = comment;
