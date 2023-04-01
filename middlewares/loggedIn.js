// this middleware is to validate that if user pressing login again even though
// he is already logged in, (just for showing a simple message) xD

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const AppError = require("../middlewares/appError");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");

const loggedIn = asyncHandler(async (req, res, next) => {
  const missingValues = [];
  const { email, password } = req.body;

  if (!email) missingValues.push("Email ");
  if (!password) missingValues.push("password ");
  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values :${missingValues} is neccessary to be filled`,
        400
      )
    );
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return next();
  } else {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      asyncHandler(async (err, decoded) => {
        if (err) {
          return next();
        }
        const id = new mongoose.Types.ObjectId(decoded.id);
        const userExists = await User.findOne(id);
        if (userExists.email === req.body.email) {
          req.flag = true;
          next();
        }
      })
    );
  }
});

module.exports = loggedIn;
