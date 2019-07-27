
var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var Article = require("../models/Articles.js");
var Comment = require("../models/Comments.js");

//===================================================================
//             MAIN ROUTE DISPPLAY: SCRAPPING
//===================================================================

router.get('/scraped', (req, res) => {
    // First, tell the console what server.js is doing
    console.log(
        "\n***********************************\n" +
        "Grabbing every thread name and link\n" +
        "from The Onion's webdev board:" +
        "\n***********************************\n"
    );

    // Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
    axios.get("https://www.theonion.com/c/news-in-brief").then(function (response) {
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);

        // An empty array to save the data that we'll scrape
        var results = [];

        //===================================================================
        //              NAV BAR REQUEST FOR TEXT AND LINKS
        //===================================================================
        // $('.dfwuc8-0').each((i, el) => {
        //     var nav = $(el).text();
        //     const link = $(el).attr('href');
        //     //console.log(nav)
        //     //console.log(link)
        //     results.push({
        //         text: nav,
        //         navlink: link
        //     })
        // });
        //===================================================================
        //              BODY REQUEST FOR TEXT AND LINK
        //===================================================================

        $(".js_post_item").each(function (i, element) {
            // var results = [];
            var title = $(element).text();
            // console.log(title);
            var link = $(element).find('.sqekv3-5').children().attr("href")
            //var img = $(element).find('.dv4r5q-3')
            // Save these results in an object that we'll push into the results array we defined earlier
            // results.push({
            //     title: title,
            //     //image: img,
            //     link: link
            // });
            var results = {
                title,
                link
            }
            $(results.link).each(function (i, element) {
                console.log("this is the element: " + element)
                // var results = [];
                var title = $(element).text();
                // console.log(title);
                var link = $(element).find('.sqekv3-5').children().attr("href")
                //var img = $(element).find('.dv4r5q-3')
                // Save these results in an object that we'll push into the results array we defined earlier
                // results.push({
                //     title: title,
                //     //image: img,
                //     link: link
                // });
                var results = {
                    title,
                    link
                }

                //var img = $(element).find('.dv4r5q-3')

                // Log the results once you've looped through each of the elements found with cheerio
                // console.log(results)

                //Create new instance of Article model
                // Use Article model create a new post
                const post = new Article(results);
                // console.log("this is the post:" + post)
                console.log(post);
                // Now, save that post to the db
                post.save(function (err) {
                    // Log any errors
                    // err ? err : doc
                    if (err) console.log(err);
                    // console.log("this is the doc:" + doc)
                });
            });
            //var img = $(element).find('.dv4r5q-3')

            // Log the results once you've looped through each of the elements found with cheerio
            // console.log(results)

            //Create new instance of Article model
            // Use Article model create a new post
            const post = new Article(results);
            // console.log("this is the post:" + post)
            console.log(post);
            // Now, save that post to the db
            post.save(function (err) {
                // Log any errors
                // err ? err : doc
                if (err) console.log(err);
                // console.log("this is the doc:" + doc)
            });
        });
        res.redirect('/')
        
    });

})






//===================================================================
//             MAIN ROUTE DISPPLAY: RETURN SCRAPPING
//===================================================================
router.get('/articles', (req, res) => {

    Article.find({}).exec((err, doc) => {
        err ? err : res.json(doc)
        //err ? err : doc
    })
})

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("Comment")
        .then(function (Article) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(Article);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.post("/articles/: id" , (req, res)=>{
   Comment.create(req.body).then((Comment)=>{
       console.log(Comment)
       return Article.findOneAndUpdate({ _id: req.params.id }, { Comment: Comment._id }, { new: true });
   }).then((Article)=>{
       console.log(Article)
       res.json(Article);
   }).catch((err)=>{
       res.json(err);
   })
})

module.exports = router;
