const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// GET ALL POSTS
const getposts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// CREATE POST
const createPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title & content required" });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_posts" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      image: imageUrl
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: post._id }
    });

    res.status(201).json(post);

  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE POST
// const updatePost = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const post = await Post.findById(id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     if (post.author.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     let updateData = {};

//     if (req.body.title) updateData.title = req.body.title;
//     if (req.body.content) updateData.content = req.body.content;

//     if (req.file) {
//       const result = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "blog_posts" },
//           (err, result) => {
//             if (err) reject(err);
//             else resolve(result);
//           }
//         );
//         stream.end(req.file.buffer);
//       });

//       updateData.image = result.secure_url;
//     }

//     const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });

//     res.json(updatedPost);

//   } catch (err) {
//     res.status(500).json({ message: "Error updating post" });
//   }
// };
const updatePost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let updateData = {};

    if (req.body.title) updateData.title = req.body.title;
    if (req.body.content) updateData.content = req.body.content;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_posts" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      updateData.image = result.secure_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });

    res.json(updatedPost);

  } catch (err) {
    console.error("Update error:", err); // ✅ ADD THIS
    res.status(500).json({ message: err.message });
  }
};
// DELETE POST
// const deletePost = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const post = await Post.findById(id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     if (post.author.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     await Post.findByIdAndDelete(id);

//     await User.findByIdAndUpdate(req.user._id, {
//       $pull: { posts: post._id } // ✅ FIXED
//     });

//     res.json({ message: "Post deleted" });

//   } catch (err) {
//     res.status(500).json({ message: "Error deleting post" });
//   }
// };
const deletePost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(id);

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: post._id }
    });

    res.json({ message: "Post deleted" });

  } catch (err) {
    console.error("Delete error:", err); // ✅ ADD THIS
    res.status(500).json({ message: err.message });
  }
};
// GET POSTS BY USER
const getpostsbyuser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "name");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user posts" });
  }
};

// LIKE / UNLIKE
const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.some(id => id.toString() === userId.toString());

    if (liked) {
      post.likes.pull(userId);
    } else {
      if(!post.likes.includes(userId)) {
      
      post.likes.push(userId);
      }
    }

    await post.save();

    res.json({
      success: true,
      liked: !liked,
      likesCount: post.likes.length
    });

  } catch (err) {
    res.status(500).json({ message: "Error toggling like" });
  }
};

module.exports = {
  getposts,
  createPost,
  updatePost,
  deletePost,
  getpostsbyuser,
  toggleLike
};