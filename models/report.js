const mongoose = require("mongoose");

const { Schema } = mongoose;

const reportSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: { type: Date, required: true, default: Date.now },
    items: [{ title: String, progress: Number, remark: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
