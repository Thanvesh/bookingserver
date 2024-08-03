const express = require('express');
const {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
  forgotUsername,getUser
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);
router.post('/forgotusername', forgotUsername);
router.get('/user/:id', getUser);

module.exports = router;
