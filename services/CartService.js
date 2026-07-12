const { ReadDBService } = require("./readDBService");
const fs = require("fs").promises;
const path = require("path");

class CartService extends ReadDBService {
  async saveToGuestCart(data) {
    const dbPath = path.join(__dirname, "..", "db", "guestCart.json");
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  }
  async getCart() {
    const users = await super.getDB("users");
    const currentUser = users[0].currentUser;

    if (!currentUser || Object.keys(currentUser).length === 0) {
      const cart = await super.getDB("guestCart");
      return cart;
    } else {
      const cart = currentUser.cart;
      return cart;
    }
  }
  async getCartProducts() {
    const users = await super.getDB("users");
    const currentUser = users[0].currentUser;

    if (!currentUser || Object.keys(currentUser).length === 0) {
      const cart = await super.getDB("guestCart");
      return cart;
    } else {
      const cart = currentUser.cart;
      return cart;
    }
  }
  async addToCart(body) {
    const id = body;

    const users = await super.getDB("users");
    const products = await super.getDB("products");

    const allUsers = users[0].users;
    const currentUser = users[0].currentUser;

    const product = {
      ...products.find((p) => p.id === id),
      quantity: 0,
      total: 0,
    };

    if (!currentUser || Object.keys(currentUser).length === 0) {
      const guestCart = await super.getDB("guestCart");

      const isAvailable = guestCart.find((item) => item.id === product.id);

      if (!isAvailable && product.inStock > 0) {
        product.quantity += 1;
        product.total += product.price;
        guestCart.push(product);

        await this.saveToGuestCart(guestCart);
        return guestCart;
      } else if (isAvailable && product.inStock > 0) {
        const index = guestCart.findIndex((item) => item.id === product.id);

        guestCart[index].quantity += 1;
        guestCart[index].total += product.price;

        await this.saveToGuestCart(guestCart);
        return guestCart;
      } else {
        return guestCart;
      }
    } else {
      const index = allUsers.findIndex((user) => user.id === currentUser.id);

      const isAvailable = allUsers[index].cart.find(
        (item) => item.id === product.id,
      );

      if (!isAvailable && product.inStock > 0) {
        product.quantity += 1;
        product.total += product.price;
        users[0].users[index].cart.push(product);
        users[0].currentUser.cart.push(product);
      } else if (isAvailable && product.inStock > 0) {
        const indexOfItemInUsers = users[0].users[index].cart.findIndex(
          (item) => item.id === product.id,
        );
        users[0].users[index].cart[indexOfItemInUsers].quantity += 1;
        users[0].users[index].cart[indexOfItemInUsers].total += product.price;
        users[0].currentUser.cart[indexOfItemInUsers].quantity += 1;
        users[0].currentUser.cart[indexOfItemInUsers].total += product.price;
      } else {
        const newData = [
          {
            users: allUsers,
            currentUser: currentUser,
          },
        ];
        return newData;
      }

      const newData = [
        {
          users: users[0].users,
          currentUser: users[0].currentUser,
        },
      ];

      await super.saveToUsers(newData);
      return newData[0].currentUser.cart;
    }
  }
  async plusQuantity(body) {
    const id = body;

    const users = await super.getDB("users");
    const products = await super.getDB("products");

    const allUsers = users[0].users;
    const currentUser = users[0].currentUser;

    const product = products.find((p) => p.id === id);

    if (!currentUser || Object.keys(currentUser).length === 0) {
      const guestCart = await super.getDB("guestCart");

      const isAvailable = guestCart.find((item) => item.id === product.id);

      if (!isAvailable && product.inStock > 0) {
        return guestCart;
      } else if (isAvailable && product.inStock > 0) {
        const index = guestCart.findIndex((item) => item.id === product.id);

        guestCart[index].quantity += 1;
        guestCart[index].total += product.price;

        await this.saveToGuestCart(guestCart);
        return guestCart;
      } else {
        return guestCart;
      }
    } else {
      const index = allUsers.findIndex((user) => user.id === currentUser.id);

      const isAvailable = allUsers[index].cart.find(
        (item) => item.id === product.id,
      );

      if (!isAvailable && product.inStock > 0) {
        return users[0].currentUser.cart
      } else if (isAvailable && product.inStock > 0) {
        const indexOfItemInUsers = users[0].users[index].cart.findIndex(
          (item) => item.id === product.id,
        );
        users[0].users[index].cart[indexOfItemInUsers].quantity += 1;
        users[0].users[index].cart[indexOfItemInUsers].total += product.price;
        users[0].currentUser.cart[indexOfItemInUsers].quantity += 1;
        users[0].currentUser.cart[indexOfItemInUsers].total += product.price;
      } else {
        const newData = [
          {
            users: allUsers,
            currentUser: currentUser,
          },
        ];
        return newData;
      }

      const newData = [
        {
          users: users[0].users,
          currentUser: users[0].currentUser,
        },
      ];

      await super.saveToUsers(newData);
      return newData[0].currentUser.cart;
    }
  }
  async minusQuantity(body) {
    const id = body;

    const users = await super.getDB("users");
    const products = await super.getDB("products");

    const allUsers = users[0].users;
    const currentUser = users[0].currentUser;

    const product = {
      ...products.find((p) => p.id === id),
      quantity: 0,
      total: 0,
    };

    if (!currentUser || Object.keys(currentUser).length === 0) {
      const guestCart = await super.getDB("guestCart");

      const isAvailable = guestCart.find((item) => item.id === product.id);

      if (isAvailable && isAvailable.quantity === 1) {
        return guestCart;
      } else {
        const index = guestCart.findIndex((item) => item.id === product.id);
        guestCart[index].quantity -= 1;
        guestCart[index].total -= product.price;

        await this.saveToGuestCart(guestCart);
        return guestCart;
      }
    } else {
      const index = allUsers.findIndex((user) => user.id === currentUser.id);

      const isAvailable = allUsers[index].cart.find(
        (item) => item.id === product.id,
      );

      if (isAvailable && isAvailable.quantity === 1) {
        const newData = [
          {
            users: users[0].users,
            currentUser: users[0].currentUser,
          },
        ];
        return newData[0].currentUser.cart;
      } else {
        const indexOfItemInUsers = users[0].users[index].cart.findIndex(
          (item) => item.id === product.id,
        );
        users[0].users[index].cart[indexOfItemInUsers].quantity -= 1;
        users[0].users[index].cart[indexOfItemInUsers].total -= product.price;
        users[0].currentUser.cart[indexOfItemInUsers].quantity -= 1;
        users[0].currentUser.cart[indexOfItemInUsers].total -= product.price;

        const newData = [
          {
            users: users[0].users,
            currentUser: users[0].currentUser,
          },
        ];
        await super.saveToUsers(newData);
        return newData[0].currentUser.cart;
      }
    }
  }
  async removeProduct(body) {
    const id = body;

    const users = await super.getDB("users");
    const products = await super.getDB("products");

    const allUsers = users[0].users;
    const currentUser = users[0].currentUser;

    const product = {
      ...products.find((p) => p.id === id),
      quantity: 0,
      total: 0,
    };

    if (!currentUser || Object.keys(currentUser).length === 0) {
      const guestCart = await super.getDB("guestCart");
      const index = guestCart.findIndex((item) => item.id === product.id);
      guestCart.splice(index, 1);
      await this.saveToGuestCart(guestCart);
      return guestCart;
    } else {
      const index = allUsers.findIndex((user) => user.id === currentUser.id);
      const indexOfItemInUsers = users[0].users[index].cart.findIndex(
        (item) => item.id === product.id,
      );
      users[0].users[index].cart.splice(indexOfItemInUsers, 1);
      users[0].currentUser.cart.splice(indexOfItemInUsers, 1);

      const newData = [
        {
          users: users[0].users,
          currentUser: users[0].currentUser,
        },
      ];
      await super.saveToUsers(newData);
      return newData[0].currentUser.cart;
    }
  }
}

module.exports.CartService = CartService;
