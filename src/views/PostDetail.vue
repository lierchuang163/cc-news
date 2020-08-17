<template>
  <div class="post-detail">
    <!-- 这是头部 -->
    <div class="header">
      <div class="left" @click="$router.go(-1)">
        <i class="iconfont iconjiantou2"></i>
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div class="btn-followed" @click="unfollow" v-if="post.has_follow">
          已关注
        </div>
        <div class="btn-follow" v-else @click="follow">关注</div>
      </div>
    </div>
    <!-- 这是详情信息 -->
    <div class="info">
      <div class="info-title">
        <div class="title">{{ post.title }}</div>
        <div class="bottom">
          <span class="author">{{ post.user.nickname }}</span>
          <span class="time">{{
            post.create_date | time('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </div>
      </div>
      <div class="video" v-if="post.type === 2">
        <video :src="post.content" controls></video>
      </div>
      <div v-else class="content" v-html="post.content"></div>
    </div>
    <!-- 这是点赞 -->
    <div class="star">
      <div class="left" @click="like">
        <i class="iconfont icondianzan" :class="{ like: post.has_like }"></i>
        <span>{{ post.like_length }}</span>
      </div>
      <div class="right">
        <i class="iconfont iconweixin"></i>
        <span>微信</span>
      </div>
    </div>

    <!-- 这是底部 -->
    <div class="footer">
      <input type="text" placeholder="写跟帖" />
      <div class="comments">
        <i class="iconfont iconpinglun-"></i>
        <span class="num">1020</span>
      </div>
      <i class="iconfont iconshoucang"></i>
      <i class="iconfont iconfenxiang"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {},
    }
  },
  created() {
    this.getPostDetail()
  },
  methods: {
    async getPostDetail() {
      // id要从动态路由中获取
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post/${id}`)
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        console.log(this.post.user.nickname)
      }
    },
    async follow() {
      // 关注的是作者
      const id = this.post.user.id
      const res = await this.$axios.get(`/user_follows/${id}`)
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getPostDetail()
      }
    },
    async unfollow() {
      // 关注的是作者
      const id = this.post.user.id
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getPostDetail()
      }
    },
    async like() {
      // 当前作者的id
      const id = this.post.id
      const res = await this.$axios.get(`/post_like/${id}`)
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getPostDetail()
      }
    },
  },
  watch: {
    $route() {
      // 监听路由的变化,如果地址发生了变化,重新获取数据
      this.getPostDetail()
    },
  },
}
</script>

<style lang="scss" scoped>
.post-detail {
  padding: 0 10px;
  .header {
    display: flex;
    height: 50px;
    line-height: 50px;
    justify-content: space-between;
    align-items: center;
    // .left {
    //   flex: 1;
    //   display: flex;
    //   align-items: center;
    //   padding-bottom: 10px;
    .left {
      i {
        vertical-align: middle;
      }
      i:last-child {
        font-size: 50px;
        padding-top: 12.5px;
      }
    }
    .right {
      .btn-followed,
      .btn-follow {
        width: 80px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 12.5px;
        font-size: 12px;
      }
      .btn-follow {
        background-color: #ff0000;
        color: #ffffff;
      }
    }
  }
  .info {
    .info-title {
      display: flex;
      flex-direction: column;
      .title {
        font-size: 19px;
        font-weight: 600;
      }
      .bottom {
        margin-top: 5px;
        .author {
          font-size: 12px;
          color: #8a8b8c;
        }
        .time {
          font-size: 12px;
          color: #8686a2;
          margin-left: 10px;
        }
      }
    }
    .content {
      margin-top: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
  video {
    width: 100%;
  }
  .star {
    padding: 15px;
    display: flex;
    justify-content: space-around;
    border-bottom: 5px solid #e4e4e4;

    .left,
    .right {
      width: 100px;
      height: 40px;
      display: flex;
      padding: 0 15px;
      line-height: 40px;
      text-align: center;
      border-radius: 20px;
      justify-content: space-around;
      border: 1px solid #a9a9a9;
    }
    .right {
      i {
        font-size: 20px;
        color: #00c800;
      }
      span {
        font-size: 16px;
      }
    }
    .left {
      i {
        font-size: 20px;
        color: #6e6e6e;
      }
      span {
        font-size: 16px;
      }
      .like {
        // background-color: red;
        color: red;
      }
    }
  }
  .footer {
    display: flex;
    padding: 0 5px;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    line-height: 80px;
    input {
      width: 200px;
      height: 40px;
      background-color: #d7d7d7;
      border-radius: 20px;
      padding-left: 20px;
      font-size: 12px;
    }
    .comments {
      margin-right: 5px;
      position: relative;
      i {
        font-size: 25px;
      }
      .num {
        position: absolute;
        left: 0;
        top: 0;
        color: white;
        background-color: red;
        width: 35px;
        height: 20px;
      }
    }
    i {
      font-size: 25px;
    }
  }
}
</style>
