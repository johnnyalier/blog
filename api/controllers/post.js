const { errorHandler } = require('../utils/error.js');
const Post  = require('../models/post')

const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) 
        return next(errorHandler(403, 'Forbidden'));
    
    if (!req.body.title || !req.body.content) 
        return next(errorHandler(400, 'All fields are required'));
    
    try {
        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
        const newPost = await Post.create({
            ...req.body,
            slug,
            userId: req.user.id,
        });

        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
}

const getPosts = async (req, res, next) => {}

const getPostById = async (req, res, next) => {}

const updatePost = async (req, res, next) => {}

const deletePost = async (req, res, next) => {}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
}