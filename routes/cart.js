var express = require("express");
const { CartController } = require("../controllers/cartController");

var router = express.Router();
const cartController = new CartController();

router.get("/", cartController.getCartProducts);

router.post("/:id", cartController.addToCart);
router.post("/:id/minus", cartController.minusQuantity);
router.post("/:id/plus", cartController.plusQuantity);
router.post("/:id/delete", cartController.removeProduct);

module.exports = router;
