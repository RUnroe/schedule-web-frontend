// https://stackoverflow.com/a/57589215/6627273
// https://www.npmjs.com/package/connect-pg-simple

const session = require('express-session');

module.exports = session({
	store: new (require('connect-pg-simple')(session))()
	, secret: require(require.main.path + '/secrets').session.secret
	, name: 'waffle.session'
	, resave: false
	, saveUninitialized: false
	, cookie: {
		maxAge: 1000*60*60*24*(process.env.SESSION_LIFETIME_DAYS || 90)
		, sameSite: true
		, secure: true
		, httpOnly: true
	}
});

