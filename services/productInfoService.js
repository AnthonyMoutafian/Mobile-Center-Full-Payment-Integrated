const fs = require("fs").promises;
const path = require("path");
const { ReadDBService } = require("./readDBService");

class ProductInfoService extends ReadDBService {
  async getProductInfo(body) {
    const products = await super.getDB("products");
    const product = products.find((p) => p.slug === body);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const relatedProducts = products.filter(
      (p) => p.categorySlug === product.categorySlug && p.slug !== product.slug,
    );

    return {
      relatedProducts: relatedProducts,
      product: product,
      title: product.title,
    };
  }
}

module.exports.ProductInfoService = ProductInfoService;
