const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    title:
        { type: String },
    content:
        { type: String },
    author:
    {type: String},
        // { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: {
  type: String,
}
})
module.exports= mongoose.model("Post", postSchema)
