import { httpUrl } from 'api/config'
import { ajaxPost } from 'api/request'

export const getSwiper = () => {
  const url = `${httpUrl}/weapp/bookSwiper`

  return ajaxPost({
    url
  })
}

export const getBooksList = ({ page, pageSize, openid } = {}) => {
  const url = `${httpUrl}/weapp/booksList`

  return ajaxPost({
    url,
    data: {
      page,
      pageSize,
      openid
    }
  })
}
