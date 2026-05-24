const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Song = require("../models/Song");
const Artist = require("../models/Artist");
const multer = require("multer");
const path = require("path");

// ── Multer setup ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/"); },
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });

// ════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Login  [FIXED: moved res.json inside try block, removed dead code after return]
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.password !== password) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        subscriptionType: user.subscriptionType,
        premiumPlan: user.premiumPlan,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin login
router.post("/Adminlogin", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@spotify.com" && password === "admin123") {
    return res.json({ message: "Admin Login Successful" });
  }
  res.status(401).json({ message: "Invalid Admin Credentials" });
});

// ════════════════════════════════════════
// ADMIN STATS ROUTE  ← NEW
// ════════════════════════════════════════
router.get("/admin/stats", async (req, res) => {
  try {
    const [totalSongs, totalArtists, totalUsers, premiumUsers] = await Promise.all([
      Song.countDocuments(),
      Artist.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ isPremium: true }),
    ]);

    res.json({ totalSongs, totalArtists, totalUsers, premiumUsers });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// ════════════════════════════════════════
// USER ROUTES
// ════════════════════════════════════════

// Get user profile  [FIXED: duplicate route removed, kept single one]
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Upload profile picture  [FIXED: userId was undefined — now read from body]
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: req.file.filename },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile picture uploaded successfully", profilePic: req.file.filename });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Upload Failed" });
  }
});

// Premium upgrade
router.post("/upgrade", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { isPremium: true },
      { new: true }
    );
    res.json({ msg: "User upgraded to premium", user });
  } catch (err) {
    res.status(500).json({ msg: "Upgrade failed" });
  }
});

// Subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    user.isPremium = true;
    user.subscriptionType = "Premium";
    await user.save();
    res.json({ message: "Subscription Successful" });
  } catch (err) {
    res.status(500).json({ message: "Subscription Failed" });
  }
});

// ════════════════════════════════════════
// SONG ROUTES
// ════════════════════════════════════════

// Add song
router.post("/add-song",
  upload.fields([{ name: "audio", maxCount: 1 }, { name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { title, artist, category } = req.body;
      if (!title || !artist || !category) return res.status(400).json({ message: "All fields required" });

      const newSong = new Song({
        title, artist, category,
        image: req.files?.image ? req.files.image[0].filename : null,
        audio: req.files?.audio ? req.files.audio[0].filename : null,
      });
      await newSong.save();
      res.json({ message: "Song Added Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error Adding Song" });
    }
  }
);

// Get all songs (with optional mood filter)
router.get("/songs", async (req, res) => {
  try {
    const mood = req.query.mood;
    const query = mood ? { mood } : {};
    const songs = await Song.find(query).populate("artist");
    res.json(songs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// View songs (admin)
router.get("/Viewsongs", async (req, res) => {
  try {
    const songs = await Song.find().populate("artist", "name");
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Error Fetching Songs" });
  }
});

// Get single song by id
router.get("/Viewsong/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: "Error fetching song" });
  }
});

// Get song for edit
router.get("/song/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: "Error fetching song details" });
  }
});

// Edit song
router.put("/edit-song/:id",
  upload.fields([{ name: "audio", maxCount: 1 }, { name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { title, artist, category } = req.body;
      const updateData = { title, artist, category };
      if (req.files?.audio) updateData.audio = req.files.audio[0].filename;
      if (req.files?.image) updateData.image = req.files.image[0].filename;
      await Song.findByIdAndUpdate(req.params.id, updateData);
      res.json({ message: "Song Updated" });
    } catch (err) {
      res.status(500).json({ message: "Update Failed" });
    }
  }
);

// Delete song
router.delete("/delete-song/:id", async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Song Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete Failed" });
  }
});

// ════════════════════════════════════════
// ARTIST ROUTES
// ════════════════════════════════════════

// Get all artists
router.get("/artists", async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching artists" });
  }
});

// Get single artist + their songs
router.get("/artist/:id", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    const songs = await Song.find({ artist: req.params.id });
    res.json({ artist, songs });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add artist
router.post("/add-artist", upload.single("image"), async (req, res) => {
  try {
    const artist = new Artist({
      name: req.body.name,
      dob: req.body.dob,
      category: req.body.category,
      monthlyListeners: req.body.monthlyListeners,
      image: req.file ? req.file.filename : null,
    });
    await artist.save();
    res.json({ message: "Artist added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding artist" });
  }
});

module.exports = router;