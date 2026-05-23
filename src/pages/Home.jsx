import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Home.css";

const BASE_URL = "https://spotify-backend-lug8.onrender.com";
const MOODS = ["All Moods", "Happy", "Sad", "Romantic", "Chill", "Party", "Motivational"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function Home() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

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
    } catch (err) { console.log(err); }
  };

  const fetchArtists = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/artists`);
      setArtists(res.data);
    } catch (err) { console.log(err); }
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setIsLiked(false);
    setCurrentTime(0);
  };

  // Sync audio element when song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.load();
    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentSong]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (isShuffle && songs.length > 1) {
      const idx = Math.floor(Math.random() * songs.length);
      playSong(songs[idx]);
    } else {
      const idx = songs.findIndex(s => s._id === currentSong?._id);
      if (idx >= 0 && idx < songs.length - 1) playSong(songs[idx + 1]);
      else setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setIsMuted(v === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    audioRef.current.volume = next ? 0 : volume;
  };

  const skipNext = () => {
    const idx = songs.findIndex(s => s._id === currentSong?._id);
    if (idx >= 0 && idx < songs.length - 1) playSong(songs[idx + 1]);
  };

  const skipPrev = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0; return;
    }
    const idx = songs.findIndex(s => s._id === currentSong?._id);
    if (idx > 0) playSong(songs[idx - 1]);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="app">

      {/* Hidden audio element */}
      {currentSong && (
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          style={{ display: "none" }}
        >
          <source src={`${BASE_URL}/uploads/${currentSong.audio}`} type="audio/mpeg" />
        </audio>
      )}

      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="nav-left">
          <div className="logo-circle">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify" className="spotify-logo" />
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
          {user?.isPremium && <div className="premium-badge">👑 Premium</div>}
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
                <span className="profile-avatar-name">{user.firstName || user.name}</span>
              </Link>
              <button className="logout-btn" onClick={handleLogout}>Log out</button>
            </>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="content full">
        <div className="home-greeting">
          <h1>{getGreeting()}{user ? `, ${user.firstName || user.name}` : ""} 👋</h1>
          <p>Discover music that fits your mood.</p>
        </div>

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

        <div className="section">
          <div className="section-header">
            <h2>{selectedMood ? `${selectedMood} Picks` : "Trending Songs"}</h2>
            <button className="show-all-btn">Show all</button>
          </div>
          <div className="song-grid">
            {songs.map((song) => (
              <div className="song-card" key={song._id} onClick={() => playSong(song)}>
                <div className="cover">
                  <img src={`${BASE_URL}/uploads/${song.image}`} alt={song.title} />
                  <button className="play-btn" onClick={(e) => { e.stopPropagation(); playSong(song); }}>▶</button>
                </div>
                <h4>{song.title}</h4>
                <p>{song.artist?.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Popular Artists</h2>
            <button className="show-all-btn">Show all</button>
          </div>
          <div className="artist-grid">
            {artists.map((artist) => (
              <Link to={`/artist/${artist._id}`} key={artist._id} className="artist-card">
                <img src={`${BASE_URL}/uploads/${artist.image}`} alt={artist.name} />
                <h4>{artist.name}</h4>
                <span>Artist</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Custom Player ── */}
      {currentSong && (
        <div className="player">

          {/* Left — song info */}
          <div className="player-left">
            <img src={`${BASE_URL}/uploads/${currentSong.image}`} alt={currentSong.title} />
            <div className="player-song-info">
              <h4>{currentSong.title}</h4>
              <p>{currentSong.artist?.name}</p>
            </div>
            <button
              className={`player-heart ${isLiked ? "liked" : ""}`}
              onClick={() => setIsLiked(!isLiked)}
              title={isLiked ? "Unlike" : "Like"}
            >
              {isLiked ? "♥" : "♡"}
            </button>
          </div>

          {/* Center — controls + progress */}
          <div className="player-center">
            <div className="player-controls">
              <button
                className={`ctrl-btn ${isShuffle ? "active" : ""}`}
                onClick={() => setIsShuffle(!isShuffle)}
                title="Shuffle"
              >
                ⇄
              </button>
              <button className="ctrl-btn" onClick={skipPrev} title="Previous">⏮</button>
              <button className="play-pause-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="ctrl-btn" onClick={skipNext} title="Next">⏭</button>
              <button
                className={`ctrl-btn ${isRepeat ? "active" : ""}`}
                onClick={() => setIsRepeat(!isRepeat)}
                title="Repeat"
              >
                ↺
              </button>
            </div>

            <div className="player-progress">
              <span className="time-label">{formatTime(currentTime)}</span>
              <div className="progress-track" onClick={handleSeek}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
                <div className="progress-thumb" style={{ left: `${progress}%`, right: "auto", transform: "translate(-50%, -50%)" }} />
              </div>
              <span className="time-label right">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right — volume */}
          <div className="player-right">
            <button className="vol-btn" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
              {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
            </button>
            <input
              type="range"
              className="volume-slider"
              min="0" max="1" step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
            />
          </div>

        </div>
      )}

    </div>
  );
}

export default Home;