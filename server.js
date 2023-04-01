const express = require("express");
require("dotenv").config();
const dbConnection = require("./config/dbConnection");
const AppError = require("./middlewares/appError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
dbConnection();

app.use("/api/users", userRoutes);

app.all("*", (req, res, next) => {
  return next(new AppError("This route is not defined in this app"));
});

app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`You are live on port: ${process.env.PORT}`);
});
