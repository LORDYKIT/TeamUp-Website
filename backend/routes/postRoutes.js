const express = require('express');
const { createPost, getAllPosts, deletePost, getPostById, likePost, getUserPosts, addComment,
    deleteComment, getComments, likeComment, getPostIdFromComment, getFirstThreeLikers,
    getPostLikeCount, checkComment
 } = require('../controllers/postController');
const { upload } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/create-post', upload.single('picture'), createPost);
router.get('/', getAllPosts);
router.delete('/delete/:_id', deletePost);
router.get('/:postId', getPostById);
router.post('/like-post', likePost);
router.get('/:userId/posts', getUserPosts);
router.post('/:postId/comment', addComment);
router.delete('/:postId/comment/:commentId', deleteComment);
router.get('/:postId/comments', getComments);
router.post('/:commentId/like', likeComment);
router.get('/post/:commentId', getPostIdFromComment);
router.get('/first-three-likers/:postId', getFirstThreeLikers);
router.get('/:postId/likes', getPostLikeCount);
router.post('/check-comment', checkComment);

module.exports = router;
