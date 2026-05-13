require("dotenv").config();
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");


const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
key_secret: process.env.RAZORPAY_KEY_SECRET
});


// CREATE ORDER
router.post("/create-order", async(req,res)=>{
try{

const options = {
amount: req.body.amount * 100, // rupees to paise
currency: "INR",
receipt: "receipt_" + Date.now()
};

const order = await razorpay.orders.create(options);

res.json(order);

}catch(error){

console.log("ORDER ERROR:",error);

res.status(500).json({
message:"Order creation failed"
});

}
});



// VERIFY PAYMENT


router.post("/verify-payment", async(req,res)=>{
try{

console.log(req.body);
console.log(process.env.RAZORPAY_KEY_SECRET);
const {
razorpay_order_id,
razorpay_payment_id,
razorpay_signature,
userId,
plan
}=req.body;


const generated_signature=crypto
.createHmac(
"sha256",
process.env.RAZORPAY_KEY_SECRET
)
.update(
razorpay_order_id + "|" + razorpay_payment_id
)
.digest("hex");


if(generated_signature===razorpay_signature){

await User.findByIdAndUpdate(
userId,
{
premium:true,
premiumPlan:plan
}
);

return res.json({
success:true,
message:"Payment verified"
});
}

res.status(400).json({
success:false,
message:"Invalid Signature"
});

}catch(err){
console.log(err);
res.status(500).json({
message:"Verification failed"
});
}
});

router.post("/subscribe", async (req, res) => {
  try {
    const { userId } = req.body;

    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      subscriptionType: "Premium",
    });

    res.status(200).json({
      message: "Subscription Activated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment Failed",
    });
  }
});
module.exports = router;