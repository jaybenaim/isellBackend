const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});

CartSchema.plugin(findOrCreate);
module.exports = mongoose.model("Cart", CartSchema);
