const DDPosition = require("../../models/ddPosition");

module.exports = {
  ddPositions: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    try {
      const positions = await DDPosition.find();
      console.log("dd positions", positions);

      return positions.map(pos => {
        return pos;
      });
    } catch (err) {
      throw err;
    }
  },
  getDdPosition: async (args, req) => {
    const { posId } = args;
    console.log("pos input", args);

    try {
      const pos = await DDPosition.findById(posId);
      return pos;
    } catch (err) {
      throw err;
    }
  },
  removeDdPosition: async (args, req) => {
    const { posId } = args;
    console.log("pos input", args);

    try {
      const pos = await DDPosition.findByIdAndDelete(posId);
      return pos;
    } catch (err) {
      throw err;
    }
  },
  updateDdPosition: async (args, req) => {
    const { id, ...rest } = args.dDPositionInput;
    console.log("pos input", args);
    try {
      const result = await DDPosition.findByIdAndUpdate(id, rest);
      console.log("pos update result", result);

      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createDdPosition: async (args, req) => {
    const {
      title,
      cate,
      updateTime,
      link,
      depart,
      location
    } = args.dDPositionInput;
    console.log("pos input", args);

    const pos = new DDPosition({
      title,
      cate,
      updateTime: new Date(updateTime),
      link,
      depart,
      location
    });
    try {
      const result = await pos.save();
      console.log("pos create result", result);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
