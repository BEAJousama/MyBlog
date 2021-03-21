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
    PassportLocalMongoose = require("passport-local-mongoose");


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



app.get("/", (req, res) => {
    Post.find({}, function(err, allposts) {
        if (err) {
            console.log(err);
        } else {
            res.render("accueil", { posts: allposts });
        }
    });
});
app.get("/login", function(req, res) {
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successFlash: "Welcome !",
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {

});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username, email: req.body.email });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "welcome to B-Blog " + user.username);
                res.redirect("/");
            });
        }
    });
});
app.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out ! ");
    res.redirect("/");
});



app.get("/posts/new", (req, res) => {
    res.render("posts/new");
});
app.post('/posts', (req, res) => {
    var title = req.body.title;
    var image = req.body.image;
    var text = req.body.text;
    // var author = {
    //     id: req.user._id,
    //     username: req.user.username
    // };
    var newpost = { title: title, image: image, text: text };
    Post.create(newpost, function(err, newlycreaed) {
        if (err) {
            console.log(err);
        } else {

            // newlycreaed.author.id = req.user._id;
            // newlycreaed.author.username = req.user.username;
            // newlycreaed.save();
            res.redirect("/posts");
        }
    });
});
app.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id, function(err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/show", { post: foundPost });
        }
    });
});

app.get('/posts/:id/edit', (req, res) => {
    Post.findById(req.params.id, function(err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/edit", { post: foundPost });
        }
    });
});

app.put('/posts/:id', (req, res) => {
    var post = req.body.post;
    Post.findByIdAndUpdate(req.params.id, post, { useFindAndModify: false }, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

app.delete('/posts/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id, { useFindAndModify: false }, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});




app.get("/portfolio", (req, res) => {
    res.render("portfolio");
});
app.listen(3030, () => {
    console.log("server started");
})