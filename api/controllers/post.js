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

const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);
        const totalPosts = await Post.countDocuments()

        const timeNow = new Date()
        const aMonthAgo = new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate())
        const postsInLastMonth = await Post.countDocuments({ createdAt: { $gte: aMonthAgo } })

        res.status(200).json({posts, totalPosts, postsInLastMonth});
    } catch (error) {
        next(error);
    }
}

const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id!== req.params.userId) 
        return next(errorHandler(403, 'Operation Forbidden!'));

    if (!req.body.title ||!req.body.content) 
        return next(errorHandler(400, 'All fields are required'));

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId, 
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                },
            }, 
            { new: true }
        );
        if (!updatedPost) return next(errorHandler(404, 'Post not found'));

        res.status(200).json(updatedPost);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) 
        return next(errorHandler(403, 'Opeartion Forbidden!'));

    try {
        const post = await Post.findByIdAndDelete(req.params.postId);
        if (!post) return next(errorHandler(404, 'Post not found'));

        res.status(200).json('Post deleted successfully');
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
}