const { mysql } = require('../qcloud')

module.exports = async ctx => {
  const { page, pageSize, openid } = ctx.request.body
  const sqlSelect = mysql('books')
                        .select('books.*', 'cSessionInfo.user_info')
                        .join('cSessionInfo', 'books.openid', 'cSessionInfo.open_id')
                        .orderBy('books.id', 'desc')

  let books
  if (openid) {
    books = await sqlSelect.where('books.openid', openid)
  } else {
    books = await sqlSelect
                    .offset(Number(page) * pageSize)
                    .limit(pageSize)
  }

  ctx.state.data = {
    list: books.map(item => {
      const info = JSON.parse(item.user_info)
      return Object.assign({}, item, {
        user_info: {
          nickName: info.nickName || ''
        }
      })
    })
  }
}
