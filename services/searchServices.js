const { ReadDBService } = require("./readDBService");

class SearchServices extends ReadDBService {
  async search(value) {
    const db = this.getDB();

    const searchedProducts = await db
      .collection("products")
      .find({
        title: {
          $regex: value,
          $options: "i",
        },
      })
      .toArray();

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

      specifications,

      brands,
    };
  }
}

module.exports.SearchServices = SearchServices;
