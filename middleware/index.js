var Comment = require("../models/comment");
var Post = require("../models/posts");
var User = require("../models/users");
var middlewareObj = {};


middlewareObj.isLogedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be Loggedin to do that !!!");
    res.redirect("back");
};
middlewareObj.CheckCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.role == "administrator") {
                    next();
                } else {
                    req.flash("error", "You are not allowed to do this !!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be Loggedin to do that !!!");
        res.redirect("back");
    }
};

middlewareObj.IsAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        User.findById(req.user._id, function(err, foundUser) {
            if (foundUser.role == "administrator") {
                next();
            } else {
                res.redirect("back");
            }
        });
    }
}

module.exports = middlewareObj;