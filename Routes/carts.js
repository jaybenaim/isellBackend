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
// add products to cart
router.post("/:id/products", (req, res) => {
  // Product.findOrCreate(req.body, (err, product) => {
  //   if (err) return res.status(500).send(err);
  //   return res.status(200).send(product);
  // });
  Cart.findById(req.params.id, (err, cart) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      Product.findOrCreate(req.body.products, (err, product) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          product.save();
          cart.products.push(product);
          cart.save();
          return res.status(200).send(cart);
        }
      });
    }
  });
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
