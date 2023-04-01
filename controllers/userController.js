const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const AppError = require("../middlewares/appError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middlewares/nodemailer");

////////////////////////////////////////////////////////////////

const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
const hashToken = (token) => {
  const sha256 = crypto.createHash("sha256");
  sha256.update(token);
  return sha256.digest("hex");
};

///////////////////////////////////////////////////////////////////////////////////////////////////
const JWTtokenGenerator = (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return accessToken;
};
///////////////////////////////////////////////////////////////////////////////////////////////////

const signUp = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    const accessToken = await JWTtokenGenerator(user);
    res.status(201).json({
      msg: "User created Successfully :)",
      accessToken,
    });
  } else {
    return next(new AppError("Something went wrong"), 500);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////

const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const authHeader = req.headers.authorization || req.headers.Authorization;

  const user = await User.findOne({ email });
  if (user) {
    if (user.password === password) {
      if (req.flag) {
        const token = authHeader.split(" ")[1];
        res.json({
          msg: "You are already logged in",
          accessToken: token,
        });
      } else {
        const accessToken = await JWTtokenGenerator(user);
        res.json({
          msg: "You have successfully logged in",
          accessToken,
        });
      }
    }
  } else {
    return next(new AppError("User is not registered yet", 400));
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////
const deleteUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (user.password === password) {
      await User.deleteOne(user);
      res.json({
        msg: "User Successfully Deleted",
      });
    }
  } else {
    return next(new AppError("User not found", 500));
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (user.password === password) {
      const resetToken = generateToken();
      const tokenDB = hashToken(resetToken);
      await user.updateOne({
        passwordResetToken: tokenDB,
      });

      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/users/resetpassword/${resetToken}`;

      const message = `Hey ${user.username}, \n Forgot your password? Don't Worry :) \n Submit a PATCH request with your new password to: ${resetURL} \n If you didn't forget your password, please ignore this email ! `;

      try {
        await sendEmail({
          email: user.email,
          subject: "Your password token is valid only for 10 mins!",
          message,
        });

        res.status(200).json({
          status: "success",
          message: "Token sent to email!",
          token: resetToken,
        });
      } catch (err) {
        user.passwordResetToken = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError({ err }, 500));
      }
    }
  } else {
    return next(new AppError("User not found", 400));
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////
const resetpassword = asyncHandler(async (req, res, next) => {});
///////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  signUp,
  signIn,
  deleteUser,
  forgotPassword,
  resetpassword,
};
