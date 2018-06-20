<template>
  <div class="detail">

    <div class="detail-content" v-if="book">

      <div class="detail-bookInfo">
        <BookInfo  :info="book"></BookInfo>
      </div>

      <div class="detail-comments" v-if="comments.length">
        <CommentList :comments="comments"></CommentList>
      </div>

      <div class="detail-comment" v-if="showAdd">
        <textarea v-model="comment"
                  class="textarea"
                  placeholder="请输入图书短评"
                  :maxlength="100"></textarea>
        <div class="location">
          地理位置：
          <switch color="#EA5A49" @change="getGeo"></switch>
          <span v-show="!localLoading" class="text-primary">{{location}}</span>
          <img v-show="localLoading" class="location-img" src="/static/img/loading.gif" alt="">
        </div>
        <div class="phone">
          手机型号：
          <switch color="#EA5A49" @change="getPhone"></switch>
          <span class="text-primary">{{phone}}</span>
        </div>
        <button class="btn" @click='addComment'>
          评论
        </button>
      </div>

      <div v-else class='text-footer'>
        未登录或者已经评论过啦
      </div>

      <button open-type='share' class="btn">转发给好友</button>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BookInfo from './book-info'
  import CommentList from 'base/comment-list/comment-list'
  import { ERR_OK } from 'api/config'
  import { getBookDetail, getLocation, getComments, addComment } from 'api/detail'
  import { showLoading, hideLoading, successToast, showModal } from 'common/js/dom'
  export default {
    components: {
      BookInfo,
      CommentList
    },
    created () {
      this.loading = false
    },
    mounted () {
      this.init()
    },
    computed: {
      ...mapGetters([
        'openid'
      ]),
      showAdd () {
        if (!this.openid) {
          return false
        }

        const arr = this.comments.filter(item => {
          if (item.openid === this.openid) {
            return item
          }
        })

        if (arr.length > 0) {
          return false
        }

        return true
      }
    },
    data () {
      return {
        book: null,
        comments: [],
        bookid: '',
        comment: '',
        location: '',
        phone: '',
        localLoading: false
      }
    },
    methods: {
      async addComment () {
        if (this.comment === '') {
          showModal('添加失败', '评论内容不能为空')
          return
        }
        if (this.loading) {
          return
        }

        this.loading = true
        showLoading({
          title: '添加中...'
        })

        const data = {
          openid: this.openid,
          bookid: this.bookid,
          comment: this.comment,
          location: this.location,
          phone: this.phone
        }

        const res = await addComment(data)

        this.loading = false
        hideLoading()

        if (res.code === ERR_OK) {
          successToast({
            title: '添加成功'
          })
          this.comment = ''
          this.location = ''
          this.phone = ''
          this._getComments(this.bookid)
        } else {
          showModal({
            title: '添加失败',
            content: '尝试重新添加'
          })
        }
      },
      async getGeo (e) {
        if (e.target.value) {
          this.localLoading = true
          const res = await getLocation()
          this.localLoading = false
          if (res.status === ERR_OK) {
            const { city } = res.result.addressComponent
            this.location = city
          } else {
            this.location = '获取地点失败'
          }
        } else {
          this.localLoading = false
          this.location = ''
        }
      },
      getPhone (e) {
        if (e.target.value) {
          const { model } = wx.getSystemInfoSync()
          this.phone = model
        } else {
          this.phone = ''
        }
      },
      init () {
        this.comment = ''
        this.location = ''
        this.phone = ''

        const { id } = this.$root.$mp.query
        this.bookid = id

        if (!id) {
          wx.navigateBack()
        }

        showLoading({
          title: '获取中...'
        })
        this._getComments(id)
        this._getBookDetail(id)
        hideLoading()
      },
      async _getComments (id) {
        const res = await getComments({
          bookid: id
        })

        if (res.code === ERR_OK) {
          this.comments = res.data.list
        }
      },
      async _getBookDetail (id) {
        if (this.book !== null) {
          this.book = null
        }

        const res = await getBookDetail({
          id
        })

        if (res.code === ERR_OK) {
          this.book = res.data
          wx.setNavigationBarTitle({
            title: this.book.title
          })
        } else {
          showModal('获取失败', '尝试重新刷新')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .detail {
    .detail-content {
      .detail-comment{
        margin-top:10px;
        font-size: 14px;
        .textarea{
          width:730rpx;
          height:200rpx;
          background:#eee;
          padding:10rpx;
        }
        .location{
          margin-top:10px;
          padding:5px 10px;
          .location-img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-left: 5px;
          }
        }
        .phone{
          margin-top:10px;
          padding:5px 10px;
        }
      }
    }
  }

</style>
