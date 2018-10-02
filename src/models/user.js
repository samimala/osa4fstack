const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI
console.log('url: ', url)
mongoose.connect(url, { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  adult: Boolean,
  passwordHash: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    adult: user.adult,
    blogs: user.blogs
  }
}


const User = mongoose.model('User', userSchema)

module.exports = User