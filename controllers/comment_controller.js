	var models = require ('../models');
	var Sequelize = require('sequelize');

	exports.load = function (req, res, next, commentId) {
	models.Comment.findById(commentId).then(function(comment) {
			if (comment) {
				req.comment = comment;
				next();
		}else{
			next( new Error ('No exite commentId=' + commentId));
		}
	}).catch(function (error) {	next(error); });
};

	//GET/ quiezzes/:quizId/comments/new
	exports.new =  function(req, res, next){
		var comment = models.Quiz.build({text: ""})
		res.render('comments/new', { comment: comment,
			quiz: req.quiz});
	};

	// POST /quizes/:quizId/comments
	exports.create = function(req, res, next) {
		var authorId = req.session.user && req.session.user.id ||0;
		var username = req.session.user && req.session.user.username.id ||0;
		var comment = models.Comment.build(
			{ text: req.body.comment.text,
				QuizId: req.quiz.id, 
				AuthorId: authorId
			});
		comment.save()
		.then(function(comment) {
			req.flash('success', 'Comentario creado con éxito.');
			res.redirect('/quizzes/' + req.quiz.id);
		})
		.catch(Sequelize.ValidationError, function(error) {
			req.flash('error', 'Errores en el formulario:');
			for (var i in error.errors) {
				req.flash('error', error.errors[i].value);
			};
			res.render('comments', { comment: comment,
				quiz: req.quiz});
		})
		.catch(function(error) {
			req.flash('error', 'Error al crear un Comentario: '+error.message);
			next(error);
		});
	};

	exports.accept = function(req, res, next) {
		req.comment.accept = true;
		req.comment.save(["accept"]).then(function(comment) {
			req.flash('success', 'Comentario creado con éxito.');
			res.redirect('/quizzes/' + req.quiz.id);
		})
		.catch(function(error) {
			req.flash('error', 'Error al crear un Comentario: '+error.message);
			next(error);
		});
	};