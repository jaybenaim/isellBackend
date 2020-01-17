const express = require("express");
const app = express();
const stripe = require("stripe")("sk_test_59y42s9amXyOuAPudcbNBta500g0JElmda");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const withAuth = require("./Middleware/auth");
const profiles = require("./Routes/profiles");
const users = require("./Routes/users");

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

app.get("/", (req, res) => {
  res.send("HOME");
  console.log("led");
});

app.get("/api/", (req, res) => {
  res.send("API HOME");
});
app.use("/api/profiles", profiles);
app.use("/api", users);

app.get("/api/checkToken", withAuth, (req, res) => {
  res.status(200).send("Authorized");
});

app.post("/api/charge", cors(), async (req, res) => {
  try {
    let { total, token } = req.headers;
    let { status } = await stripe.charges.create({
      amount: total,
      currency: "cad",
      description: "An example charge",
      source: token
    });

    res.json({ status });
    console.log(status);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.listen(process.env.PORT || 5000);
