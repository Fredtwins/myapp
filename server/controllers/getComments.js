const { mysql } = require('../qcloud')

module.exports = async ctx => {
  const { bookid, openid } = ctx.request.body

  const mysqlSelect = mysql('comments')
                      .select('comments.*', 'cSessionInfo.user_info')
                      .join('cSessionInfo', 'cSessionInfo.open_id', 'comments.openid')

  let list
  if (bookid) {
    list = await mysqlSelect.where('bookid', bookid)
  } else if (openid) {
    list = await mysqlSelect.where('openid', openid)
  }

  ctx.state.data = {
    list: list.map(item => {
      const user = JSON.parse(item.user_info)

      return Object.assign({}, item, {
        user_info: user
      })
    })
  }
}
