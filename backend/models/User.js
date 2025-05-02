// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Main User schema
const UserSchema = new Schema({
  id: { type: Schema.Types.ObjectId, auto: true },
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  biography: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }], // Store references to posts
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  online: { type: Boolean, default: false },
  likedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  likedComments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('User', UserSchema);
