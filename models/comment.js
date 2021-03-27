var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

var commentSchema = new mongoose.Schema({

    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: {
            type: mongoose.Schema.Types.String,
            ref: "User"
        },
        image: {
            type: mongoose.Schema.Types.String,
            ref: "User"
        }
    }

});

module.exports = mongoose.model("Comment", commentSchema);