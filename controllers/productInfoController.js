const { ReadDBService } = require("../services/readDBService");

class ProductInfoController extends ReadDBService {
  async getProductInfo(req, res) {
    try {
      const slug = req.params.slug;

      const productData =
        await req.app.locals.services.slugOfProduct.getProductInfo(slug);

      const cart = await req.app.locals.services.cartItems.getCart();

      const currentUser = await super.getDB()
        .collection("currentUser")
        .findOne({});

      const favorites = await req.app.locals.services.favorites.getFavorites();

      res.render("product", {
        title: productData.product.title,

        product: productData.product,

        relatedProducts: productData.relatedProducts,

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

module.exports.ProductInfoController = ProductInfoController;
