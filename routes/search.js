const express = require("express");
const { SearchController } = require("../controllers/searchController");


const router = express.Router();
const searchController = new SearchController()

router.get("/", searchController.search);

module.exports = router;
