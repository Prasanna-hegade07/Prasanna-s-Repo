require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);


// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Tetsing routes
app.get('/', (req, res) => {
    res.send('Welcome to the Spotify backend!');
});

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//payment route


const paymentRoutes=require("./routes/payment");
app.use("/api/payment",paymentRoutes);

const userRoutes = require("./routes/auth");
app.use("/api/auth", userRoutes);


console.log("MongoURI:", process.env.MONGO_URI); 