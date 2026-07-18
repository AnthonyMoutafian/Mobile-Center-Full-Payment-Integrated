const { ReadDBService } = require("../services/readDBService");

class SearchController extends ReadDBService {
  async search(req, res) {
    try {
      const searchValue = (req.query.search || "").trim().toLowerCase();

      const searchProducts =
        await req.app.locals.services.search.search(searchValue);

      const cart = await req.app.locals.services.cartItems.getCart();

      const currentUser = await super.getDB()
        .collection("currentUser")
        .findOne({});

      const favorites = await req.app.locals.services.favorites.getFavorites();

      res.render("search", {
        title: `Search: ${req.query.search || ""}`,

        products: searchProducts.searchProducts,

        search: req.query.search || "Not Found",

        brands: searchProducts.brands,

        specifications: searchProducts.specifications,

        cartLength: cart.length,

        currentUser: currentUser || {},

        favorites,
      });
    } catch (err) {
      console.log(err);

      res.status(500).send(err.message);
    }
  }
}

module.exports.SearchController = SearchController;
