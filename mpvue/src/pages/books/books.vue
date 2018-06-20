<template>
  <div class="books">

    <div class="books-swiper">
      <TopSwiper :tops="swiperList"></TopSwiper>
    </div>

    <div class="books-card">
      <Card v-for="item in books" :key="item.id" :book="item"></Card>
    </div>

    <div class="books-footer">
      <div v-if="books.length && more" class="more-loading">
        <img
          src="/static/img/loading.gif"
          class="loading">
        <div class="text">加载中...</div>
      </div>

      <div v-if="!more" class="no-more">没有更多数据了</div>
    </div>
  </div>
</template>

<script>
  import Card from 'base/card/card'
  import TopSwiper from 'base/top-swiper/top-swiper'
  import { ERR_OK } from 'api/config'
  import { getBooksList, getSwiper } from 'api/books'
  import { showLoading, hideLoading, showNavLoading, hideNavLoading, showModal } from 'common/js/dom'
  export default {
    components: {
      Card,
      TopSwiper
    },
    created () {
      this.page = 0
      this.loading = false
    },
    data () {
      return {
        swiperList: [],
        books: [],
        more: true
      }
    },
    onPullDownRefresh () {
      // 下拉刷新触发事件
      this._getSwiper()
      this._getBooksList()
    },
    onReachBottom () {
      // 上拉触底触发事件
      this._getMoreBooks()
    },
    mounted () {
      this._getSwiper()
      this._getBooksList(true)
    },
    methods: {
      async _getSwiper () {
        const res = await getSwiper()
        if (res.code === ERR_OK) {
          this.swiperList = res.data.list
        }
      },
      async _getMoreBooks () {
        if (!this.more) {
          return
        }
        this.page += 1
        const res = await getBooksList({
          page: this.page,
          pageSize: 10
        })
        if (res.code === ERR_OK) {
          const list = res.data.list
          this.books = [...this.books, ...list]
          if (list.length < 10) {
            this.more = false
          }
        } else {
          showModal({
            title: '获取失败',
            content: '尝试重新获取'
          })
        }
      },
      async _getBooksList (isInit) {
        if (this.loading) {
          return
        }
        this.page = 0
        this.more = true
        this.loading = true
        if (isInit) {
          showLoading({
            title: '获取中...'
          })
        } else {
          showNavLoading()
        }
        const res = await getBooksList({
          page: 0,
          pageSize: 10
        })
        this.loading = false
        if (isInit) {
          hideLoading()
        } else {
          hideNavLoading()
        }

        wx.stopPullDownRefresh()
        if (res.code === ERR_OK) {
          const list = res.data.list
          this.books = list
          if (list.length < 10) {
            this.more = false
          }
        } else {
          showModal({
            title: '获取失败',
            content: '尝试重新获取'
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .books {
    .books-footer {
      padding: 10px;
      text-align: center;
      font-size: 12px;
      .more-loading {
        > .loading {
          width: 22px;
          height:22px;
          vertical-align: middle;
          margin-right: 5px;
        }
        > .text {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
</style>

