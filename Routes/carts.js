const express = require("express");
const router = express.Router();
const Cart = require("../Models/Cart");

router.get("/", (req, res) => {
  Cart.find((err, cart) => {
    try {
      console.log(cart);
      return res.status(200).send(cart);
    } catch {
      console.log(Cart);
      return res.status(500).send(err);
    }
  });
});

// find cart from id
router.get("/:id", (req, res) => {
  Cart.findOne({ _id: req.params.id }, (err, cart) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(cart);
  });
});

// find cart from user id
router.get("/find/:id", (req, res) => {
  Cart.findOne({ "user.id": req.params.id })
    .populate("products ", "-__v")
    .select("-__v")
    .exec((err, cart) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send(cart);
      }
    });
});

router.post("/", (req, res) => {
  const newCart = new Cart(req.body);
  newCart.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(newCart);
  });
});

router.patch("/:id", (req, res) => {
  Cart.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("products")
    .exec((err, updatedCart) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(updatedCart);
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
