'use strict';

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const low = require("lowdb");
const rideRouter = require("../routes/rides");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 4000;
dotenv.config();

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ rides: [] }).write();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Rides Library API",
    //   termsOfService: "http://global-rides.com/terms/",
    //   contact: {
    //     name: "API Support",
    //     url: "http://www.global-rides.com/support",
    //     email: "support@rides.com",
    //   },
    },

    servers: [
      {
        url: "http://localhost:4000",
        description: "Rides API Documentation",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use("/rides", rideRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
