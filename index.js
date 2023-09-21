require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { connectDB } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { flightRouter } = require("./routes/flight.route");
const { bookingRouter } = require("./routes/booking.route");

const app = express();

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Air Ticket Booking API",
      version: "1.0.0",
      description: "API for Air Ticket Booking System",
    },
    servers: [
      {
        url: "http://localhost:8080/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

// Swagger specification
const swaggerSpec = swaggerJsdoc(options);

app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/flight", flightRouter);
app.use("/api/booking", bookingRouter);
app.use("/documentations", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(201).json({ message: "Welcome to Air Ticket Booking" });
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server listening on port ${process.env.PORT}`);
});
