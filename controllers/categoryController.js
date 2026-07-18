const { ReadDBService } = require("../services/readDBService");

class CategoryController extends ReadDBService {
  async getCategory(req, res) {
    try {
      const categorySlug = req.params.slug;

      const category =
        await req.app.locals.services.category.getCategory(categorySlug);

      const cart = await req.app.locals.services.cartItems.getCart();

      const currentUser = await super.getDB()
        .collection("currentUser")
        .findOne({});

      const favorites = await req.app.locals.services.favorites.getFavorites();

      res.render("category", {
        title: category.title,

        products: category.filteredProducts,

        specifications: category.specifications,

        brands: category.brands,

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

module.exports.CategoryController = CategoryController;
