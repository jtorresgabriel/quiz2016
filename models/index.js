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

// Importar la definición de la tabla attach de attah.js
var Attachment = sequelize.import(path.join(__dirname,'attachment'));

//Relación 1 a N entre Quiz y comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Relacion 1 a N entre User y Quiz:
User.hasMany(Quiz, {foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

//realacion 1-a-1
Attachment.belongsTo(Quiz);
Quiz.hasOne(Attachment);

User.hasMany(Comment, {foreignKey: 'AuthorId'});
Comment.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;	
exports.Attachment = Attachment;