var express = require("express");
const { OrdersController } = require("../controllers/ordersController");

var router = express.Router();
const ordersController = new OrdersController();

router.get("/", ordersController.getOrders);

module.exports = router;
