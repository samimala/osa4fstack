const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

beforeAll( async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  console.log('Saved blogs')
})

test('blogs are returned as json', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(res.body.length).toBe(6)

  const urls = res.body.map(r => r.url)
  expect(urls).toContain(initialBlogs[4].url)
})


test('add new blog to db', async () => {

  const newBlog = {
    title: 'Lazy Evaluation in Refrigeration Methodology',
    author: 'Diploma Mill Graduate',
    url: 'not known',
    likes: -1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const res = await api
    .get('/api/blogs')
    .expect(200)

  expect(res.body.length).toBe(initialBlogs.length + 1)
  const contents = res.body.map(blog => ({ title: blog.title, author: blog.author, url: blog.url, likes: blog.likes }))
  console.log('contents: ', contents)
  expect(contents).toContainEqual(newBlog)
})

test('add new blog without likes to db', async () => {

  const newBlog = {
    title: 'Tää tätä on',
    author: 'Plokikirjoittaja',
    url: 'Jossain'
  }

  const testAgainstBlog = {
    title: 'Tää tätä on',
    author: 'Plokikirjoittaja',
    url: 'Jossain',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const res = await api
    .get('/api/blogs')
    .expect(200)

  const contents = res.body.map(blog => ({ title: blog.title, author: blog.author, url: blog.url, likes: blog.likes }))
  console.log('contents: ', contents)
  expect(contents).toContainEqual(testAgainstBlog)
})

test('add new blog without title to db fails', async () => {

  const newBlog = {
    author: 'Plokikirjoittaja2',
    url: 'Jossain2',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('add new blog without url to db fails', async () => {

  const newBlog = {
    title: 'Kun urli puuttuu, se puuttuu',
    author: 'Plokikirjoittaja3',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll( () => {
  server.close()
})
