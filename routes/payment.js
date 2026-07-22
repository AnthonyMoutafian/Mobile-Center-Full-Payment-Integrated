const express = require("express");
const Stripe = require("stripe");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const { ReadDBService } = require("../services/readDBService");
const readDBService = new ReadDBService();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const AMD_TO_USD = 380;

router.post("/create-checkout-session", async (req, res) => {
  try {
    const db = await readDBService.getDB();

    const currentUser = await db.collection("currentUser").findOne({});

    if (!currentUser) {
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

    await db.collection("users").updateOne(
      {
        _id: currentUser._id,
      },

      {
        $push: {
          orders: newOrder,
        },
      },
    );

    await db.collection("currentUser").updateOne(
      {
        _id: currentUser._id,
      },

      {
        $push: {
          orders: newOrder,
        },
      },
    );

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
        userId: String(currentUser._id),

        orderId,
      },

      success_url: "http://localhost:3000/orders?success=true",

      cancel_url: "http://localhost:3000/cart",
    });

    res.redirect(session.url);
  } catch (err) {
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
      return res.status(400).send(`Webhook Error ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const db = await readDBService.getDB();

      const userId = new ObjectId(session.metadata.userId);

      const orderId = session.metadata.orderId;

      const user = await db.collection("users").findOne({
        _id: userId,
      });

      if (user) {
        const updatedOrders = user.orders.map((order) => {
          if (order.id === orderId) {
            order.paid = true;
          }

          return order;
        });

        await db.collection("users").updateOne(
          {
            _id: userId,
          },

          {
            $set: {
              orders: updatedOrders,

              cart: [],
            },
          },
        );

        await db.collection("currentUser").updateOne(
          {
            _id: userId,
          },

          {
            $set: {
              orders: updatedOrders,

              cart: [],
            },
          },
        );
      }
    }

    res.sendStatus(200);
  },
);

module.exports = router;
