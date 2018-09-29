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
  passwordHash: String
})

const User = mongoose.model('User', userSchema)

module.exports = User