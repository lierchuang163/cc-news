import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入公共的默认样式
import 'styles/base.css'
//导入字体图标的样式
import 'styles/iconfont.css'
import 'lib-flexible'
// 按需引进模块
import moment from 'moment'
import {
  Toast,
  Button,
  Dialog,
  Field,
  RadioGroup,
  Radio,
  Uploader,
  List,
  Tab,
  Tabs,
  PullRefresh,
  Search,
} from 'vant'
import axios from 'axios'
import CcNav from 'components/cc-nav.vue'
import CcBar from 'components/cc-bar.vue'
import CcPost from 'components/cc-post.vue'
// 在Vue中注册一下
Vue.config.productionTip = false
Vue.use(Field)
Vue.use(Search)
Vue.use(Toast)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Uploader)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
// 这是注册全局过滤器,用于处理时间格式
Vue.filter('time', (value, str = 'YYYY-MM-DD') => {
  return moment(value).format(str)
})
// 这是注册全局过滤器,用于处理图片路径的问题,
Vue.filter('fixUrl', (value) => {
  return axios.defaults.baseURL + value
})
// 注册一个全局过滤器,用于处理时间格式
Vue.filter('timeCalc', (value) => {
  moment.locale('zh-cn')
  return moment(value).fromNow()
})
// 这是注册全局自定义指令
Vue.directive('focus', {
  inserted: (el) => {
    el.focus()
  },
})
Vue.component('cc-nav', CcNav)
Vue.component('cc-bar', CcBar)
Vue.component('cc-post', CcPost)
// axios优化1:将axios挂载到vue原型上
Vue.prototype.$axios = axios
// axios优化2:配置基础地址,只要配置了基础地址,将来axios的请求都会自动拼上这个基准路径
axios.defaults.baseURL = 'http://localhost:3000'
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 所有的请求,在真正被发送出去之前,都会先经过请求拦截器(我们就可以在请求拦截器,统一添加token,这样我们就不需要每次请求都手动带上token了,不管请求需不需要token,带还是那个并没有什么影响)
    // console.log(config)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    const { statusCode, message } = response.data
    if (statusCode === 401 && message === '用户信息验证失败') {
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      Toast('用户登录信息已过期')
      router.push('/login')
    }
    return response
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
