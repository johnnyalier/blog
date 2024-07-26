const router = require("express").Router();
const {
    signup,
    signin,
    googleAuth,
} = require('../controllers/auth.js');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google-signin', googleAuth);

module.exports = router;