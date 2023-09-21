const { Router } = require("express");
const { FlightModel } = require("../models/flight.model");
const flightRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Flight
 *   description: Flight-related endpoints
 */

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Get a list of all flights
 *     tags: [Flight]
 *     responses:
 *       200:
 *         description: A list of flight data
 *       500:
 *         description: Internal server error
 */
flightRouter.get("/", async (req, res) => {
  try {
    const flights = await FlightModel.find();
    res.status(200).json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/flights:
 *   post:
 *     summary: Add a new flight
 *     tags: [Flight]
 *     requestBody:
 *       description: Flight data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               airline:
 *                 type: string
 *               flightNo:
 *                 type: string
 *               departure:
 *                 type: string
 *               arrival:
 *                 type: string
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *               arrivalTime:
 *                 type: string
 *                 format: date-time
 *               seats:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Flight added successfully
 *       500:
 *         description: Internal server error
 */
flightRouter.post("/", async (req, res) => {
  try {
    const {
      airline,
      flightNo,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      seats,
      price,
    } = req.body;

    // Create a new flight document
    const newFlight = new FlightModel({
      airline,
      flightNo,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      seats,
      price,
    });

    // Save the new flight to the database
    await newFlight.save();
    res.status(201).json({ message: "Flight added", flight: newFlight });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/flights/{id}:
 *   get:
 *     summary: Get details of a specific flight by ID
 *     tags: [Flight]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Flight ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight data
 *       404:
 *         description: Flight not found
 *       500:
 *         description: Internal server error
 */
flightRouter.get("/:id", async (req, res) => {
  try {
    const flightId = req.params.id;
    const flight = await FlightModel.findById(flightId);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.status(200).json({ "Flight Data": flight });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/flights/{id}:
 *   patch:
 *     summary: Update details of a specific flight by ID
 *     tags: [Flight]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Flight ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated flight data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               airline:
 *                 type: string
 *               flightNo:
 *                 type: string
 *               departure:
 *                 type: string
 *               arrival:
 *                 type: string
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *               arrivalTime:
 *                 type: string
 *                 format: date-time
 *               seats:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated flight data
 *       404:
 *         description: Flight not found
 *       500:
 *         description: Internal server error
 */
flightRouter.patch("/:id", async (req, res) => {
  try {
    const flightId = req.params.id;
    const updatedFlightData = req.body;

    const updatedFlight = await FlightModel.findByIdAndUpdate(
      flightId,
      updatedFlightData,
      { new: true }
    );

    if (!updatedFlight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.status(200).json(updatedFlight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/flights/{id}:
 *   delete:
 *     summary: Delete a specific flight by ID
 *     tags: [Flight]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Flight ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight Deleted
 *       500:
 *         description: Internal server error
 */
flightRouter.delete("/:id", async (req, res) => {
  try {
    const flightId = req.params.id;
    await FlightModel.findByIdAndDelete(flightId);

    res.status(200).json({ message: "Flight Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  flightRouter,
};
