const express = require("express");
const router = express.Router();
const Profile = require("../Models/Profile");

router.get("/", (req, res) => {
  Profile.find((err, profile) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(profile);
  });
});

router.post("/", (req, res) => {
  Profile.findOrCreate(req.body, (err, profile) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      const results = {
        profile,
        status: "Successfully created profile."
      };
      return res.status(200).send(results);
    }
  });
});
// find cart from user id
router.get("/find/:id", (req, res) => {
  Profile.find({ "user.id": req.params.id })
    .populate("users")
    .select("-__v")
    .exec((err, cart) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send(cart);
      }
    });
});
router.get("/:id", (req, res) => {
  Profile.findOne({ _id: req.params.id }, (err, profile) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(profile);
  });
});
router.patch("/:id", (req, res) => {
  Profile.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },

    (err, profile) => {
      if (err) return res.status(500).send(err);
      return res.send(profile);
    }
  );
});

router.delete("/:id", (req, res) => {
  Profile.findByIdAndRemove(req.params.id, (err, profile) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Profile deleted successfully"
    };
    return res.status(200).send(response);
  });
});

module.exports = router;
