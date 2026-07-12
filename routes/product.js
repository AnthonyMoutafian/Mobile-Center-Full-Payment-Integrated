const express = require("express");
const { ProductInfoController } = require("../controllers/productInfoController");


const router = express.Router();
const productInfoController = new ProductInfoController()

router.get(
  "/:slug",
  productInfoController.getProductInfo
);

module.exports = router;
