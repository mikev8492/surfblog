const express = require("express");
      mongoose = require("mongoose");
      bodyParser = require("body-parser");
      methodOverride = require("method-override");
      app = express();

mongoose.connect("mongodb+srv://mikev8492:1234@surfblog-dnpkw.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//MONGOOSE MODEL CONFIGURATION
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

//MANUALLY INPUTS SOME STARTER DATA
// Blog.create(
//   {
//     title: "Gulf Coast",
//     image: "https://images.unsplash.com/photo-1502209944943-85c1d6146367?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
//     body: "Blah blah blah"
//   }, function(err, blogs){
//       if (err) {
//         console.log(err)
//       } else {
//         console.log("Newly created blog: ");
//         console.log(blogs);
//       }
//   });

app.get("/", function(req, res){
  res.redirect("/surf");
});

//INDEX ROUTE
app.get("/surf", function(req, res){
  // GET ALL CAMPGROUNDS FROM THE DB
  Blog.find({}, function(err, allBlogs){
    if (err) {
      console.log(err);
    } else {
      res.render("index", {blogs: allBlogs});
    }
  });
});

//NEW ROUTE
app.get("/surf/new", function(req, res){
  res.render("new");
});

//CREATE ROUTE
app.post("/surf", function(req, res){
  Blog.create(req.body.blog, function(err, newBlog){
    if (err) {
      res.render("new");
      console.log(err);
    } else {
      res.redirect("/surf");
      // console.log(req.body);
      // console.log(newBlog);
    }
  });
});

//SHOW ROUTE
app.get("/surf/:id", function(req, res){
  //Blog.findById(id, callback)
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      res.redirect("/surf");
      console.log(err);
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

//EDIT ROUTE
app.get("/surf/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      res.redirect("/surf");
      console.log(err);
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE ROUTE
app.put("/surf/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if (err) {
      res.redirect("/surf");
      console.log(err);
    } else {
      res.redirect("/surf/" + req.params.id);
    }
  });
});

app.listen(3000, function(){
  console.log("serving to port 3000");
});
