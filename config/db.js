const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MongoURL);
  console.log("Connected to DB");
};

module.exports = {
  connectDB,
};
