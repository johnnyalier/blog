const express = require("express")
const {
    getUsers,
    getUser,
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
router.get('/:userId', getUser); 

module.exports = router;