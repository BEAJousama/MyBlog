var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Comment = require("../models/comment"),
    passport = require("passport"),
    Post = require("../models/posts"),
    User = require("../models/users"),
    middlewareObj = require("../middleware");

router.get("/new", middlewareObj.isLogedin, function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
        } else {
            res.render("comments/new", { post, post });
        }
    });
});
router.post("/", middlewareObj.isLogedin, function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/posts");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);

                } else {
                    comment.author.id = req.user._id;
                    comment.author.image = req.user.image;
                    comment.author.username = req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    User.findById(req.user._id, (err, user) => {
                        if (err) {
                            console.log(err);

                        } else {
                            user.comments.push(comment);
                            user.save();
                            res.redirect("/posts/" + post._id);
                        }

                    })
                }

            });
        }
    });
});
router.delete("/:comment_id", middlewareObj.CheckCommentOwnership, function(req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, { useFindAndModify: false }, function(err, deletedcamp) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});
router.get("/:comment_id/edit", middlewareObj.CheckCommentOwnership, function(req, res) {
    Post.findById(req.params.id, function(err, foundpost) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    req.flash("error", err.message);
                    console.log(err);
                } else {
                    res.render("comments/edit", { post: foundpost, comment: foundComment });
                }
            });
        }
    });
});
router.put("/:comment_id", middlewareObj.CheckCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, { useFindAndModify: false }, function(err, updatedcamp) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

module.exports = router;