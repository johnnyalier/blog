const Comment = require('../models/comment')
const { errorHandler } = require('../utils/error');

const createComment = async (req, res, next) => {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id) 
        return next(errorHandler(403, 'Forbidden'));

    if (!content) 
        return next(errorHandler(400, 'Content is required'));

    try {
        const comment = await Comment.create({ content, postId, userId });

        res.status(201).json(comment);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

const getPostComments = async (req, res, next) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

const getcomments = async (req, res, next) => {
    try {
        if (!req.user.isAdmin)
            return next(errorHandler(403, 'You are not allowed to get all comments'));
        
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        
        const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
        const totalComments = await Comment.countDocuments();
        
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        
        res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

const updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) 
            return next(errorHandler(404, 'Comment not found'));
        
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(
                errorHandler(403, 'You are not allowed to edit this comment')
            );
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content,
            },
            { new: true }
        );
    res.status(200).json(editedComment);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) 
            return next(errorHandler(404, 'Comment not found'));

        if (comment.userId!== req.user.id &&!req.user.isAdmin) {
            return next(
                errorHandler(403, 'You are not allowed to delete this comment')
            );
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getPostComments,
    getcomments,
    likeComment,
}