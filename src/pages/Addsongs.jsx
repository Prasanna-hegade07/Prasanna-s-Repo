import { useState,useEffect } from "react";
import axios from "axios";
import "./Addsongs.css";

function AddSong(){

const [title,setTitle]=useState("");
const [artist,setArtist]=useState("");
const [category,setCategory]=useState("");
const [image,setImage]=useState(null);
const [audio,setAudio]=useState(null);

const [artists,setArtists]=useState([]);

useEffect(()=>{
fetchArtists();
},[]);

const fetchArtists = async()=>{
try{

const res = await axios.get(
"http://localhost:5000/api/auth/artists"
);

setArtists(res.data);

}catch(err){
console.log(err);
}
};

const handleSubmit = async(e)=>{
e.preventDefault();

if(!title || !artist || !category || !audio || !image){
alert("Please fill all fields");
return;
}

const formData = new FormData();

formData.append("title",title);
formData.append("artist",artist); // artist id
formData.append("category",category);
formData.append("image",image);
formData.append("audio",audio);

try{

await axios.post(
"http://localhost:5000/api/auth/add-song",
formData,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);

alert("Song Added Successfully");

setTitle("");
setArtist("");
setCategory("");
setImage(null);
setAudio(null);

}catch(err){
console.log(err);
alert("Error Adding Song");
}

};

return(
<div className="addsong-container">

<div className="addsong-card">

<h2>Add New Song</h2>

<form onSubmit={handleSubmit}>

<label>Title</label>
<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
placeholder="Song Title"
/>

<label>Artist</label>

<select
value={artist}
onChange={(e)=>setArtist(e.target.value)}
>
<option value="">
Select Artist
</option>

{artists.map((a)=>(
<option
key={a._id}
value={a._id}
>
{a.name}
</option>
))}

</select>


<label>Category</label>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
>
<option value="">
Select Category
</option>

<option value="Bollywood">
Bollywood
</option>

<option value="Sandalwood">
Sandalwood
</option>

<option value="Pop">
Pop
</option>

</select>


<label>Image</label>

<input
type="file"
accept="image/*"
onChange={(e)=>setImage(
e.target.files[0]
)}
/>


<label>Audio</label>

<input
type="file"
accept="audio/*"
onChange={(e)=>setAudio(
e.target.files[0]
)}
/>

<button type="submit">
Add Song
</button>

</form>

</div>

</div>
);

}

export default AddSong;