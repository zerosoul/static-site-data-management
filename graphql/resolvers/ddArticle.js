const DDArticle = require("../../models/ddArticle");

module.exports = {
  ddArticles: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    try {
      const arts = await DDArticle.find();
      console.log("dd arts", arts);

      return arts.map(art => {
        return art;
      });
    } catch (err) {
      throw err;
    }
  },
  removeDdArticle: async (args, req) => {
    const { artId } = args;
    console.log("art input", args);

    try {
      DDArticle.findByIdAndDelete(artId, (err, art) => {
        if (err) {
          throw err;
        }
        console.log("wtf", err, art);

        return art;
      });
    } catch (err) {
      throw err;
    }
  },
  createDdArticle: async (args, req) => {
    const { title, description, date, link, thumbnail } = args.dDArticleInput;
    console.log("art input", args);

    const art = new DDArticle({
      title,
      description,
      date: new Date(date),
      link,
      thumbnail
    });
    let createArticle;
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
