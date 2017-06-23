var express = require("express");
var User = require("./models/user");
var passport = require("passport");
var router = express.Router();

//http requests
const request = require('request-promise');

//init user model and flash
router.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});




/*************************       FACEBOOK LOGIN      ********************************/

// route for facebook login
router.get('/login/facebook', passport.authenticate('facebook', { scope : ['email','user_photos'] }));
 

// handle the callback after facebook has authenticated the user
router.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash: true
  })
);



// route for list of albums
router.get('/fb_search/:id', (req, res) => {

  // you need permission for most of these fields
  const userFieldSet = 'id, name, about, email, picture';

  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.9/${req.params.id}/albums?fields=cover_photo.fields(source)`,
    qs: {
      access_token: req.user.facebook.token,
      fields: userFieldSet
    }
  };

  request(options)
    .then(fbRes => {
      var parsedRes = JSON.parse(fbRes);
      res.render("albums",{albums: parsedRes });
    });
});






// route for list of album pictures
router.get('/album/:id', (req, res) => {

  const userFieldSet = 'id, name,source,album';


  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.9/${req.params.id}/photos`,
    qs: {
      access_token: req.user.facebook.token,
      fields: userFieldSet
    }
  };

  request(options)
    .then(fbRes => {
      var parsedRes = JSON.parse(fbRes);
      res.render("album",{album: parsedRes });
    });
});



/***************************************************************/





//route for main page 
router.get("/", function(req, res, next) {
		if(req.user) res.render("index");
		else res.render("login");
});




//GET login
router.get("/login", function(req, res) {
	res.render("login");
});



//GET logout
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});



//GET edit
router.get("/edit", ensureAuthenticated, function(req, res) {
	res.render("edit");
});



//POST edit
router.post("/edit", ensureAuthenticated, function(req, res, next) {
	if(req.user.local){
		req.user.local.displayName = req.body.displayname;
		if(req.body.bio) req.user.local.bio = req.body.bio;
	}
	else{
		req.user.facebook.username = req.body.displayname;
	}
	req.user.save(function(err) {
		if (err) { next(err); return;}
		req.flash("info", "Profile updated!");
		res.redirect("/edit");
	});
});




// to make sure user is authenticated (used in the GET edit route)
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash("info", "You must be logged in to see this page.");
		res.redirect("/login");
	}
}





//exporting routes
module.exports = router;