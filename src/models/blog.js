const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI
console.log('url: ', url)
mongoose.connect(url, { useNewUrlParser: true })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [String]
})

blogSchema.statics.format = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: blog.user,
    comments: blog.comments
  }
}
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog

