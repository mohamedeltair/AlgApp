var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.session = false;
    res.render('Login', {});
});

module.exports = router;
