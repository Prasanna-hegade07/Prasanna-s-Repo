import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ArtistProfile.css";

function ArtistProfile() {

const { id } = useParams();

const [artist, setArtist] = useState({});
const [songs, setSongs] = useState([]);

const BASE_URL = "https://spotify-backend-lug8.onrender.com";

useEffect(() => {
fetchArtist();
}, []);

const fetchArtist = async () => {

try {

const res = await axios.get(
`${BASE_URL}/api/auth/artist/${id}`
);

setArtist(res.data.artist);
setSongs(res.data.songs);

} catch (error) {

console.log(error);

}

};

return (

<div className="artist-profile">

<div className="artist-header">

<img
src={`${BASE_URL}/uploads/${artist.image}`}
alt={artist.name}
/>

<div className="artist-details">

<h1>{artist.name}</h1>

<p>
<span>DOB:</span> {artist.dob}
</p>

<p>
<span>Genre:</span> {artist.category}
</p>

<p>
<span>Monthly Listeners:</span> {artist.monthlyListeners}
</p>

<p>
<span>Total Songs:</span> {songs.length}
</p>

</div>

</div>


<h2 className="song-title-heading">Popular Songs</h2>

<div className="artist-song-list">

{songs.map((song) => (

<div
className="artist-song-card"
key={song._id}
>

<img
src={`${BASE_URL}/uploads/${song.image}`}
alt={song.title}
/>

<div className="song-info">

<h3>{song.title}</h3>

<p>{song.category}</p>

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

);

}

export default ArtistProfile;