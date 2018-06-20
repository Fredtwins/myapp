<template>
  <div class="book-card" @click="cardClick">
    <div class="thumb" @click.stop="preview">
      <img class="img"
          mode="aspectFit"
          :src="book.image" />
    </div>
    <div class="detail">
      <div class="row text-primary">
        <div class="right">
          {{book.rate}} <Rate :value='book.rate'></Rate>
        </div>
        <div class="left">
          {{book.title}}
        </div>
      </div>
      <div class="row">
        <div class="right text-primary">
          {{book.count}}
        </div>
        <div class="left">
          {{book.author}}
        </div>
      </div>
      <div class="row">
        <div class="right">
          {{book.user_info.nickName}}
        </div>
        <div class="left">
        {{book.publisher}}
        </div>
      </div>

    </div>
  </div>

</template>
<script>
  import Rate from 'base/rate/rate'
  export default {
    components: {
      Rate
    },
    props: ['book'],
    methods: {
      cardClick () {
        wx.navigateTo({
          url: `/pages/detail/main?id=${this.book.id}`
        })
      },
      preview () {
        wx.previewImage({
          current: this.book.image,
          urls: [this.book.image]
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .book-card{
    padding: 5px;
    overflow: hidden;
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 14px;
    .thumb{
      width: 90px;
      height: 90px;
      float: left;
      margin: 0 auto;
      overflow: hidden;
      .img{
        max-width: 100%;
        max-height: 100%;
      }
    }
    .detail{
      margin-left: 100px;
      .row{
        line-height: 20px;
        margin-bottom: 3px;
      }
      .right{
        float: right;

      }
      .left{
        margin-right: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>










