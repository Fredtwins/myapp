const KoaProxy = require('koa2-proxy')

KoaProxy.when('/', function (ctx) {
  ctx.request.host = '47.100.210.33:5757'
  ctx.request.protocol = 'http'
})

KoaProxy.listen(6868, () => {
  console.log('启动反向代理成功')
})
