const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  username: String,

  shippingInfo: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "ShippingInfo"
      }
    }
  ],
  user: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  }
});
ProfileSchema.plugin(findOrCreate);
module.exports = mongoose.model("Profile", ProfileSchema);
