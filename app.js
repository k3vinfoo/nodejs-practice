var express = require("express"); 
var bodyParser = require("body-parser"); 
var path = require("path"); 
var expressValidator = require("express-validator"); 
var mongojs = require('mongojs');
var db = mongojs('nodejs-practice', ['users'])
var ObjectID = mongojs.ObjectID;

var app = express(); 

// middleware 
// var logger = function (req, res, next) {
// 	console.log('logging...'); 
// 	next(); 
// };

// app.use(logger); 

// setting up a view
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded:false}));

// global variables
app.use(function(req, res, next){
	res.locals.errors = null; 
	next(); 
}); 


// setting direct path html files (which are in public folder)
// set static path (any CSS folders, etc...)
app.use(express.static(path.join(__dirname, 'public')));


// express validator middleware

app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift() 
		, formParam = root; 

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value, value
		};
	}
}));

// var users = [
// 	{
// 		id: 1,
// 		first_name: 'John',
// 		last_name: 'Doe',
// 		email: 'johndoe@gmail.com',
// 	},
// 	{
// 		id: 2,
// 		first_name: 'Jane',
// 		last_name: 'Doe',
// 		email: 'janedoe@gmail.com',
// 	},
// 	{
// 		id: 3,
// 		first_name: 'Jill',
// 		last_name: 'Doe',
// 		email: 'jilldoe@gmail.com',
// 	}
// ]

app.get('/', function(req, res) {
	db.users.find(function (err, docs) {
	// docs is an array of all the documents in mycollection
	// console.log(docs);
	res.render('index', {
		title: 'Customers',
		users: docs, 
	});
})
	// res.send("Hello 123"); 
	// var title = 'Customers'; 
	
	// instead of sending a string, you can send an array 
});
app.post('/users/add', function(req, res){
	// console.log(req.body.first_name);

	// setting rules for our fields through express-validator
	req.checkBody('first_name', 'First name is required').notEmpty();
	req.checkBody('last_name', 'Last name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();


	var errors = req.validationErrors(); 

	if (errors) {
		res.render('index', {
			title: 'Customers',
			users: users, 
			errors: errors,
		});
	}
	else {
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
		}

		console.log("success"); 
		db.users.insert(newUser, function(err, result){
			if (err) {
				console.log(err);
			}
			res.redirect('/'); 
		
		});
	}	
});

app.delete('/users/delete/:id', function(req, res){
	console.log(req.params.id); 
	db.users.remove({_id: ObjectID(req.params.id)}, function(err,result){
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	})
});
app.listen(3000, function(){
	console.log("server started on port 3000");
});















