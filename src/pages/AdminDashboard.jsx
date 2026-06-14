import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalSongs: null,
    totalArtists: null,
    totalUsers: null,
    premiumUsers: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/admin/stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/Login");
  };

  const statCards = [
    { icon: "🎵", label: "Total Songs",   value: stats.totalSongs,   trend: "on platform" },
    { icon: "🎤", label: "Total Artists", value: stats.totalArtists, trend: "registered" },
    { icon: "👥", label: "Total Users",   value: stats.totalUsers,   trend: "registered" },
    { icon: "👑", label: "Premium Users", value: stats.premiumUsers, trend: "subscribed" },
  ];

  return (
    <div className="admin-shell">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-circle">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
              alt="Spotify"
            />
          </div>
          <div className="sidebar-logo-text">
            Spotify
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Overview</span>
          <button className="sidebar-item active">
            <span className="s-icon">📊</span> Dashboard
          </button>

          <span className="sidebar-section-label">Content</span>
          <button className="sidebar-item" onClick={() => navigate("/Addsongs")}>
            <span className="s-icon">➕</span> Add Song
          </button>
          <button className="sidebar-item" onClick={() => navigate("/Viewsongs")}>
            <span className="s-icon">🎵</span> View Songs
          </button>
          <button className="sidebar-item" onClick={() => navigate("/admin/add-artist")}>
            <span className="s-icon">🎤</span> Add Artist
          </button>
          <button className="sidebar-item" onClick={() => navigate("/admin/view-artists")}>
            <span className="s-icon">👁</span> View Artists
          </button>

          <span className="sidebar-section-label">Management</span>
          <button className="sidebar-item" onClick={() => navigate("/admin/subscriptions")}>
            <span className="s-icon">👑</span> Subscriptions
          </button>
          <button className="sidebar-item" onClick={() => navigate("/admin/users")}>
            <span className="s-icon">👥</span> Users
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-admin-tag">
            <div className="admin-avatar">A</div>
            <div className="admin-avatar-info">
              <h5>Admin</h5>
              <p>● Online</p>
            </div>
          </div>
          <button className="logout-sidebar-btn" onClick={handleLogout}>
            <span>🚪</span> Log out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h2>Dashboard</h2>
          <div className="admin-topbar-right">
            <span className="admin-badge">🛡 Admin</span>
          </div>
        </div>

        <div className="admin-content">

          {/* Welcome banner */}
          <div className="admin-welcome">
            <div className="admin-welcome-text">
              <h1>Welcome back, Admin 👋</h1>
              <p>Here's what's happening on your platform today.</p>
            </div>
            <div className="admin-welcome-icon">🎧</div>
          </div>

          {/* Stats */}
          <div className="admin-stats">
            {statCards.map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon">{s.icon}</div>
                <h3>
                  {loadingStats
                    ? <span className="stat-loading">…</span>
                    : s.value ?? "—"}
                </h3>
                <p>{s.label}</p>
                <div className="stat-trend">↑ {s.trend}</div>
              </div>
            ))}
          </div>

          {/* Action cards */}
          <h2 className="section-heading">Manage Content</h2>
          <div className="admin-cards">

            <div className="admin-card">
              <div className="card-icon-wrap">🎵</div>
              <h3>Songs</h3>
              <p>Add new tracks or browse all songs currently available on the platform.</p>
              <div className="card-actions">
                <button className="card-btn primary" onClick={() => navigate("/Addsongs")}>
                  + Add Song
                </button>
                <button className="card-btn secondary" onClick={() => navigate("/Viewsongs")}>
                  View All
                </button>
              </div>
            </div>

            <div className="admin-card">
              <div className="card-icon-wrap">🎤</div>
              <h3>Artists</h3>
              <p>Register new artists and manage their profiles and discography.</p>
              <div className="card-actions">
                <button className="card-btn primary" onClick={() => navigate("/admin/add-artist")}>
                  + Add Artist
                </button>
                <button className="card-btn secondary" onClick={() => navigate("/admin/view-artists")}>
                  View All
                </button>
              </div>
            </div>

            <div className="admin-card">
              <div className="card-icon-wrap">👑</div>
              <h3>Subscriptions</h3>
              <p>View and manage premium plans, billing cycles, and active subscribers.</p>
              <div className="card-actions">
                <button className="card-btn primary" onClick={() => navigate("/admin/subscriptions")}>
                  Manage Plans
                </button>
              </div>
            </div>

            <div className="admin-card">
              <div className="card-icon-wrap">👥</div>
              <h3>Users</h3>
              <p>Browse all registered users, view profiles, and manage accounts.</p>
              <div className="card-actions">
                <button className="card-btn primary" onClick={() => navigate("/admin/users")}>
                  View Users
                </button>
              </div>
            </div>

          </div>

          {/* Quick actions */}
          <h2 className="section-heading">Quick Actions</h2>
          <div className="quick-actions">
            <button className="quick-btn" onClick={() => navigate("/Addsongs")}>
              <span>➕</span> New Song
            </button>
            <button className="quick-btn" onClick={() => navigate("/admin/add-artist")}>
              <span>🎤</span> New Artist
            </button>
            <button className="quick-btn" onClick={() => navigate("/admin/view-artists")}>
              <span>👁</span> View Artists
            </button>
            <button className="quick-btn" onClick={() => navigate("/Viewsongs")}>
              <span>📋</span> Song Library
            </button>
            <button className="quick-btn" onClick={() => navigate("/admin/subscriptions")}>
              <span>👑</span> Premium Plans
            </button>
            <button className="quick-btn" onClick={() => navigate("/")}>
              <span>🏠</span> View Site
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;