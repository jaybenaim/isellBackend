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
const Cart = require("./Models/Cart");

const whitelist = ["https://jaybenaim.github.io", "http://localhost:3000"];
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
app.use(cors(corsOptions));
require("dotenv").config({
  debug: process.env.DB_CONNECTION
});
var options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: false,
  useCreateIndex: true
};
const uri = process.env.MONGODB_URI || process.env.DB_CONNECTION;
mongoose.connect(uri, options, err => {
  if (err) console.log(err);
  return console.log("Connected to DB");
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());
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

app.get("/", (req, res) => {
  res.send("HOME");
});
app.get("/api/", (req, res) => {
  res.send("API HOME");
});
app.get("/checkToken", withAuth, (req, res) => {
  res.status(200).send("Authorized");
});

app.listen(process.env.PORT || 5000);
