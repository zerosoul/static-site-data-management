const DDArticle = require("../../models/ddArticle");

module.exports = {
  ddArticles: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    try {
      const arts = await DDArticle.find().sort({
        date: -1
      });
      // console.log("dd arts", arts);

      return arts.sort((x, y) => {
        return x.isTop === y.isTop ? 0 : x.isTop ? -1 : 1;
      });
    } catch (err) {
      throw err;
    }
  },
  getDdArticle: async (args, req) => {
    const { artId } = args;
    console.log("art input", args);

    try {
      const art = await DDArticle.findById(artId);
      return art;
    } catch (err) {
      throw err;
    }
  },
  removeDdArticle: async (args, req) => {
    const { artId } = args;
    console.log("art input", args);

    try {
      const art = await DDArticle.findByIdAndDelete(artId);
      return art;
    } catch (err) {
      throw err;
    }
  },
  updateDdArticle: async (args, req) => {
    const { id, ...rest } = args.dDArticleInput;
    console.log("art input", args);
    try {
      const result = await DDArticle.findByIdAndUpdate(id, rest);
      console.log("art update result", result);

      // createArticle = transformEvent(result);
      // return createArticle;
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createDdArticle: async (args, req) => {
    const {
      title,
      description,
      date,
      link,
      thumbnail,
      content,
      type,
      isTop
    } = args.dDArticleInput;
    console.log("art input", args);

    const art = new DDArticle({
      title,
      description,
      content,
      date: new Date(date),
      link,
      thumbnail,
      type,
      isTop
    });
    try {
      const result = await art.save();
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
