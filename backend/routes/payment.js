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
router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // rupees to paise
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log("ORDER ERROR:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// VERIFY PAYMENT  [FIXED: was updating 'subscription' but model field is 'subscriptionType']
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      plan
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // FIXED: use correct field names matching User model
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
        subscriptionType: "Premium",  // was 'subscription' — wrong field name
        premiumPlan: plan,
      },
      { new: true }  // return updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Return updated user so frontend can refresh localStorage
    res.json({
      success: true,
      message: "Payment verified",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isPremium: updatedUser.isPremium,
        subscriptionType: updatedUser.subscriptionType,
        premiumPlan: updatedUser.premiumPlan,
        profilePic: updatedUser.profilePic,
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// SUBSCRIBE (direct, no payment)
router.post("/subscribe", async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      subscriptionType: "Premium",
    });
    res.status(200).json({ message: "Subscription Activated" });
  } catch (error) {
    res.status(500).json({ message: "Payment Failed" });
  }
});

module.exports = router;