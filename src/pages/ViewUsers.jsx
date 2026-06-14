import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewUsers.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

function ViewUsers() {
  const navigate = useNavigate();
  const [users, setUsers]           = useState([]);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all"); // all | premium | free
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/admin/users`);
      setUsers(res.data);
    } catch (err) { console.log(err); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/auth/admin/delete-user/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) { console.log(err); }
  };

  const filtered = users.filter(u => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "premium" ? u.isPremium :
      !u.isPremium;
    return matchSearch && matchFilter;
  });

  const premiumCount = users.filter(u => u.isPremium).length;

  return (
    <div className="viewusers-container">
      <button className="back-link" onClick={() => navigate("/AdminDashboard")}>
        ‹ Back to Dashboard
      </button>

      {/* Header */}
      <div className="viewusers-header">
        <div className="viewusers-header-left">
          <h2>Users</h2>
          <p>{users.length} registered · {premiumCount} premium</p>
        </div>
      </div>

      {/* Search */}
      <div className="viewusers-search">
        <span style={{ color: "#b3b3b3", fontSize: "14px" }}>🔍</span>
        <input
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {["all", "premium", "free"].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All Users" : f === "premium" ? "👑 Premium" : "Free"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p>{search ? "No users match your search." : "No users found."}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Plan</th>
                <th>Package</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id}>
                  <td style={{ color: "#535353", width: "40px" }}>{i + 1}</td>
                  <td>
                    <div className="user-cell">
                      <div className={`user-avatar ${u.isPremium ? "premium-av" : ""}`}>
                        {(u.name || "U")[0].toUpperCase()}
                      </div>
                      <div className="user-cell-info">
                        <h4>{u.name}</h4>
                        <p>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`plan-badge ${u.isPremium ? "premium" : "free"}`}>
                      {u.isPremium ? "👑 Premium" : "Free"}
                    </span>
                  </td>
                  <td style={{ color: "#b3b3b3", fontSize: "13px" }}>
                    {u.premiumPlan && u.premiumPlan !== "None" ? u.premiumPlan : "—"}
                  </td>
                  <td>
                    <span className={`status-dot ${u.isPremium ? "active" : ""}`}>
                      {u.isPremium ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btn">
                      <button className="del-btn" onClick={() => setDeleteTarget(u)}>
                        🗑 Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-icon">👤</div>
            <h3>Remove User?</h3>
            <p>
              Are you sure you want to remove <strong>"{deleteTarget.name}"</strong>?
              This will permanently delete their account.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="modal-confirm-delete" onClick={handleDelete}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewUsers;