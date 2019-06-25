const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  // 名称
  title: {
    type: String,
    required: true
  },
  // 分类
  cate: {
    type: String,
    required: true
  },
  // 工作地点
  location: {
    type: String,
    required: true
  },
  // 部门
  depart: {
    type: String,
    required: true
  },
  // 更新时间
  updateTime: {
    type: Date,
    default: Date.now
  },
  // 外链
  link: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("DDPosition", eventSchema);
