var mongoose = require("mongoose");
var PassportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    password: String,
    role: String,
    image: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

userSchema.plugin(PassportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model("User", userSchema);