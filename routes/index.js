const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.use(cors());

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = Number(session.metadata.userId);

      const orderId = session.metadata.orderId;

      const data = await req.app.locals.services.users.getDB("users");

      const users = data[0].users;

      const currentUser = data[0].currentUser;

      const user = users.find((user) => user.id === userId);

      if (user) {
        const order = user.orders.find((order) => order.id === orderId);

        if (order) {
          order.paid = true;
        }

        if (currentUser.id === userId) {
          const currentOrder = currentUser.orders.find(
            (order) => order.id === orderId,
          );

          if (currentOrder) {
            currentOrder.paid = true;
          }
        }

        await req.app.locals.services.users.saveToUsers(data);

        console.log("Paid order:", orderId);
      }
    }
    res.sendStatus(200);
  },
);

router.get("/", async (req, res) => {
  const products = await req.app.locals.services.products.getDB("products");
  const categories =
    await req.app.locals.services.categories.getDB("categories");
  const cart = await req.app.locals.services.cartItems.getCart();
  const data = await req.app.locals.services.users.getDB("users");
  const favorites = await req.app.locals.services.favorites.getFavorites();

  res.render("index", {
    products,
    categories,
    cartLength: cart.length,
    users: data[0].users,
    currentUser: data[0].currentUser,
    favorites,
  });
});

module.exports = router;
