const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_59y42s9amXyOuAPudcbNBta500g0JElmda");
const cors = require("cors");
router.use(cors({ origin: "http://localhost:3000" }));

router.post("/charge", cors(), async (req, res) => {
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

module.exports = router;
