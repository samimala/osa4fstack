const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog  = (blog) => {
  //console.log('blog: ', blog)
  //console.log('formatBlog called')
  return { title: blog.title, author: blog.author, url: blog.url, likes: blog.likes, id: blog._id }
}


blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs.map(formatBlog))
  }
  catch(exception) {
    console.log('Error:', exception)
  }
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (blog.likes===undefined) {
    //console.log('likes was undefined')
    blog['likes'] = 0
    //console.log('Blog now: ', blog)
  }
  if (blog.title===undefined || blog.url===undefined) {
    response.status(400).end()
    return
  }
  //console.log(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter