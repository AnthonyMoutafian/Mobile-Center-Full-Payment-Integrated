const { ReadDBService } = require("../services/readDBService");

class CategoryController extends ReadDBService {
  async getCategory(req, res) {
    const categorySlug = req.params.slug;
    const category =
      await req.app.locals.services.category.getCategory(categorySlug);
    const cart = await req.app.locals.services.cartItems.getCart();
    const data = await req.app.locals.services.users.getDB("users");
    const users = data[0].users;
    const currentUser = data[0].currentUser;
    const favorites = await req.app.locals.services.favorites.getFavorites();
    res.render("category", {
      title: category.title,
      products: category.filteredProducts,
      specifications: category.specifications,
      brands: category.brands,
      cartLength: cart.length,
      users: users,
      currentUser: currentUser,
      favorites: favorites,
    });
  }
}

module.exports.CategoryController = CategoryController;
