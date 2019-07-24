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
        $('.dfwuc8-0').each((i, el) => {
            var nav = $(el).text();
            const link = $(el).attr('href');
            //console.log(nav)
            //console.log(link)
            results.push({
                text: nav,
                navlink: link
            })
        });
        //===================================================================
        //              BODY REQUEST FOR TEXT AND LINK
        //===================================================================

        $(".js_post_item").each(function (i, element) {

            var title = $(element).text();
            var link = $(element).find('.sqekv3-5').children().attr("href")
            //var img = $(element).find('.dv4r5q-3')
            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                title: title,
                //image: img,
                link: link
            });
        });

        // Log the results once you've looped through each of the elements found with cheerio
        console.log(results);

        //Create new instance of Article model
        var post = new Article(results)
        //save new instance to mongo db
        post.save((err, doc)=>{
            err ? err : doc
        })
    });
    res.redirect('/articles')
})

//===================================================================
//             MAIN ROUTE DISPPLAY: RETURN SCRAPPING
//===================================================================
router.get('/articles', (req,res)=>{

     Article.find({}).exec((err, doc)=>{
     err ? err : res.json(doc) 
     //err ? err : doc 
     })
})

module.exports = router;