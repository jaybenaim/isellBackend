const express = require("express");
const router = express.Router();
const passport = require("passport");
var User = require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res) {
  res.send("Home");
});

// AUTH ROUTES
// show register form
router.get("/register", function(req, res) {
  res.send(" GET /register");
});

// handle sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// show login form
router.get("/login", function(req, res) {
  res.send("GET LOGIN ");
});

// handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  }),
  function(req, res) {}
);
const express = require("express"),
  app = express(),
  path = require("path"),
  stripe = require("stripe")("sk_test_59y42s9amXyOuAPudcbNBta500g0JElmda"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  http = require("http"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// mongoose
mongoose.connect(process.env.DB_CONNECTION);

// routes
require("./routes")(app);

app.get("/", async (req, res) => {
  res.send("HOME");
});

app.get("/api/", async (req, res) => {
  res.send("API HOME");
});

app.use(cors());
app.post("/api/charge", cors(), async (req, res) => {
  try {
    let { total, token } = req.headers;
    total = Math.floor(total * 100);
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

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/");
});

module.exports = router;
