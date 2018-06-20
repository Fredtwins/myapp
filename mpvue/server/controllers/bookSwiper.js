const { mysql } = require('../qcloud')

module.exports = async ctx => {
  const list = await mysql('books')
                      .select('id', 'title', 'image', 'count')
                      .orderBy('count', 'desc')
                      .limit(9)

  ctx.state.data = {
    list
  }
}
