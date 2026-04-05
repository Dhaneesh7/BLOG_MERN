const express= require('express');
const router= express.Router();
const User = require('../controllers.js/userControllers');
router.get("/",User.getUsers);
router.post("/",User.insertUsers);  
module.exports = router;