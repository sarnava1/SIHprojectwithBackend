//requiring the libraries that we need to complete our project
var express           = require("express"),
    app               = express(),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    flash             = require("connect-flash"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local"),
    methodOverride    = require("method-override"),
    //this is requiring our user model which we defined separately in the models subfolder
    User              = require("./models/user");

//we are requiring our routes which are defined in an external folder
//as the project gets complex we will soon be requiring many more routes here ;D
var indexRoutes      = require("./routes/index")

//connecting to our local db    
//mongoose.connect("mongodb://localhost/project1");
var url=process.env.DATABASEURL|| "mongodb://localhost/project1";
mongoose.connect(url);

//mongoose.connect("mongodb://sarnava:password1997@ds117749.mlab.com:17749/project_1");
//mongodb://sarnava:password1997@ds117749.mlab.com:17749/project_1
//just for testing purpose of our page
// app.get("/",function(req,res){
//     res.send("hiiii");
// });

//although we have made a routes folder separately we wont require it immediately as our page will have 3 routes presently and 
//it is of no use to make the routes folder separately but it is made thinking of future times

//using the body parser and setting the view engine to ejs and a few other petty jobs
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//although of no use now we may later on require the methodOverride method for greater handling of data
app.use(methodOverride("_method"));
//requiring/using flash for flash messages..we should use flash before we configure passpoert.js..ITS A RULE CHAMPS!!!
app.use(flash());

// PASSPORT CONFIGURATION
//few lines of hebrew for the uninitiated but it is nothing but just configuring our passport.js
//nothing to memorize guys...chill out!!!!!!!!!!!!
app.use(require("express-session")({
    secret: "online hvl",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this part is actually a middleware which will run for each and every template
//the next part is very important as this part is only a middleware and we need to progress from this part
//the code for displaying flash messages are written just before we redirect 
//this part actually send our common requirements to every route of our project
//this is a middleware which will run for each and every single route..if next() is not there it will just stop and if it is there
//then it will move on to the next middleware which is a route handler in most cases
app.use(function(req, res, next){
   //req.user gives us the details of the user and we are sending it to all the pages from here so that we can access the details of the 
   //user in each page so that we can use in for login and signup options
   //whatever we write inside res.locals is actually available in every template
   res.locals.currentUser = req.user;
   //this sends our error and sucess messages to all of our routes
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   //move on to the next code
   next();
});

//we will only do our work using the indexRoutes and thus we are calling it here
app.use("/", indexRoutes);


//the app is listening to the server 
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Online HVL server is up!!!!!!!!!");
});

