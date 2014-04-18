module.exports = function(express, data, page) {

	express.get(page.path + 'detail/:userId', function(req, res) {
		res.render(page.template, {
			title: 'User Detail'
		});
	});

};
