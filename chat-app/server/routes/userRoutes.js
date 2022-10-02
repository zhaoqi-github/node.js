const express = require('express');
const router = express.Router();
const { register, login, setAvatar } = require('../controllers/userController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/setAvatar/:id').post(setAvatar);

module.exports = router;
