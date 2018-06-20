<template>
  <div class="me">
    <div class="me-wrapper-noLogin" v-if="!userinfo.openId">
      <div class="user-info">
        <img src="/static/img/unlogin.png" alt="">
      </div>
      <div class="noLogin-btn">
        <button
          v-if="!userinfo.openId"
          open-type="getUserInfo"
          lang="zh_CN"
          @getuserinfo="userIsSession">点击登录</button>
      </div>
    </div>

    <div class="me-wrapper" v-if="userinfo.openId">
      <div class="user-info">
        <img :src="userinfo.avatarUrl" alt="">
        <p>{{userinfo.nickName}}</p>
      </div>

      <div class="add-book">
        <button
          class='btn'
          @click='scanBook'>添加图书</button>
      </div>
    </div>

  </div>
</template>

<script>
  import qcloud from 'wafer2-client-sdk'
  import { mapState, mapMutations } from 'vuex'
  import { ERR_OK } from 'api/config'
  import { userLogin, getUserInfo, addBook } from 'api/me'
  import { userStorageKey } from 'common/js/config'
  import { setStorageSync, showLoading, hideLoading, successToast, showModal } from 'common/js/dom'

  export default {
    created () {
      this.loading = false
    },
    computed: {
      ...mapState([
        'userinfo'
      ])
    },
    data () {
      return {
        img: '/img/unlogin.png'
      }
    },
    methods: {
      scanBook () {
        if (this.loading) {
          return
        }
        wx.scanCode({
          success: res => {
            const isbn = res.result
            if (isbn) {
              this._addBook(isbn)
            } else {
              showModal('扫码错误', '请尝试重新扫码')
            }
          }
        })
      },
      async _addBook (isbn) {
        this.loading = true
        showLoading({
          title: '添加中...'
        })
        const res = await addBook({
          isbn,
          openid: this.userinfo.openId
        })
        hideLoading()
        this.loading = false
        if (res.code === ERR_OK && res.data.title) {
          showModal('添加成功', `${res.data.title} 添加成功`)
        } else if (res.code === 1) {
          showModal('添加失败', res.data.msg)
        } else {
          showModal('添加失败', '请尝试重新添加')
        }
      },
      userIsSession (e) {
        if (this.loading) {
          return
        }

        this.loading = true
        wx.getSetting({
          success: res => {
            // 获取用户授权情况
            if (res.authSetting['scope.userInfo']) {
              // 用户允许授权用户信息
              wx.checkSession({
                success: (res) => {
                  if (JSON.stringify(this.userinfo) === '{}') {
                    this.loading = true
                    showLoading({
                      title: '登录中...'
                    })
                    getUserInfo().then(res => {
                      hideLoading()
                      this.loading = false
                      if (res.code === ERR_OK) {
                        setStorageSync({
                          key: userStorageKey,
                          val: res.data
                        })
                        this.SET_USERINFO(res.data)
                        successToast({
                          title: '登录成功'
                        })
                      } else {
                        showModal('登录失败', '请尝试重新登录')
                      }
                    })
                  }
                },
                fail: () => {
                  // session已经过期
                  qcloud.clearSession()
                  this._userLogin(e.mp)
                }
              })
            } else {
              // 用户拒绝授权用户信息
            }
          }
        })
      },
      async _userLogin (e) {
        showLoading({
          title: '登录中...'
        })

        const res = await userLogin(e)
        hideLoading()
        this.loading = false
        if (res.code === ERR_OK) {
          setStorageSync({
            key: userStorageKey,
            val: res.data
          })
          this.SET_USERINFO(res.data)
          successToast({
            title: '登录成功'
          })
        } else {
          showModal('登录失败', '请尝试重新登录')
        }
      },
      ...mapMutations([
        'SET_USERINFO'
      ])
      // async _userLogin (e) {
      //   if (this.loading) {
      //     return
      //   }

      //   const user = getStorageSync({
      //     key: userStorageKey
      //   })

      //   if (!user) {
      //     this.loading = true
      //     showLoading({
      //       title: '登录中...'
      //     })

      //     const res = await userLogin(e.mp)
      //     hideLoading()
      //     this.loading = false
      //     if (res.code === ERR_OK) {
      //       setStorageSync({
      //         key: userStorageKey,
      //         val: res.data
      //       })
      //       this.userinfo = res.data
      //       successToast({
      //         title: '登录成功'
      //       })
      //     } else {
      //       showModal('登录失败', '请尝试重新登录')
      //     }
      //   }
      // }
      // async _userLogin () {
      //   if (this.loading) {
      //     return
      //   }
      //   const user = getStorageSync({
      //     key: userStorageKey
      //   })
      //   if (!user) {
      //     this.loading = true
      //     showLoading({
      //       title: '登录中...'
      //     })
      //     const res = await userLogin()
      //     hideLoading()
      //     this.loading = false
      //     if (res.code === ERR_OK) {
      //       setStorageSync({
      //         key: userStorageKey,
      //         val: res.data
      //       })
      //       this.userinfo = res.data
      //       successToast({
      //         title: '登录成功'
      //       })
      //     } else {
      //       showModal('登录失败', '请尝试重新登录')
      //     }
      //   }
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .me {
    padding: 0 30rpx;
    .me-wrapper-noLogin {
      >.user-info{
        margin-top:100rpx;
        text-align:center;
        > img {
          width: 150rpx;
          height:150rpx;
          margin: 20rpx;
          border-radius: 50%;
        }
      }
      > .noLogin-btn {
        > button {
          width: 100px;
          font-size: 14px;
        }
      }
    }
    .me-wrapper {
      >.user-info{
        margin-top: 100rpx;
        text-align: center;
        > img {
          width: 150rpx;
          height: 150rpx;
          margin: 20rpx;
          border-radius: 50%;
        }
      }
      > .add-book {
        margin-top: 20px;
      }
    }
  }
</style>

