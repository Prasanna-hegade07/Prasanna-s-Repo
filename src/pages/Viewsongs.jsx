import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Viewsongs.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function ViewSongs() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // song to confirm-delete

  // Per-row player state: { songId: { playing, currentTime, duration } }
  const [playerState, setPlayerState] = useState({});
  const audioRefs = useRef({});

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/Viewsongs`);
      setSongs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (song) => setDeleteTarget(song);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/auth/delete-song/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchSongs();
    } catch (error) {
      console.log(error);
    }
  };

  // Mini player controls
  const togglePlay = (song) => {
    const audio = audioRefs.current[song._id];
    if (!audio) return;

    // Pause all others
    Object.entries(audioRefs.current).forEach(([id, a]) => {
      if (id !== song._id && a) {
        a.pause();
        setPlayerState(prev => ({ ...prev, [id]: { ...prev[id], playing: false } }));
      }
    });

    if (audio.paused) {
      audio.play();
      setPlayerState(prev => ({ ...prev, [song._id]: { ...prev[song._id], playing: true } }));
    } else {
      audio.pause();
      setPlayerState(prev => ({ ...prev, [song._id]: { ...prev[song._id], playing: false } }));
    }
  };

  const handleTimeUpdate = (id) => {
    const audio = audioRefs.current[id];
    if (!audio) return;
    setPlayerState(prev => ({
      ...prev,
      [id]: { ...prev[id], currentTime: audio.currentTime, duration: audio.duration || 0 }
    }));
  };

  const handleSeek = (e, id) => {
    const audio = audioRefs.current[id];
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * (audio.duration || 0);
  };

  const filtered = songs.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.artist?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="viewsong-container">

      {/* Header */}
      <div className="viewsong-header">
        <div className="viewsong-header-left">
          <h2>Song Library</h2>
          <p>{songs.length} song{songs.length !== 1 ? "s" : ""} on the platform</p>
        </div>
        <button className="add-song-btn" onClick={() => navigate("/Addsongs")}>
          ➕ Add Song
        </button>
      </div>

      {/* Search */}
      <div className="viewsong-search">
        <span className="search-ic">🔍</span>
        <input
          placeholder="Search by title, artist or genre…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <p>{search ? "No songs match your search." : "No songs added yet."}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Song</th>
                <th>Genre</th>
                <th>Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((song, index) => {
                const ps = playerState[song._id] || {};
                const progress = ps.duration ? (ps.currentTime / ps.duration) * 100 : 0;

                return (
                  <tr key={song._id}>

                    {/* Index */}
                    <td style={{ color: "#535353", width: "40px" }}>{index + 1}</td>

                    {/* Song info */}
                    <td>
                      <div className="song-cell">
                        {song.image
                          ? <img src={`${BASE_URL}/uploads/${song.image}`} className="vimg" alt={song.title} />
                          : <div className="vimg" style={{ background: "#282828", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎵</div>
                        }
                        <div className="song-cell-info">
                          <h4>{song.title}</h4>
                          <p>{song.artist?.name || "Unknown Artist"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="category-badge">{song.category}</span>
                    </td>

                    {/* Mini player */}
                    <td>
                      {song.audio ? (
                        <>
                          <audio
                            ref={el => audioRefs.current[song._id] = el}
                            onTimeUpdate={() => handleTimeUpdate(song._id)}
                            onLoadedMetadata={() => handleTimeUpdate(song._id)}
                            onEnded={() => setPlayerState(prev => ({ ...prev, [song._id]: { ...prev[song._id], playing: false } }))}
                          >
                            <source src={`${BASE_URL}/uploads/${song.audio}`} type="audio/mpeg" />
                          </audio>

                          <div className="mini-player">
                            <button
                              className={`mini-play-btn ${ps.playing ? "playing" : ""}`}
                              onClick={() => togglePlay(song)}
                            >
                              {ps.playing ? "⏸" : "▶"}
                            </button>

                            <div className="mini-progress-wrap">
                              <div className="mini-track" onClick={e => handleSeek(e, song._id)}>
                                <div className="mini-fill" style={{ width: `${progress}%` }} />
                              </div>
                              <div className="mini-time-row">
                                <span>{formatTime(ps.currentTime)}</span>
                                <span>{formatTime(ps.duration)}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span style={{ color: "#535353", fontSize: "12px" }}>No audio</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-btn">
                        <button className="edit-btn" onClick={() => navigate(`/edit-song/${song._id}`)}>
                          ✏ Edit
                        </button>
                        <button className="delete-btn" onClick={() => confirmDelete(song)}>
                          🗑 Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-icon">🗑</div>
            <h3>Delete Song?</h3>
            <p>
              Are you sure you want to delete <strong>"{deleteTarget.title}"</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="modal-confirm-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ViewSongs;