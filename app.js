// PACKAGES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user");
const middleware = require('./middleware');

// CONFIG
mongoose.connect("mongodb://localhost/sih", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIG
app.use(require('express-session')({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


// ==============================
// ROUTES
// ==============================

// Home page
app.get('/', function (req, res) {
  res.render('home');
});

// Profile page
app.get('/profile', middleware.isLoggedIn, function (req, res) {
  res.render('profile');
})

// show register form
app.get("/register", function(req, res){
	res.render("register");
});

// handle signup logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			return res.redirect("back");
		} else {
			passport.authenticate("local")(req, res, function(){
				res.redirect("/profile");
			});
		}
	});
});

// Show login form
app.get('/login', function (req, res) {
  res.render("login");
})

// handle login
app.post("/login", passport.authenticate("local",{
	successRedirect: "/profile",
	failureRedirect: "/login"
}), function(req, res){

});

// logout route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

app.get('*', function (req, res) {
  res.send('Error 404 page not found!');
})


const port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("The YelpCamp server has started! on port ", port);
});