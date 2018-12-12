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


router.get("/logtoexp2",function(req, res) {
    res.render("logtoexp2");
});


router.get("/logtoexp3",function(req, res) {
    res.render("logtoexp3");
});

// show about page
router.get("/about", function(req, res){
   res.render("about"); 
});

// show instructions page
router.get("/instructions", function(req, res){
   res.render("instructions"); 
});

// show register form so that an unauthorised user can register himself
router.get("/register", function(req, res){
   res.render("register"); 
});

//renders the index page
router.get("/index",function(req, res) {
    res.render("index");
});

//renders the details page which for exp1
router.get("/details1",function(req, res) {
    res.render("details1");
});


//renders the details page which for exp2
router.get("/details2",function(req, res) {
    res.render("details2");
});


//renders the details page which for exp3
router.get("/details3",function(req, res) {
    res.render("details3");
});

//get the page for entering code of the first exp
router.get("/logtoexp1",middleware.isLoggedIn,function(req, res) {
    res.render("logtoexp1");
});

//the logic for seeing whether the code for exp1 is okay or not
router.post("/logtoexp1", function(req, res){
    if(req.body.codeforexp1!=process.env.EXPCODE1){
      req.flash("error", "Please enter the correct code that has been mailed to you");
      return res.redirect("/logtoexp1");    
    }else{
        return res.render("camera1.ejs");
    }
    
});

//get the page for entering code of the second exp
router.get("/logtoexp2",middleware.isLoggedIn,function(req, res) {
    res.render("logtoexp2");
});

//the logic for seeing whether the code for exp1 is okay or not
router.post("/logtoexp2", function(req, res){
    if(req.body.codeforexp2!=process.env.EXPCODE2){
      req.flash("error", "Please enter the correct code that has been mailed to you");
      return res.redirect("/logtoexp2");    
    }else{
        return res.render("camera2.ejs");
    }
    
});

//get the page for entering code of the third exp
router.get("/logtoexp3",middleware.isLoggedIn,function(req, res) {
    res.render("logtoexp3");
});

//the logic for seeing whether the code for exp1 is okay or not
router.post("/logtoexp3", function(req, res){
    if(req.body.codeforexp3!=process.env.EXPCODE3){
      req.flash("error", "Please enter the correct code that has been mailed to you");
      return res.redirect("/logtoexp3");    
    }else{
        return res.render("camera3.ejs");
    }
    
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

    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        organisation: req.body.organisation,
        organisationaddr: req.body.organisationaddr,
        orgheadname: req.body.orgheadname,
        orgheadcontno: req.body.orgheadcontno,
        rollno:req.body.rollno,
        pursueyear:req.body.pursueyear,
        personalcontno:req.body.personalcontno,
        hodname:req.body.hodname,
        hodcontno:req.body.hodcontno,
        handledhvl:req.body.handledhvl,
        teachingexp:req.body.teachingexp,
      });

    //the user in the callback fn is the new user that has been created just now
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //on err display a flash message and directly end the function over here by using the return statement to render the register page again
            //console.log(err);
            return res.render("register", {error: err.message});
            
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



//show contact info 
router.get("/contact", function(req, res){
   res.render("contact"); 
});



//handling login logic
//here we use the same passport.authenticate middleware that we used during registration process and the only difference is here
//we are registered from before..all the complex work is handled by passport js using the local strategy...so chill out guys!!!!!!!!
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/index",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to Online High Voltage Lab!'
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
