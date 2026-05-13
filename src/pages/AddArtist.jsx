import { useState } from "react";
import axios from "axios";
import "./Addsongs.css";

function AddArtist() {

const [name,setName] = useState("");
const [dob,setDob] = useState("");
const [category,setCategory] = useState("");
const [monthlyListeners,setMonthlyListeners] = useState("");
const [image,setImage] = useState(null);

const handleSubmit = async (e)=>{
e.preventDefault();

if(!name || !dob || !category){
alert("Please fill all fields");
return;
}

const formData = new FormData();

formData.append("name",name);
formData.append("dob",dob);
formData.append("category",category);
formData.append("monthlyListeners",monthlyListeners);

if(image){
formData.append("image",image);
}

try{

await axios.post(
"http://https://spotify-backend-lug8.onrender.com/api/auth/add-artist",
formData,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);

alert("Artist Added Successfully");

setName("");
setDob("");
setCategory("");
setMonthlyListeners("");
setImage(null);

}

catch(err){
console.log(err);
alert("Error Adding Artist");
}

};

return(
<div className="addsong-container">

<div className="addsong-card">

<h2>Add New Artist</h2>

<form onSubmit={handleSubmit}>

<label>Name</label>
<input
type="text"
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Artist Name"
/>

<label>Date of Birth</label>
<input
type="date"
value={dob}
onChange={(e)=>setDob(e.target.value)}
/>

<label>Category</label>
<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
>
<option value="">Select Category</option>
<option value="Bollywood">Bollywood</option>
<option value="Sandalwood">Sandalwood</option>
<option value="Pop">Pop</option>
<option value="Hip-Hop">Hip-Hop</option>
</select>

<label>Monthly Listeners</label>
<input
type="number"
value={monthlyListeners}
onChange={(e)=>setMonthlyListeners(e.target.value)}
placeholder="1000000"
/>

<label>Artist Image</label>
<input
type="file"
accept="image/*"
onChange={(e)=>setImage(e.target.files[0])}
/>

<button type="submit">
Add Artist
</button>

</form>

</div>

</div>
);
}

export default AddArtist;