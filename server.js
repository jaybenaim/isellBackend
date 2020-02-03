const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const withAuth = require("./Middleware/auth");
const profiles = require("./Routes/profiles");
const users = require("./Routes/users");
const stripe = require("./Routes/stripe");
const products = require("./Routes/products");
const carts = require("./Routes/carts");
const Cart = require("./models/Cart");

app.use(
  cors({ credentials: true, origin: "https://jaybenaim.github.io/isell/" })
);
require("dotenv").config({
  debug: process.env.DB_CONNECTION
});
mongoose.set("useCreateIndex", true);
const mongoDB = process.env.MONGODB_URI || process.env.DB_CONNECTION;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  err => {
    try {
      console.log(`Successfully connected to db`);
    } catch {
      console.log(err);
    }
  }
);

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/api/", (req, res) => {
  res.send("API HOME");
});
app.use("/stripe", stripe);
app.use("/api", users);
app.use("/api/profiles", profiles);
app.use("/api/products", products);
app.use("/api/carts", carts);

app.get("/", (req, res) => {
  res.send("HOME");
});

app.get("/checkToken", withAuth, (req, res) => {
  res.status(200).send("Authorized");
});

app.listen(process.env.PORT || 5000);
