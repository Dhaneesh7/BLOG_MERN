const express = require('express');
const router= express.Router();
const Post =require("../controllers.js/postControllers")

router.get("/",Post.getposts);
router.get("/:userId",Post.getpostsbyuser);
router.post("/",Post.createPost);
router.post("/:userId",Post.addPost);
router.put("/:id", Post.updatePost);
router.delete("/:id", Post.deletePost);
module.exports = router;