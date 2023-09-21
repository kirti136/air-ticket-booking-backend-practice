const { Router } = require("express");
const { UserModel } = require("../models/user.model");
const { FlightModel } = require("../models/flight.model");
const { BookingModel } = require("../models/booking.model");
const bookingRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking-related endpoints
 */

/**
 * @swagger
 * /api/booking/dashboard:
 *   get:
 *     summary: Get a list of all bookings with user and flight details
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: A list of booking data with user and flight details
 *       500:
 *         description: Internal server error
 */
bookingRouter.get("/dashboard", async (req, res) => {
  try {
    // Fetch all booking records
    const bookings = await BookingModel.find();

    // Populate user and flight details for each booking
    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const populatedBooking = booking.toObject();
        populatedBooking.user = await UserModel.findById(booking.user);
        populatedBooking.flight = await FlightModel.findById(booking.flight);
        return populatedBooking;
      })
    );

    res.status(200).json(populatedBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Book a flight
 *     tags: [Booking]
 *     requestBody:
 *       description: Booking data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               flight:
 *                 type: string
 *     responses:
 *       201:
 *         description: Flight booked successfully
 *       404:
 *         description: User or flight not found
 *       500:
 *         description: Internal server error
 */
bookingRouter.post("/", async (req, res) => {
  try {
    const { user, flight } = req.body;

    // Check if the user and flight exist
    const u = await UserModel.findById(user);
    const f = await FlightModel.findById(flight);

    if (!u) {
      return res.status(404).json({ message: "User  not found" });
    }

    if (!f) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Create a booking record
    const newBooking = new BookingModel({ user: user, flight: flight });
    await newBooking.save();

    res.status(201).json({ message: "Flight booked", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/booking/dashboard/{id}:
 *   patch:
 *     summary: Update a booking by ID
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Booking ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated booking data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               flight:
 *                 type: string
 *     responses:
 *       204:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
bookingRouter.patch("/dashboard/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updatedBookingData = req.body;

    // Find the booking by its ID
    const booking = await BookingModel.findById(bookingId);

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the booking with new data
    Object.assign(booking, updatedBookingData);
    await booking.save();

    res.status(204).send(); // Send a 204 No Content response for success
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/booking/{id}:
 *   delete:
 *     summary: Delete a booking by ID
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Booking ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
bookingRouter.delete("/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Find the booking by its ID and delete it
    const booking = await BookingModel.findByIdAndDelete(bookingId);

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(202).json({ message: "Booking deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  bookingRouter,
};
