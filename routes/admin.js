var express = require('express');
var router = express.Router();
var app = require(app.js);

router.get('/', function(req, res, next) {
	//if(app.LoginStatus)
		res.render('admin', {});
	//else {
		//console.log("Invalid Login");
        //res.redirect('/');
    //}
});


module.exports=router;
