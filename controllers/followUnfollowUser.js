const asyncHandler = require("express-async-handler");
const AppError = require("../middlewares/appError");
const User = require("../models/userModel");

const followUser = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const user = await User.findOne({ name });
  if (!user) {
    return next(new AppError("User not found", 400));
  }
  if (user.followers.includes(req.user.id)) {
    return res.json({
      msg: "You have already followed the user",
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

const unFollowUser = asyncHandler(async (req, res, next) => {});

module.exports = followUser;
