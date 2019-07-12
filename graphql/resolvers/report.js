const Report = require("../../models/report");

module.exports = {
  reports: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    try {
      const reports = await Report.find();
      // console.log("dd reports", reports);

      return reports;
    } catch (err) {
      throw err;
    }
  },
  getReport: async (args, req) => {
    const { reportId } = args;
    console.log("report input", args);

    try {
      const report = await Report.findById(reportId);
      return report;
    } catch (err) {
      throw err;
    }
  },
  removeReport: async (args, req) => {
    const { reportId } = args;
    console.log("report input", args);

    try {
      const report = await Report.findByIdAndDelete(reportId);
      return report;
    } catch (err) {
      throw err;
    }
  },
  updateReport: async (args, req) => {
    const { id, ...rest } = args.reportInput;
    console.log("report input", args);
    try {
      const result = await Report.findByIdAndUpdate(id, rest);
      console.log("report update result", result);

      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createReport: async (args, req) => {
    const { title, startTime, endTime, items } = args.reportInput;
    console.log("report input", args);

    const report = new Report({
      title,
      startTime,
      endTime,
      items
    });
    try {
      const result = await report.save();
      console.log("art create result", result);

      // createArticle = transformEvent(result);
      // return createArticle;
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
