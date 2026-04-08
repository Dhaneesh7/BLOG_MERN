const express = require('express');
const router= express.Router();
const Post =require("../controllers.js/postControllers")
const {upload} = require("./../middleware/upload");
console.log("UPLOAD:", upload);
router.get("/",Post.getposts);
router.get("/:userId",Post.getpostsbyuser);
router.post("/",Post.createPost);
router.post("/:userId", upload.single("image"), Post.addPost);
router.put("/:id", upload.single("image"), Post.updatePost);
router.delete("/:id", Post.deletePost);
module.exports = router;