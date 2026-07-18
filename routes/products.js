const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.services.users.getDB();

    const products = await db.collection("products").find({}).toArray();

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");

    const db = req.app.locals.services.users.getDB();

    const product = await db.collection("products").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.services.users.getDB();

    const product = req.body;

    const result = await db.collection("products").insertOne(product);

    res.json({
      message: "Product created",

      id: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");

    const db = req.app.locals.services.users.getDB();

    await db.collection("products").updateOne(
      {
        _id: new ObjectId(req.params.id),
      },

      {
        $set: req.body,
      },
    );

    res.json({
      message: "Product updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");

    const db = req.app.locals.services.users.getDB();

    await db.collection("products").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.json({
      message: "Product deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
