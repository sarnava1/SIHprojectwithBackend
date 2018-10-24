var User = require("../models/user");

// all the middleare goes here
//the middleware is where we see where a user is logged in or not and other things
//it comes in the middle and thus it is termed as a middleware
var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


middlewareObj.isCodeAccpt1 = function(req, res, next){
    if(req.body.codeforexp1 == process.env.EXPCODE1){
        return next();
    }
    req.flash("error", "You need to enter the correct code for exp 1 to perform it");
    res.redirect("/logtoexp1");
}

module.exports = middlewareObj;