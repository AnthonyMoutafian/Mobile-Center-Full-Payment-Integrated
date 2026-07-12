const fs = require("fs").promises;
const path = require("path");
const { ReadDBService } = require("./readDBService");

class ProductsServices extends ReadDBService {
  async getProducts() {
    const products = await super.getDB("products");
    return products;
  }
}

module.exports.ProductsServices = ProductsServices;