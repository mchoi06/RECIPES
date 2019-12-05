const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recipesRoutes = require('./routes/recipes');

mongoose.connect('mongodb+srv://mchoi06:oof@mchoi06-dvlp7.mongodb.net/Comp20Final?retryWrites=true&w=majority', 
		{
			useUnifiedTopology: true,
			useNewUrlParser: true
		}
	);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET');
		return res.status(200).json({});
	}
	next();
});

//Routes which should handle requests
// app.use('/', recipesRoutes);
app.use('/recipes', recipesRoutes); 
// app.use('/', express.static)

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
}) 

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

app.listen(3003, () => {
	console.log("Server is up and listening on 3003...")
});

module.exports = app;
