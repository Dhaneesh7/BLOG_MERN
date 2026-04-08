const { default: mongoose } = require('mongoose');
const post= require('../models/Post');
const User= require('../models/User');
const cloudinary = require('../config/cloudinary');

const getposts = async (req, res) => {
  try {
    const posts = await post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
}
const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = new post({ title, content, author });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
}
// const updatePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content } = req.body;
//     const updatedPost = await post.findByIdAndUpdate(id, { title, content }, { new: true });
//     if (!updatedPost) {
//       return res.status(404).json({ message: 'Post not found' });
//     }
//     res.status(200).json(updatedPost);
//     } catch (error) {
//     res.status(500).json({ message: 'Error updating post', error });   
// }
// }
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    let updateData = { title, content };

    // ✅ if new image uploaded
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      updateData.image = result.secure_url;
    }

    const updatedPost = await post.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
};
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
       // Optional: remove this post from any user's posts array
    await User.updateMany(
      { "posts.post": id },
      { $pull: { posts: { post: id } } }
    );
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
}
// const getpostsbyuser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId)
//     .populate({
//     path: "posts.post",              // populate each 'post' ID
//     select: "title content author image",  // fetch only needed fields
//     populate: {                      // optionally populate author details
//       path: "author",
//       select: "name"
//     }
//   })
//   .exec();
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user.posts);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch order items", err });
//   }
// };

const getpostsbyuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: "posts.post",
        select: "title content author image",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ FLATTEN RESPONSE (IMPORTANT)
    res.json(user.posts.map(p => p.post));

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user posts", err });
  }
};
// const addPost = async (req, res) => {
//   try {
//     // const { postId} = req.body;
//     // const {userId} = req.params;
//     //  // Check productId sent
//     // if (!postId) return res.status(400).json({ message: "postId is required" });
//     // if (!mongoose.Types.ObjectId.isValid(userId)) {
//     //   return res.status(400).json({ message: "Invalid userId" });
//     // }


//     // const user = await User.findById(userId).select('+password');
//     // if (!user) {
//     //   return res.status(404).json({ message: "User not found" });
//     // }

//     // // const existingItem = user.posts.find(post => post.posts.toString() === postId);

//     //   user.posts.push({ post: postId});
    
//     // await user.save();

//     // const updatedUser = await User.findById(userId).populate('posts.post');
//     // res.status(200).json(updatedUser.posts);
//       const { title, content} = req.body;
//       const {author} = req.user?._id || req.body; // Assuming author is the logged-in user or provided in the request body
//   const { userId } = req.params;
//   // optional: validate mongoose.Types.ObjectId.isValid(userId)

//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: 'User not found' });

//   const newPost = await post.create({ title, content, author });

//   user.posts.push({ post: newPost._id });
//   await user.save();

//   const populated = await User.findById(userId).populate(/*'posts.post'*/{
//       path: 'posts',      // assuming user.posts is [ObjectId ref 'Post']
//       populate: {         // also populate author info inside each post
//         path: 'author',
//         select: 'name email'
//       }
//     }).exec();
//   res.status(201).json(populated.posts);
//   } catch (err) {
//     console.error("Error adding post:", err);
//     res.status(500).json({ message: "Failed to add orders", error:err.message || err });
//   }
// };
const addPost = async (req, res) => {
  try {
    console.log("BODY:", req.body);
console.log("FILE:", req.file);
    const { title, content } = req.body;
    const author = req.user?._id || req.body.author;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let imageUrl = "";

    // ✅ HANDLE IMAGE UPLOAD
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    // ✅ CREATE POST
    const newPost = await post.create({
      title,
      content,
      author,
      image: imageUrl,
    });

    // ✅ LINK TO USER
    user.posts.push({ post: newPost._id });
    await user.save();

    res.status(201).json(newPost);

  } catch (err) {
    console.error("Error adding post:", err);
    res.status(500).json({ message: "Failed to add post" });
  }
};
module.exports = {
  getposts,
  createPost,
  updatePost,
  deletePost,
  addPost,
  getpostsbyuser
};