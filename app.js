//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const sugar = require("sugar");
const cliTruncate = require('cli-truncate');
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const posts = [];


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://shaikh:1234@cluster0.t4jyn.mongodb.net/ToDoList', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const blogSchema = {
  title: String,
  body: String
}

const Blog = mongoose.model("Blog", blogSchema)

const bloghome = new Blog({
  title: "Day 0",
  body: "Start of an epic journey"
})


app.get("/", function(req, res) {

  Blog.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Blog.insertMany(bloghome, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("OK");
        }
      });
      res.redirect("/")
    } else {
      res.render("home", {
        newListItems: foundItems,
        firstContent: homeStartingContent
      });
    }
  })

})



app.get("/compose", function(req, res) {
  res.render("compose", {});
})

app.get("/blog", function (req, res){
  res.render( "homeBlog");
})

app.get("/foods", function(req, res){
  res.render( "foods",);
})

app.get("/books", function(req, res){
  res.render( "books");
})


app.get("/post/:postName", function(req, res) {
  const requestedTitle = _.capitalize(req.params.postName);

  Blog.findOne({
    title: requestedTitle
  }, function(err, foundList) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        bloo: foundList
      });
    }

  })
})

app.post("/compose", function(req, res) {
  const title = _.capitalize(req.body.textHead);
  const body = req.body.textBody;

  const newblog = new Blog({
    title: title,
    body: body
  })

  newblog.save();
  res.redirect("/");

})

app.post("/delete", function(req, res){
  const checkItemId = req.body.del;

  Blog.findByIdAndDelete(checkItemId, function(err){
    console.log("Successful deletion");
    res.redirect("/");
  })

})



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
