const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

router.get("/", (req, res) => {
  Product.find()
    .select("-__v")
    .exec((err, product) => {
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

router.patch("/:id", (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .select("-__v")
    .exec((err, updatedProduct) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(updatedProduct);
    });
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err, product) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Product deleted successfully"
    };
    return res.status(200).send(response);
  });
});

module.exports = router;
