var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Post = require("../models/posts"),
    passport = require("passport"),
    middlewareObj = require("../middleware");


router.get("/new", (req, res) => {
    res.render("posts/new");
});
router.post('', (req, res) => {
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
            res.redirect("");
        }
    });
});
router.get('/:id', (req, res) => {
    Post.findById(req.params.id, function(err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/show", { post: foundPost });
        }
    });
});

router.get('/:id/edit', (req, res) => {
    Post.findById(req.params.id, function(err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/edit", { post: foundPost });
        }
    });
});

router.put('/:id', (req, res) => {
    var post = req.body.post;
    Post.findByIdAndUpdate(req.params.id, post, { useFindAndModify: false }, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/" + req.params.id);
        }
    });
});

router.delete('/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id, { useFindAndModify: false }, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});



module.exports = router;