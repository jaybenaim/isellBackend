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

// find cart from id
router.get("/:id", (req, res) => {
  Cart.findOne({ _id: req.params.id }, (err, cart) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(cart);
  });
});

// find cart from user id
router.get("/find/:id", (req, res) => {
  Cart.findOne({ "user.id": req.params.id }, (err, cart) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      console.log(cart);
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

// add or remove item from cart
router.patch("/:id", (req, res) => {
  // console.log(req.body);
  Cart.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedCart) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        const { products } = req.body;
        updatedCart.user.id = req.body.user.id;

        products.map(product => {
          Product.findOrCreate(
            { _id: product },

            { new: true },
            (err, updatedProduct) => {
              if (err) {
                return res.status(500).send(err);
              } else {
                console.log(updatedProduct);
                updatedCart.products.push(updatedProduct);
              }
            }
          );
        });

        console.log("products: ", updatedCart.products);
        updatedCart.save(err => {
          if (err) {
            return res.status(500).send(err);
          } else {
            console.log(updatedCart);
          }
        });
        ///// /// // get product

        return res.status(200).send(updatedCart);
      }
    }
  );
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
