const express = require('express');

const router = express.Router();

const feedController = require('../controller/feed');
const postValidation = require('../validation/postValidation');

router.get('/post', feedController.getPosts);

router.post('/post', postValidation, feedController.createPost);

router.get('/post/:postId', feedController.getPost);

router.put('/post/edit-post/:id', postValidation, feedController.editPost);

router.delete('/post/delete/:id', feedController.deletePost)

module.exports = router;