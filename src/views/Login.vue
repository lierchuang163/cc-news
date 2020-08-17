<template>
  <div class="login">
    <div class="close">
      <i class="iconfont iconicon-test"></i>
    </div>
    <div class="logo">
      <i class="iconfont iconnew"></i>
    </div>
    <div class="username">
      <cc-input
        placeholder="用户名/手机号码"
        type="text"
        :value="username"
        @input="handleUsername"
        :rules="userRules"
        err-msg="手机号格式错误"
      ></cc-input>
    </div>
    <div class="password">
      <cc-input
        placeholder="密码"
        type="password"
        :value="password"
        @input="handlePassword"
        :rules="passRules"
        err-msg="密码格式错误"
      ></cc-input>
    </div>
    <div class="cc-btn">
      <CcButton @click="clickFn">登录</CcButton>
    </div>
    <div class="to-register">
      没有账号,立即<router-link to="/register">注册</router-link>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import CcInput from 'components/cc-input'
import CcButton from 'components/cc-button'
export default {
  components: {
    CcInput,
    CcButton,
  },
  created() {
    const { username, password } = this.$route.params
    this.username = username
    this.password = password
  },
  data() {
    return {
      username: '',
      password: '',
      userRules: /^1\d{4,10}$/,
      passRules: /^\w{3,11}$/,
    }
  },
  methods: {
    handleUsername(value) {
      this.username = value
      // console.log(this.username)
    },
    handlePassword(value) {
      this.password = value
    },
    async clickFn() {
      // 发送之前先验证内容对不对,不对就不向下执行了
      if (!this.userRules.test(this.username)) {
        this.$toast('用户名不正确')
        return
      }
      if (!this.passRules.test(this.password)) {
        this.$toast('密码不正确')
        return
      }
      // console.log('我可以点击了')
      // 点击的时候要发送请求
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password,
      })
      const { message, statusCode, data } = res.data
      // console.log(res)
      if (statusCode === 200) {
        // 获取token和用户id,并且设置为本地存储
        // console.log(res)
        const { token, user } = data
        localStorage.setItem('token', token)
        localStorage.setItem('user_id', user.id)
        this.$toast.success(message)
        this.$router.push('/home')
        // alert(message)
      } else {
        this.$toast.fail(message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  padding: 20px;
  .close {
    i {
      font-size: 30px;
    }
  }
  .logo {
    text-align: center;
    i {
      font-size: 120px;
      color: #d81e06;
    }
  }
  .to-register {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
    a {
      color: blue;
    }
  }
}
</style>
