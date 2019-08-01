const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
      type: String,
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

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", userSchema);
