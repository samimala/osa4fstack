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
  id: String
})

blogSchema.statics.format = function(blog) {
  console.log('blog: ', blog)
  return { title: blog.title, author: blog.author, url: blog.url, likes: blog.likes, id: blog._id }
  
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog