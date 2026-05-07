import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const BASE_URL = "https://spotify-backend-lydl.onrender.com";

function Home() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  const playSong = (song) => {
    setCurrentSong(song);
  };

  useEffect(() => {
    fetchSongs();
    fetchArtists();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/songs`);
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
      <div className="topbar">
        <div className="nav-left">
          <div className="logo-circle">🎵</div>
          <button className="home-btn">🏠</button>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input placeholder="What do you want to play?" />
            <span className="library-icon">📚</span>
          </div>
        </div>

        <div className="nav-right">
          <Link to="/Subscription">Premium</Link>
          <Link to="/Support">Support</Link>
          <Link to="/Download">Download</Link>
          <div className="divider"></div>
          <span className="install">⬇ Install App</span>
          <Link to="/Registration">Sign up</Link>
          <Link to="/Login" className="login-btn">
            Log in
          </Link>
        </div>
      </div>

      <div className="content full">
        <div className="section">
          <div className="section-header">
            <h2>Trending songs</h2>
            <span>Show all</span>
          </div>

          <div className="song-grid">
            {songs.map((song) => (
              <div className="song-card" key={song._id}>
                <div className="cover">
                  <img
                    src={`${BASE_URL}/uploads/${song.image}`}
                    alt={song.title}
                  />
                  <button onClick={() => playSong(song)} className="play-btn">
                    ▶
                  </button>
                </div>
                <h4>{song.title}</h4>
                <p>{song.artist?.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Popular artists</h2>
            <span>Show all</span>
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
              </Link>
            ))}
          </div>
        </div>
      </div>

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