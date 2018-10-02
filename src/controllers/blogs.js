const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')



blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { _id:1, username: 1, name: 1 })

    console.log('Blogs', blogs)
    if (blogs===undefined || blogs.length===0) {
      console.log('Mitään ei löytynyt')
      response.json({ data: 'no content in page' })
      return
    }

    response.json(blogs.map(Blog.format))
  }
  catch(exception) {
    console.log('Error:', exception)
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (body.title===undefined || body.url===undefined) {
    response.status(400).end()
    return
  }

  //const user = await User.findById(body.userId)
  const user = await User.findOne()

  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: (body.likes===undefined)?0:body.likes,
    url: body.url,
    user: user._id
  })


  //console.log(request.body)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
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
    console.log('udatedBlog', updatedBlog)
    response.json(Blog.format(updatedBlog))
  } catch(exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter