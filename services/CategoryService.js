const fs = require("fs").promises;
const path = require("path");
const { ReadDBService } = require("./readDBService");

class CategoryService extends ReadDBService {
  async getCategory(body) {
    const products = await super.getDB("products");
    const categories = await super.getDB("categories");

    const category = categories.find((c) => c.slug === body);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    let filteredProducts = products.filter(
      (product) => product.categorySlug === body,
    );

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
        specifications: specifications,
        brands: brands,
        filteredProducts: filteredProducts,
    }
  }
}

module.exports.CategoryService = CategoryService;
