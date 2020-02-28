const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;

const provenceArr = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "ON",
  "PE",
  "QC",
  "SK",
  "NT",
  "NU",
  "YT"
];
const ProfileSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  username: String,
  shippingInfo: {
    name: { type: String, required: false },
    street: { type: String, required: false },
    city: { type: String, required: false },
    province: { type: String, required: false, enum: provinceArr },
    postalCode: {
      type: String,
      required: false
    }
  },
  user: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  }
});
ProfileSchema.plugin(findOrCreate);
module.exports = mongoose.model("Profile", ProfileSchema);
