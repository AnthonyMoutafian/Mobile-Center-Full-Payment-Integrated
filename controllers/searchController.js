const { ReadDBService } = require("../services/readDBService");

class SearchController extends ReadDBService {
  async search(req, res) {
    const searchValue = (req.query.search || "Didn't Found The Product")
      .trim()
      .toLowerCase();
    const searchProducts =
      await req.app.locals.services.search.search(searchValue);
    const cart = await req.app.locals.services.cartItems.getCart();
    const data = await req.app.locals.services.users.getDB("users");
    const users = data[0].users;
    const currentUser = data[0].currentUser;
    const favorites = await req.app.locals.services.favorites.getFavorites();

    res.render("search", {
      title: `Search: ${req.query.search || ""}`,
      products: searchProducts.searchProducts,
      search: req.query.search || "Not Found",
      brands: searchProducts.brands,
      specifications: searchProducts.specifications,
      cartLength: cart.length,
      users: users,
      currentUser:currentUser,
      favorites:favorites,
    });
  }
}

module.exports.SearchController = SearchController;
