// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './mock/mockServer'
import { Button, MessageBox } from 'element-ui';
import VueLazyload from 'vue-lazyload'
import loading from './commom/imgs/loading.gif'
import './filters/index'

//注册全局组件标签
Vue.component(Button.name,Button) 
Vue.component(MessageBox.name,MessageBox) 
Vue.use(VueLazyload, { // 内部自定义一个指令lazy
  loading
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store

})
