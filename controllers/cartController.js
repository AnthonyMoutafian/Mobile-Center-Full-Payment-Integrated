class CartController {
  async getCart(req, res, next) {
    const cart = await req.app.locals.services.cartItems.getCart();
    const data = await req.app.locals.services.users.getDB("users");
    const users = data[0].users;
    const currentUser = data[0].currentUser;
    res.render("index", {
      cartLength: cart.length,
      users:users,
      currentUser:currentUser,
    });
  }
  async getCartProducts(req, res, next) {
    const cart = await req.app.locals.services.cartItems.getCartProducts();
    const data = await req.app.locals.services.users.getDB("users");
    const users = data[0].users;
    const currentUser = data[0].currentUser;
    const totalAll = cart.reduce((sum, product) => sum + product.total, 0);

    res.render("cart", {
      cart: cart,
      users: users,
      currentUser: currentUser,
      totalAll,
    });
  }
  async addToCart(req, res, next) {
    const id = req.params.id;
    const items = await req.app.locals.services.cartItems.addToCart(id);
    res.redirect(req.get("referer") || "/");
  }

  async plusQuantity(req, res, next) {
    const id = req.params.id;
    const items = await req.app.locals.services.cartItems.plusQuantity(id);
    res.redirect("/cart");
  }

  async minusQuantity(req, res, next) {
    const id = req.params.id;
    const items = await req.app.locals.services.cartItems.minusQuantity(id);
    res.redirect("/cart");
  }

  async removeProduct(req, res, next) {
    const id = req.params.id;
    const items = await req.app.locals.services.cartItems.removeProduct(id);
    res.redirect("/cart");
  }
}

module.exports.CartController = CartController;
