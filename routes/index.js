//requiring the routes and libraries and models
var express     = require("express");
var request = require("request");
var router      = express.Router();
var passport    = require("passport");
//requiring the user model
var User        = require("../models/user");
var middleware = require("../middleware");

//root route
//gives us the landing page
router.get("/", function(req, res){
    res.render("landing");
});

// show register form so that an unauthorised user can register himself
router.get("/register", function(req, res){
   res.render("register"); 
});

//renders the index page
router.get("/index",function(req, res) {
    res.render("index");
});

//renders the details page which for now shows "PAGE UNDER CONSTRUCTION"
//isLoggedIn is a middleware which checks if we are logged in or not
router.get("/details",middleware.isLoggedIn,function(req, res) {
    res.render("details");
});

router.get("/camera",middleware.isLoggedIn,function(req, res) {
    res.render("camera");
});


//handle sign up logic
router.post("/register", function(req, res){
    
    
    const captcha = req.body["g-recaptcha-response"];
    if (!captcha) {
      console.log(req.body);
      req.flash("error", "Please select captcha");
      return res.redirect("/register");
    }
    // secret key
    var secretKey = process.env.CAPTCHA;
    // Verify URL
    var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
    // Make request to Verify URL
    request.get(verifyURL, (err, response, body) => {
      // if not successful
      if (body.success !== undefined && !body.success) {
        req.flash("error", "Captcha Failed");
        return res.redirect("/register");
      }

    var newUser = new User({username: req.body.username});
    //the user in the callback fn is the new user that has been created just now
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //on err display a flash message and directly end the function over here by using the return statement to render the register page again
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        //passport.authenticate is a middleware..the signup logic first registers the user and then logs them in
        passport.authenticate("local")(req, res, function(){
            // on authentication display a flash message to welcome the new user
           req.flash("success", "Welcome to Online High Voltage Laboratory " + user.username);
           //only after displaying a flash message can we redirect..this is a rule!!!!!!!!!
           res.redirect("/index"); 
        });
    });
});
});

//show login form so that a registered user can login 
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
//here we use the same passport.authenticate middleware that we used during registration process and the only difference is here
//we are registered from before..all the complex work is handled by passport js using the local strategy...so chill out guys!!!!!!!!
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/index",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    
   //logout logic provided by the packages that we have installed
   req.logout();
   req.flash("success","Logged you out!");
   res.redirect("/index");
});


//exporting our logic from here to app.js main file
module.exports = router;
