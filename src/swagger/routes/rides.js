"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const rideRouter = express.Router();
rideRouter.use(bodyParser.json()); // to use body object in requests

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       required:
 *         - startLat
 *         - startLong
 *         - endLat
 *         - endLong
 *         - riderName
 *         - driverName
 *         - driverVehicle
 *       properties:
 *         rideID:
 *           type: integer
 *           description: The Auto-generated id of a ride
 *         startLat:
 *           type: decimal
 *           description: Latitude of the starting position of the ride
 *         startLong:
 *           type: decimal
 *           description: Longitude of the starting position of the ride
 *         endLat:
 *           type: decimal
 *           description: Latitude of the ending position of the ride
 *         endLong:
 *           type: decimal
 *           description: Longitude of the ending position of the ride
 *         riderName:
 *           type: string
 *           description: Name of the rider
 *         driverName:
 *           type: string
 *           description: Name of the driver
 *         driverVehicle:
 *           type: string
 *           description: The vehicle used for the ride
 *         created:
 *           type: datetime
 *           description: The timestamp when the ride was created in the database
 *         updated:
 *           type: datetime
 *           description: The timestamp when the ride was last updated in the database
 *       example:
 *         rideID: 1
 *         startLat: 35.147567
 *         startLong: 33.345850
 *         endLat: 35.147519
 *         endLong: 33.345936
 *         riderName: John Doe
 *         driverName: John Wick
 *         driverVehicle: Ford Mustang
 *         created: "2022-02-05T17:28:29.387Z"
 *         updated: "2022-02-05T17:28:29.387Z"
 *     RideBody:
 *       type: object
 *       required:
 *         - startLat
 *         - startLong
 *         - endLat
 *         - endLong
 *         - riderName
 *         - driverName
 *         - driverVehicle
 *       properties:
 *         startLat:
 *           type: decimal
 *           description: Latitude of the starting position of the ride
 *         startLong:
 *           type: decimal
 *           description: Longitude of the starting position of the ride
 *         endLat:
 *           type: decimal
 *           description: Latitude of the ending position of the ride
 *         endLong:
 *           type: decimal
 *           description: Longitude of the ending position of the ride
 *         riderName:
 *           type: string
 *           description: Name of the rider
 *         driverName:
 *           type: string
 *           description: Name of the driver
 *         driverVehicle:
 *           type: string
 *           description: The vehicle used for the ride
 *       example:
 *         startLat: 14.521997999
 *         startLong: -75.817663343
 *         endLat: 14.521997912
 *         endLong: -75.817663396
 *         riderName: Hector Barbossa
 *         driverName: Jack Sparrow
 *         driverVehicle: Black Pearl
 *     Page:
 *       type: object
 *       required:
 *         - page
 *         - limit
 *       properties:
 *         page:
 *           type: integer
 *           description: The page number
 *         limit:
 *           type: integer
 *           description: Maximum number of items in a page
 *       example:
 *         page: 2
 *         limit: 3
 *     RidesPage:
 *       type: object
 *       properties:
 *         nextPage:
 *           $ref: '#/components/schemas/Page'
 *         prevPage:
 *           $ref: '#/components/schemas/Page'
 *         rides:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ride'
 *       required:
 *         - rides
 *       example:
 *         nextPage:
 *           page: 3
 *           limit: 2
 *         prevPage:
 *           page: 1
 *           limit: 2
 *         rides:
 *           - rideID: 3
 *             startLat: 35.14757
 *             startLong: 33.345856
 *             endLat: 35.147595
 *             endLong: 33.345943
 *             riderName: Patric
 *             driverName: Sponge Bob
 *             driverVehicle: Burger Car
 *             created: 2022-02-05T17:31:09.943Z
 *             updated: 2022-02-05T17:31:09.943Z
 *           - rideID: 4
 *             startLat: 35.147567
 *             startLong: 33.34585
 *             endLat: 35.147519
 *             endLong: 33.345936
 *             riderName: John Cena
 *             driverName: Undertaker
 *             driverVehicle: Funeral Chopper
 *             created: 2022-02-05T19:28:29.676Z
 *             updated: 2022-02-05T19:28:29.676Z
 *
 */

/**
 * @swagger
 *  tags:
 *    - name: Health
 *      description: The server health status API
 *    - name: Rides
 *      description: The rides managing API
 */

/**
 * @swagger
 * /rides/health:
 *   get:
 *     summary: Returns health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: The server with the APIs is healthy
 */

rideRouter.get("/health", async (req, res) => res.send("Healthy"));

/**
 * @swagger
 * /rides:
 *   post:
 *     summary: Create a new ride
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RideBody'
 *     responses:
 *       200:
 *         description: The ride was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ride'
 *       500:
 *         description: Internal server error
 */

rideRouter.post("/", async (req, res) => {
  try {
    const startLatitude = Number(req.body.startLat);
    const startLongitude = Number(req.body.startLong);
    const endLatitude = Number(req.body.endLat);
    const endLongitude = Number(req.body.endLong);
    const riderName = req.body.riderName;
    const driverName = req.body.driverName;
    const driverVehicle = req.body.driverVehicle;

    if (
      isNaN(startLatitude) ||
      isNaN(startLongitude) ||
      isNaN(endLatitude) ||
      isNaN(endLongitude)
    ) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Latitudes and longitudes must be numbers",
      });
    }

    if (
      startLatitude < -90 ||
      startLatitude > 90 ||
      startLongitude < -180 ||
      startLongitude > 180
    ) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message:
          "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      });
    }

    if (
      endLatitude < -90 ||
      endLatitude > 90 ||
      endLongitude < -180 ||
      endLongitude > 180
    ) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message:
          "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      });
    }

    if (typeof riderName !== "string" || riderName.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Rider name must be a non empty string",
      });
    }

    if (typeof driverName !== "string" || driverName.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Driver name must be a non empty string",
      });
    }

    if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Driver vehicle must be a non empty string",
      });
    }

    const currentCount = Number(req.app.db.get("autoIncrement"));
    const timestamp = new Date();

    const ride = {
      rideID: currentCount,
      startLat: startLatitude,
      startLong: startLongitude,
      endLat: endLatitude,
      endLong: endLongitude,
      riderName: riderName,
      driverName: driverName,
      driverVehicle: driverVehicle,
      created: timestamp,
      updated: timestamp,
    };

    req.app.db.get("rides").push(ride).write();

    // Increment count
    req.app.db.assign({ autoIncrement: currentCount + 1 }).write();

    res.send(ride);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// /**
//  * @swagger
//  * /rides:
//  *   get:
//  *     summary: Returns the list of all the rides
//  *     tags: [Rides]
//  *     responses:
//  *       200:
//  *         description: The list of the rides
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Ride'
//  */

// rideRouter.get("/", async (req, res) => {
//   const rides = req.app.db.get("rides");

//   res.send(rides);
// });

/**
 * @swagger
 * /rides:
 *   get:
 *     summary: Returns a page of rides based on the limit
 *     tags: [Rides]
 *     parameters:
 *       - in : query
 *         name: page
 *         description: The number of the page
 *         schema:
 *           type: integer
 *         required: true
 *       - in : query
 *         name: limit
 *         description: The number of items to return
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: A list of rides based on page and limit parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RidesPage'
 */

rideRouter.get("/", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const ridesCount = req.app.db.get("rides").value().length;

  const result = {};
  if (endIndex < ridesCount) {
    result.nextPage = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    result.prevPage = {
      page: page - 1,
      limit: limit,
    };
  }
  result.rides = req.app.db.get("rides").slice(startIndex, endIndex);

  res.json(result);
});

/**
 * @swagger
 * /rides/{rideID}:
 *   get:
 *     summary: Get the ride by id
 *     tags: [Rides]
 *     parameters:
 *       - in : path
 *         name: rideID
 *         description: The ride id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Ride details for the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ride'
 *       404:
 *         description: The ride was not found
 */

rideRouter.get("/:rideID", async (req, res) => {
  const ride = req.app.db
    .get("rides")
    .find({ rideID: +req.params.rideID })
    .value();

  if (!ride) {
    return res.sendStatus(404);
  }

  res.send(ride);
});

/**
 * @swagger
 * /rides/{rideID}:
 *   put:
 *     summary: Updates the ride by the id
 *     tags: [Rides]
 *     parameters:
 *       - in: path
 *         name: rideID
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ride id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RideBody'
 *     responses:
 *       200:
 *         decsription: The ride was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ride'
 *       404:
 *         description: The ride was not found
 *       500:
 *         description: Internal server error
 *
 */

rideRouter.put("/:rideID", async (req, res) => {
  try {
    const startLatitude = Number(req.body.startLat);
    const startLongitude = Number(req.body.startLong);
    const endLatitude = Number(req.body.endLat);
    const endLongitude = Number(req.body.endLong);
    const riderName = req.body.riderName;
    const driverName = req.body.driverName;
    const driverVehicle = req.body.driverVehicle;

    if (
      isNaN(startLatitude) ||
      isNaN(startLongitude) ||
      isNaN(endLatitude) ||
      isNaN(endLongitude)
    ) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Latitudes and longitudes must be numbers",
      });
    }

    if (
      startLatitude < -90 ||
      startLatitude > 90 ||
      startLongitude < -180 ||
      startLongitude > 180
    ) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message:
          "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      });
    }

    if (
      endLatitude < -90 ||
      endLatitude > 90 ||
      endLongitude < -180 ||
      endLongitude > 180
    ) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message:
          "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      });
    }

    if (typeof riderName !== "string" || riderName.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Rider name must be a non empty string",
      });
    }

    if (typeof driverName !== "string" || driverName.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Driver name must be a non empty string",
      });
    }

    if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Driver vehicle must be a non empty string",
      });
    }

    const rideID = Number(req.params.rideID);
    const ride = {
      startLat: startLatitude,
      startLong: startLongitude,
      endLat: endLatitude,
      endLong: endLongitude,
      riderName: riderName,
      driverName: driverName,
      driverVehicle: driverVehicle,
      updated: new Date(),
    };

    const existingRide = req.app.db
      .get("rides")
      .find({ rideID: rideID })
      .value();

    if (!existingRide) {
      return res.sendStatus(404);
    }

    req.app.db.get("rides").find({ rideID: rideID }).assign(ride).write();

    res.send(req.app.db.get("rides").find({ rideID: rideID }));
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 *  /rides/{rideID}:
 *    delete:
 *      summary: Removes the ride by id
 *      tags: [Rides]
 *      parameters:
 *        - in: path
 *          name: rideID
 *          description: The ride id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: The ride was deleted successfully
 *        404:
 *          description: The ride was not found
 *
 */

rideRouter.delete("/:rideID", async (req, res) => {
  const existingRide = req.app.db
    .get("rides")
    .find({ rideID: +req.params.rideID })
    .value();

  if (!existingRide) {
    return res.sendStatus(404);
  }

  req.app.db
    .get("rides")
    .remove({ rideID: +req.params.rideID })
    .write();

  res.sendStatus(200);
});

module.exports = rideRouter;
