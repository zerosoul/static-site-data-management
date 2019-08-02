const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const SECRET_KEY = process.env.JWT_TOKEN || "";

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
    const errResp = {
      userId: 0,
      errMsg: "用户名或密码不正确"
    };
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return errResp;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        return errResp;
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        SECRET_KEY,
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
