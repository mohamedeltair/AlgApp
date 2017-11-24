var express = require('express');
var router = express.Router();

/* GET addCourse Page. */
router.get('/', function(req, res, next) {
	if(LoginStatus)
		res.render('addCourse', {});
	else {
		//console.log("Invalid Login");
        res.render('Login', {});
    }
});

module.exports = router;
