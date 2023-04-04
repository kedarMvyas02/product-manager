const asyncHandler = require("express-async-handler");
const AppError = require("../middlewares/appError");
const Like = require("../models/likeModel");
const Dislike = require("../models/dislikeModel");
const User = require("../models/userModel");

const mostLikedProduct = asyncHandler(async (req, res, next) => {
  const kedar = await Like.aggregate([
    {
      $group: {
        _id: "$product_id",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 1,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: "$product._id",
        total_likes: "$count",
        name: "$product.name",
        size: "$product.size",
        color: "$product.color",
        photo: "$product.photo",
      },
    },
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
  const kedar = await Dislike.aggregate([
    {
      $group: {
        _id: "$product_id",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 1,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: "$product._id",
        total_dislikes: "$count",
        name: "$product.name",
        size: "$product.size",
        color: "$product.color",
        photo: "$product.photo",
      },
    },
  ]).exec();

  if (kedar) {
    res.json({
      output: kedar,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const getMostFollowers = asyncHandler(async (req, res, next) => {
  const mostFollowed = await User.aggregate([
    // Match products that have at least one followers
    { $match: { followers: { $exists: true, $ne: [] } } },
    // Group products by their _id and count the number of likes
    {
      $group: {
        _id: "$_id",
        totalFollowers: { $sum: { $size: "$followers" } },
        name: { $first: "$username" },
        email: { $first: "$email" },
      },
    },
    // Sort the products in descending order by their totalFollowers
    { $sort: { totalFollowers: -1 } },
    // Limit the results to the topmost product
    { $limit: 1 },
  ]).exec();

  if (mostFollowed) {
    return res.json({
      mostFollowed,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = { mostLikedProduct, mostDislikedProduct, getMostFollowers };

/*
 await Like.aggregate([
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
 */
