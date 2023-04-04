const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const AppError = require("../middlewares/appError");
const Like = require("../models/likeModel");
const Dislike = require("../models/dislikeModel");

const like = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const product = await Product.findOne({ name });
  if (!product) {
    return next(new AppError("Product does not exists", 403));
  }

  await Dislike.findOneAndDelete({
    user_id: req.user.id,
    product_id: product.id,
  });

  const existingLike = await Like.findOne({
    user_id: req.user.id,
    product_id: product.id,
  });
  if (existingLike) {
    return res.status(400).json({
      msg: "You have already liked the product",
    });
  }

  const addLike = new Like({ user_id: req.user.id, product_id: product.id });
  await addLike.save();

  if (addLike) {
    res.json({
      msg: "U have successfully like the product",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const disLike = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const product = await Product.findOne({ name });
  if (!product) {
    return next(new AppError("Product does not exists", 403));
  }

  await Like.findOneAndDelete({
    user_id: req.user.id,
    product_id: product.id,
  });

  const existingDislike = await Dislike.findOne({
    user_id: req.user.id,
    product_id: product.id,
  });
  if (existingDislike) {
    return res
      .status(400)
      .json({ message: "Product already disliked by this user" });
  }

  const addDislike = new Dislike({
    user_id: req.user.id,
    product_id: product.id,
  });
  await addDislike.save();

  if (addDislike) {
    res.json({
      msg: "U have successfully dislike the product",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = { like, disLike };
