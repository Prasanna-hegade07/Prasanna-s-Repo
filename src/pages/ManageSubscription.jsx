import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageSubscriptions.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

const PLANS = [
  { name: "1 Month Premium Plan",       price: 99,  period: "/month",    features: ["No Ads", "Unlimited Skips", "High Quality Audio"] },
  { name: "3 Month Premium Plan",       price: 299, period: "/3 months", features: ["No Ads", "Unlimited Skips", "High Quality Audio", "Limited Podcasts"] },
  { name: "6 Month Premium Plan",       price: 499, period: "/6 months", features: ["No Ads", "Unlimited Skips", "High Quality Audio", "International Podcasts"] },
  { name: "Student Special Premium Plan", price: 59, period: "/month",   features: ["No Ads", "Unlimited Skips", "High Quality Audio", "Free Podcasts"] },
];

function ManageSubscriptions() {
  const navigate = useNavigate();
  const [premiumUsers, setPremiumUsers] = useState([]);
  const [totalUsers, setTotalUsers]     = useState(0);
  const [loading, setLoading]           = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/auth/admin/stats`),
        axios.get(`${BASE_URL}/api/auth/admin/users`),
      ]);
      setTotalUsers(statsRes.data.totalUsers);
      // Filter only premium users
      setPremiumUsers(usersRes.data.filter(u => u.isPremium));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Count subscribers per plan
  const getCount = (planName) =>
    premiumUsers.filter(u => u.premiumPlan === planName).length;

  const getRevenue = (plan) => {
    const count = getCount(plan.name);
    return (count * plan.price).toLocaleString("en-IN");
  };

  return (
    <div className="subscriptions-container">

      <button className="back-link" onClick={() => navigate("/AdminDashboard")}>
        ‹ Back to Dashboard
      </button>

      <div className="sub-header">
        <h2>Subscriptions</h2>
        <p>Manage premium plans and active subscribers</p>
      </div>

      {/* Stats */}
      <div className="sub-stats">
        <div className="sub-stat">
          <div className="s-icon">👥</div>
          <h3>{loading ? "…" : totalUsers}</h3>
          <p>Total Users</p>
          <div className="trend">↑ registered</div>
        </div>
        <div className="sub-stat">
          <div className="s-icon">👑</div>
          <h3>{loading ? "…" : premiumUsers.length}</h3>
          <p>Premium Users</p>
          <div className="trend">↑ subscribed</div>
        </div>
        <div className="sub-stat">
          <div className="s-icon">📊</div>
          <h3>{loading ? "…" : totalUsers > 0 ? Math.round((premiumUsers.length / totalUsers) * 100) + "%" : "0%"}</h3>
          <p>Conversion Rate</p>
          <div className="trend">↑ free to premium</div>
        </div>
        <div className="sub-stat">
          <div className="s-icon">💰</div>
          <h3>{loading ? "…" : "₹" + premiumUsers.reduce((acc, u) => {
            const plan = PLANS.find(p => p.name === u.premiumPlan);
            return acc + (plan ? plan.price : 0);
          }, 0).toLocaleString("en-IN")}</h3>
          <p>Est. Revenue</p>
          <div className="trend">↑ total collected</div>
        </div>
      </div>

      {/* Plans */}
      <h2 className="sec-title">Plan Overview</h2>
      <div className="plans-grid">
        {PLANS.map(plan => (
          <div className="plan-admin-card" key={plan.name}>
            <h3>{plan.name}</h3>
            <div className="plan-price">
              ₹{plan.price}<span>{plan.period}</span>
            </div>
            <ul className="plan-features">
              {plan.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <div className="plan-subscribers">
              <span>Subscribers</span>
              <strong>{loading ? "…" : getCount(plan.name)}</strong>
            </div>
            <div className="plan-revenue">
              Est. Revenue: <strong>₹{loading ? "…" : getRevenue(plan)}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Premium subscribers table */}
      <h2 className="sec-title">Active Subscribers</h2>
      <div className="table-card">
        {premiumUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👑</div>
            <p>{loading ? "Loading…" : "No premium subscribers yet."}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Package</th>
                <th>Plan Type</th>
              </tr>
            </thead>
            <tbody>
              {premiumUsers.map((u, i) => (
                <tr key={u._id}>
                  <td style={{ color: "#535353", width: "40px" }}>{i + 1}</td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {(u.name || "U")[0].toUpperCase()}
                      </div>
                      <div className="user-cell-info">
                        <h4>{u.name}</h4>
                        <p>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="pkg-badge">
                      {u.premiumPlan && u.premiumPlan !== "None" ? u.premiumPlan : "Premium"}
                    </span>
                  </td>
                  <td style={{ color: "#b3b3b3", fontSize: "13px" }}>
                    {u.subscriptionType || "Premium"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default ManageSubscriptions;