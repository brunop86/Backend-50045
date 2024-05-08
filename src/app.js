const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require("path");
const PUERTO = 8080;
require("./database.js");

const ProductsRouter = require("./routes/product.router.js");
const CartsRouter = require("./routes/cart.router.js");
const ViewsRouter = require("./routes/view.router.js");
const UsersRouter = require("./routes/user.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

//Passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routes
app.use("/api/products", ProductsRouter);
app.use("/api/carts", CartsRouter);
app.use("/api/users", UsersRouter);
app.use("/", ViewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Server listening at http://localhost:${PUERTO}`);
});

//Websockets
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);

//Manejo de Errores
const manejadorError = require("./middleware/error.js");
app.use(manejadorError);

//Logger
const addLogger = require("./utils/logger.js");
//Middleware
app.use(addLogger);
//Route
app.get("/", (req, res) => {
  res.send("Logger Test");
});
//Test
app.get("/loggerTest", (req, res) => {
  req.logger.error("Error");
  req.logger.warning("Warning");
  req.logger.info("Surfing the app");
  res.send("Logs generated!");
});
