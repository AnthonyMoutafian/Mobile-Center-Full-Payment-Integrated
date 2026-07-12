const fs = require("fs").promises;
const path = require("path");
const { ReadDBService } = require("./readDBService");

class ProductsServices extends ReadDBService {
  
}

module.exports.ProductsServices = ProductsServices;