const { ReadDBService } = require("../services/readDBService");

class OrdersController extends ReadDBService {
  async getOrders(req, res) {
    try {
      const cart = await req.app.locals.services.cartItems.getCart();

      const currentUser = await super.getDB()
        .collection("currentUser")
        .findOne({});

      if (!currentUser || Object.keys(currentUser).length === 0) {
        return res.redirect("/api/login");
      }

      const user = await super.getDB().collection("users").findOne({
        _id: currentUser._id,
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const paidOrders = user.orders.filter((order) => order.paid === true);

      res.render("orders", {
        cartLength: cart.length,

        currentUser,

        orders: paidOrders,
      });
    } catch (err) {
      console.log(err);

      res.status(500).send(err.message);
    }
  }
}

module.exports.OrdersController = OrdersController;
