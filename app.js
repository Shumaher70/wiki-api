const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleSchema);
// ////////////////////////////////////////////Requests Targetting all Articles////////////////////////////////////
app.route('/articles')

.get((req, res)=>{

    Article.find()
    .then(foundArticles=> res.send(foundArticles))
    .catch(err=> res.send(err));

})

.post((req, res)=>{

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save().then(res.send('success')).catch(res.send('err'));

})

.delete((req, res)=>{

    Article.deleteMany()
    .then(res.send('Successfully deleted all articles'))
    .catch(res.send('sometghing wrong'));

});

////////////////////////////////////////Requests Targetting A Specific Article///////////////////////////////

app.route('/articles/:articleTile')

.get((req, res)=>{
   Article.findOne({title: req.params.articleTile}) 
   .then(foundArticle => res.send(foundArticle == null? 'No articles matching tat title was found.': foundArticle))
   .catch('something err');
})

.put((req, res)=>{
    Article.updateMany(
        {title: req.params.articleTile},
        {title: req.body.title, content: req.body.content},
        {ovrewrite: true})
    .then(res.send('successfully'))
    .catch(res.send('some kind of mistake, the provider is solving it now'));
})
.patch((req, res)=>{
    Article.updateMany(
        {title: req.params.articleTile},
        {$set: req.body}
    )
    .then(res.send('succsesfully Update Article.'))
    .catch(res.send('some kind of mistake, the provider is solving it now'));
})
.delete((req, res)=>{
    console.log(req.params.articleTile);
    Article.deleteMany({title: req.params.articleTile})
    .then(res.send('successfully deleted'))
    .catch(res.send('something workng'));
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});