const asyncHandler = require("express-async-handler");
const AppError = require("../middlewares/appError");
const User = require("../models/userModel");

const followUser = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const user = await User.findOne({ username: name });
  if (!user) {
    return next(new AppError("User not found", 400));
  }
  if (req.user.username === name) {
    return next(new AppError("You cannot follow yourself lmaoo", 400));
  }
  if (user.followers.includes(req.user.id)) {
    return res.json({
      msg: "Noob You are already following the user",
    });
  }

  await user.updateOne({
    $push: {
      followers: req.user.id,
    },
  });
  const created = await user.save();
  if (created) {
    return res.json({
      msg: "You have successfully followed the user",
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const unFollowUser = asyncHandler(async (req, res, next) => {
  const name = req.body.name;

  const user = await User.findOne({ username: name });
  if (!user) {
    return next(new AppError("User not found sorry", 404));
  }
  if (user.followers.includes(req.user.id)) {
    await user.updateOne({
      $pull: {
        followers: req.user.id,
      },
    });
    const created = await user.save();
    if (!created) {
      return next(new AppError("Something went wrong", 500));
    } else {
      return res.json({
        msg: "You have successfully unfollowed the user",
      });
    }
  } else {
    return next(new AppError("You are not following the user", 400));
  }
});

const mostFollowers = asyncHandler(async (req, res, next) => {
  const kedar = await User.aggregate([
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

  if (kedar) {
    res.json({
      output: kedar,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

module.exports = { followUser, unFollowUser, mostFollowers };
