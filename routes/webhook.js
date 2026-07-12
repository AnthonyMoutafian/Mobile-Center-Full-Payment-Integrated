const express = require("express");
const bodyParser = require("body-parser");
const Stripe = require("stripe");

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/",
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
      return res.status(400).send(err.message);
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
      }

      if (data[0].currentUser.id === userId) {
        const currentOrderIndex = data[0].currentUser.orders.findIndex(
          (order) => order.id === orderId,
        );

        if (currentOrderIndex !== -1) {
          data[0].currentUser.orders[currentOrderIndex].paid = true;
        }
      }

      await req.app.locals.services.users.saveToUsers(data);
    }

    res.sendStatus(200);
  },
);

module.exports = router;
