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
    password: String
});

userSchema.plugin(PassportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model("User", userSchema);