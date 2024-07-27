const express = require("express")
const { 
    updateProfile,
    deleteUser,
} = require("../controllers/user");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.put('/update/:userId', verifyToken, updateProfile)
router.delete('/delete/:userId', verifyToken, deleteUser)

module.exports = router;