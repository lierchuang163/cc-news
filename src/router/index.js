import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'views/Login.vue'
import Register from 'views/Register.vue'
import Profile from 'views/Profile.vue'
import editInfo from 'views/editInfo.vue'
import myFocus from 'views/Myfocus.vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/editinfo', name: 'editinfo', component: editInfo },
    { path: '/myfocus', name: 'myfocus', component: myFocus },
  ],
})

// 进行登录前置守护拦截
const AuthUrls = ['/profile', '/editinfo', '/myfocus']
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
