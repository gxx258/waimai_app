import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Msite from '../pages/Msite/Msite.vue'
import Order from '../pages/Order/Order.vue'
import Profile from '../pages/Profile/Profile.vue'
import Search from '../pages/Search/Search.vue'
import Login from '../pages/Login/Login.vue'
import Shop from '../pages/Shop/Shop.vue'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods' 
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo' 
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings' 
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'msite',
      component: Msite
    },
    {
      path: '/msite',
      component: Msite,
      meta:{
        showFooter:true
      }
    },
    {
      path: '/order',
      component: Order,
      meta:{
        showFooter:true
      }
    },
    {
      path: '/profile',
      component: Profile,
      meta:{
        showFooter:true
      }
    },
    {
      path: '/search',
      component: Search,
      meta:{
        showFooter:true
      }
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/shop',
      component: Shop,
      children:[
        {
          path: '',
          redirect:'/shop/goods'
        },
        {
          path:'/shop/goods',
          component: ShopGoods,
        },
        {
          path:'/shop/ratings',
          component: ShopRatings,
        },
        {
          path:'/shop/info',
          component: ShopInfo,
        },
      ]
    },
  ],
  
})
