var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: './uploads/' });

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller'); 
var userController = require('../controllers/user_controller'); 
var sessionController = require('../controllers/session_controller'); 

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/autor', function(req, res) {
  res.render('autor');
});

//Autoload de rutas que usen: quizId
router.param('quizId', quizController.load); //quizId
router.param('userId', userController.load); //userId
router.param('commentId', commentController.load); //commentId

router.get('/quizzes.:format?', sessionController.autologout, quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?', sessionController.autologout, quizController.show);
router.get('/quizzes/:quizId(\\d+)/check', sessionController.autologout, quizController.check);
router.get('/quizzes/new',  sessionController.autologout,sessionController.loginRequired, quizController.new);
router.post('/quizzes', sessionController.autologout, sessionController.loginRequired, upload.single('image'), 
										quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit', sessionController.autologout, sessionController.loginRequired,
											quizController.ownershipRequired,
											quizController.edit);
router.put('/quizzes/:quizId(\\d+)', sessionController.autologout, sessionController.loginRequired,
										quizController.ownershipRequired,
										upload.single('image'),
									 	quizController.update);
router.delete('/quizzes/:quizId(\\d+)', sessionController.autologout, sessionController.loginRequired,
											quizController.ownershipRequired,
										 	quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/comments/new', sessionController.loginRequired, commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments', sessionController.loginRequired, commentController.create);
router.post('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept', sessionController.loginRequired, commentController.accept);

router.get('/users', sessionController.autologout, userController.index);
router.get('/users/:userId(\\d+)', sessionController.autologout, userController.show);
router.get('/users/new', sessionController.autologout, userController.new);
router.post('/users', sessionController.autologout, userController.create);
router.get('/users/:userId(\\d+)/edit', sessionController.autologout, sessionController.loginRequired, 
										sessionController.adminOrMyselfRequired,
										userController.edit);
router.get('/users/:userId(\\d+)/', sessionController.autologout, sessionController.loginRequired, 
									sessionController.adminOrMyselfRequired,
									userController.update);
router.delete('/users/:userId(\\d+)/', sessionController.autologout, sessionController.loginRequired, 
										sessionController.adminAndNotMyselfRequired,
										userController.destroy);

router.get('/session', sessionController.new);
router.post('/session', sessionController.create);
router.delete('/session', sessionController.destroy);

module.exports = router;
