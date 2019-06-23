const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  cate: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  depart: {
    type: String,
    required: true
  },
  updateTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DDPosition", eventSchema);
