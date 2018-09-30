const User = require('../models/user')

const initialUsers = [
  {
    username: 'InitUser1',
    name: 'Initial 1 User',
    adult: true,
    password: 'salasana'
  },
  {
    username: 'InitUser2',
    name: 'Initial 2 User',
    adult: true,
    password: 'salasana'
  },
  {
    username: 'InitUser3',
    name: 'Initial 3 User',
    adult: true,
    password: 'salasana'
  },
  {
    username: 'InitUser4',
    name: 'Initial 4 User',
    adult: true,
    password: 'salasana'
  }
]

const format  = (user) => {
  return {
    username: user.username,
    name: user.name,
    adult: user.adult,
    id: user._id
  }
}

const nonExistingId = async () => {
  const user = new User()
  await user.save()
  await user.remove()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(format)
}

module.exports = {
  initialUsers, format, nonExistingId, usersInDb
}

