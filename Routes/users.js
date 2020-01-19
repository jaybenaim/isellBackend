const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Profile = require("../Models/Profile");
const withAuth = require("../Middleware/auth");
const jwt = require("jsonwebtoken");
router.get("/users", withAuth, (req, res) => {
  User.find((err, user) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(user);
  });
});

router.post("/signup", (req, res) => {
  User.findOrCreate(req.body, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      Profile.findOrCreate({ username: req.body.email }, (err, profile) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(200).send({
            userId: user.id,
            profile
          });
        }
      });
    }
  });
});

router.post("/authenticate", (req, res) => {
  const { email, password } = req.body;
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

module.exports = router;
