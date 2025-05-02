// models/Post.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for comments within posts
const CommentSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// Main Post schema
const PostSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User who created the post
  username: { type: String, required: true }, // Display name of the user
  content: { type: String, required: true },
  picture: { type: String, default: null },
  category: { type: String, enum: ['Urgent', 'War Related', 'Medical Assistance', 'Volunteers Needed', 'Housing & Shelter', 'Supplies Needed', 'Resource Donations', 'Discussion', 'null'], default: 'null' },
  likes: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  comments: [CommentSchema], // Embedding comments within the post
  profilePic: { type: String, default: '' },
});

module.exports = mongoose.model('Post', PostSchema);
