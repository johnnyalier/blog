const express = require("express")
const { updateProfile } = require("../controllers/user");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.put('/update/:userId', verifyToken, updateProfile)

module.exports = router;