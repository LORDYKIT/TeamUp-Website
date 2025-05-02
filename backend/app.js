// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require("dotenv").config();
const connectDB = require("./config/db");
//const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express(); // Initialize the Express application

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON data in rSequests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Middleware to parse JSON request bodies
const multer = require('multer');

const mongoose = require('mongoose');
connectDB();

// Import Models
const User = require('./models/User');
const Post = require('./models/Post');


// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up Multer to store images in the "uploads" directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/check-comment', async (req, res) => {
  console.log("Received request:", req.body); // Log the incoming request
  try {
    const response = await axios.post('http://127.0.0.1:5000/predict', {
      text: req.body.text,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error forwarding request to Flask:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
    res.status(500).json({ error: 'Error checking comment' });
  }
});

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route imports
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

// Route setup
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);


  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world',
    });
  });
  
  

module.exports = app;

