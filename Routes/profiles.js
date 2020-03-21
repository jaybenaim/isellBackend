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

// find profile from user id
router.get("/find/:id", (req, res) => {
  Profile.findByIdAndUpdate(
    { "user.id": req.params.id },
    { user: { _id: req.params.id } }
  )
    .populate("shippingInfo")
    .exec((err, profile) => {
      return err ? res.status(500).send(err) : res.status(200).send(profile);
    });
});

router.get("/:id", (req, res) => {
  Profile.findOne({ _id: req.params.id }, (err, profile) => {
    return err ? res.status(500).send(err) : res.status(200).send(profile);
  });
});

router.patch("/:id", (req, res) => {
  const { shippingInfo } = req.body;
  Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }).exec((err, profile) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      ShippingInfo.find({ "profile.id": profile.id }).exec((err, info) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          profile.shippingInfo = info;

          profile.save((err, results) => {
            if (err) return res.send(err);
            return res.status(200).send(results);
          });
        }
      });
    }
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
