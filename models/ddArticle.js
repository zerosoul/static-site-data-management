const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: ""
    },
    thumbnail: {
      type: String,
      required: false
    },
    link: {
      type: String,
      default: "",
      required: false
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    // 1 新闻 2 点滴人物
    type: {
      type: Number,
      default: 1
    },
    isTop: {
      type: Boolean,
      default: false
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);
articleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("DDArticle", articleSchema);
