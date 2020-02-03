const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  description: String,
  price: String,
  image: String,
  category: String,
  qty: Number
});

ProductSchema.plugin(findOrCreate);
module.exports = mongoose.model("Product", ProductSchema);
