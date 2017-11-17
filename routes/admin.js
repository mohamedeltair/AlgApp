var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	res.render('admin', {});
    req.session.authenticated = true;
});


module.exports=router;
