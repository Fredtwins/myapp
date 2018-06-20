import coordtransform from 'coordtransform'
import { httpUrl } from 'api/config'
import { ajaxPost } from 'api/request'

export const getBookDetail = ({ id }) => {
  const url = `${httpUrl}/weapp/bookDetail`

  const data = {
    id
  }

  return ajaxPost({
    url,
    data
  })
}

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      success: geo => {
        const wgs84togcj02 = coordtransform.wgs84togcj02(geo.longitude, geo.latitude)
        const changeGeo = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1])

        const url = 'http://api.map.baidu.com/geocoder/v2/'

        const data = {
          ak: 'bM5wNuOrapPqqwjLxTV90q4vonw6IVYR',
          location: `${changeGeo[1]},${changeGeo[0]}`,
          output: 'json'
        }

        wx.request({
          url,
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
      }
    })
  })
}

export const addComment = (data = {}) => {
  const url = `${httpUrl}/weapp/addComment`

  return ajaxPost({
    url,
    data
  })
}

export const getComments = ({ bookid, openid }) => {
  const url = `${httpUrl}/weapp/getComments`

  const data = {
    bookid,
    openid
  }

  return ajaxPost({
    url,
    data
  })
}

