var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Post = require("../models/posts"),
    Comment = require("../models/comment"),
    User = require("../models/users"),
    passport = require("passport");

router.get("/", (req, res) => {
    Post.find({}, function(err, allposts) {
        if (err) {
            console.log(err);
        } else {
            res.render("accueil", { posts: allposts });
        }
    });
});
router.get("/login", function(req, res) {
    res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successFlash: "Welcome !",
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {

});

router.get("/register", function(req, res) {
    res.render("./");
});

router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username, email: req.body.email, role: "user" });
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
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out ! ");
    res.redirect("/");
});

router.get("/portfolio", (req, res) => {
    res.render("portfolio");
});


module.exports = router;