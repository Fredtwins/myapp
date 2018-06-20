const axios = require('axios')

const get = ({ url }) => request({
  url,
  method: 'GET'
})

const post = ({ url, data }) => request({
  url,
  data,
  method: 'POST'
})

const request = ({ url, method, data }) => new Promise((resolve, reject) => {
  axios({
    url,
    method,
    data
  }).then(res => {
    resolve(res.data)
  }).catch(err => {
    reject({
      msg: err
    })
  })
})

module.exports = {
  get,
  post
}
