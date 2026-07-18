const { getDb } = require("../db");

class ReadDBService {
  getDB() {
    return getDb();
  }

  async getCollection(collection) {
    const db = this.getDB();

    return await db.collection(collection).find({}).toArray();
  }

  async getOne(collection, query = {}) {
    const db = this.getDB();

    return await db.collection(collection).findOne(query);
  }

  async saveToUsers(id, data) {
    const db = this.getDB();

    await db.collection("users").updateOne(
      {
        _id: id,
      },

      {
        $set: data,
      },
    );
  }

  async saveToCurrentUser(id, data) {
    const db = this.getDB();

    await db.collection("currentUser").updateOne(
      {
        _id: id,
      },

      {
        $set: data,
      },
    );
  }
}

module.exports.ReadDBService = ReadDBService;
