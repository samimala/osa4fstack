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

blogsRouter.delete('/:id', async (request, response) => {
  console.log('REquest is ', request.params.id)
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true } )
    response.json(formatBlog(updatedBlog))
  } catch(exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter