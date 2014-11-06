exports.index = function(req, res){
	res.render('index');
};

exports.userpages = function (req, res) {
	var name = req.params.name;
	res.render('p/user/' + name);
};

exports.productpages = function(req, res) {
	var name = req.params.name;
	res.render('p/product/' + name);
};