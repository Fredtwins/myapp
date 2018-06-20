import Vue from 'vue'
import App from './comments'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '评论列表',
    enablePullDownRefresh: true
  }
}
