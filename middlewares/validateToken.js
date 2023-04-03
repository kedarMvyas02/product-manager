const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const AppError = require("./appError");
const User = require("../models/userModel");
const mongoose = require("mongoose");

const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader && !authHeader.startsWith("Bearer")) {
    return next(new AppError("Token is invalid", 403));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return next(new AppError("You are not Authorized", 401));
      }
      const id = new mongoose.Types.ObjectId(decoded.id);
      const userExists = await User.findOne(id);
      if (userExists) {
        req.user = userExists;
        next();
      } else {
        return next(new AppError("Please Login"), 401);
      }
    })
  );
});

module.exports = validateToken;
