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
 var sequelize = new Sequelize (url, { storage: storage, omit: true});

// Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//sequelize.sync() crea e inializa tabla de preguntas en DB

sequelize.sync()
.then(function() {
	return Quiz.count()
		 .then(function (c) {
			if(c == 0) {
			 return Quiz.create({ question: 'Capital de Italia', answer: 'Roma'})
			  .then(function() {
			  	console.log('Base de datos inicializada con datos');
			  });
			}
		});
	}).catch(function(error){
		console.log("Error Sincronizado las tablas de la BBDD", error);
		process.exit(1);
});

exports.Quiz = Quiz;	