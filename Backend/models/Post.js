const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    required: true,
    trim: true
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  image: {
    type: String,
    default: ""
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
  type: Number,
  default: 0
}

}, { timestamps: true }); // ✅ IMPORTANT

module.exports = mongoose.model("Post", postSchema);