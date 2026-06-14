import axios from "axios";
import "./Subscription.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

const PLANS = [
  {
    name: "1 Month Premium Plan",
    price: 99,
    label: "₹99/month",
    features: ["No Ads", "Unlimited Skips", "High Quality Audio", "No Podcast Access"],
  },
  {
    name: "3 Month Premium Plan",
    price: 299,
    label: "₹299/3 months",
    features: ["No Ads", "Unlimited Skips", "High Quality Audio", "Limited Podcast Access"],
  },
  {
    name: "6 Month Premium Plan",
    price: 499,
    label: "₹499/6 months",
    features: ["No Ads", "Unlimited Skips", "High Quality Audio", "International Podcasts"],
    popular: true,
  },
  {
    name: "Student Special Premium Plan",
    price: 59,
    label: "₹59/month",
    features: ["No Ads", "Unlimited Skips", "High Quality Audio", "Free Podcast Access"],
  },
];

function Subscription() {
  const navigate = useNavigate();

  const payNow = async (amount, planName) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/payment/create-order`, { amount, planName });

      const options = {
        key: "rzp_test_SjHmRDW188B4zu",
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "Spotify Premium",
        description: planName,
        method: { upi: true, card: true, netbanking: true, wallet: true },
        theme: { color: "#1db954" },

        handler: async function (response) {
          try {
            const verify = await axios.post(`${BASE_URL}/api/payment/verify-payment`, {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              userId: localStorage.getItem("userId"),
              plan:   planName,
            });

            if (verify.data.success) {
              // FIXED: update localStorage so profile reflects premium immediately
              const updatedUser = verify.data.user;
              localStorage.setItem("user", JSON.stringify(updatedUser));

              alert(`🎉 Welcome to ${planName}!`);
              navigate("/UserProfile");  // send to profile so they see the update
            }
          } catch (error) {
            console.log(error.response?.data || error);
            alert("Payment verification failed. Contact support.");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.log(error.response?.data || error);
      alert("Could not initiate payment. Try again.");
    }
  };

  return (
    <div className="premium-container">
      <h2>Upgrade to Premium</h2>
      <div className="plan-wrapper">
        {PLANS.map((plan) => (
          <div className={`plan-card ${plan.popular ? "popular" : ""}`} key={plan.name}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <p>{plan.label}</p>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <button onClick={() => payNow(plan.price, plan.name)}>
              Upgrade Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subscription;