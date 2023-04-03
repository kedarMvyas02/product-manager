const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const AppError = require("../middlewares/appError");

const like = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const product = await Product.findOne({ name });
  if (!product) {
    return next(new AppError("Product does not exists", 403));
  }

  if (await product.isLiked.includes(req.user.id)) {
    return next(new AppError("You have already liked the product", 400));
  }

  await product.updateOne({
    $push: {
      isLiked: req.user.id,
    },
  });

  if (await product.isDisliked.includes(req.user.id)) {
    await product.updateOne({
      $pull: {
        isDisliked: req.user.id,
      },
    });
  }

  const created = await product.save();
  if (created) {
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

  if (await product.isDisliked.includes(req.user.id)) {
    return next(new AppError("You have already disliked the product", 400));
  }

  await product.updateOne({
    $push: {
      isDisliked: req.user.id,
    },
  });

  if (await product.isLiked.includes(req.user.id)) {
    await product.updateOne({
      $pull: {
        isLiked: req.user.id,
      },
    });
  }

  const created = await product.save();
  if (created) {
    res.json({
      msg: "U have successfully dislike the product",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = { like, disLike };
