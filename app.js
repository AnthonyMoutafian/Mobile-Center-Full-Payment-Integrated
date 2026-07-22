var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRoute = require("./routes/products");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const searchRouter = require("./routes/search");
const cartRouter = require("./routes/cart");
const { ReadDBService } = require("./services/readDBService");
const { SearchServices } = require("./services/searchServices");
const { ProductInfoService } = require("./services/productInfoService");
const { CategoryService } = require("./services/CategoryService");
const { CartService } = require("./services/CartService");
const authRouter = require("./routes/auth");
const { AuthServices } = require("./services/authServices");
const favoritesRouter = require("./routes/favorites");
const { FavoritesService } = require("./services/favoritesService");
const ordersRouter = require("./routes/orders");
const paymentRouter = require("./routes/payment");
const { DB } =  require("./services/db");
const connectToDB = new DB().connectToDB

var app = express();
connectToDB()


app.locals.services = {
  products: new ReadDBService(),
  categories: new ReadDBService(),
  users: new ReadDBService(),
  search: new SearchServices(),
  slugOfProduct: new ProductInfoService(),
  category: new CategoryService(),
  cartItems: new CartService(),
  auth: new AuthServices(),
  favorites: new FavoritesService(),
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));

app.use("/", paymentRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRoute);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/search", searchRouter);
app.use("/cart", cartRouter);
app.use("/api", authRouter);
app.use("/favorites", favoritesRouter);
app.use("/orders", ordersRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
