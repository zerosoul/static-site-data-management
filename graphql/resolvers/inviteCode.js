const InviteCode = require("../../models/inviteCode");

module.exports = {
  codes: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    try {
      const codes = await InviteCode.find();
      // console.log("dd codes", codes);

      return codes;
    } catch (err) {
      throw err;
    }
  },
  getCode: async (args, req) => {
    const { codeId } = args;
    console.log("code input", args);

    try {
      const code = await InviteCode.findById(codeId);
      return code;
    } catch (err) {
      throw err;
    }
  },
  updateCode: async (args, req) => {
    const { id, ...rest } = args.inviteCodeInput;
    console.log("code input", args);
    try {
      const result = await InviteCode.findByIdAndUpdate(id, rest);
      console.log("code update result", result);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  removeCode: async (args, req) => {
    const { codeId } = args;
    console.log("code input", args);

    try {
      const code = await InviteCode.findByIdAndDelete(codeId);
      return code;
    } catch (err) {
      throw err;
    }
  },
  createCode: async (args, req) => {
    const { inviteCodeInput } = args;
    console.log("code input", args);

    const code = new InviteCode({
      ...inviteCodeInput
    });
    try {
      const result = await code.save();
      console.log("code create result", result);

      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
