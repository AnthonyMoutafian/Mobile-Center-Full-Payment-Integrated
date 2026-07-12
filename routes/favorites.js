const express = require('express');
const { FavoritesController } = require('../controllers/favoritesController');
const favoritesRouter = express.Router();

const favoritesController = new FavoritesController()

favoritesRouter.get("/", favoritesController.getFavoritesPage);
favoritesRouter.post("/:id", favoritesController.addFavorites);
favoritesRouter.post("/:id/delete", favoritesController.deleteFavorites);

module.exports = favoritesRouter