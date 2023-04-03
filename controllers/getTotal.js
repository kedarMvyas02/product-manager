const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const AppError = require("../middlewares/appError");

const mostLikedProduct = asyncHandler(async (req, res, next) => {
  const kedar = await Product.aggregate([
    // Match products that have at least one like
    { $match: { isLiked: { $exists: true, $ne: [] } } },

    // Group products by their _id and count the number of likes
    {
      $group: {
        _id: "$_id",
        totalLikes: { $sum: { $size: "$isLiked" } },
        name: { $first: "$name" },
        size: { $first: "$size" },
        color: { $first: "$color" },
        photo: { $first: "$photo" },
        productType: { $first: "$productType" },
      },
    },

    // Sort the products in descending order by their totalLikes
    { $sort: { totalLikes: -1 } },

    // Limit the results to the topmost product
    { $limit: 1 },
  ]).exec();

  if (kedar) {
    res.json({
      output: kedar,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const mostDislikedProduct = asyncHandler(async (req, res, next) => {
  const kedar = await Product.aggregate([
    // Match products that have at least one like
    { $match: { isDisliked: { $exists: true, $ne: [] } } },

    // Group products by their _id and count the number of likes
    {
      $group: {
        _id: "$_id",
        totalDislikes: { $sum: { $size: "$isDisliked" } },
        name: { $first: "$name" },
        size: { $first: "$size" },
        color: { $first: "$color" },
        photo: { $first: "$photo" },
        productType: { $first: "$productType" },
      },
    },

    // Sort the products in descending order by their totalLikes
    { $sort: { totalDislikes: -1 } },

    // Limit the results to the topmost product
    { $limit: 1 },
  ]).exec();

  if (kedar) {
    res.json({
      output: kedar,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = { mostLikedProduct, mostDislikedProduct };

/**{
      $addFields: {
        likesCount: { $size: "$isLiked" },
      },
    },
    {
      $sort: { likesCount: -1 },
    },
    {
      $limit: 1,
    },
     */
