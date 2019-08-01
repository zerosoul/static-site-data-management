const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  reg: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("该用户已存在");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        name: args.userInput.name,
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("用户名或密码不正确");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("用户名或密码不正确");
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "somesupersecretkey",
        {
          expiresIn: "1d"
        }
      );
      return {
        userId: user.id,
        meta: {
          name: user.name,
          role: user.role,
          email: user.email,
          mobile: user.mobile
        },
        token,
        tokenExpiration: 1
      };
    } catch (error) {
      throw error;
    }
  }
};
