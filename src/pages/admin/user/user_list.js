module.exports = function(express, data, page) {

	express.get(page.path + 'list', function(req, res) {
		res.render(page.template, {
			title: 'User List'
		});
	});

};
