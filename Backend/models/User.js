const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Post } = require('./Post');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
  
  },
  phone: Number,
  password: {
    type: String,
    required: true,
    
  select: false,
  },
  posts: [
    {
   
      post : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    },
  ],


});

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
