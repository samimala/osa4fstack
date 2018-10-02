const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


usersRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { author: 1, title: 1, url: 1, likes: 1, _id: 1 })
    response.json(users.map(User.format))
  }
  catch(exception) {
    console.log('Error:', exception)
  }})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    console.log('POST:', body)
    const existingUser = await User.find({ username : body.username })
    console.log('existing user: ', existingUser)
    if (existingUser.length) {
      response.status(400).json({ error: 'username already exists' })
      return
    }
    if (body.password===undefined || body.password.length < 3) {
      response.status(400).json({ error: 'password too short, must be at least 3 characters' })
      return
    }


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      adult: (body.adult===undefined)?true:body.adult,
      passwordHash
    })

    console.log('Adding user ', user)
    const result = await user.save()
    response.status(201).json(result)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter
