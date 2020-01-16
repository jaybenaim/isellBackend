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
const Profile = require("./Models/Profile");

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
app.get("/api/checkToken", withAuth, (req, res) => {
  res.status(200).send("Authorized");
});

app.get("/api/profiles", (req, res) => {
  Profile.find((err, profile) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(profile);
  });
});
app.post("/api/profiles", (req, res) => {
  Profile.findOrCreate(req.body, (err, profile) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      const results = {
        profile,
        status: "Successfully created profile."
      };
      return res.status(200).send(results);
    }
  });
});

app.get("/api/profiles/:id", (req, res) => {
  Profile.findOne({ _id: req.params.id }, (err, profile) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(profile);
  });
});
app.patch("/api/profiles/:id", (req, res) => {
  console.log(req.params);

  Profile.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },

    (err, profile) => {
      if (err) return res.status(500).send(err);
      return res.send(profile);
    }
  );
});
app.delete("/api/profiles/:id", (req, res) => {
  Profile.findByIdAndRemove(req.params.id, (err, profile) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Profile deleted successfully",
      id: profile._id
    };
    return res.status(200).send(response);
  });
});
app.get("/api/users", withAuth, (req, res) => {
  User.find((err, user) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(user);
  });
});
app.post("/api/register", (req, res) => {
  User.findOrCreate(req.body, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send({ user_id: user.id });
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
          res.json({ token: token });
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
