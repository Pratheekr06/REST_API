const express = require('express');

const router = express.Router();

const feedController = require('../controller/feed');
const postValidation = require('../validation/postValidation');
const auth = require('../middleware/auth');

router.get('/post', feedController.getPosts);

router.post('/post', auth, postValidation, feedController.createPost);

router.get('/post/:postId', feedController.getPost);

router.put('/post/edit-post/:id', auth, postValidation, feedController.editPost);

router.delete('/post/delete/:id', auth,  feedController.deletePost)

module.exports = router;