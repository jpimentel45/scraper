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
    comments: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
})

//store model and export
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;