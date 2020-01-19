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
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
require("dotenv").config({
  debug: process.env.DB_CONNECTION
});
mongoose.set("useCreateIndex", true);

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  err => {
    if (err) {
      throw err;
    } else {
      console.log(`Successfully connected to db`);
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

app.use("/api/profiles", profiles);
app.use("/api", users);
app.use("/stripe", stripe);
app.use("/api/products", products);
app.use("/api/carts", carts);

app.get("/", (req, res) => {
  res.send("HOME");
  console.log("led");
});
app.get("/api/", (req, res) => {
  res.send("API HOME");
});
app.get("/api/checkToken", withAuth, (req, res) => {
  res.status(200).send("Authorized");
});

app.listen(process.env.PORT || 5000);
