const express = require("express");
const productsRoute = express.Router();

productsRoute.get("/",(req,res)=>{
    res.render("")
})

module.exports = productsRoute