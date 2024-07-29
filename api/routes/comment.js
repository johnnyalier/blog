const express = require("express")
const { verifyToken } = require('../utils/verifyUser')
const {
    createComment,
    updateComment,
    deleteComment,
    getPostComments,
    getcomments,
    likeComment,
} = require('../controllers/comment')

const router = express.Router();

router.post('/create', verifyToken, createComment)

router.get('/getpostcomments/:postId', getPostComments)

router.get('/getcomments', verifyToken, getcomments)

router.put('/like/:commentId', verifyToken, likeComment)

router.put('/update/:commentId', verifyToken, updateComment)

router.delete('/delete/:commentId', verifyToken, deleteComment)

module.exports = router;