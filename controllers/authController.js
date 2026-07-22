const { ReadDBService } = require("../services/readDBService");

class AuthController extends ReadDBService {
  async registerUser(req, res, next) {
    try {
      const newUser = req.body;

      await req.app.locals.services.auth.registerUser(newUser);

      res.redirect("/api/login");
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }

  async loginUser(req, res, next) {
    try {
      const user = req.body;

      await req.app.locals.services.auth.loginUser(user);

      res.redirect("/");
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }

  async logoutUser(req, res, next) {
    try {
      await req.app.locals.services.auth.logoutUser();

      res.redirect("/api/login");
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }

  async loginUserPage(req, res, next) {
    try {
      const cart = await req.app.locals.services.cartItems.getCart();
      const db = await super.getDB();

      const currentUser = await db.collection("currentUser").findOne({});

      res.render("login", {
        cartLength: cart.length,

        currentUser: currentUser || {},
      });
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }

  async registerUserPage(req, res, next) {
    try {
      const cart = await req.app.locals.services.cartItems.getCart();
      const db = await super.getDB();

      const currentUser = await db.collection("currentUser").findOne({});

      res.render("register", {
        cartLength: cart.length,

        currentUser: currentUser || {},
      });
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }
}

module.exports.AuthController = AuthController;
