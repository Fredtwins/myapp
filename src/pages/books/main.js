import Vue from 'vue'
import App from './books'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    enablePullDownRefresh: true
  }
}
