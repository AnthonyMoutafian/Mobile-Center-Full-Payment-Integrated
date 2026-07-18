const { ReadDBService } = require("./readDBService");

class ProductsServices extends ReadDBService {
  async getProducts() {
    const db = this.getDB();

    const products = await db.collection("products").find({}).toArray();

    return products;
  }
}

module.exports.ProductsServices = ProductsServices;
