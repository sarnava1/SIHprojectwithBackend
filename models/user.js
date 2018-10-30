var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, unique: false},
    firstName: {type: String, unique: false},
    lastName: {type: String, unique: false},
    email: {type: String, unique: true},
    organisation:{type: String, unique: false},
    organisationaddr:{type: String, unique: false},
    orgheadname:{type: String, unique: false},
    orgheadcontno:{type: Number, unique: false},
    rollno:{type: String, unique: false},
    pursueyear:{type: Number, unique: false},
    personalcontno:{type: Number, unique: false},
    hodname:{type: String, unique: false},
    hodcontno:{type: Number, unique: false},
    handledhvl:{type: Number, unique: false},
    teachingexp:{type: Number, unique: false}
    
});
//designation:{type: String, unique: false, required: true},
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);