import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

function Home(){

const [songs,setSongs]=useState([]);
const [artists,setArtists]=useState([]);
const [currentSong,setCurrentSong]=useState(null);

const playSong=(song)=>{
setCurrentSong(song);
};

useEffect(()=>{
fetchSongs();
fetchArtists();
},[]);


const fetchSongs = async()=>{

try{
const res = await axios.get(
"http://localhost:5000/api/auth/songs"
);

setSongs(res.data);

}catch(error){
console.log(error);
}

};


const fetchArtists = async()=>{

try{

const res = await axios.get(
"http://localhost:5000/api/auth/artists"
);

setArtists(res.data);

}catch(error){
console.log(error);
}

};
const user = JSON.parse(localStorage.getItem("user"));

return(

<div className="home-wrapper">

<nav className="navigationbar">

<div className="navigationlogo">
<img
src="/images/logob.png"
className="logo"
alt="Spotify"
/>
</div>

<div className="navbtns">

  <Link to="/Support" className="regbtnnav">
    Support
  </Link>

  <Link to="/Subscription" className="regbtnnav">
    Premium
  </Link>

  {!user && (
    <>
      <Link to="/Login" className="loginbtnnav">
        Sign Out
      </Link>

      <Link to="/Registration" className="regbtnnav">
        Sign up
      </Link>
      <Link to="/UserProfile" className="regbtnnav">
        Profile
        </Link>
    </>
  )}

  {user && (
    <div className="user-info">
      <span className="username">{user.name}</span>

      {user.isPremium && (
        <span className="premium-badge">
          👑 Premium
        </span>
      )}
    </div>
  )}
</div>

</nav>



<div className="home-content">

<div className="section-header">
<h2>Trending Songs</h2>
<span className="show-all">
Show all
</span>
</div>


<div className="song-grid">

{songs.map((song)=>(

<div
className="song-card"
key={song._id}
>

<div className="cover-box">

<img
src={`http://localhost:5000/uploads/${song.image}`}
alt={song.title}
/>

<button
className="play-btn"
onClick={()=>playSong(song)}
>
▶
</button>

</div>

<h4>{song.title}</h4>

<p>{song.artist?.name}</p>

</div>

))}

</div>



<div
className="section-header"
style={{marginTop:"60px"}}
>
<h2>Popular Artists</h2>

<span className="show-all">
Show all
</span>

</div>


<div className="artist-grid">

{artists.map((artist)=>(
    <Link to={`/artist/${artist._id}`}
    key={artist._id}
    style={{textDecoration:"none",color:"white"}}> 


<div
className="artist-card"
key={artist._id}
>

<img
src={`http://localhost:5000/uploads/${artist.image}`}
alt={artist.name}
/>

<h4>{artist.name}</h4>

</div>
</Link>
))}

</div>

</div>


{currentSong && (

<div className="music-player">

<div className="player-left">

<img
src={`http://localhost:5000/uploads/${currentSong.image}`}
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
src={`http://localhost:5000/uploads/${currentSong.audio}`}
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