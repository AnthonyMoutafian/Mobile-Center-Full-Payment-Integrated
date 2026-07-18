const { ObjectId } = require("mongodb");
const { ReadDBService } = require("./readDBService");

class FavoritesService extends ReadDBService {
  async getFavorites() {
    const db = this.getDB();

    const currentUser = await db.collection("currentUser").findOne({});

    if (!currentUser) return [];

    return currentUser.favorites || [];
  }

  async addFavorites(id) {
    const db = this.getDB();

    const currentUser = await db.collection("currentUser").findOne({});

    if (!currentUser) return [];

    const objectId = new ObjectId(id);

    const product = await db.collection("products").findOne({
      _id: objectId,
    });

    if (!product) return [];

    const exists = currentUser.favorites.some(
      (fav) => fav._id.toString() === id,
    );

    if (exists) {
      return currentUser.favorites;
    }

    await db.collection("currentUser").updateOne(
      {
        _id: currentUser._id,
      },
      {
        $push: {
          favorites: product,
        },
      },
    );

    await db.collection("users").updateOne(
      {
        _id: currentUser._id,
      },
      {
        $push: {
          favorites: product,
        },
      },
    );

    return [...currentUser.favorites, product];
  }

  async deleteFavorites(id) {
    const db = this.getDB();

    const currentUser = await db.collection("currentUser").findOne({});

    if (!currentUser) return [];

    const objectId = new ObjectId(id);

    await db.collection("currentUser").updateOne(
      {
        _id: currentUser._id,
      },
      {
        $pull: {
          favorites: {
            _id: objectId,
          },
        },
      },
    );

    await db.collection("users").updateOne(
      {
        _id: currentUser._id,
      },
      {
        $pull: {
          favorites: {
            _id: objectId,
          },
        },
      },
    );

    return await this.getFavorites();
  }
}

module.exports.FavoritesService = FavoritesService;
