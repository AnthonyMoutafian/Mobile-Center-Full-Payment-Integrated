const { ReadDBService } = require("../services/readDBService");

class FavoritesController extends ReadDBService {
  async getFavoritesPage(req, res) {
    try {
      const cart = await req.app.locals.services.cartItems.getCart();
      const db = await super.getDB();

      const currentUser = await db.collection("currentUser").findOne({});

      const favorites = await req.app.locals.services.favorites.getFavorites();

      res.render("favorites", {
        cartLength: cart.length,

        currentUser: currentUser || {},

        favorites,
      });
    } catch (err) {
      console.log(err);

      res.status(500).send(err.message);
    }
  }

  async addFavorites(req, res) {
    try {
      const id = req.params.id;

      await req.app.locals.services.favorites.addFavorites(id);

      res.redirect(req.get("referer") || "/");
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }

  async deleteFavorites(req, res) {
    try {
      const id = req.params.id;

      await req.app.locals.services.favorites.deleteFavorites(id);

      res.redirect(req.get("referer") || "/");
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }
}

module.exports.FavoritesController = FavoritesController;
