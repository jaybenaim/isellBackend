const express = require("express");
const router = express.Router();
const ShippingInfo = require("../Models/ShippingInfo");

router.get("/", (req, res) => {
  ShippingInfo.find((err, address) => {
    return err ? res.status(500).send(err) : res.status(200).send(address);
  });
});

router.post("/", (req, res) => {
  const { shippingInfo, user } = req.body;
  const info = new ShippingInfo({ ...shippingInfo, user });

  info
    .save()
    .then(response => {
      console.log(response);
      return res.status(200).send(info);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});
// find addresses from user id
router.get("/find/:id", (req, res) => {
  const results = [];
  ShippingInfo.find({ "user.id": req.params.id }).exec((err, info) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      results.push(info);
      return res.status(200).send(results);
    }
  });
});

router.get("/:id", (req, res) => {
  ShippingInfo.findOne({ _id: req.params.id }, (err, address) => {
    return err ? res.status(500).send(err) : res.status(200).send(address);
  });
});

router.patch("/:id", (req, res) => {
  console.log(req.body);
  ShippingInfo.findByIdAndUpdate(req.params.id, req.body, (err, address) => {
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
