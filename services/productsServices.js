const { ReadDBService } = require("./readDBService");

class ProductsServices extends ReadDBService {
  async getProducts() {
    const db = await super.getDB();

    const products = await db.collection("products").find({}).toArray();

    return products;
  }
}

module.exports.ProductsServices = ProductsServices;
