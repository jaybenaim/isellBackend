const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../Models/Product");

router.get("/", (req, res) => {
  Product.find((err, product) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(product);
  });
});
router.post("/", (req, res) => {
  Product.findOrCreate(req.body, (err, product) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(product);
  });
});
router.get("/:id", (req, res) => {
  Product.findOne({ _id: req.params.id }, (err, product) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(product);
  });
});
router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err, product) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Profile deleted successfully"
    };
    return res.status(200).send(response);
  });
});

module.exports = router;
