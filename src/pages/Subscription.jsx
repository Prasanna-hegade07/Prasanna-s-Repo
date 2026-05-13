import axios from "axios";
import "./Subscription.css";
import { useNavigate } from "react-router-dom";

function Subscription() {

const navigate = useNavigate();

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

const payNow = async (amount, planName) => {

try {

const { data } = await axios.post(
`${BASE_URL}/api/payment/create-order`,
{
amount,
planName
}
);

const options = {
key: "rzp_test_SjHmRDW188B4zu",
amount: data.amount,
currency: data.currency,
order_id: data.id,

method: {
upi: true,
card: true,
netbanking: true,
wallet: true
},

name: "Spotify Premium",
description: planName,

handler: async function (response) {

try {

const verify = await axios.post(
`${BASE_URL}/api/payment/verify-payment`,
{
razorpay_order_id: response.razorpay_order_id,
razorpay_payment_id: response.razorpay_payment_id,
razorpay_signature: response.razorpay_signature,
userId: localStorage.getItem("userId"),
plan: planName
}
);

console.log(verify.data);

if (verify.data.success) {
alert("Payment Success");
navigate("/");
}

} catch (error) {
console.log(error.response?.data || error);
alert("Verify payment failed");
}

},

theme: {
color: "#1db954"
}

};

const razorpay = new window.Razorpay(options);
razorpay.open();

} catch (error) {

console.log(error.response?.data || error);
alert("Payment failed");

}

};

return (

<div className="premium-container">

<h2>Upgrade to Premium</h2>

<div className="plan-wrapper">

<div className="plan-card">
<h3>1 Month Premium Plan</h3>
<p>₹99/month</p>

<ul>
<li>No Ads</li>
<li>Unlimited Skips</li>
<li>High Quality Audio</li>
<li>No Podcast Access</li>
</ul>

<button onClick={() => payNow(99, "1 Month Premium Plan")}>
Upgrade Now
</button>
</div>


<div className="plan-card">
<h3>3 Month Premium Plan</h3>
<p>₹299/3 months</p>

<ul>
<li>No Ads</li>
<li>Unlimited Skips</li>
<li>High Quality Audio</li>
<li>Limited Access to Podcast</li>
</ul>

<button onClick={() => payNow(299, "3 Month Premium Plan")}>
Upgrade Now
</button>
</div>


<div className="plan-card">
<h3>6 Month Premium Plan</h3>
<p>₹499/6 months</p>

<ul>
<li>No Ads</li>
<li>Unlimited Skips</li>
<li>High Quality Audio</li>
<li>Access to International Podcasts</li>
</ul>

<button onClick={() => payNow(499, "6 Month Premium Plan")}>
Upgrade Now
</button>
</div>


<div className="plan-card">
<h3>Student Special Premium Plan</h3>
<p>₹59/month</p>

<ul>
<li>No Ads</li>
<li>Unlimited Skips</li>
<li>High Quality Audio</li>
<li>Free Access to Podcast</li>
</ul>

<button onClick={() => payNow(59, "Student Special Premium Plan")}>
Upgrade Now
</button>

</div>

</div>

</div>

);

}

export default Subscription;