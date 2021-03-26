var express = require("express"),
    router = express.Router({ mergeParams: true }),
    User = require("../models/users"),
    Comment = require("../models/comment"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    middlewareObj = require("../middleware");

router.get("/new", middlewareObj.isLogedin, middlewareObj.IsAdmin, function(req, res) {
    res.render("users/new");

});
router.post("/new", middlewareObj.isLogedin, middlewareObj.IsAdmin, function(req, res) {
    var newUser = new User(req.body.user);
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect('/');
        } else {
            res.redirect("/");
        }
    });
});

router.delete('/:user_id', middlewareObj.isLogedin, middlewareObj.IsAdmin, (req, res) => {
    User.findByIdAndDelete(req.params.user_id, { useFindAndModify: false }, function(err, deleteduser) {
        if (err) {
            console.log(err);
        } else {
            Comment.deleteOne({
                author: { id: new mongoose.mongo.ObjectId(deleteduser._id) }
            }, { useFindAndModify: false }, function(err) {
                if (err) console.log(err);
                res.redirect("/");
            });
        }
    });
});
router.get("/:user_id/edit", middlewareObj.isLogedin, middlewareObj.IsAdmin, function(req, res) {
    User.findById(req.params.user_id, function(err, founduser) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("users/edit", { user: founduser });
        }
    });
});
router.put("/:user_id", middlewareObj.isLogedin, middlewareObj.IsAdmin, function(req, res) {
    User.findByIdAndUpdate(req.params.user_id, req.body.user, { useFindAndModify: false }, function(err, updateduser) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.redirect("/");
        }
    });
});

module.exports = router;