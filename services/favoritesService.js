const { ReadDBService } = require("./readDBService");
const fs = require("fs").promises;
const path = require("path");

class FavoritesService extends ReadDBService {
  async getFavorites() {
    const users = await super.getDB("users");
    const currentUser = users[0].currentUser;

    if (!currentUser || Object.keys(currentUser).length === 0) {
      return [];
    } else {
      const favorites = currentUser.favorites;
      return favorites;
    }
  }
  async addFavorites(body) {
    const id = body;
    const users = await super.getDB("users");
    const products = await super.getDB("products");

    const allUsers = users[0].users;
    const currentUser = users[0].currentUser;

    const product = products.find((product) => product.id === id);

    if (!currentUser || Object.keys(currentUser).length === 0) {
      return [];
    } else {
      const index = allUsers.findIndex((user) => user.id === currentUser.id);

      const isAvailable = allUsers[index].favorites.find(
        (item) => item.id === product.id,
      );

      if (isAvailable) {
        return currentUser.favorites;
      } else {
        users[0].users[index].favorites.push(product);
        users[0].currentUser.favorites.push(product);

        await super.saveToUsers(users);
        return users[0].currentUser.favorites;
      }
    }
  }
  async deleteFavorites(body) {
    const id = body;
    const users = await super.getDB("users");
    const products = await super.getDB("products");
    const allUsers = users[0].users;
    const currentUser = users[0].currentUser;
    const product = products.find((product) => product.id === id);

    if (!currentUser || Object.keys(currentUser).length === 0) {
      return [];
    } else {
      const index = allUsers.findIndex((user) => user.id === currentUser.id);

      if (index === -1) return currentUser.favorites;

      const updatedFavorites = allUsers[index].favorites.filter(
        (item) => item.id !== product.id,
      );

      users[0].users[index].favorites = updatedFavorites;
      users[0].currentUser.favorites = updatedFavorites;

      await super.saveToUsers(users);

      return users[0].currentUser.favorites;
    }
  }
}

module.exports.FavoritesService = FavoritesService;
