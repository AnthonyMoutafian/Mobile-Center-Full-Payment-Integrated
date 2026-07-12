const express = require("express");
const { CategoryController } = require("../controllers/categoryController");

const categoryRoute = express.Router();
const categoryController = new CategoryController();

categoryRoute.get("/:slug", categoryController.getCategory);

module.exports = categoryRoute;
