const jwt =require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Song = require("../models/Song");
const Artist = require("../models/Artist");


//registration route
router.post("/register", async (req, res) => {

  try {

    console.log("Incoming Data:", req.body); 

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({
      message: "User Registered Successfully"
    });

  } catch (error) {

    console.error("Registration Error:", error);

    res.status(500).json({
      message: "Server Error"
    });

  }

});


//login route

router.post("/login", async(req,res)=>{
try{

const {email,password}=req.body;

if(!email || !password){
return res.status(400).json({
message:"All fields required"
});
}

const user=await User.findOne({email});

if(!user){
return res.status(400).json({
message:"User not found"
});
}

if(user.password!==password){
return res.status(400).json({
message:"Invalid credentials"
});
}

res.status(200).json({
message:"Login successful",
user:user
});

}catch(err){
console.log(err);

res.status(500).json({
message:"Server Error"
});
}

const token = jwt.sign({ id: user._id },"secretkey",{ expiresIn: "1d" });
res.json({token,user:{
id:user._id,
name:user.name,
email:user.email,
isPremium:user.isPremium,
}
});
});

//user profile route

router.get("/profile/:id", async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

//admin route
router.post("/Adminlogin", (req, res) => {

  const { email, password } = req.body;

  if (email === "admin@spotify.com" && password === "admin123") {
    return res.json({ message: "Admin Login Successful" });
  }

  res.status(401).json({ message: "Invalid Admin Credentials" });

});


//multer

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, "uploads/");
},
filename: (req, file, cb) => {
cb(null, Date.now() + path.extname(file.originalname));
}
});
const upload = multer({ storage: storage });



//post route to add song with file upload

router.post(
"/add-song",
upload.fields([
{name:"audio",maxCount:1},
{name:"image",maxCount:1}
]),
async(req,res)=>{

try{

const {title,artist,category}=req.body;

if(!title || !artist || !category){
return res.status(400).json({
message:"All fields required"
});
}

const newSong = new Song({

title,
artist, 
category,

image:req.files?.image
? req.files.image[0].filename
: null,

audio:req.files?.audio
? req.files.audio[0].filename
: null

});

await newSong.save();

res.json({
message:"Song Added Successfully"
});

}
catch(err){

console.log(err);

res.status(500).json({
message:"Error Adding Song"
});

}

});

//get route to fetch all songs
router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find().populate("artist","name image");
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching songs" });
  }
});

//get route to fetch songs
router.get("/Viewsongs", async (req, res) => {
try{
const songs = await Song.find().populate("artist","name");
  res.json(songs);
}
catch(err)
{res.status(500).json({message:"Error Fetching Songs"});
}
});

router .get("/Viewsong/:id", async (req, res) => {
    const song = await Song.findById(req.params.id);
    res.json(song);
});


//delete song route

router.delete("/delete-song/:id", async (req, res) => {

  try {

    await Song.findByIdAndDelete(req.params.id);

    res.json({
      message: "Song Deleted"
    });

  } catch (err) {

    res.status(500).json({
      message: "Delete Failed"
    });

  }

});

//route to get single song details for editing
router.get("/song/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching song details" });
  }
});


//edit song route
router.put("/edit-song/:id",
upload.fields([
{ name: "audio", maxCount: 1 },
{ name: "image", maxCount: 1 }
]),
async (req,res)=>{

try{

const { title, artist, category } = req.body;

const updateData = {
title,
artist,
category
};

if(req.files?.audio){
updateData.audio = req.files.audio[0].filename;
}

if(req.files?.image){
updateData.image = req.files.image[0].filename;
}

await Song.findByIdAndUpdate(req.params.id, updateData);

res.json({message:"Song Updated"});

}catch(err){
console.log(err);
res.status(500).json({message:"Update Failed"});
}

});


//get route to fetch all artists
router.get("/artists", async(req,res)=>{

try{

const artists = await Artist.find();

res.json(artists);

}catch(err){

res.status(500).json({
message:"Error fetching artists"
});

}

});

//artist details route
router.get("/artist/:id", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    const songs = await Song.find({ artist: req.params.id }); 
    res.json({ artist, songs });
  } 
  catch (err) {
    res.status(500).json({ message: "Error fetching artist details" });
  }
});


//artist form

router.post(
"/add-artist",
upload.single("image"),
async(req,res)=>{
try{

const artist = new Artist({
name:req.body.name,
dob:req.body.dob,
category:req.body.category,
monthlyListeners:req.body.monthlyListeners,
image:req.file ? req.file.filename : null
});

await artist.save();

res.json({
message:"Artist added successfully"
});

}catch(err){
console.log(err);
res.status(500).json({
message:"Error adding artist"
});
}
});

//subscription route

router.post("/subscribe", async (req, res) => {

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.subscription = "premium";
    await user.save();

    res.json({ message: "Subscription Successful" });
  } catch (err) {
    console.error("Subscription Error:", err);
    res.status(500).json({ message: "Subscription Failed" });
  }
});
//premium upgrade route

router.post("/upgrade", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isPremium: true },
      { new: true }
    );

    res.json({
      msg: "User upgraded to premium",
      user
    });

  } catch (err) {
    res.status(500).json({ msg: "Upgrade failed" });
  }
});



// GET USER PROFILE
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// upload profile picture route

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
     const user =await User.findByIdAndUpdate(
      userId,
      { profilePic: req.file.filename },
      { new: true }
    );
    

    if (!req.file) {
      return res.status(404).json({ message: "No Profile Pic" });
    }
   

    res.json({ message: "Profile picture uploaded successfully" });
  } 
  catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Upload Failed" });
  }
});
module.exports = router;