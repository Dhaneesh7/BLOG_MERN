const express = require('express');
const router= express.Router();
const Post =require("../controllers.js/postControllers")
const {upload} = require("./../middleware/upload");
const { protectRoute } = require("../middleware/Auth_Middleware");
console.log("UPLOAD:", upload);

console.log("CONTROLLERS:", Post);
router.get("/",Post.getposts);
router.get("/:userId",Post.getpostsbyuser);
router.post("/",protectRoute,upload.single("image"),Post.createPost);
// router.post("/:userId", protectRoute, upload.single("image"), Post.createPost);
router.put("/:id", protectRoute, upload.single("image"), Post.updatePost);
router.delete("/:id", protectRoute, Post.deletePost);
module.exports = router;