const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight" },
  },
  {
    versionKey: false,
  }
);

const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = {
  BookingModel,
};
