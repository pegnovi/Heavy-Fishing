
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Heavy Fishing', error: req.query.error});
};

exports.register = function(req, res) {
	res.render('register', {title: 'Please Register', error: req.query.error});
};
