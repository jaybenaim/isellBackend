const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;

const provinceArr = [
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
const addressTypeArr = ["House", "Apartment", "Business", "Hotel", "Other"];

const ShippingInfoSchema = new Schema({
  name: { type: String, required: false },
  street: { type: String, required: false },
  addressType: { type: String, required: false, enum: addressTypeArr },
  suite: { type: String, required: false },
  city: { type: String, required: false },
  province: { type: String, required: false, enum: provinceArr },
  postalCode: {
    type: String,
    required: false
  }
});
ShippingInfoSchema.plugin(findOrCreate);
module.exports = mongoose.model("ShippingInfoSchema", ShippingInfoSchema);
