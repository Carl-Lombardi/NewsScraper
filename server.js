var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_xn5xm63m:mefj86a1glsmvfksk5ei1sol0i@ds217438.mlab.com:17438/heroku_xn5xm63m";

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
  axios.get("https://www.nhl.com/news/t-277350296").then(function (response) {
    var $ = cheerio.load(response.data);
    $("h1").each(function (i, element) {
      var result = {};

      result.title = $(this)
        .children()
        .text()
        .trim();
      result.link = "https://www.nhl.com" +
        $(this)
          .children()
          .attr("href");

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/clear", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.delete('/articles/:id', function (req, res) {
  db.Article.findByIdAndRemove({ _id: req.params.id })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});