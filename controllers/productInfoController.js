const { ReadDBService } = require("../services/readDBService");

class ProductInfoController extends ReadDBService {
  async getProductInfo(req, res) {
    const slug = req.params.slug;
    const slugOfProduct =
      await req.app.locals.services.slugOfProduct.getProductInfo(slug);
    const cart = await req.app.locals.services.cartItems.getCart();
    const data = await req.app.locals.services.users.getDB("users");
    const favorites = await req.app.locals.services.favorites.getFavorites();
    const users = data[0].users;
    const currentUser = data[0].currentUser;

    res.render("product", {
      title: slugOfProduct.product.title,
      product: slugOfProduct.product,
      relatedProducts: slugOfProduct.relatedProducts,
      cartLength: cart.length,
      users:users,
      currentUser:currentUser,
      favorites: favorites,
    });
  }
}

module.exports.ProductInfoController = ProductInfoController;
