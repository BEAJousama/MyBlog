const express = require("express"),
    router = express.Router({ mergeParams: true }),
    Post = require("../models/posts"),
    Comment = require("../models/comment"),
    User = require("../models/users"),
    passport = require("passport");
const nodemailer = require('nodemailer');

router.get("/", (req, res) => {
    Post.find({}, function(err, allposts) {
        if (err) {
            console.log(err);
        } else {
            User.find({}, (err, allusers) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render("accueil", { posts: allposts, users: allusers });

                }
            });
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
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({ image: req.body.image, username: req.body.username, email: req.body.email, role: "user" });
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
router.post("/email", (req, res) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, //ssl
        auth: {
            user: 'b.blogg@zohomail.com',
            pass: 'B-Blog2021'
        }
    });

    let mailOptions = {
        from: 'b.blogg@zohomail.com',
        to: 'oussama.beaj2@gmail.com',
        subject: 'Email from Portfolio form',
        text: "Name : " + req.body.name + req.body.firstname + "\nEmail : " + req.body.email + "\nPhone : " + req.body.phone + "\nMessage : " + req.body.message
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.redirect("/portfolio");
});

router.get("*", (req, res) => {
    let d = new Date();
    res.send("Bad request \n " + d);

});

module.exports = router;