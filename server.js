const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");
const articleRouter = require("./controllers/article-controller");
const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
  })
);
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.use("/", articleRouter);
// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/unit18Populater", {
//   useNewUrlParser: true
// });
MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Routes

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
