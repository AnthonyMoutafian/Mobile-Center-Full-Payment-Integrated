const { ReadDBService } = require("../services/readDBService");

class CartController extends ReadDBService {
  async getCart(req, res, next) {
    try {
      const cart = await req.app.locals.services.cartItems.getCart();
      const db = await super.getDB();

      const currentUser = await db.collection("currentUser").findOne({});

      res.render("index", {
        cartLength: cart.length,

        currentUser: currentUser || {},
      });
    } catch (err) {
      console.log(err);

      res.status(500).send(err.message);
    }
  }

  async getCartProducts(req, res, next) {
    try {
      const cart = await req.app.locals.services.cartItems.getCartProducts();
      const db = await super.getDB();

      const currentUser = await db.collection("currentUser").findOne({});

      const totalAll = cart.reduce((sum, product) => sum + product.total, 0);

      res.render("cart", {
        cart,

        currentUser: currentUser || {},

        totalAll,
      });
    } catch (err) {
      console.log(err);

      res.status(500).send(err.message);
    }
  }

  async addToCart(req, res, next) {
    try {
      const id = req.params.id;

      await req.app.locals.services.cartItems.addToCart(id);

      res.redirect(req.get("referer") || "/");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async plusQuantity(req, res, next) {
    try {
      await req.app.locals.services.cartItems.plusQuantity(req.params.id);

      res.redirect("/cart");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async minusQuantity(req, res, next) {
    try {
      await req.app.locals.services.cartItems.minusQuantity(req.params.id);

      res.redirect("/cart");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async removeProduct(req, res, next) {
    try {
      await req.app.locals.services.cartItems.removeProduct(req.params.id);

      res.redirect("/cart");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports.CartController = CartController;
