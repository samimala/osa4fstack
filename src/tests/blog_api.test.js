const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb }  = require('./test_helper')


describe ('initially blogs in db', async () => {
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

  describe ('add new blog', async () => {

    test('add new blog to db', async () => {

      const newBlog = {
        title: 'Lazy Evaluation in Refrigeration Methodology',
        author: 'Diploma Mill Graduate',
        url: 'not known',
        likes: -1
      }

      const blogsBefore = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      await api
        .get('/api/blogs')
        .expect(200)

      const blogsAfter = await blogsInDb()
      expect(blogsAfter.length).toBe(blogsBefore.length + 1)

      const contents = blogsAfter.map(blog => ({ title: blog.title, author: blog.author, url: blog.url, likes: blog.likes }))
      expect(contents).toContainEqual(newBlog)
    })

  
    describe('add new blogs', async () => {


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

        const blogsAfter = await blogsInDb()

        const contents = blogsAfter.map(blog => ({ title: blog.title, author: blog.author, url: blog.url, likes: blog.likes }))
        //console.log('contents: ', contents)
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
    })
  })

  afterAll( () => {
    server.close()
  })

})