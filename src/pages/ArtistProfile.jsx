import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import "./ArtistProfile.css";

function ArtistProfile(){

const {id}=useParams();

const [artist,setArtist]=useState({});
const [songs,setSongs]=useState([]);

useEffect(()=>{
fetchArtist();
},[]);

const fetchArtist = async()=>{

const res=await axios.get(
`http://https://spotify-backend-lug8.onrender.com/api/auth/artist/${id}`
);

setArtist(res.data.artist);
setSongs(res.data.songs);

};

return(

<div className="artist-profile">

<div className="artist-header">

<img
src={`http://https://spotify-backend-lug8.onrender.com/uploads/${artist.image}`}
alt={artist.name}
/>

<div>
<h1>{artist.name}</h1>

<p>DOB: {artist.dob}</p>

<p>Genre: {artist.category}</p>

<p>
Monthly Listeners:
{artist.monthlyListeners}
</p>

<p>
Total Songs:
{songs.length}
</p>

</div>

</div>


<h2>Popular Songs</h2>

<div className="artist-song-list">

{songs.map(song=>(

<div
className="artist-song-card"
key={song._id}
>

<img
src={`http://https://spotify-backend-lug8.onrender.com/uploads/${song.image}`}
/>

<div>
<h3>{song.title}</h3>
<p>{song.category}</p>
</div>

<audio controls>
<source
src={`http://https://spotify-backend-lug8.onrender.com/uploads/${song.audio}`}
type="audio/mpeg"
/>
</audio>

</div>

))}

</div>

</div>

)

}

export default ArtistProfile;