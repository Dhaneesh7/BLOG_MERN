const express= require('express');
const router= express.Router();
const User = require('../controllers.js/userControllers');
router.get("/",User.getUsers);
router.post("/",User.insertUsers);  
router.put("/:id", User.updateUser);
router.get("/:id",User.getUserById);
router.put("/avatar/:id", User.updateAvatar);
module.exports = router;