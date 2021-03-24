const express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    bodyParser = require("body-parser"),
    Post = require('./models/posts'),
    User = require("./models/users"),
    flash = require("connect-flash"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    PassportLocalMongoose = require("passport-local-mongoose"),
    RouterPosts = require("./routes/posts"),
    RouterIndex = require("./routes/index"),
    RouterComments = require("./routes/comments");


app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://127.0.0.1:27017/myblog", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));



app.use(require("express-session")({
    secret: "hi beaj welcome",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.currentuser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(methodOverride("_method"));
passport.use(new LocalStrategy({
    usernameField: 'email'
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/", RouterIndex);
app.use("/posts", RouterPosts);
app.use("/posts/:id/comments", RouterComments);






app.listen(3030, () => {
    console.log("server started");
})