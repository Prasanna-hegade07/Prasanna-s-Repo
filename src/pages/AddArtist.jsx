import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Addsongs.css"; // reuses the same form style

const BASE_URL = "https://spotify-backend-lug8.onrender.com";
const CATEGORIES = ["Bollywood", "Sandalwood", "Pop", "Hip-Hop", "Classical", "Rock", "Jazz"];

function AddArtist() {
  const navigate = useNavigate();

  const [name, setName]                     = useState("");
  const [dob, setDob]                       = useState("");
  const [category, setCategory]             = useState("");
  const [monthlyListeners, setListeners]    = useState("");
  const [image, setImage]                   = useState(null);
  const [imagePreview, setImagePreview]     = useState(null);
  const [loading, setLoading]               = useState(false);
  const [showToast, setShowToast]           = useState(false);
  const toastTimer                          = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const triggerToast = () => {
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !dob || !category) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("category", category);
    formData.append("monthlyListeners", monthlyListeners);
    if (image) formData.append("image", image);

    try {
      await axios.post(`${BASE_URL}/api/auth/add-artist`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName(""); setDob(""); setCategory("");
      setListeners(""); setImage(null); setImagePreview(null);
      triggerToast();
    } catch (err) {
      console.log(err);
      alert("Error Adding Artist");
    } finally {
      setLoading(false);
    }
  };

  const isReady = name && dob && category;

  return (
    <div className="addsong-container">
      <div style={{ width: "100%", maxWidth: "520px" }}>

        <button className="back-link" onClick={() => navigate("/AdminDashboard")}>
          ‹ Back to Dashboard
        </button>

        <div className="addsong-card">

          <div className="addsong-card-header">
            <div className="addsong-icon">🎤</div>
            <div>
              <h2>Add New Artist</h2>
              <p>Register an artist on the platform</p>
            </div>
          </div>

          <form className="addsong-form" onSubmit={handleSubmit}>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Artist Name</label>
              <input
                id="name" type="text"
                placeholder="e.g. Arijit Singh"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            {/* DOB */}
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                id="dob" type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                required
                style={{ colorScheme: "dark" }}
              />
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

            {/* Monthly Listeners */}
            <div className="form-group">
              <label htmlFor="listeners">Monthly Listeners</label>
              <input
                id="listeners" type="text"
                placeholder="e.g. 5000000"
                value={monthlyListeners}
                onChange={e => setListeners(e.target.value)}
              />
            </div>

            {/* Artist Image */}
            <div className="form-group">
              <label>Artist Photo</label>
              <div className={`file-upload-zone ${image ? "has-file" : ""}`}>
                <input type="file" accept="image/*" onChange={handleImage} />
                {imagePreview
                  ? <img src={imagePreview} className="img-preview" alt="preview" />
                  : <div className="upload-icon">🎤</div>
                }
                <div className="upload-text">
                  <h4>{image ? image.name : "Click to upload photo"}</h4>
                  <p>{image ? "Image selected ✓" : "PNG, JPG up to 10MB"}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="addsong-submit"
              disabled={!isReady || loading}
            >
              {loading ? "Saving…" : "✓ Add Artist"}
            </button>

          </form>
        </div>
      </div>

      <div className={`toast ${showToast ? "show" : ""}`}>
        🎤 Artist added successfully!
      </div>
    </div>
  );
}

export default AddArtist;