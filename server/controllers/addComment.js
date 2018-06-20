const { mysql } = require('../qcloud')

module.exports = async ctx => {
  const data = ctx.request.body

  try {
    await mysql('comments')
            .insert(data)

    ctx.state.data = {
      msg: '添加成功'
    }
  } catch (e) {
    ctx.state = {
      code: -1,
      data: {
        msg: e.sqlMessage
      }
    }
  }
}
