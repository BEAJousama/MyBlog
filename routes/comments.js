var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Comment = require("../models/comment"),
    passport = require("passport"),
    Post = require("../models/posts"),
    middlewareObj = require("../middleware");


module.exports = router;