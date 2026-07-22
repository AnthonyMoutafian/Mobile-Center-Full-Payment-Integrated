const { ReadDBService } = require("./readDBService");

class CategoryService extends ReadDBService {
  async getCategory(slug) {
    const db = await super.getDB();

    const category = await db.collection("categories").findOne({
      slug: slug,
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const filteredProducts = await db
      .collection("products")
      .find({
        categorySlug: slug,
      })
      .toArray();

    const specifications = {};

    const brands = [];

    filteredProducts.forEach((product) => {
      if (!brands.includes(product.brand)) {
        brands.push(product.brand);
      }

      product.params.forEach((param) => {
        if (!specifications[param.title]) {
          specifications[param.title] = [];
        }

        if (!specifications[param.title].includes(param.desc)) {
          specifications[param.title].push(param.desc);
        }
      });
    });

    return {
      title: category.title,

      specifications,

      brands,

      filteredProducts,
    };
  }
}

module.exports.CategoryService = CategoryService;
