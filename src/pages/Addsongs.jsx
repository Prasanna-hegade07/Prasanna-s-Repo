import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Addsongs.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

const CATEGORIES = ["Bollywood", "Sandalwood", "Pop", "Hip-Hop", "Classical", "Jazz", "Rock"];

function AddSong() {
  const navigate = useNavigate();

  const [title, setTitle]       = useState("");
  const [artist, setArtist]     = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage]       = useState(null);
  const [audio, setAudio]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [artists, setArtists]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toastTimer = useRef(null);

  useEffect(() => {
    fetchArtists();
    return () => clearTimeout(toastTimer.current);
  }, []);

  const fetchArtists = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/artists`);
      setArtists(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAudio = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAudio(file);
  };

  const triggerToast = () => {
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !artist || !category || !audio || !image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("category", category);
    formData.append("image", image);
    formData.append("audio", audio);

    try {
      await axios.post(`${BASE_URL}/api/auth/add-song`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setTitle(""); setArtist(""); setCategory("");
      setImage(null); setAudio(null); setImagePreview(null);
      triggerToast();
    } catch (err) {
      console.log(err);
      alert("Error Adding Song");
    } finally {
      setLoading(false);
    }
  };

  const isReady = title && artist && category && image && audio;

  return (
    <div className="addsong-container">
      <div style={{ width: "100%", maxWidth: "520px" }}>

        {/* Back */}
        <button className="back-link" onClick={() => navigate("/AdminDashboard")}>
          ‹ Back to Dashboard
        </button>

        <div className="addsong-card">

          {/* Header */}
          <div className="addsong-card-header">
            <div className="addsong-icon">🎵</div>
            <div>
              <h2>Add New Song</h2>
              <p>Upload a track to the platform</p>
            </div>
          </div>

          <form className="addsong-form" onSubmit={handleSubmit}>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Song Title</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Kesariya"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Artist */}
            <div className="form-group">
              <label htmlFor="artist">Artist</label>
              <div className="select-wrap">
                <select
                  id="artist"
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
                  required
                >
                  <option value="">Select Artist</option>
                  {artists.map(a => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Genre / Category</label>
              <div className="select-wrap">
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Genre</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cover Image */}
            <div className="form-group">
              <label>Cover Image</label>
              <div className={`file-upload-zone ${image ? "has-file" : ""}`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />
                {imagePreview
                  ? <img src={imagePreview} className="img-preview" alt="preview" />
                  : <div className="upload-icon">🖼</div>
                }
                <div className="upload-text">
                  <h4>{image ? image.name : "Click to upload cover"}</h4>
                  <p>{image ? "Image selected ✓" : "PNG, JPG up to 10MB"}</p>
                </div>
              </div>
            </div>

            {/* Audio File */}
            <div className="form-group">
              <label>Audio File</label>
              <div className={`file-upload-zone ${audio ? "has-file" : ""}`}>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudio}
                />
                <div className="upload-icon">{audio ? "🎶" : "🎵"}</div>
                <div className="upload-text">
                  <h4>{audio ? audio.name : "Click to upload audio"}</h4>
                  <p>{audio ? "Audio selected ✓" : "MP3, WAV, M4A"}</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="addsong-submit"
              disabled={!isReady || loading}
            >
              {loading ? "Uploading…" : "✓ Add Song"}
            </button>

          </form>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        🎵 Song added successfully!
      </div>
    </div>
  );
}

export default AddSong;