<template>
  <div class="post-detail" v-if="!loading">
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

    <!-- 这是评论区 -->
    <div class="comment">
      <h3>精彩跟帖</h3>
      <p v-if="commentList.length === 0">暂无跟帖,抢占沙发</p>
      <cc-comment
        @reply="reply"
        v-else
        v-for="item in commentList"
        :key="item.id"
        :list="item"
      ></cc-comment>
      <div class="empty"></div>
    </div>

    <!-- 这是底部 -->
    <div class="footer">
      <div class="input" v-if="isShowBox">
        <input @focus="handleFocus" type="text" placeholder="写跟帖" />
        <div class="comments">
          <i class="iconfont iconpinglun-"></i>
          <span class="num">{{ commentList.length }}</span>
        </div>
        <i
          @click="love"
          class="iconfont iconshoucang"
          :class="{ like: post.has_star }"
        ></i>
        <i class="iconfont iconfenxiang"></i>
      </div>
      <div class="textarea" v-else>
        <textarea
          :placeholder="placeholder"
          v-model="content"
          @blur="loseBlur"
          v-focus
          rows="3"
        >
        </textarea>
        <button @click="send">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import CcComment from 'components/cc-comment.vue'
export default {
  components: {
    CcComment,
  },
  data() {
    return {
      post: {},
      loading: true,
      isShowBox: true,
      commentList: [],
      content: '',
      parent_id: '',
      placeholder: '回复:',
    }
  },
  async created() {
    await this.getPostDetail()
    this.getCommentList()
  },
  methods: {
    async getPostDetail() {
      // id要从动态路由中获取
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post/${id}`)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        this.loading = false
        // console.log(this.post)
      }
    },
    async getCommentList() {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
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
        await this.getPostDetail()
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
        await this.getPostDetail()
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
        await this.getPostDetail()
      }
    },
    async love() {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_star/${id}`)
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        await this.getPostDetail()
        this.$toast.success(message)
      }
    },
    handleFocus() {
      this.isShowBox = false
      // vue是异步更新的,想要拿到更新后的数据,可以通过$nextTick来获取更新后的数据
      // this.$nextTick(() => {
      //   this.$refs.txt.focus()
      // })
    },
    loseBlur() {
      if (this.content.trim() !== '') return
      this.isShowBox = true
      // 清空父评论id
      this.parent_id = ''
      // 修改提示为回复
      this.placeholder = '回复'
    },
    async send() {
      // 首先判断是否输入为空,让代码更加健壮
      if (this.content.trim() === '') return
      const id = this.$route.params.id
      const res = await this.$axios.post(`/post_comment/${id}`, {
        content: this.content,
        parent_id: this.parent_id,
      })
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // 清空内容
        this.content = ''
        // 清空父评论id
        this.parent_id = ''
        // 修改提示为回复
        this.placeholder = '回复'
        // 关闭文本域
        this.isShowBox = true
        // 调用获取评论列表的方法
        this.getCommentList()
      }
    },
    reply(id, nickname) {
      // 一点击回复就显示文本域,进行输入
      this.isShowBox = false
      // 将nickanme和id进行赋值
      this.parent_id = id
      this.placeholder = `回复:${nickname}`
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
  .header {
    display: flex;
    height: 50px;
    padding: 10px;
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
    padding: 10px;
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
    padding: 10px;
  }
  .star {
    padding: 15px;
    display: flex;
    justify-content: space-around;
    border-bottom: 5px solid #e4e4e4;
    margin-bottom: 10px;
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
  .comment {
    h3 {
      text-align: center;
      font-size: 20px;
      height: 50px;
      line-height: 50px;
    }
    p {
      font-size: 20px;
      text-align: center;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 0 5px;
    width: 100%;
    border-top: 1px solid #ccc;
    background-color: #f2f2f2;
    .input {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 50px;
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
          left: 10px;
          top: 0;
          color: white;
          background-color: red;
          width: 35px;
          height: 20px;
          line-height: 20px;
          border-radius: 10px;
          text-align: center;
        }
      }
      i {
        font-size: 25px;
      }
      .like {
        color: red;
      }
    }
    .textarea {
      padding: 10px 10px;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      textarea {
        width: 260px;
        height: 90px;
        margin-top: 20px;
        background-color: #d7d7d7;
        border-radius: 15px;
        padding: 10px;
        font-size: 14px;
      }
      button {
        width: 60px;
        height: 26px;
        font-size: 14px;
        background-color: red;
        border-radius: 23px;
        color: white;
      }
    }
  }
  .empty {
    height: 30px;
  }
}
</style>
