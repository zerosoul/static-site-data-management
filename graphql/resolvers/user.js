const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  users: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    console.log("users args", args);
    const { page = 1, limit = 10, ...rest } = args;
    const filter = {};
    if (rest.title) {
      filter.title = { $regex: rest.title, $options: "i" };
    }
    if (rest.role) {
      filter.role = { $eq: Number(rest.role) };
    }
    console.log("filter", filter);

    try {
      const result = await User.paginate(filter, {
        page,
        limit,
        sort: {
          createAt: -1
        }
      });
      console.log("dd result", result);
      return {
        list: result.docs,
        currPage: result.page,
        pageSize: limit,
        total: result.totalDocs
      };
    } catch (err) {
      throw err;
    }
  },
  getUser: async (args, req) => {
    const { uid } = args;
    console.log("user input", args);

    try {
      const user = await User.findById(uid);
      return user;
    } catch (err) {
      throw err;
    }
  },
  updateUser: async (args, req) => {
    const { id, ...rest } = args.userInput;
    console.log("user input", args);
    if (rest.password) {
      rest.password = await bcrypt.hash(rest.password, 12);
    }

    try {
      const result = await User.findByIdAndUpdate(id, rest);
      console.log("user update result", result);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  removeUser: async (args, req) => {
    const { uid } = args;
    console.log("user input", args);

    try {
      const user = await User.findByIdAndDelete(uid);
      return user;
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args, req) => {
    const { userInput } = args;
    console.log("user input", args);
    const { password } = userInput;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      ...userInput,
      password: hashedPassword
    });
    try {
      const result = await user.save();
      console.log("user create result", result);

      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
