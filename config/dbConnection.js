const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const dbConnection = asyncHandler(async () => {
  const connect = await mongoose.connect(process.env.DB_CONNECT);
  console.log(
    "Database Connected: ",
    connect.connection.host,
    connect.connection.name
  );
});

module.exports = dbConnection;
