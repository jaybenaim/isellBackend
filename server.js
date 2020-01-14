const express = require("express"),
  app = express(),
  path = require("path"),
  stripe = require("stripe")("sk_test_59y42s9amXyOuAPudcbNBta500g0JElmda"),
  bodyParser = require("body-parser"),
  cors = require("cors");

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", async (req, res) => {
  res.send("HOME");
  console.log("led");
});

app.get("/api/", async (req, res) => {
  res.send("API HOME");
});

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
