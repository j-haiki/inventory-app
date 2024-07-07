const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  added: { type: Date, default: Date.now },
});

ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

ItemSchema.virtual("addedFormatted").get(function () {
  return DateTime.fromJSDate(this.added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Item", ItemSchema);
