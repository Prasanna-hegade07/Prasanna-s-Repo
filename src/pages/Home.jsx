import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

const MOODS = ["All Moods", "Happy", "Sad", "Romantic", "Chill", "Party", "Motivational"];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Home() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  const playSong = (song) => setCurrentSong(song);

  useEffect(() => {
    fetchSongs(selectedMood);
    fetchArtists();
  }, [selectedMood]);

  const fetchSongs = async (mood = "") => {
    try {
      let url = `${BASE_URL}/api/auth/songs`;
      if (mood && mood !== "All Moods") url += `?mood=${mood}`;
      const res = await axios.get(url);
      setSongs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchArtists = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/artists`);
      setArtists(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app">

      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="nav-left">
          <div className="logo-circle">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
              alt="Spotify"
              className="spotify-logo"
            />
          </div>

          <button className="home-btn" onClick={() => navigate("/")}>🏠</button>

          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input placeholder="What do you want to play?" />
            <span className="library-icon">📚</span>
          </div>
        </div>

        <div className="nav-right">
          <Link to="/Subscription">Premium</Link>

          {user?.isPremium && (
            <div className="premium-badge">👑 Premium</div>
          )}

          {!user && (
            <>
              <Link to="/Registration">Sign up</Link>
              <Link to="/Login" className="login-btn">Log in</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/UserProfile" className="profile-avatar-btn" title="View Profile">
                <div className="profile-avatar-circle">
                  {(user.firstName || user.name || "U")[0].toUpperCase()}
                </div>
                <span className="profile-avatar-name">
                  {user.firstName || user.name}
                </span>
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="content full">

        {/* Greeting */}
        <div className="home-greeting">
          <h1>{getGreeting()}{user ? `, ${user.firstName || user.name}` : ""} 👋</h1>
          <p>Discover music that fits your mood.</p>
        </div>

        {/* Mood Chips */}
        <div className="mood-chips">
          {MOODS.map((mood) => (
            <button
              key={mood}
              className={`mood-chip ${selectedMood === (mood === "All Moods" ? "" : mood) ? "active" : ""}`}
              onClick={() => setSelectedMood(mood === "All Moods" ? "" : mood)}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Songs Section */}
        <div className="section">
          <div className="section-header">
            <h2>
              {selectedMood ? `${selectedMood} Picks` : "Trending Songs"}
            </h2>
            <button className="show-all-btn">Show all</button>
          </div>

          <div className="song-grid">
            {songs.map((song) => (
              <div className="song-card" key={song._id} onClick={() => playSong(song)}>
                <div className="cover">
                  <img
                    src={`${BASE_URL}/uploads/${song.image}`}
                    alt={song.title}
                  />
                  <button className="play-btn" onClick={(e) => { e.stopPropagation(); playSong(song); }}>
                    ▶
                  </button>
                </div>
                <h4>{song.title}</h4>
                <p>{song.artist?.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Artists Section */}
        <div className="section">
          <div className="section-header">
            <h2>Popular Artists</h2>
            <button className="show-all-btn">Show all</button>
          </div>

          <div className="artist-grid">
            {artists.map((artist) => (
              <Link
                to={`/artist/${artist._id}`}
                key={artist._id}
                className="artist-card"
              >
                <img
                  src={`${BASE_URL}/uploads/${artist.image}`}
                  alt={artist.name}
                />
                <h4>{artist.name}</h4>
                <span>Artist</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ── Player ── */}
      {currentSong && (
        <div className="player">
          <div className="player-left">
            <img
              src={`${BASE_URL}/uploads/${currentSong.image}`}
              alt={currentSong.title}
            />
            <div>
              <h4>{currentSong.title}</h4>
              <p>{currentSong.artist?.name}</p>
            </div>
          </div>

          <div className="player-center">
            <audio controls autoPlay>
              <source
                src={`${BASE_URL}/uploads/${currentSong.audio}`}
                type="audio/mpeg"
              />
            </audio>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;