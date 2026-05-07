require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");

const app = express();


//  CORS FIX
app.use(
  cors({
    origin: "https://spotify-frontend-tjpx.onrender.com",
    credentials: true,
  })
);

//  IMPORTANT (preflight fix)
app.options("*", cors());


//  Middlewares
app.use(express.json());
app.use("/uploads", express.static("uploads"));


//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);


//  MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Spotify backend!");
});


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});