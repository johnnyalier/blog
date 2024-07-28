const express = require("express")
const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
} = require('../controllers/post')
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router()

router.post('/create', verifyToken, createPost)

router.get('/', getPosts)

router.get('/:postId', getPostById)

router.put('/update/:postId', verifyToken, updatePost)

router.delete('/delete/:postId', verifyToken, deletePost)

module.exports = router;