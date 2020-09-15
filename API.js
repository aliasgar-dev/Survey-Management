module.exports = function API(app){

	var bodyParser   = require("body-parser");
	var express 	 = require('express')
	var exphbs       = require("express-handlebars");
	var flash        = require('connect-flash');
	var cookieParser = require('cookie-parser');
	var session      = require('express-session'); 
	var cors 		 = require ('cors')
	
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(cors())

	app.engine("handlebars", exphbs({defaultLayout: "main"}));
	app.set("view engine","handlebars");
	app.use(express.static("public"));
	app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "http://localhost:4008");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
}
