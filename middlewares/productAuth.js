// this middleware is to validate that all the details are acceptable valid or not for creating products

const AppError = require("./appError");
const asyncHandler = require("express-async-handler");

const productAuth = asyncHandler(async (req, res, next) => {
  const { name, size, color, photo, productType } = req.body;

  const missingValues = [];

  if (!name) missingValues.push("name ");
  if (!size) missingValues.push("size ");
  if (!color) missingValues.push("color ");
  if (!photo) missingValues.push("photo ");
  if (!productType) missingValues.push("productType ");

  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values :${missingValues} is neccessary to be filled`,
        400
      )
    );
  }

  next();
});

module.exports = productAuth;
