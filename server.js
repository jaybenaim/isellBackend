const express = require("express");
const app = express();
const path = require("path");
const stripe = require("stripe")("sk_test_59y42s9amXyOuAPudcbNBta500g0JElmda");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.send("HOME");
});

app.get("/api/", async (req, res) => {
  res.send("API HOME");
});

var whitelist = [
  "https://jaybenaim.github.io",
  "http://localhost:3000",
  "http://localhost:3000"
];

var corsOptions = {
  origin: true,
  methods: ["GET", "POST", "HEAD", "OPTIONS", "DELETE"],
  credentials: true
};
app.use(cors());
app.post("/api/charge", cors(), async (req, res, next) => {
  try {
    // const headers = JSON.parse(req.headers);
    // const { token, total } = headers;
    // const data = JSON.parse(req.body);
    // const data = JSON.parse(req.headers.data);
    let { total, token } = req.headers;
    console.log(req.body);
    // let { token, subTotal } = data;
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
