const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a resource name"],
    unique: true,
  },
  provider: {
    type: String,
    required: [true, "Please add a provider"],
    unique: true,
  },
  url: {
    type: String,
    required: [true, "Please add a url"],
    unique: true,
  },
});

module.exports = mongoose.model("Resource", ResourceSchema);
