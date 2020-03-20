const express = require("express");
const router = express.Router();
const Profile = require("../Models/Profile");
const ShippingInfo = require("../Models/ShippingInfo");

router.get("/", (req, res) => {
  Profile.find((err, profile) => {
    return err ? res.status(500).send(err) : res.status(200).send(profile);
  });
});

router.post("/", (req, res) => {
  Profile.findOrCreate(req.body, (err, profile) => {
    const results = {
      profile,
      message: "Successfully created profile."
    };
    return err ? res.status(500).send(err) : res.status(200).send(results);
  });
});
// find cart from user id
router.get("/find/:id", (req, res) => {
  Profile.find({ "user.id": req.params.id })
    .populate("users")
    .select("-__v")
    .exec((err, cart) => {
      return err ? res.status(500).send(err) : res.status(200).send(cart);
    });
});
router.get("/:id", (req, res) => {
  Profile.findOne({ _id: req.params.id }, (err, profile) => {
    return err ? res.status(500).send(err) : res.status(200).send(profile);
  });
});

router.patch("/:id", (req, res) => {
  const { shippingInfo } = req.body;
  Profile.findByIdAndUpdate({ _id: req.params.id }, { new: true })
    .select("-__v")
    .exec((err, profile) => {
      if (shippingInfo) {
        const newInfo = shippingInfo.map(i => {
          return new ShippingInfo(i);
        });
        profile.shippingInfo = newInfo;
        profile.save();
      }
      const results = {
        profile,
        message: "Successfully updated profile."
      };
      return err ? res.status(500).send(err) : res.status(200).send(results);
    });
});

router.delete("/:id", (req, res) => {
  Profile.findByIdAndRemove(req.params.id, (err, profile) => {
    const response = {
      message: "Profile deleted successfully"
    };
    return err ? res.status(500).send(err) : res.status(200).send(response);
  });
});

module.exports = router;
