module.exports = function(express, data, page) {

	express.get(page.path, function(req, res) {
		res.render(page.template, {
			title: 'User Dashboard'
		});
	});

};