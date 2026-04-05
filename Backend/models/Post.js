const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    title:
        { type: String },
    content:
        { type: String },
    author:
    {type: String}
        // { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})
module.exports= mongoose.model("Post", postSchema)
