const express = require("express")
const {
    createPost,
    getPosts,
    updatePost,
    deletePost,
} = require('../controllers/post')
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router()

router.post('/create', verifyToken, createPost)

router.get('/getposts', getPosts)

router.put('/update/:postId/:userId', verifyToken, updatePost)

router.delete('/delete/:postId/:userId', verifyToken, deletePost)

module.exports = router;