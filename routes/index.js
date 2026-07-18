const express = require("express");
const { getDb } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDb();

    const products = await db.collection("products").find({}).toArray();

    const categories = await db.collection("categories").find({}).toArray();

    const currentUser = await db.collection("currentUser").findOne({});

    const cart = await req.app.locals.services.cartItems.getCart();

    const favorites = await req.app.locals.services.favorites.getFavorites();

    res.render("index", {
      products,

      categories,

      cartLength: cart.length,

      currentUser: currentUser || {},

      favorites,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

module.exports = router;
