// this middleware is only for checking if username and password are present or not

const common = (req, res, next) => {
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
  next();
};

module.exports = common;
