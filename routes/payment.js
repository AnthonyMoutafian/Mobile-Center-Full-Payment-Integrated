const express = require("express");
const Stripe = require("stripe");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const AMD_TO_USD = 380;

router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("CHECKOUT START");

    const data = await req.app.locals.services.users.getDB("users");

    const users = data[0].users;
    const currentUser = data[0].currentUser;

    if (!currentUser || Object.keys(currentUser).length === 0) {
      return res.status(401).send("Login required");
    }

    const cart = await req.app.locals.services.cartItems.getCart();

    if (cart.length === 0) {
      return res.status(400).send("Cart empty");
    }

    const orderId = crypto.randomUUID();

    const totalAll = cart.reduce((sum, product) => sum + product.total, 0);

    const newOrder = {
      id: orderId,

      products: cart,

      totalAll,

      paid: false,

      createdAt: new Date(),
    };

    const userIndex = users.findIndex((user) => user.id === currentUser.id);

    if (userIndex === -1) {
      return res.status(404).send("User not found");
    }

    users[userIndex].orders.push(newOrder);

    data[0].currentUser.orders.push(newOrder);

    await req.app.locals.services.users.saveToUsers(data);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: cart.map((product) => ({
        price_data: {
          currency: "usd",

          product_data: {
            images: [product.image],
            name: product.title,
          },

          unit_amount: Math.round((product.price / AMD_TO_USD) * 100),
        },

        quantity: product.quantity,
      })),

      metadata: {
        userId: String(currentUser.id),
        orderId,
      },

      success_url: "http://localhost:3000/orders?success=true",

      cancel_url: "http://localhost:3000/cart",
    });

    console.log("STRIPE SESSION CREATED");

    res.redirect(session.url);
  } catch (err) {
    console.log("CHECKOUT ERROR");
    console.log(err);

    res.status(500).send(err.message);
  }
});

router.post(
  "/webhook",
  bodyParser.raw({
    type: "application/json",
  }),
  async (req, res) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,

        req.headers["stripe-signature"],

        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(err.message);

      return res.status(400).send(`Webhook Error ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = Number(session.metadata.userId);

      const orderId = session.metadata.orderId;

      const data = await req.app.locals.services.users.getDB("users");

      const users = data[0].users;

      const userIndex = users.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        const orderIndex = users[userIndex].orders.findIndex(
          (order) => order.id === orderId,
        );

        if (orderIndex !== -1) {
          users[userIndex].orders[orderIndex].paid = true;

          console.log("ORDER PAID:", users[userIndex].orders[orderIndex]);
        }

        users[userIndex].cart = [];

        if (data[0].currentUser.id === userId) {
          const currentOrderIndex = data[0].currentUser.orders.findIndex(
            (order) => order.id === orderId,
          );

          if (currentOrderIndex !== -1) {
            data[0].currentUser.orders[currentOrderIndex].paid = true;
          }

          data[0].currentUser.cart = [];
        }

        await req.app.locals.services.users.saveToUsers(data);
      }
    }

    res.sendStatus(200);
  },
);

module.exports = router;
