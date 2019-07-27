const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//comment Collection
const CommentSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String,
        required: true
    }
});

//store model and export
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;