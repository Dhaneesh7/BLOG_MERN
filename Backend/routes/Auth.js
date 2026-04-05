const express =require('express');
const router = express.Router();
const Auth=require('../controllers.js/authControllers');

router.post('/login', Auth.login);
router.post('/logout', Auth.logout);    
router.post('/signup', Auth.signup);
router.get('/refresh-token', Auth.refreshToken);
router.get('/profile', Auth.getProfile);    

module.exports = router;
