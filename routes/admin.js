var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	if(LoginStatus)
		res.render('admin', {});
	else {
		console.log("Invalid Login");
        res.render('Login', {});

    }
});


module.exports=router;
