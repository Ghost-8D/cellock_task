'use strict';

const express = require('express');
const app = express();
const cors = require("cors");
const helmet = require('helmet');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(cors({ origin: "*"}))
app.use(helmet());

module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, async (req, res) => {
        const startLatitude =  Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName =  req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        if(isNaN(startLatitude) || isNaN(startLongitude) || isNaN(endLatitude) || isNaN(endLongitude)) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Latitudes and longitudes must be numbers'
            })
        }

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        var values = [startLatitude, startLongitude, endLatitude, endLongitude, riderName, driverName, driverVehicle];
        
        const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }

                res.json(rows);
            });
        });
    });

    app.get('/rides', async (req, res) => {
        await db.all('SELECT * FROM Rides', async (err, rows) => {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const result = {};
            if (endIndex < rows.length) {
                result.next = {
                    page: page + 1,
                    limit: limit
                };
            }
            if (startIndex > 0) {
                result.previous = {
                    page: page - 1,
                    limit: limit
                };
            }
            result.results = rows.slice(startIndex, endIndex);
            
            res.json(result)
        });
    });

    app.get('/rides/:id', async (req, res) => {
        await db.all(`SELECT * FROM Rides WHERE rideID= ?`, [req.params.id], async (err, rows) => {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDE_NOT_FOUND_ERROR',
                    message: `There is no ride with ID = ${req.params.id}`
                });
            }

            res.send(rows);
        });
    });

    return app;
};
