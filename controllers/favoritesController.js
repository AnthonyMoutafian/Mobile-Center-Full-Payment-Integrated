const { ReadDBService } = require("../services/readDBService");

class FavoritesController extends ReadDBService {
  async getFavoritesPage(req, res) {
    const cart = await req.app.locals.services.cartItems.getCart();
    const data = await req.app.locals.services.users.getDB("users");
    const favorites = await req.app.locals.services.favorites.getFavorites();
    const users = data[0].users;
    const currentUser = data[0].currentUser;

    res.render("favorites", {
      cartLength: cart.length,
      users: users,
      currentUser: currentUser,
      favorites: favorites,
    });
  }
  async addFavorites(req, res) {
    try {
      const id = req.params.id;
      const favorites =
        await req.app.locals.services.favorites.addFavorites(id);
      res.redirect(req.get("referer") || "/");
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async deleteFavorites(req,res){
    try {
      const id = req.params.id;
      const favorites =
        await req.app.locals.services.favorites.deleteFavorites(id);
      res.redirect(req.get("referer") || "/");
    } catch (err) {
      res.json({ message: err.message });
    }
  }
}

module.exports.FavoritesController = FavoritesController;
