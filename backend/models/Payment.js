const mongoose = require("mongoose");
const { create } = require("../models/Artist");
const paymentSchema = new mongoose.Schema({
    userEmail:String,
    plan:String,
    amount:Number,
    paymentId:String,
    orderId:String,
    status:{type:String,default:"pending"},

    createdAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model("Payment",paymentSchema);