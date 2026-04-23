const express = require('express');
const router = express.Router();

const comment=require('../controllers.js/commentController');
const {protectRoute} = require('../middleware/Auth_Middleware');
console.log("comment:", comment);
console.log("protectRoute:", protectRoute);

// 🔐 Protected
router.post('/add/:postId', protectRoute, comment.addComment);
router.delete('/delete/:commentId', protectRoute, comment.deleteComment);
router.put('/update/:commentId', protectRoute, comment.updateComment);

// 🌐 Public
router.get('/post/:postId', comment.getCommentsByPost);

module.exports = router;