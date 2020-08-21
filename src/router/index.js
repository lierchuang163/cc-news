import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'views/Login.vue'
import Register from 'views/Register.vue'
import Profile from 'views/Profile.vue'
import editInfo from 'views/editInfo.vue'
import myFocus from 'views/Myfocus.vue'
import Favorite from 'views/Favorite.vue'
import Comments from 'views/Comments.vue'
import Home from 'views/Home.vue'
import PostDetail from 'views/PostDetail.vue'
import TabManage from 'views/TabManage.vue'
import Search from 'views/Search.vue'
import Test from 'views/Test.vue'
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch((err) => err)
}

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/editinfo', name: 'editinfo', component: editInfo },
    { path: '/myfocus', name: 'myfocus', component: myFocus },
    { path: '/favorite', name: 'favorite', component: Favorite },
    { path: '/comments', name: 'comments', component: Comments },
    { path: '/home', name: 'home', component: Home },
    { path: '/post-detail/:id', name: 'post-detail', component: PostDetail },
    { path: '/tab-manage', name: 'tab-manage', component: TabManage },
    { path: '/search', name: 'search', component: Search },
    { path: '/test', name: 'test', component: Test },
  ],
})

// 进行登录前置守护拦截
const AuthUrls = ['/profile', '/editinfo', '/myfocus', '/favorite', '/comments']
router.beforeEach((to, from, next) => {
  if (AuthUrls.includes(to.path)) {
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
export default router
