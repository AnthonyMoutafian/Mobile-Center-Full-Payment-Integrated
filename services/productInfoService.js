const { ReadDBService } = require("./readDBService");

class ProductInfoService extends ReadDBService {
  async getProductInfo(slug) {
    const db = this.getDB();

    const product = await db.collection("products").findOne({
      slug: slug,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const relatedProducts = await db
      .collection("products")
      .find({
        categorySlug: product.categorySlug,

        slug: {
          $ne: product.slug,
        },
      })
      .toArray();

    return {
      product,

      relatedProducts,

      title: product.title,
    };
  }
}

module.exports.ProductInfoService = ProductInfoService;
