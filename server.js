//Load the needed modules
var express = require("express");
var app = express();
var fs  = require('fs');
var cors = require('cors');
var secretKeyAuthMiddleware = require('./middlewares/secretkey-auth');
var jwtAuthMiddleware = require('./middlewares/jwt-auth');
var statusCode = require("./enums/statusCode");
var error = require("./models/error");
var response = require("./models/response");

//Handle default get request with welcome screen
app.get('/', function (req, res){
	res.end('Welcome to Image S3 middleware server!');
});

// enable cors
app.use(cors())

// Authenticate all incoming requests with secret key
// We can switch between secretKeyAuth & jwtAuth middlewares
// Later we might use both
// app.use(secretKeyAuthMiddleware);
// app.use(jwtAuthMiddleware);

//Require controllers
var controllers_path = __dirname + '/controllers'
, controller_files = fs.readdirSync(controllers_path);

controller_files.forEach(function (file) {
	require(controllers_path+'/'+file)(app);
});

//Handling Not found error (404)
app.use(function(req, res, next) {
	res.status(statusCode.NotFound)
		.json(err);
});

//Handling Image S3 Internal Server (500)
app.use(function(err, req, res, next) {
	res.status(err.statusCode)
    .json(err); 
});

//Running the server and listen to specific port
var port = process.env.PORT || 9999;
app.listen(port, function() {
	console.log('Image S3 middleware server is running and listening on port ' + port);
});