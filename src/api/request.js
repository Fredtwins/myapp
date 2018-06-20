export const ajaxGet = ({ url = '', data = {} }) => {
  return request({
    url,
    data,
    method: 'GET'
  })
}

export const ajaxPost = ({ url = '', data = {} }) => {
  return request({
    url,
    data,
    method: 'POST'
  })
}

function request ({ url, method, data } = { url: '', method: 'GET', data: {} }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        reject({
          msg: err
        })
      }
    })
  })
}
