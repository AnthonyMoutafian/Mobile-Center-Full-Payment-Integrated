const { schema } = require("../schema/schema");
class AuthController {
  async registerUser(req, res, next) {
    try {
      const newUser = req.body;
      const auth = await req.app.locals.services.auth.registerUser(newUser);
      res.redirect("/api/login");
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async loginUser(req, res, next) {
    try {
      const user = req.body;
      const auth = await req.app.locals.services.auth.loginUser(user);
      res.redirect("/");
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async logoutUser(req, res, next) {
    try {
      const auth = await req.app.locals.services.auth.logoutUser();
      res.redirect("/api/login");
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async loginUserPage(req, res, next) {
    try {
      const cart = await req.app.locals.services.cartItems.getCart();
      const data = await req.app.locals.services.users.getDB("users");
      const users = data[0].users;
      const currentUser = data[0].currentUser;
      res.render("login", {
        cartLength: cart.length,
        users: users,
        currentUser: currentUser,
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async registerUserPage(req, res, next) {
    try {
      const cart = await req.app.locals.services.cartItems.getCart();
      const data = await req.app.locals.services.users.getDB("users");
      const users = data[0].users;
      const currentUser = data[0].currentUser;
      res.render("register", {
        cartLength: cart.length,
        users: users,
        currentUser: currentUser,
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  }
}

module.exports.AuthController = AuthController;
