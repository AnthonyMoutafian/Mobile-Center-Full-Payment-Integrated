const fs = require("fs").promises;
const path = require("path");
const { ReadDBService } = require("./readDBService");

class SearchServices extends ReadDBService {
  async search(body) {
    const products = await super.getDB("products");

    const searchedProducts = products.filter((product) =>
      product.title.toLowerCase().includes(body),
    );

    const specifications = {};
    const brands = [];

    searchedProducts.forEach((product) => {
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
        searchProducts: searchedProducts,
        specifications: specifications,
        brands: brands,
    }
  }
}

module.exports.SearchServices = SearchServices;
