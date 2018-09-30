const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { initialUsers, usersInDb }  = require('./user_test_helper')


describe ('initially users in db', async () => {
  beforeAll( async () => {
    await User.remove({})

    const userObjects = initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
    //console.log('Saved users')
  })

  test('users are returned as json', async () => {
    const res = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.length).toBe(initialUsers.length)

    const unames = res.body.map(r => r.username)
    expect(unames).toContain(initialUsers[initialUsers.length-1].username)
  })

  //test('delete user', async () => {
  //  const usersBefore = await usersInDb()
  //  console.log('Deleting ', usersBefore[0].id)
  //  await api.delete('/api/users/' + usersBefore[0].id)
  //  const usersAfter = await usersInDb()
  //  expect(usersAfter.length).toBe(usersBefore.length - 1)
  //  expect(usersAfter).not.toContainEqual(usersBefore[0])
  //})

  //test('modify user', async () => {
  //  const usersBefore = await usersInDb()
  //  usersBefore[0].likes = usersBefore[0].likes+2
  //  console.log('Modify: ', usersBefore[0])
  //  await api
  //    .put('/api/users/' + usersBefore[0].id)
  //    .send(usersBefore[0])
  //  const usersAfter = await usersInDb()
  //  expect(usersAfter.length).toBe(usersBefore.length)
  //  expect(usersAfter).toContainEqual(usersBefore[0])
  //})

  describe ('add new user', async () => {

    test('add new user to db', async () => {

      const newUser = {
        username: 'testuser',
        name: 'test user',
        adult: true,
        password: 'thisIsIt'
      }

      const usersBefore = await usersInDb()

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)

      await api
        .get('/api/users')
        .expect(200)

      const usersAfter = await usersInDb()
      expect(usersAfter.length).toBe(usersBefore.length + 1)

      const contents = usersAfter.map(user => ({ username: user.username, name: user.name, adult: user.adult }))
      expect(contents).toContainEqual({ username: newUser.username, name: newUser.name, adult: newUser.adult })
    })

    describe('add new users', async () => {

      test('adding new user having existing username fails', async () => {

        const newUser = {
          username: 'existinguser',
          name: 'Existing User',
          adult: true,
          password: 'salasana'
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
      })

      test('adding new user having too short password fails', async () => {

        const newUser = {
          username: 'user1',
          name: 'user one',
          adult: true,
          password: 'ok'
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
      })
    })
  })

  afterAll( () => {
    server.close()
  })

})