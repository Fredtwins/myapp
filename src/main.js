import Vue from 'vue'
import App from './App'

import store from 'src/store'
import 'common/scss/index'

Vue.config.productionTip = false
Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()

export default {
  config: {
    pages: [
      '^pages/books/main',
      'pages/detail/main'
    ],
    tabBar: {
      selectedColor: '#ea5149',
      list: [
        {
          pagePath: 'pages/books/main',
          text: '图书',
          iconPath: 'static/img/book.png',
          selectedIconPath: 'static/img/book-active.png'
        },
        {
          pagePath: 'pages/comments/main',
          text: '评论',
          iconPath: 'static/img/todo.png',
          selectedIconPath: 'static/img/todo-active.png'
        },
        {
          pagePath: 'pages/me/main',
          text: '我的',
          iconPath: 'static/img/me.png',
          selectedIconPath: 'static/img/me-active.png'
        }
      ]
    },
    window: {
      navigationBarBackgroundColor: '#ea5149',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '图书馆',
      backgroundColor: '#eeeeee',
      backgroundTextStyle: 'light'
    }
  }
}
