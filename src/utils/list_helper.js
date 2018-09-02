
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

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return {}
  }

  let maxLikes = blogs.reduce((accum,blog) => accum=Math.max(accum, blog.likes),0)
  let maxIndex = blogs.findIndex((blog) => blog.likes === maxLikes)
  return { title: blogs[maxIndex].title, author: blogs[maxIndex].author, likes: blogs[maxIndex].likes }
}

const mostBlogs = (blogs) => {
  let authors = blogs.map(blog => blog.author) 
  let blogCounts = []

  authors.forEach(auth => {
    if (!blogCounts.find(val => val.author===auth)) {
      blogCounts.push({ author: auth, blogs: blogs.filter(blog => blog.author === auth).length })
    }
  })

  let maxBlogs = blogCounts.reduce((accum,blogcnt) => accum=Math.max(accum, blogcnt.blogs),0)
  let maxIndex = blogCounts.findIndex((blogcnt) => blogcnt.blogs === maxBlogs)
  if (blogCounts[maxIndex]) {
    return blogCounts[maxIndex]
  }
  return {}
}

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return {}
  }

  let authors = blogs.map(blog => blog.author)
  let blogLikes = []

  authors.forEach(auth => {
    let blog = blogLikes.find(val => val.author===auth)
    if (!blog) {
      blogLikes.push({ author: auth, likes: blogs.reduce((totlikes, redblog) => (redblog.author===auth)?totlikes+redblog.likes:totlikes, 0) })
    } 
  })
  //console.log('Bloglikes: ', blogLikes)
  let maxLikes = blogLikes.reduce((accum,bwithLikes) => accum=Math.max(accum, bwithLikes.likes),0)
  let maxIndex = blogLikes.findIndex((blog) => blog.likes === maxLikes)
  //console.log('MaxLikes:', blogLikes[maxIndex])
  return blogLikes[maxIndex]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

