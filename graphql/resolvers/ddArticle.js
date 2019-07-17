const DDArticle = require("../../models/ddArticle");

module.exports = {
  ddArticles: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    console.log("arts args", args);
    const { page = 1, limit = 10, ...rest } = args;
    const filter = {};
    if (rest.title) {
      filter.title = { $regex: rest.title, $options: "i" };
    }
    if (rest.type) {
      filter.type = { $eq: Number(rest.type) };
    }
    console.log("filter", filter);

    try {
      const result = await DDArticle.paginate(filter, {
        page,
        limit,
        sort: {
          isTop: -1,
          date: -1
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
  getDdArticle: async (args, req) => {
    const { artId } = args;
    // console.log("art input", args);

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
      // console.log("art update result", result);

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
