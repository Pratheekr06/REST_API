const Post = require('../models/post');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/fileHelper');
const io = require('../socket');

exports.getPosts = (req, res, next) => {
    const page = req.query.pageNo;
    const itemsPerPage = req.query.itemsPerPage;
    Post.find().skip((page - 1) * itemsPerPage).limit(itemsPerPage)
        .then(posts => {
            if (!posts) {
                const error = new Error('Could not find the post');
                error.statusCode = 404;
                throw err;
            }
            res.status(200).json({ message: 'Posts fetched', posts: posts});
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const image = req.file;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, Entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }
    if (!image) {
        const error = new Error('Image not found');
        error.statusCode = 422;
        throw error;
    }
    const post = new Post({
        title: title,
        image: image.path.replace("\\" ,"/"),
        content: content,
        creator: { name: 'Max' },
    });
    post.save()
        .then(result => {
            io.getIO().emit('posts', { action: 'create', post: post })
            res.status(201).json({
                message: 'Post created successfully',
                post: result
            });
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.getPost = (req, res, next) => {
    const id = req.params.postId;
    Post.findById(id)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find the post');
                error.statusCode = 404;
                throw err;
            }
            res.status(200).json({ message: 'Post fetched', post: post});
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        })
}

exports.editPost = async (req, res, next) => {
    const id = req.params.id;
    const title = req.body.title;
    const content = req.body.content;
    let image = req.body.image;
    if (req.file) image = req.file;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, Entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }
    if (!image) {
        const error = new Error('Image not found');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(id)
        .then(post => {
            if (!post) {
                const error = 'No Post found';
                error.statusCode = 404;
                throw error;
            }
            post.title = title;
            post.content = content;
            post.creator = { name: 'max' };
            if(post.image) fileHelper.fileDelete(post.image);
            else post.image = image.path.replace("\\" ,"/");;
            return post.save();
        })
        .then(post => {
            res.status(200).json({ message: 'Post Updated Successfullt', post: post})
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
}

exports.deletePost = (req, res, next) => {
    const id = req.params.id;
    Post.findById(id)
        .then(post => {
            if (!post) {
                const error = 'No Post found';
                error.statusCode = 404;
                throw error;
            }
            if (post.image) fileHelper.fileDelete(post.image);
            return post.remove()
        })
        .then(post => {
            res.status(202).json({ message: 'Post deleted successfully', post: post })
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        })
}