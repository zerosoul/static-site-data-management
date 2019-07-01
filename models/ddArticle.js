const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema(
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
      required: true
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DDArticle", eventSchema);
