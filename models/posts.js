var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

var postsSchema = new mongoose.Schema({
    title: String,
    image: String,
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String

    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Posts", postsSchema);