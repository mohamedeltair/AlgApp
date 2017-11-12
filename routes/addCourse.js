var express = require('express');
var router = express.Router();

/* GET addCourse Page. */
router.get('/', function(req, res, next) {
    res.render('addCourse', {});
});

module.exports = router;
