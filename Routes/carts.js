const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../Models/Product");
const Cart = require("../Models/Cart");

router.get("/", (req, res) => {
  Cart.find((err, cart) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(cart);
  });
});
router.get("/:id", (req, res) => {
  Cart.findOne({ _id: req.params.id }, (err, cart) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(cart);
  });
});

router.post("/", (req, res) => {
  Cart.findOrCreate(req.body, (err, cart) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(cart);
    }
  });
});
// add or remove item from cart
router.patch("/:id", (req, res) => {
  Cart.findByIdAndUpdate(
    req.params.id,
    req.body,

    (err, updatedCart) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.status(200).send(updatedCart);
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  Cart.findByIdAndRemove(req.params.id, (err, profile) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Cart deleted successfully"
    };
    return res.status(200).send(response);
  });
});
module.exports = router;
