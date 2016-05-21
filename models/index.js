var path = require ('path');

// cargar Modelo ORM
var Sequelize = require ('sequelize');

//usar BBDD SQLite:
// DATABASE_URL = sqlite:///
// DATABASE_STORAGE = quiz.sqlite

var url, storage;

if(!process.env.DATABASE_URL){
	url = "sqlite:///";
	storage = "quiz.sqlite";
}else {
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || "";
}
 var sequelize = new Sequelize (url, { storage: storage, omitNull: true});

// Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Importar la definición de la tabla Comments de comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));

// Importar la definición de la tabla Comments de comment.js
var User = sequelize.import(path.join(__dirname,'user'));

//Relación 1 a N entre Quiz y comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Relacion 1 a N entre User y Quiz:
User.hasMany(Quiz, {foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;	

//sequelize.sync() crea e inializa tabla de preguntas en DB
/*
sequelize.sync()
.then(function() {
	return Quiz.count().then(function (c) {
		if(c == 0) {
		 return Quiz.bulkCreate([{ question: 'Capital de Italia', answer: 'Roma'},
			 						{ question: 'Capital de Portugal', answer: 'Lisboa'}
			 						])
			  .then(function() {
			  	console.log('Base de datos inicializada con datos');
			  });
			}
		});
	}).catch(function(error){
		console.log("Error Sincronizado las tablas de la BBDD", error);
		process.exit(1);
});
*/
