const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    default: `用户${new Date().getTime()}`
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
  // createdEvents: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Event"
  //   }
  // ]
});

module.exports = mongoose.model("User", userSchema);
