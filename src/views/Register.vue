<template>
  <div class="register">
    <div class="close">
      <i class="iconfont iconicon-test"></i>
    </div>
    <div class="logo">
      <i class="iconfont iconnew"></i>
    </div>
    <div class="username">
      <CcInput
        placeholder="用户名/手机号码"
        v-model="username"
        :rules="userRules"
        err-msg="手机号格式1开头,5至11为数字"
      ></CcInput>
    </div>
    <div class="nickname">
      <CcInput
        placeholder="昵称"
        v-model="nickname"
        :rules="nickRules"
        err-msg="昵称为最少两个汉字字符"
      ></CcInput>
    </div>
    <div class="password">
      <CcInput
        placeholder="密码"
        type="text"
        v-model="password"
        :rules="passRules"
        err-msg="密码为3至12字符数字"
      ></CcInput>
    </div>
    <div class="register-btn">
      <CcButton @click="handleFn">注册</CcButton>
    </div>
    <div class="back">
      已有账号,去 <router-link to="/login">登录</router-link>
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
  data() {
    return {
      username: '',
      password: '',
      nickname: '',
      nickRules: /^[\u4e00-\u9fa5]{2,6}$/,
      userRules: /^1\d{4,10}$/,
      passRules: /^\w{3,11}$/,
    }
  },
  methods: {
    async handleFn() {
      //判断输入框的内容是否符合当前的正则
      if (!this.userRules.test(this.username)) {
        this.$toast('请输入正确的用户名')
        return
      }
      if (!this.passRules.test(this.password)) {
        this.$toast('请输入正确的密码')
        return
      }
      if (!this.nickRules.test(this.nickname)) {
        this.$toast('请输入正确的昵称')
        return
      }
      const res = await this.$axios.post('/register', {
        username: this.username,
        password: this.password,
        nickname: this.nickname,
      })
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.$router.push({
          name: 'login',
          params: {
            username: this.username,
            password: this.password,
          },
        })
      } else {
        this.$toast.fail(message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.register {
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
  .back {
    width: 100%;
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    text-align: center;
    a {
      color: blue;
    }
  }
}
</style>
