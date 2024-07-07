const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, require: true },
  authorized: { type: Boolean, default: false },
});

CategorySchema.virtual("url").get(function () {
  return `/inventory/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
