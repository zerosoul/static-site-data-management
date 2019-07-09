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
    mobile: {
      type: Number,
      default: null
    },
    password: {
      type: String,
      required: true
    },
    // 1 管理员 2 运营
    role: {
      type: Number,
      default: 2
    },
    inviteCode: {
      type: Schema.Types.ObjectId,
      ref: "InviteCode"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
