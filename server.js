const express = require("express");
const app = express();
const path = require("path");
const stripe = require("stripe")("sk_test_59y42s9amXyOuAPudcbNBta500g0JElmda");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Models/User.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const withAuth = require("./Middleware/auth");

require("dotenv").config({ debug: process.env.SECRET });
mongoose.set("useCreateIndex", true);

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      throw err;
    } else {
      console.log(`Successfully connected to db`);
    }
  }
);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("HOME");
});

app.get("/api/", async (req, res) => {
  res.send("API HOME");
});
app.get("/api/home", withAuth, async (req, res) => {
  res.send("API WITH AUTH");
});
app.get("/checkToken", withAuth, function(req, res) {
  res.sendStatus(200);
});

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save(err => {
    if (err) {
      console.log(err);
      res.status(500).send(`Error registering new user, please try again.`);
    } else {
      res.status(200).send("Thanks for signing up!");
    }
  });
});
app.post("/api/authenticate", (req, res) => {
  const { email, password } = req.body;
  console.log();

  User.findOne({ email }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again"
      });
    } else if (!user) {
      console.error(err);
      res.status(401).json({
        error: "Incorrect email or password"
      });
    } else {
      user.isCorrectPassword(password, (err, same) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            error: "Internal error please try again"
          });
        } else if (!same) {
          console.error(err);
          res.status(401).json({
            error: "Incorrect email or password"
          });
        } else {
          // Issue token
          const payload = {
            email
          };
          const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: "1h"
          });
          res.send(token);
        }
      });
    }
  });
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
