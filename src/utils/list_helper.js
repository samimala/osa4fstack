
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}

