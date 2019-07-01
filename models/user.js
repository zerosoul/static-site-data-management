const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
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
    },
    // 1 管理员 2 运营
    role: {
      type: Number,
      default: 2
    }
    // createdEvents: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Event"
    //   }
    // ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
