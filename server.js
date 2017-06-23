var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var routes = require("./routes");

var passport = require("passport");
var setUpPassport = require("./setuppassport");


var app = express();




setUpPassport();

app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());// handling cookies


// express-session
app.use(session({
	secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
	resave: true,
	saveUninitialized: true
}));


// for showing errors
app.use(flash());

//handling sessions and stuff
app.use(passport.initialize());
app.use(passport.session());






app.use(routes);

var port = process.env.PORT || 8080;        // set our port

/*
mongoose.connect("mongodb://localhost:27017/test");


app.listen(port, function() {
	console.log("Magic happening on port " + port+"...");
});
*/

// mlab user: lolimtesting

var connectionString = 'mongodb://user1:pass@ds163020.mlab.com:63020/moviesdb';

mongoose.connect(connectionString, (err, database) => {
  
	if (err) return console.log(err)
	app.listen(port, () => {
		console.log('Magic happening on port '+port+'...');
	})
});

