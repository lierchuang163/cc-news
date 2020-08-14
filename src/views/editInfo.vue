<template>
  <div class="edit-info">
    <div class="user-info">
      <cc-bar title="编辑内容"></cc-bar>
      <div class="avatar">
        <img :src="imgUrls" alt="" />
        <van-uploader :after-read="afterRead"></van-uploader>
      </div>
    </div>
    <div class="list">
      <cc-nav
        @click="showNickname"
        name="昵称"
        :desc="profile.nickname"
      ></cc-nav>
      <cc-nav @click="showPassword" name="密码" desc="******"></cc-nav>
      <cc-nav
        @click="showGender"
        name="性别"
        :desc="profile.gender === 1 ? '男' : '女'"
      ></cc-nav>
      <!-- 编辑昵称的对话框 v-model绑定了一个isShowNIckname 控制着对话框的显示和隐藏-->
      <van-dialog
        @confirm="editNickname"
        v-model="isShowNickname"
        title="编辑昵称"
        show-cancel-button
      >
        <van-field v-model="nickname" placeholder="请修改昵称" />
      </van-dialog>

      <!-- 这是修改密码的对话框 -->
      <van-dialog
        @confirm="editPassword"
        v-model="isShowPassword"
        title="编辑密码"
        show-cancel-button
      >
        <van-field
          @click-right-icon="changeCanSee"
          :type="canSeePass ? 'text' : 'password'"
          :right-icon="canSeePass ? 'closed-eye' : 'eye-o'"
          v-model="password"
          placeholder="请修改密码"
        />
      </van-dialog>

      <!-- 这是修改性别的对话框 -->
      <van-dialog
        @confirm="editGender"
        v-model="isShowGender"
        title="编辑密码"
        show-cancel-button
      >
        <van-radio-group v-model="gender" direction="horizontal">
          <van-radio :name="1">男</van-radio>
          <van-radio :name="0">女</van-radio>
        </van-radio-group>
      </van-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: {},
      nickRules: /^[\u4e00-\u9fa5]{2,6}$/,
      passRules: /^\w{3,11}$/,
      isShowNickname: false,
      nickname: '',
      isShowPassword: false,
      password: '',
      canSeePass: false,
      isShowGender: false,
      gender: '',
    }
  },
  created() {
    this.getUserinfo()
  },
  methods: {
    async getUserinfo() {
      // 先获取本地存储的token和id
      const id = localStorage.getItem('user_id')
      const res = await this.$axios.get(`/user/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.profile = data
        // console.log(this.profile)
      }
    },
    async editUserInfo(dataObj) {
      const id = this.profile.id
      const res = await this.$axios.post(`/user_update/${id}`, dataObj)
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // this.profile = data
        // 如果后台返回的数据比较全的情况下,可以直接赋值给prifile,进行渲染
        // 如果不全,就需要从新渲染
        // 将获取数据的请求封装成一个函数,直接调用即可
        this.getUserinfo()
      }
    },
    showNickname() {
      this.isShowNickname = true
      this.nickname = this.profile.nickname
    },
    editNickname() {
      // 验证一个用户输入的内容是否符合正则规范,符合就继续执行,不符合就提示用户,并中值代码的执行
      if (!this.nickRules.test(this.nickname)) {
        this.$toast('输入错误,格式为2-6位汉字符')
        return
      }
      this.editUserInfo({
        nickname: this.nickname,
      })
    },
    showPassword() {
      this.isShowPassword = true
      this.password = this.profile.password
    },
    changeCanSee() {
      this.canSeePass = !this.canSeePass
    },
    editPassword() {
      if (!this.passRules.test(this.password)) {
        this.$toast('密码格式为3-11位任意字符')
        return
      }
      this.editUserInfo({
        password: this.password,
      })
    },
    showGender() {
      this.isShowGender = true
      this.gender = this.profile.gender
    },
    editGender() {
      this.editUserInfo({
        gender: this.gender,
      })
    },
    // xhr2.0新增了formData的语法,可以用正常的传输数据,可以一步文件上传
    // 在文件选择完成之后,可以得到文件对象,需要自行上传(异步文件上传=>formData)
    async afterRead(file) {
      // console.log(file)
      // file.content base64字符串的图片,可以用于预览(裁剪的时候哦用)
      // file.file 真实的用于上传的文件对象
      const formData = new FormData()
      // 将要上传的内容append到这个formdata对象身上
      // append(name名,值) 只可以是文件对象
      formData.append('file', file.file)
      // axios也支持formData格式的数据上传,这个也只是在将图片上传到后台服务器,并没有图片直接修改掉
      const res = await this.$axios.post('/upload', formData)
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 发送axios请求来进行修改图片
        this.editUserInfo({
          head_img: data.url,
        })
      }
    },
    // 代码备份,版本控制工具
  },

  computed: {
    imgUrls() {
      return this.$axios.defaults.baseURL + this.profile.head_img
    },
  },
}
</script>

<style lang="scss" scoped>
.edit-info {
  padding: 0 20px;
  .user-info {
    .avatar {
      width: 100%;
      height: 100px;
      line-height: 100px;
      position: relative;
      img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .van-uploader {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        opacity: 0;
      }
    }
  }
  .list {
    .van-dialog {
      padding: 0 20px;
      .van-field {
        border: 1px solid #ccc;
      }
    }
    .van-radio-group {
      padding: 20px 0;
      justify-content: space-around;
    }
  }
}
</style>
