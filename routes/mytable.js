var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(LoginStatus)
		res.render('student_instructor_timetable', {});
	else {
		//console.log("Invalid Login");
        res.render('Login', {});
    }
});

module.exports = router;
