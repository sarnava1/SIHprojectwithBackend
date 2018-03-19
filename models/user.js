var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    // useremail: String,
    password: String,
    username:String
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
