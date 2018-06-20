import qcloud from 'wafer2-client-sdk'
import { httpUrl, ERR_OK } from 'api/config'
import { ajaxPost } from 'api/request'

export const userIsSession = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.checkSession({
            success: () => {
              resolve({
                code: 0
              })
            },
            fail: () => {
              qcloud.clearSession()
              resolve({
                code: 2,
                msg: '需要重新登录'
              })
            }
          })
        } else {
          // res.
        }
        console.log(res)
      }
    })
  })
}

export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    const url = `${httpUrl}/weapp/login`
    const userUrl = `${httpUrl}/weapp/user`

    qcloud.setLoginUrl(url)
    qcloud.request({
      url: userUrl,
      login: true,
      success: res => {
        resolve({
          code: ERR_OK,
          data: res.data.data
        })
      },
      fail: err => {
        resolve(err)
      }
    })
  })
}

export const userLogin = (e) => {
  return new Promise((resolve, reject) => {
    const url = `${httpUrl}/weapp/login`

    qcloud.setLoginUrl(url)
    wx.login({
      success: loginResult => {
        const options = e.detail
        const loginParams = {
          code: loginResult.code,
          encryptedData: options.encryptedData,
          iv: options.iv
        }
        qcloud.requestLogin({
          loginParams,
          success: () => {
            getUserInfo().then(res => {
              resolve(res)
            })
          },
          fail: err => {
            resolve(err)
          }
        })
      },
      fail: err => {
        resolve(err)
      }
    })
  })
}

// export const userLogin = () => {
//   return new Promise((resolve, reject) => {
//     const url = `${httpUrl}/weapp/login`

//     qcloud.setLoginUrl(url)
//     qcloud.login({
//       success: res => {
//         resolve({
//           code: ERR_OK,
//           data: res
//         })
//       },
//       fail: res => {
//         resolve(res)
//       }
//     })
//   })
// }

export const addBook = ({ isbn, openid }) => {
  const url = `${httpUrl}/weapp/addBook`

  const data = {
    isbn,
    openid
  }

  return ajaxPost({ url, data })
}
