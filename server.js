const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv");
const logger = require("morgan");
const multer = require("multer");
const upload = multer();
const cookieparser = require("cookie-parser");
const router = require("./lib/routes/routes");
const mongooseConnect = require("./lib/connection/mongoose-connection");
const app = express();

//seting dotenv environment
require("dotenv").config({ path: __dirname + "/.env" });
dotenv.config();

//mogon db
mongooseConnect();

app.use(logger("dev"));

// app.use(
// helmet({
// contentSecurityPolicy: false,
// })
// );

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcElem: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["fonts.gstatic.com"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
    },
  })
);

//seting Cookie
app.use(cookieparser("some_secret_1234"));

app.use(
  "/jquery",
  express.static(path.join(__dirname, "/node_modules/jquery/dist/"))
);
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/"))
);
app.use(
  "/datatables",
  express.static(path.join(__dirname, "/node_modules/datatables/media/"))
);
app.use(
  "/datatablebutton",
  express.static(path.join(__dirname, "/node_modules/datatables.net-buttons/"))
);
app.use(
  "/apexcharts",
  express.static(path.join(__dirname, "/node_modules/apexcharts/dist/"))
);
app.use(
  "/bootbox",
  express.static(path.join(__dirname, "/node_modules/bootbox/dist/"))
);

app.use(
  "/loading",
  express.static(path.join(__dirname, "/node_modules/loading-spinner/"))
);

app.use(express.static(path.join(__dirname, "./public")));

// View Engine setup
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

//seting up Router
app.use(router);

const port = process.env.PORT || "3000";

var server;

function start() {
  server = app.listen(port);
}

function end() {
  server.close();
}

exports.end = end;
exports.start = start;
exports.app = app;
