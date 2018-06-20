export const setStorageSync = (obj = {}) => {
  const { key, val } = obj
  return wx.setStorageSync(key, val)
}

export const getStorageSync = (obj = {}) => {
  const { key } = obj
  return wx.getStorageSync(key)
}

export const showLoading = (obj = { title: '加载中' }) => {
  const { title } = obj
  wx.showLoading({
    title: title
  })
}

export const hideLoading = () => {
  wx.hideLoading()
}

export const showNavLoading = () => {
  wx.showNavigationBarLoading()
}

export const hideNavLoading = () => {
  wx.hideNavigationBarLoading()
}

export const successToast = (obj = {}) => {
  const { title } = obj
  wx.showToast({
    title: title,
    icon: 'success'
  })
}

export function showModal (title = '', content = '') {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}
