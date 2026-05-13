import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Addsongs.css";   

function EditSong(){

const { id } = useParams();
const navigate = useNavigate();

const [title,setTitle] = useState("");
const [artist,setArtist] = useState("");
const [category,setCategory] = useState("");
const [image,setImage] = useState(null);
const [audio,setAudio] = useState(null);

useEffect(()=>{
fetchSong();
},[]);

const fetchSong = async ()=>{
try{

const res = await axios.get(
`http://https://spotify-backend-lug8.onrender.com/api/auth/song/${id}`
);

setTitle(res.data.title);
setArtist(res.data.artist);
setCategory(res.data.category);
setImage(res.data.image);
setAudio(res.data.audio);

}catch(err){
console.log(err);
}
};

const handleUpdate = async (e)=>{
e.preventDefault();

const formData = new FormData();

formData.append("title",title);
formData.append("artist",artist);
formData.append("category",category);

if(image) formData.append("image",image);
if(audio) formData.append("audio",audio);

console.log("ID:", id);

try{

await axios.put(
`http://https://spotify-backend-lug8.onrender.com/api/auth/edit-song/${id}`,
formData
);

alert("Song Updated Successfully");

navigate("/Viewsongs");

}catch(err){
console.log(err);
alert("Update Failed");
}
};

return(
<div className="addsong-container">   {/* ✅ SAME AS ADD */}

<div className="addsong-card">

<h2>Edit Song</h2>

<form onSubmit={handleUpdate}>

<label>Title:</label>
<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<label>Artist:</label>
<select
value={artist}
onChange={(e)=>setArtist(e.target.value)}
>
<option value="">Select Artist</option>
<option value="Arijit Singh">Arijit Singh</option>
<option value="Shreya Ghoshal">Shreya Ghoshal</option> 
<option value="Rajesh Krishnan">Rajesh Krishnan</option>
<option value="Vijay Prakash">Vijay Prakash</option>
</select>

<label>Category:</label>
<select 
value={category}
onChange={(e)=>setCategory(e.target.value)}
>
<option value="Bollywood">Bollywood</option>
<option value="Sandalwood">Sandalwood</option>
</select>

<label>Change Image:</label>
<input
type="file"
accept="image/*"
onChange={(e)=>setImage(e.target.files[0])}
/>

<label>Change Audio:</label>
<input
type="file"
accept="audio/*"
onChange={(e)=>setAudio(e.target.files[0])}
/>

<button>Update Song</button>

</form>

</div>

</div>
);
}

export default EditSong;