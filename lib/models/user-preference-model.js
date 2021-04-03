const mongoose = require("mongoose");

const userPreferenceSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currency: { type: String, default: "&#8377" },
});

const userPreference = mongoose.model("userPreference", userPreferenceSchema);

module.exports = userPreference;
