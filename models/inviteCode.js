const mongoose = require("mongoose");

const { Schema } = mongoose;

const inviteCodeSchema = new Schema({
  value: {
    type: String,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  usedTime: {
    type: Date
  },
  // 1 管理员 2 运营
  role: {
    type: Number,
    default: 2
  }
});

module.exports = mongoose.model("InviteCode", inviteCodeSchema);
