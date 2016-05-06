var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller'); 
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/autor', function(req, res) {
  res.render('autor');
});


router.get('/question', quizController.question);
router.get('/check', quizController.check);


module.exports = router;
