var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Post = require("../models/posts"),
    passport = require("passport"),
    middlewareObj = require("../middleware");



module.exports = router;