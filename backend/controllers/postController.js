const User = require('../models/User');
const Post = require('../models/Post')
const mongoose = require('mongoose');


/**
 * Create a new post by the user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.createPost =  async (req, res) => {
  const { username, content, category } = req.body;
  const picture = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newPost = new Post({
      username,
      content,
      picture,
      category,
      user_id: user._id,
      likes: 0,
      replies: 0,
    });

    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error creating post' });
  }
};

/**
 * Retrieve all posts from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('comments'); // You can modify the populate to include other fields as needed
    res.status(200).json(posts); // Return the posts from the database
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Server Error");
  }
};

/**
 * Delete a post by its ID.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params._id - The ID of the post to delete.
 * @returns {void}
 */
exports.deletePost = async (req, res) => {
      const { _id } = req.params;
    
    
      try {
        const post = await Post.findByIdAndDelete(_id);
        if (!post) {
          return res.status(404).json({ msg: "Post not found" });
        }
        res.status(200).json({ msg: "Post deleted" });
      } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("Server Error");
      }
    };


    /**
 * Retrieve a post by its ID.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.postId - The ID of the post to retrieve.
 * @returns {void}
 */
    exports.getPostById = async (req, res) => {
      const { postId } = req.params;
    
      try {
        // Find the post by its _id in the database
        const post = await Post.findById(postId).populate('user_id'); // Populate author data if needed
    
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        res.json(post); // Return the post data
      } catch (error) {
        console.error('Error fetching post data:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    /**
 * Like or unlike a post.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.userId - The ID of the user liking the post.
 * @param {string} req.body.postId - The ID of the post being liked or unliked.
 * @param {boolean} req.body.liked - A boolean indicating whether the post is liked (true) or unliked (false).
 * @returns {void}
 */
    exports.likePost = async (req, res) => {
          const { userId, postId, liked } = req.body;
          try {
              // Log the request body to ensure data is coming through
              console.log('User ID:', userId, 'Post ID:', postId, 'Liked:', liked);
        
              // Update the user's likedPosts array
              const userUpdate = liked 
                  ? { $addToSet: { likedPosts: postId } } 
                  : { $pull: { likedPosts: postId } };
              
              const userResult = await User.findByIdAndUpdate(userId, userUpdate);
              console.log('User Update Result:', userResult);
        
              // Increment or decrement the like count on the post
              const postUpdate = liked 
                  ? { $inc: { likes: 1 } } 
                  : { $inc: { likes: -1 } };
              
              const updatedPost = await Post.findByIdAndUpdate(postId, postUpdate, { new: true });
              console.log('Updated Post:', updatedPost);
        
              res.status(200).json({ message: liked ? 'Post liked' : 'Post unliked', likes: updatedPost.likes || 0 });
        
          } catch (error) {
              console.error('Error in like-post route:', error); // Log the error for debugging
              res.status(500).json({ error: 'An error occurred while updating liked posts' });
          }
        };
        
/**
 * Retrieve all posts of a specific user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.userId - The ID of the user whose posts are to be fetched.
 * @returns {void}
 */
exports.getUserPosts = async (req, res) => {
  try {
      const userId = req.params.userId;
      const userPosts = await Post.find({ user_id: userId });

      if (!userPosts) {
          return res.status(404).json({ message: 'No posts found for this user' });
      }

      res.json(userPosts);
  } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ error: 'Server error fetching user posts' });
  }
};

/**
 * Add a comment to a post.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.user_id - The ID of the user adding the comment.
 * @param {string} req.body.username - The username of the user adding the comment.
 * @param {string} req.body.content - The content of the comment.
 * @param {string} req.body.profilePicture - The profile picture of the user adding the comment.
 * @param {string} req.params.postId - The ID of the post to add the comment to.
 * @returns {void}
 */
exports.addComment = async (req, res) => {
  const { user_id, username, content, profilePicture } = req.body;
  const { postId } = req.params;

  if (!user_id || !username || !content) {
      return res.status(400).json({ error: 'All fields are required: user_id, username, content' });
  }

  try {
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }

      // Create the comment
      const newComment = {
          user_id,
          username,
          content,
          profilePicture,
          date: new Date(),
          likes: 0,
      };

      // Add the comment to the post
      post.comments.push(newComment);
      await post.save();

       // Update the replies count in the post
       await Post.findByIdAndUpdate(postId, {
        $inc: { replies: 1 },
    });

      res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Server error adding comment' });
  }
};

/**
 * Delete a comment from a post.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.postId - The ID of the post containing the comment to delete.
 * @param {string} req.params.commentId - The ID of the comment to delete.
 * @returns {void}
 */
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }

      // Find the comment index
      const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
      if (commentIndex === -1) {
          return res.status(404).json({ error: 'Comment not found' });
      }

      // Remove the comment
      post.comments.splice(commentIndex, 1);
      await post.save();
      // Update the replies count in the post
      await Post.findByIdAndUpdate(postId, {
        $inc: { replies: -1 },
    });

      res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Server error deleting comment' });
  }
};

/**
 * Retrieve all comments for a post.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.postId - The ID of the post whose comments are to be fetched.
 * @returns {void}
 */
exports.getComments = async (req, res) => {
  const { postId } = req.params;

  try {
      // Find the post by ID and return only the comments field
      const post = await Post.findById(postId).select('comments');
      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json(post.comments); // Send the comments array
  } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Server error fetching comments' });
  }
};

/**
 * Like or unlike a comment.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.userId - The ID of the user liking or unliking the comment.
 * @param {string} req.body.postId - The ID of the post containing the comment.
 * @param {boolean} req.body.liked - A boolean indicating whether the comment is liked (true) or unliked (false).
 * @param {string} req.params.commentId - The ID of the comment to like or unlike.
 * @returns {void}
 */
exports.likeComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId, postId, liked } = req.body; // Get the current user's ID, post ID, and like status from the request
  
    try {
      // Find the post containing the comment
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      // Locate the specific comment within the comments array
      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
  
      // Find the user to update their likedComments array
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Update the comment's like count and the user's likedComments array
      if (liked) {
        // Only increment the like count if the comment is not already liked by the user
        if (!user.likedComments.includes(commentId)) {
          comment.likes += 1;
          user.likedComments.addToSet(commentId); // Add the commentId to likedComments if not already there
        } else {
          return res.status(400).json({ message: 'Comment already liked' });
        }
      } else {
        // Only decrement the like count if the comment was liked by the user
        if (user.likedComments.includes(commentId)) {
          comment.likes = Math.max(comment.likes - 1, 0); // Prevent likes from going below zero
          user.likedComments.pull(commentId); // Remove the commentId from likedComments
        } else {
          return res.status(400).json({ message: 'Comment not liked previously' });
        }
      }
  
      // Save the updated post and user
      await post.save();
      await user.save();
  
      res.status(200).json({
        message: liked ? 'Comment liked' : 'Comment unliked',
        likeCount: comment.likes,
        isLiked: liked
      });
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  /**
 * Retrieve the post ID associated with a comment.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.commentId - The ID of the comment whose associated post ID is to be fetched.
 * @returns {void}
 */
  exports.getPostIdFromComment = async (req, res) => {
    const { commentId } = req.params; // Get the comment ID from the request params
  
    try {
      // Find the post that contains the comment with the given comment ID
      const post = await Post.findOne({ "comments._id": commentId });
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found for this comment' });
      }
  
      // Find the comment within the post to get the associated post ID
      const comment = post.comments.find(comment => comment._id.toString() === commentId);
      
      if (comment) {
        // Send the post ID if the comment was found
        return res.json({ postId: post._id });
      } else {
        return res.status(404).json({ message: 'Comment not found in the post' });
      }
    } catch (error) {
      console.error('Error fetching post ID for comment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
 * Retrieve the first three users who liked a post.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.postId - The ID of the post whose likers are to be fetched.
 * @returns {void}
 */
  exports.getFirstThreeLikers = async (req, res) => {
    try {
        const { postId } = req.params;
  
        // Find users who have liked this post
        const users = await User.find({ likedPosts: postId })
            .limit(3) // Limit to the first 3 users
            .select('username profilePicture'); // Only get username and profile picture
  
        res.json(users);
    } catch (error) {
        console.error("Error fetching likers:", error);
        res.status(500).json({ message: 'Failed to fetch likers' });
    }
  };

  /**
 * Retrieve the like count of a post.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.postId - The ID of the post whose like count is to be fetched.
 * @returns {void}
 */
  exports.getPostLikeCount = async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const postlikecounts = post.likes;
      res.json({ postlikecounts });
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  /**
 * Check the contents of a comment for hateful or inappropriate text.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.content - The content of the comment being checked.
 * @returns {void}
 */
  exports.checkComment = async (req, res) => {
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
    };