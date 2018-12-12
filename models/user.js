var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:               {type: String, unique: true, required: true},
    password:               String,
    firstName:              String, 
    lastName:               String,
    email:                  {type: String, unique: true, required: true},
    organisation:           String,
    organisationaddr:       String,
    orgheadname:            String,
    orgheadcontno:          String,
    rollno:                 String,
    pursueyear:             String,
    personalcontno:         Number,
    hodname:                String, 
    hodcontno:              String,
    handledhvl:             String,
    teachingexp:            String
    
});
//designation:{type: String, unique: false, required: true},
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);