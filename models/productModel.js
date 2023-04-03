const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    productType: {
      type: mongoose.Schema.ObjectId,
      ref: "ProductTypee",
      required: true,
    },
    isLiked: {
      type: Array,
      default: [],
    },
    isDisliked: {
      type: Array,
      default: [],
    },
    comment: [
      {
        commentByUser: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Product", productSchema);
