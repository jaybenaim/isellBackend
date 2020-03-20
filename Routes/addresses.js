const express = require("express");
const router = express.Router();
const ShippingInfo = require("../Models/ShippingInfo");

router.get("/", (req, res) => {
  ShippingInfo.find((err, address) => {
    return err ? res.status(500).send(err) : res.status(200).send(address);
  });
});

router.post("/", (req, res) => {
  const { shippingInfo, profile } = req.body;
  const info = new ShippingInfo({ ...shippingInfo, profile });

  info.save((err, address) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(address);
  });
});
// find addresses from profile id
router.get("/find/:id", (req, res) => {
  ShippingInfo.find({ "profile.id": req.params.id })
    .select("-__v")
    .exec((err, address) => {
      return err ? res.status(500).send(err) : res.status(200).send(address);
    });
});
router.get("/:id", (req, res) => {
  ShippingInfo.findOne({ _id: req.params.id }, (err, address) => {
    return err ? res.status(500).send(err) : res.status(200).send(address);
  });
});

router.patch("/:id", (req, res) => {
  console.log(req.body);
  ShippingInfo.findByIdAndUpdate(req.params.id, req.body.data, {
    new: true
  })
    .select("-__v")
    .exec((err, address) => {
      return err ? res.status(500).send(err) : res.status(200).send(address);
    });
});

router.delete("/:id", (req, res) => {
  ShippingInfo.findByIdAndRemove(req.params.id, (err, address) => {
    const response = {
      message: "Address deleted successfully"
    };
    return err ? res.status(500).send(err) : res.status(200).send(response);
  });
});

module.exports = router;
