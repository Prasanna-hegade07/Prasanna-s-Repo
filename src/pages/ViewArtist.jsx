import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewArtists.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

function formatListeners(n) {
  if (!n) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function formatDob(dob) {
  if (!dob) return "—";
  return new Date(dob).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function ViewArtists() {
  const navigate = useNavigate();
  const [artists, setArtists]         = useState([]);
  const [search, setSearch]           = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchArtists(); }, []);

  const fetchArtists = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/artists`);
      setArtists(res.data);
    } catch (err) { console.log(err); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/auth/delete-artist/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchArtists();
    } catch (err) { console.log(err); }
  };

  const filtered = artists.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="viewartist-container">

      <button className="back-link" onClick={() => navigate("/AdminDashboard")}>
        ‹ Back to Dashboard
      </button>

      {/* Header */}
      <div className="viewartist-header">
        <div className="viewartist-header-left">
          <h2>Artist Roster</h2>
          <p>{artists.length} artist{artists.length !== 1 ? "s" : ""} on the platform</p>
        </div>
        <button className="add-artist-btn" onClick={() => navigate("/admin/add-artist")}>
          ➕ Add Artist
        </button>
      </div>

      {/* Search */}
      <div className="viewartist-search">
        <span style={{ color: "#b3b3b3", fontSize: "14px" }}>🔍</span>
        <input
          placeholder="Search by name or genre…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎤</div>
          <p>{search ? "No artists match your search." : "No artists added yet."}</p>
        </div>
      ) : (
        <div className="artist-grid">
          {filtered.map(artist => (
            <div className="artist-admin-card" key={artist._id}>

              {/* Image */}
              <div className="artist-card-img-wrap">
                <img
                  src={
                    artist.image
                      ? `${BASE_URL}/uploads/${artist.image}`
                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt={artist.name}
                />
                <div className="artist-card-img-overlay" />
              </div>

              {/* Body */}
              <div className="artist-card-body">
                <h3>{artist.name}</h3>

                {artist.category && (
                  <div className="artist-category-badge">{artist.category}</div>
                )}

                <div className="listeners-pill">
                  🎧 {formatListeners(artist.monthlyListeners)} listeners
                </div>

                <div className="artist-card-meta">
                  <span>🎂 {formatDob(artist.dob)}</span>
                </div>

                <div className="artist-card-actions">
                  <button
                    className="artist-edit-btn"
                    onClick={() => navigate(`/artist/${artist._id}`)}
                  >
                    ✏ View
                  </button>
                  <button
                    className="artist-delete-btn"
                    onClick={() => setDeleteTarget(artist)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-icon">🎤</div>
            <h3>Remove Artist?</h3>
            <p>
              Are you sure you want to remove <strong>"{deleteTarget.name}"</strong> from
              the platform? Their songs will remain but the artist profile will be deleted.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="modal-confirm-delete" onClick={handleDelete}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ViewArtists;