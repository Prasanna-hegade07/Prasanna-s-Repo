import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ArtistProfile.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

function formatListeners(n) {
  if (!n) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function formatDob(dob) {
  if (!dob) return "—";
  const d = new Date(dob);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState({});
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchArtist();
  }, []);

  const fetchArtist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/artist/${id}`);
      setArtist(res.data.artist);
      setSongs(res.data.songs);
    } catch (error) {
      console.log(error);
    }
  };

  const artistImgUrl = artist.image
    ? `${BASE_URL}/uploads/${artist.image}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <div className="artist-profile">

      {/* ── Hero Banner ── */}
      <div className="artist-hero">
        {/* Blurred background from artist image */}
        <div
          className="artist-hero-bg"
          style={{ backgroundImage: `url(${artistImgUrl})` }}
        />
        <div className="artist-hero-gradient" />

        {/* Back button */}
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>

        <div className="artist-hero-content">
          <img
            src={artistImgUrl}
            alt={artist.name}
            className="artist-hero-img"
          />

          <div className="artist-hero-info">
            <div className="artist-verified">
              <span>✓</span> Verified Artist
            </div>

            <h1>{artist.name}</h1>

            <div className="artist-stats">
              <div className="artist-stat">
                <span className="artist-stat-label">Monthly Listeners</span>
                <span className="artist-stat-value">
                  {formatListeners(artist.monthlyListeners)}
                </span>
              </div>
              <div className="artist-stat">
                <span className="artist-stat-label">Date of Birth</span>
                <span className="artist-stat-value">{formatDob(artist.dob)}</span>
              </div>
              <div className="artist-stat">
                <span className="artist-stat-label">Total Songs</span>
                <span className="artist-stat-value">{songs.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="artist-content">

        {/* Genre badge */}
        {artist.category && (
          <div className="genre-badge">{artist.category}</div>
        )}

        <h2 className="songs-heading">Popular Songs</h2>

        <div className="artist-song-list">
          {songs.map((song, index) => (
            <div className="artist-song-card" key={song._id}>

              <div className="song-number">{index + 1}</div>
              <div className="song-play-hover">▶</div>

              <img
                src={`${BASE_URL}/uploads/${song.image}`}
                alt={song.title}
              />

              <div className="song-info">
                <h3>{song.title}</h3>
                <p>{song.category || artist.category}</p>
              </div>

              <div className="song-audio-col">
                <audio controls>
                  <source
                    src={`${BASE_URL}/uploads/${song.audio}`}
                    type="audio/mpeg"
                  />
                </audio>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
export default ArtistProfile;