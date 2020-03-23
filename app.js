const addresses = require("./Routes/addresses");
const cookieParser = require("cookie-parser");
const withAuth = require("./Middleware/auth");
const profiles = require("./Routes/profiles");
const products = require("./Routes/products");
const stripe = require("./Routes/stripe");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const carts = require("./Routes/carts");
const users = require("./Routes/users");
const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config({
  debug: process.env.DB_CONNECTION
});

app.use(logger("dev"));

// catch 404 and forward to error handler
<<<<<<< HEAD
app.use((req, res, next) => {
  next(createError(404));
});
=======
// app.use((req, res, next) => {
//   next(createError(404));
// });
>>>>>>> addMorgan

const whitelist = [
  "https://jaybenaim.github.io",
  "http://localhost:3000",
  "http://localhost:5000"
];
const corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

var options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: false,
  useCreateIndex: true
};
app.use(cors(corsOptions));

const uri = process.env.MONGODB_URI || process.env.DB_CONNECTION;
mongoose.connect(uri, options, err => {
  if (err) console.log(err);
  return console.log("Connected to DB");
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/stripe", stripe);
app.use("/api", users);
app.use("/api/profiles", profiles);
app.use("/api/products", products);
app.use("/api/carts", carts);
app.use("/api/addresses", addresses);

app.get("/", (req, res) => {
  res.send("HOME");
});
app.get("/api/", (req, res) => {
  res.send("API HOME");
});
app.get("/checkToken", withAuth, (req, res) => {
  res.status(200).send("Authorized");
});

// TODO Web Template Studio: Add your own error handler here.
if (app.settings.env === "production") {
  // Do not send stack trace of error message when in production
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send("Error occurred while handling the request.");
  });
} else {
  // Log stack trace of error message while in development
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.log(err);
    res.send(err.message);
  });
}
module.exports = app;
