const express = require("express");
const router = express.Router();
const ShippingInfo = require("../Models/ShippingInfo");

router.get("/", (req, res) => {
  ShippingInfo.find((err, address) => {
    return err ? res.status(500).send(err) : res.status(200).send(address);
  });
});

router.post("/", (req, res) => {
  ShippingInfo.findOrCreate(req.body, (err, address) => {
    const results = {
      Address,
      message: "Successfully created Address."
    };
    return err ? res.status(500).send(err) : res.status(200).send(results);
  });
});

router.get("/:id", (req, res) => {
  ShippingInfo.findOne({ _id: req.params.id }, (err, address) => {
    return err ? res.status(500).send(err) : res.status(200).send(address);
  });
});

router.patch("/:id", (req, res) => {
  ShippingInfo.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })
    .select("-__v")
    .exec((err, address) => {
      return err ? res.status(500).send(err) : res.status(200).send(address);
    });
});

router.delete("/:id", (req, res) => {
  Address.findByIdAndRemove(req.params.id, (err, address) => {
    const response = {
      message: "Address deleted successfully"
    };
    return err ? res.status(500).send(err) : res.status(200).send(response);
  });
});

module.exports = router;
