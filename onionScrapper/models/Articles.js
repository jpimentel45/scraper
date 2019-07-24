const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//article Collection
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }],
    saved: {
        type: Boolean,
        required: true,
        default: false //update boolean later
    }
})

//store model and export
const Article = mongoose.model("articles", ArticleSchema);

module.exports = Article;