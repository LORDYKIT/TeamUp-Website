const User = require('../models/User');
const Post = require('../models/Post')
const mongoose = require('mongoose');

/**
 * @description Fetch all users
 * @route GET /api/users
 * @returns {Object[]} Array of users
 */
exports.users = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * @description Update a user's information
 * @route PUT /api/users/:id
 * @param {string} id - The user's unique ID
 * @param {string} username - The new username
 * @param {string} fullname - The new full name
 * @param {string} biography - The new biography
 * @param {file} profilePicture - The user's profile picture (optional)
 * @returns {Object} Updated user information
 */
exports.updateUser =  async (req, res) => {
  const { id } = req.params;
  const { username, fullname, biography } = req.body;

  let profilePicture;
  if (req.file) {
    profilePicture = `/uploads/${req.file.filename}`; // Save file path for profile picture
  }

  try {
    const updatedData = { username, fullname, biography };
    if (profilePicture) updatedData.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updatedData,
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error. Could not update profile." });
  }
};

/**
 * @description Fetch a user's followers
 * @route GET /api/users/:_id/followers
 * @param {string} _id - The user's unique ID
 * @returns {Object} The followers list and the current user ID
 */
exports.getFollowers = async (req, res) => {
  try {
    const currentUserId = req.query._id; // Retrieve current user's _id from the query
    const user = await User.findById(req.params._id).populate('followers');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      followers: user.followers,
      currentUserId: currentUserId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch followers.' });
  }
};

/**
 * @description Fetch a user's following
 * @route GET /api/users/:_id/following
 * @param {string} _id - The user's unique ID
 * @returns {Object} The following list and the current user ID
 */
exports.getFollowing = async (req, res) => {
  try {
    const currentUserId = req.query._id; // Retrieve current user's _id from the query
    const user = await User.findById(req.params._id).populate('following');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      following: user.following,
      currentUserId: currentUserId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch following.' });
  }
};

/**
 * @description Follow or unfollow a user
 * @route POST /api/users/:currentUserId/follow/:targetUserId
 * @param {string} currentUserId - The current user's unique ID
 * @param {string} targetUserId - The target user's unique ID
 * @returns {Object} Updated follow status, followers, and following lists
 */
exports.followUser = async (req, res) => {
      const { currentUserId, targetUserId } = req.params;
    
      try {
        // Check if the currentUser and targetUser are the same
        if (currentUserId === targetUserId) {
          return res.status(400).json({ error: 'Users cannot follow themselves.' });
        }
    
        const current = await User.findById(currentUserId); // Use findById instead of findOne
        const target = await User.findById(targetUserId);  // Use findById instead of findOne
    
        // Check if users were found
        if (!current || !target) {
          return res.status(404).json({ error: 'User not found.' });
        }
    
        const isFollowing = current.following.includes(target._id);
    
        // Unfollow if already following, else follow
        if (isFollowing) {
          current.following.pull(target._id);
          target.followers.pull(current._id);
        } else {
          // Only add if not already in the followers list
          if (!target.followers.includes(current._id)) {
            current.following.push(target._id);
            target.followers.push(current._id);
          }
        }
    
        // Save changes
        await current.save();
        await target.save();
    
        res.json({
          following: !isFollowing,
          updatedFollowers: target.followers,   // Return updated followers of the target
          updatedFollowing: current.following,  // Return updated following of the current user
        });
      } catch (error) {
        console.error("Error updating follow status:", error);
        res.status(500).json({ error: 'Failed to update following status.' });
      }
    };

/**
 * @description Check the follow status between two users
 * @route GET /api/users/:currentUserId/follow-status/:targetUserId
 * @param {string} currentUserId - The current user's unique ID
 * @param {string} targetUserId - The target user's unique ID
 * @returns {Object} Follow status details (isFollowing, isFollower)
 */
  exports.checkFollowStatus = async (req, res) => {
  const { currentUserId, targetUserId } = req.params; // Use _id instead of username

  try {
    // Find the current user by their _id
    const currentUser = await User.findById(currentUserId).lean();
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the target user by their _id
    const targetUser = await User.findById(targetUserId).lean();
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if targetUserId exists in the current user's following list
    const isFollowing = currentUser.following.some(
      (_id) => _id.toString() === targetUserId
    );

    // Check if targetUserId exists in the current user's followers list
    const isFollower = currentUser.followers.some(
      (_id) => _id.toString() === targetUserId
    );

    return res.json({ isFollowing, isFollower });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @description Get user data by ID
 * @route GET /api/users/:_id
 * @param {string} _id - The user's unique ID
 * @returns {Object} User data (username, fullname, profilePicture, etc.)
 */
exports.getUser = async (req, res) => {
    const { _id } = req.params; // Retrieve user _id from the URL parameter
  
    const isValidObjectId = mongoose.Types.ObjectId.isValid(_id);
  if (!isValidObjectId) {
    console.error("Invalid ObjectId:", _id);
  }
    try {
      const user = await User.findById(_id).lean(); // Find user by _id
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        username: user.username,
        fullname: user.fullname,
        biography: user.biography,
        profilePicture: user.profilePicture,
        // Add other user fields as needed
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  /**
 * @description Get follower and following count of a user
 * @route GET /api/users/:id/follow-count
 * @param {string} id - The user's unique ID
 * @returns {Object} Follower and following counts
 */
 exports.getFollowCount = async (req, res) => {
    try {
      const { id } = req.params; // Retrieve user _id from the URL parameter
  
      // Find the user by _id and populate the 'followers' and 'following' fields
      const user = await User.findById(id).populate('followers following');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Get the count of followers and following
      const followersCount = user.followers.length;
      const followingCount = user.following.length;
  
      // Respond with the counts
      res.json({
        followersCount,
        followingCount,
      });
    } catch (error) {
      console.error('Error fetching follow counts:', error);
      res.status(500).json({ error: 'Failed to fetch follow counts' });
    }
  };
  
  /**
 * @description Get all liked posts by a user
 * @route GET /api/users/:user_id/liked-posts
 * @param {string} user_id - The user's unique ID
 * @returns {Array} List of liked posts
 */
  exports.getLikedPosts = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await User.findById(user_id).select('likedPosts');
        res.status(200).json(user.likedPosts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching liked posts' });
    }
  };

  /**
 * @description Get all liked comments by a user
 * @route GET /api/users/:userId/liked-comments
 * @param {string} userId - The user's unique ID
 * @returns {Array} List of liked comments
 */
  exports.getLikedComments = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find the user and retrieve the likedComments array
      const user = await User.findById(userId).select('likedComments');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Now use the likedComments array to find matching comments in posts
      const likedCommentIds = user.likedComments;
      const postsWithLikedComments = await Post.find({
        'comments._id': { $in: likedCommentIds }
      }).select('comments');
  
      // Extract the liked comments from the posts
      const likedComments = postsWithLikedComments.flatMap(post => 
        post.comments.filter(comment => likedCommentIds.includes(comment._id))
      );
  
      res.status(200).json({ likedComments });
    } catch (error) {
      console.error("Error retrieving liked comments:", error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  /**
 * @description Get suggested users for a user to follow
 * @route GET /api/users/:userId/suggested-users
 * @param {string} userId - The current user's unique ID
 * @returns {Array} List of suggested users
 */
  exports.getSuggestedUsers = async (req, res) => {
    try {
        const currentUserId = req.params.userId;
  
        // Fetch the current user and populate the following field
        const currentUser = await User.findById(currentUserId).populate('following', '_id');
  
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
  
        // Create an array of user IDs the current user is following
        const followingIds = currentUser.following.map(user => user._id);
  
        // Fetch suggested users who are not the current user and not in the following list
        const suggestedUsers = await User.find({
            _id: { $ne: currentUserId }, // Exclude current user
            _id: { $nin: followingIds }  // Exclude users already followed
        }).select('username profilePicture fullname');
  
        res.json(suggestedUsers);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
  };