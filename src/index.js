const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

const Blog = require('./models/blog')

app.get('/info', (req, res) => {
  Blog
    .countDocuments({})
    .then(result => {
      res.send('<div>Blogissa on ' + result + ' alkiota</div>' +
               '<div>' + new Date()+ '</div>')
    })
    .catch(error => {
      res.send('<div>Counting produce error: ' + error + '</div>')
    })
})

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      console.log('Blogs found in DB')
      console.log('Blogs: ', blogs)
      console.log(blogs.map(Blog.format))
      response.json(blogs.map(Blog.format))
    })
    .catch(err => {
      console.log('Error:', err)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  console.log(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
