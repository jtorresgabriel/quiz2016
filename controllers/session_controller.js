var userController = require('./user_controller');
var Sequelize = require('sequelize');
var url = require ('url');
var models =require ('../models');
var timeout = 12000 //en ms
 
var authenticate = function( login, password){
	return models.User.findOne({where: {username: login }}).then(function(user){
		if(user && user.verifyPassword(password)) {
			return user;
		} else {
			return null;
		}
	});
};

exports.loginRequired = function (req, res, next){ 
	if (req.session.user){
			next();
	} else{
		res.redirect('/session?redir=' +(req.param('redir') || req.url ));
		}
	};

	exports.adminOrMyselfRequired = function (req, res, next){
	var isAdmin = req.session.user.isAdmin;
	var quizAuthorId = req.quiz.AuthorId;
	var loggedUserId = req.session.user.id;

	if (isAdmin || userId === loggedUserId){
		next();
	} else{ 
		console.log('Ruta prohibida: no es el usuario logeado, ni un admin.');
		res.send(403);
	}
};

exports.adminAndNotMyselfRequired = function (req, res, next){
	var isAdmin = req.session.user.isAdmin;
	var quizAuthorId = req.quiz.AuthorId;
	var loggedUserId = req.session.user.id;

	if (isAdmin || userId !== loggedUserId){
		next();
	} else{ 
		console.log('Ruta prohibida: no es el usuario logeado, ni un admin.');
		res.send(403);
	}
};

// GET /session -- Formulario de login
exports.new = function(req, res, next) {
	var redir = req.query.redir || url.parse(req.headers.refer || "/").pathname;
	if(redir === '/session' || redir === '/user/new') { redir = "/"; }
		res.render('session/new', { redir: redir });
};
// POST /session -- Crear la sesion si usuario se autentica
exports.create = function(req, res, next) {

	var redir = req.body.redir || '/'
	var login = req.body.login;
	var password = req.body.password;

	authenticate(login, password)
	.then(function(user) {
		if (user) {
			req.session.user = {ịd:user.id, username: user.username, expires: new Date().getTime + 120000};
			res.redirect(redir); // redirección a redir
} else {
	req.flash('error', 'La autenticación ha fallado. Reinténtelo otra vez.');
	res.redirect("/session?redir="+redir);
}
})
	.catch(function(error) {
		req.flash('error', 'Se ha producido un error: ' + error);
		next(error);
	});
};
// DELETE /session -- Destruir sesion
exports.destroy = function(req, res, next) {
	delete req.session.user;
res.redirect("/session"); // redirect a login
};

/*//Autologout
exports.autologout = function(req, res, next){
	var date = new Date();
	var time = date.getTime();
	var sessionTime = 120000; 
	if(req.session){
		if(time - req.session.user.logoutTime > sessionTime){
			delete req.session.user;
			req.flash('info, Su sesion ha expirado')
			res.redirect("/session");
		}else{
			req.session.user.logoutTime = new Date().getTime();
		}
	}else{
	next();
}
};
*/
