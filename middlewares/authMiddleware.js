// this middleware is to validate that all the details are acceptable valid or not

const AppError = require("../middlewares/appError");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const auth = asyncHandler(async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  const missingValues = [];

  if (!username) missingValues.push("Username ");
  if (!email) missingValues.push("Email ");
  if (!password) missingValues.push("password ");
  if (!passwordConfirm) missingValues.push("passwordConfirm ");

  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values :${missingValues} is neccessary to be filled`,
        400
      )
    );
  }

  if (password !== passwordConfirm) {
    return next(
      new AppError("Password and Password confirm are not the same", 405)
    );
  }

  if (password.length <= 5 || password.length >= 20) {
    return next(new AppError("Password is very short", 405));
  }

  if (
    !password.match(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  ) {
    return next(
      new AppError("Password is soo weak, please pick a strong password", 405)
    );
  }

  const userEmail = await User.findOne({ email });

  if (userEmail) {
    return next(new AppError("Email is Already Registered", 405));
  }

  if (
    !email.match(
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    )
  ) {
    return next(new AppError("Email address is not valid", 400));
  }
  next();
});

module.exports = auth;
