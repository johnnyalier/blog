const express = require("express")
const { 
    updateProfile,
    deleteUser,
    signout,
} = require("../controllers/user");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.put('/update/:userId', verifyToken, updateProfile)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout', signout)

module.exports = router;