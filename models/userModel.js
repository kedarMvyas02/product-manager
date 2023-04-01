const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: false,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the email"],
    },
    password: {
      type: String,
      required: [true, "Please fill the password field"],
    },
    passwordResetToken: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

module.exports = new mongoose.model("User", userSchema);
