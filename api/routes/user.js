const express = require("express")
const {
    getUsers,
    updateProfile,
    deleteUser,
    signout,
} = require("../controllers/user");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.get('/getusers', verifyToken, getUsers)
router.put('/update/:userId', verifyToken, updateProfile)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout', signout)

module.exports = router;