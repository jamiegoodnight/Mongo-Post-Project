const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");

const postRouter = require("./routes/postRouter.js");

mongoose.set("useCreateIndex", true);

mongoose
  .connect(
    "mongodb+srv://InsidePetroleumUser:a1b2c3@insidepetroleumprojectcluster-9b7w7.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true }
  )
  .then(connection => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.log("Failed to connect to MongoDB");
  });

const server = express();

//Middleware
server.use(cors());
server.use(express.json());
server.use(helmet());

//Routes
server.use("/", postRouter);

module.exports = server;
