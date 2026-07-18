const { MongoClient } = require("mongodb");

const URL = "mongodb://localhost:27017";

const client = new MongoClient(URL);

let db;

module.exports = {
  async connectToDB() {
    await client.connect();

    db = client.db("MobileCenterDB");

    console.log("MongoDB Connected");
  },

  getDb() {
    return db;
  },
};
