const jwt = require('jwt-simple');
const User = require('../models/users');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();

	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {

	res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
	const request = {
		email: req.body.email,
		password: req.body.password
	}

	User.findOne({ email: request.email }, function(err, existingUser) {
		if(err) { return next(err); }

		if(existingUser) {
			return res.status(422).send({ error: 'Email us in use.' });
		}

		const user = new User({
			email: request.email,
			password: request.password
		});

		user.save(function(err) {
			if(err) { return next(err); }

			res.json({ token: tokenForUser(user) });
		})
	});
}