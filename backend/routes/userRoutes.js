const express = require('express');
const {
  users,
  updateUser,
  getFollowers,
  getFollowing,
  followUser,
  getUser,
  getFollowCount,
  checkFollowStatus,
  getLikedPosts, getLikedComments,
  getSuggestedUsers
} = require('../controllers/userController');
const { upload } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.get('/', users);
router.put('/:id', upload.single('profilePicture'), updateUser);
router.get('/:_id', getUser);
router.get('/:_id/followers', getFollowers);
router.get('/:_id/following', getFollowing);
router.post('/:currentUserId/follow/:targetUserId', followUser);
router.get('/:id/follow-count', getFollowCount);
router.get('/checkFollowStatus/:currentUserId/:targetUserId', checkFollowStatus);
router.get('/user-liked-posts/:user_id', getLikedPosts);
router.get('/:userId/liked-comments', getLikedComments);
router.get('/suggested-users/:userId', getSuggestedUsers);
module.exports = router;
