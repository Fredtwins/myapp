<template>
  <div class="comments">
    <div class="comments-list" v-if="openid">
      <div class="page-title" v-if="!comments.length">我的图书</div>
      <CommentList
        v-if="comments.length"
        type="user"
        :comments="comments"></CommentList>
      <div v-if="!comments.length" class="no-comment">暂无评论过书籍</div>
    </div>
    <div class="comments-books" v-if="openid">
      <div class="page-title">我的图书</div>
      <Card
        v-if="books.length"
        v-for="book in books"
        :key="book.id"
        :book="book"></Card>
      <div v-if="!books.length" class="no-book">暂无添加过书籍</div>
    </div>
    <div class="no-login" v-if="!openid">请先登陆</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Card from 'base/card/card'
  import CommentList from 'base/comment-list/comment-list'
  import { ERR_OK } from 'api/config'
  import { getBooksList } from 'api/books'
  import { getComments } from 'api/detail'
  import { showLoading, hideLoading, showNavLoading, hideNavLoading } from 'common/js/dom'
  export default {
    components: {
      Card,
      CommentList
    },
    computed: {
      ...mapGetters([
        'openid'
      ])
    },
    data () {
      return {
        comments: [],
        books: []
      }
    },
    onShow () {
      this.init(true)
    },
    onPullDownRefresh () {
      this.init()
      wx.stopPullDownRefresh()
    },
    methods: {
      init (isInit) {
        if (!this.openid) {
          return
        }
        if (isInit) {
          showLoading({
            title: '获取中'
          })
        } else {
          showNavLoading()
        }

        this._getComments()
        this._getBooksList()
        if (isInit) {
          hideLoading()
        } else {
          hideNavLoading()
        }
      },
      async _getComments () {
        const res = await getComments({
          openid: this.openid
        })

        if (res.code === ERR_OK) {
          this.comments = res.data.list
        }
      },
      async _getBooksList () {
        const res = await getBooksList({
          openid: this.openid
        })

        if (res.code === ERR_OK) {
          this.books = res.data.list
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .comments {
    .no-comment, .no-book, .no-login {
      text-align: center;
      font-size: 14px;
      padding: 20px 0;
    }
  }
</style>

