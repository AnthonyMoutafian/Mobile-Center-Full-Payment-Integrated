const { ReadDBService } = require("./readDBService");
const { ObjectId } = require("mongodb");

class CartService extends ReadDBService {
  async getCart() {
    const db = await super.getDB();

    const currentUser = await db.collection("currentUser").findOne({});

    if (!currentUser) {
      const guestCart = await db.collection("guestCart").findOne({});

      return guestCart?.items || [];
    }

    return currentUser.cart || [];
  }

  async getCartProducts() {
    return await this.getCart();
  }

  async saveGuestCart(items) {
    const db = await super.getDB();

    await db.collection("guestCart").updateOne(
      {},

      {
        $set: {
          items,
        },
      },

      {
        upsert: true,
      },
    );
  }

  async updateUserCart(userId, cart) {
    const db = await super.getDB();

    await db.collection("currentUser").updateOne(
      {
        _id: userId,
      },

      {
        $set: {
          cart,
        },
      },
    );

    await db.collection("users").updateOne(
      {
        _id: userId,
      },

      {
        $set: {
          cart,
        },
      },
    );
  }

  async addToCart(id) {
    const db = await super.getDB();

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return [];
    }

    const currentUser = await db.collection("currentUser").findOne({});

    const cartProduct = {
      _id: product._id,

      categorySlug: product.categorySlug,

      brand: product.brand,

      title: product.title,

      price: product.price,

      image: product.image,

      quantity: 1,

      total: product.price,
    };

    if (!currentUser) {
      const cart = await this.getCart();

      const existing = cart.find(
        (item) => String(item._id) === String(product._id),
      );

      if (existing) {
        existing.quantity += 1;

        existing.total += product.price;
      } else {
        cart.push(cartProduct);
      }

      await this.saveGuestCart(cart);

      return cart;
    }

    const cart = currentUser.cart || [];

    const existing = cart.find(
      (item) => String(item._id) === String(product._id),
    );

    if (existing) {
      existing.quantity += 1;

      existing.total += product.price;
    } else {
      cart.push(cartProduct);
    }

    await this.updateUserCart(
      currentUser._id,

      cart,
    );

    return cart;
  }

  async plusQuantity(id) {
    return await this.addToCart(id);
  }

  async minusQuantity(id) {
    const db = await super.getDB();

    const currentUser = await db.collection("currentUser").findOne({});

    if (!currentUser) {
      const cart = await this.getCart();

      const item = cart.find((p) => String(p._id) === String(id));

      if (item && item.quantity > 1) {
        item.quantity--;

        item.total -= item.price;
      }

      await this.saveGuestCart(cart);

      return cart;
    }

    const cart = currentUser.cart || [];

    const item = cart.find((p) => String(p._id) === String(id));

    if (item && item.quantity > 1) {
      item.quantity--;

      item.total -= item.price;
    }

    await this.updateUserCart(
      currentUser._id,

      cart,
    );

    return cart;
  }

  async removeProduct(id) {
    const db = await super.getDB();

    const currentUser = await db.collection("currentUser").findOne({});

    if (!currentUser) {
      const cart = await this.getCart();

      const filtered = cart.filter((item) => String(item._id) !== String(id));

      await this.saveGuestCart(filtered);

      return filtered;
    }

    const cart = currentUser.cart || [];

    const filtered = cart.filter((item) => String(item._id) !== String(id));

    await this.updateUserCart(
      currentUser._id,

      filtered,
    );

    return filtered;
  }
}

module.exports.CartService = CartService;
