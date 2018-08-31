const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog  = (blog) => {
  console.log('blog: ', blog)
  return { title: blog.title, author: blog.author, url: blog.url, likes: blog.likes, id: blog._id }
}


blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      //console.log('Blogs found in DB')
      //console.log('Blogs: ', blogs)
      //console.log(blogs.map(formatBlog))
      response.json(blogs.map(formatBlog))
    })
    .catch(err => {
      console.log('Error:', err)
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  //console.log(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})


module.exports = blogsRouter