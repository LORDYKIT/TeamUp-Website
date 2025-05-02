const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Signup function to create a new user in the system.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Responds with the user data (without password) and a JWT token.
 */
exports.signup = async (req, res) => {
  const { username, fullname, email, password, biography, profile_picture } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, fullname, email, password: hashedPassword, biography, profilePicture: profile_picture });
    const savedUser = await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error signing up." });
  }
};

/**
 * Login function to authenticate an existing user and generate a JWT token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Responds with the user data (without password) and a JWT token.
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

