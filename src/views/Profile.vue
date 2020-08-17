<template>
  <div class="profile">
    <div class="user-info" @click="$router.push('/editinfo')">
      <div class="avatar">
        <img :src="imgUrl" alt="" />
      </div>
      <div class="info">
        <p class="name">
          <i v-if="showIcon" class="iconfont iconxingbienan"></i>
          <i v-else class="iconfont iconxingbienv"></i>
          <span>{{ profile.nickname }}</span>
        </p>
        <p class="time">{{ profile.create_date | time }}</p>
      </div>
      <div class="icon">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </div>
    <div class="list">
      <cc-nav
        @click="$router.push('/myfocus')"
        name="我的关注"
        desc="关注的用户"
      ></cc-nav>
      <cc-nav
        @click="$router.push('/comments')"
        name="我的跟帖"
        desc="跟帖/回复"
      ></cc-nav>
      <cc-nav
        @click="$router.push('/favorite')"
        name="我的收藏"
        desc="文章/视频"
      ></cc-nav>
      <cc-nav @click="$router.push('/editinfo')" name="设置"></cc-nav>
    </div>
    <div class="logout-btn">
      <van-button @click="logout" size="large" type="info" round>
        退出
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    showIcon() {
      return this.profile.gender === 1
    },
    imgUrl() {
      return this.$axios.defaults.baseURL + this.profile.head_img
    },
  },
  data() {
    return {
      profile: {},
    }
  },
  async created() {
    // 从本地拿到id和token
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('user_id')
    const res = await this.$axios.get(`/user/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    console.log(res)
    // console.log(res)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.profile = data
      // console.log(this.profile)
    }
  },
  methods: {
    // fn() {
    //   // console.log(11)
    //   this.
    // },
    // toEditInfo() {
    //   this.$router.push('/editinfo')
    // },
    async logout() {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '您真的要退出吗',
        })
        // console.log(res)
        // 清除本地token和id
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        this.$toast('退出成功')
        this.$router.push('/login')
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.profile {
  .user-info {
    padding: 20px;
    display: flex;
    border-bottom: 3px solid #ccc;
    .avatar {
      width: 70px;
      height: 70px;
      img {
        border-radius: 50%;
      }
    }
    .info {
      flex: 1;
      padding: 10px;
      line-height: 25px;
      .name {
        font-size: 16px;
        color: #666;
        .iconxingbienan {
          color: #8ac3ed;
        }
        .iconxingbienv {
          color: hotpink;
        }
      }
      .time {
        font-size: 12px;
        color: #a9a8a8;
      }
    }
    .icon {
      width: 30px;
      height: 70px;
      line-height: 70px;
      text-align: center;
      i {
        color: #999;
      }
    }
  }
  .logout-btn {
    padding: 20px;
  }
}
</style>
