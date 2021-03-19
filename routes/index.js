var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Post = require("../models/posts"),
    Comment = require("../models/comment"),
    User = require("../models/users"),
    passport = require("passport");



module.exports = router;