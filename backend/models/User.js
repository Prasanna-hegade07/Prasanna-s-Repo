const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
firstName:{
type:String,
required:true
},

lastName:{
type:String,
required:true
},

email:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:true
},

isPremium:{
type:Boolean,
default:false
},

premiumPlan:{
type:String,
default:"Free"
},

profilePic:{
type:String,
default:""
}

});


module.exports = mongoose.model("User",userSchema);