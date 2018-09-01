
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (accumulator,blog) => {
    //console.log('Curreng accum: ', accumulator)
    return accumulator + blog.likes
  }
  return blogs.reduce(reducer,0)
}


module.exports = {
  dummy,
  totalLikes
}

