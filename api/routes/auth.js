const router = require("express").Router();
const {
    signup
} = require('../controllers/auth.js');


router.post('/signup', signup);

module.exports = router;