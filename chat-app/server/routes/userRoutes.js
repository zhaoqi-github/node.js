const express = require('express');
const router = express.Router();
const {
  register,
  login,
  setAvatar,
  getAllUsers,
  logout,
} = require('../controllers/userController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/setAvatar/:id').post(setAvatar);
router.route('/allUsers/:id').get(getAllUsers);
router.route('/logout/:id').get(logout);

module.exports = router;
