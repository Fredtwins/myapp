const request = require('../axios')
const { mysql } = require('../qcloud')

module.exports = async ctx => {
  const { isbn, openid } = ctx.request.body

  if (isbn && openid) {
    const findRes = await mysql('books').select().where('isbn', isbn)
    if (findRes.length) {
      ctx.state = {
        code: 1,
        data: {
          msg: '图书已存在'
        }
      }
      return
    }

    const url = `https://api.douban.com/v2/book/isbn/${isbn}`

    const bookinfo = await request.get({ url })

    const rate = bookinfo.rating.average
    const { title, image, alt, publisher, summary, price } = bookinfo
    const tags = bookinfo.tags.map(item => {
      return `${item.title} ${item.count}`
    }).join(',')
    const author = bookinfo.author.join(',')

    try {
      await mysql('books').insert({
        isbn, openid, rate, title, image, alt, publisher, summary, price, tags, author
      })
      ctx.state.data = {
        title,
        msg: 'success'
      }
    } catch (err) {
      ctx.state = {
        code: -1,
        data: {
          msg: err.sqlMessage
        }
      }
    }
  }
}

