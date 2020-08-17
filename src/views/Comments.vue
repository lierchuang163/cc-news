<template>
  <div class="comments">
    <cc-bar title="我的跟帖"></cc-bar>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
      :offset="50"
    >
      <div class="item" v-for="item in list" :key="item.id">
        <div class="time">
          {{ item.create_date | time('YYYY-MM-DD HH:mm') }}
        </div>
        <div class="origin" v-if="item.parent">
          <p>回复: {{ item.parent.user.nickname }}</p>
          <p>{{ item.parent.content }}</p>
        </div>
        <div class="reply">
          {{ item.content }}
        </div>
        <div class="title">
          <p class="one-txt-cut">原文：{{ item.post.title }}</p>
          <i class="iconfont iconjiantou1"></i>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  created() {
    this.getComments()
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 5,
    }
  },
  methods: {
    async getComments() {
      const res = await this.$axios.get('user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      })
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = [...this.list, ...data]
        this.loading = false
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad() {
      console.log('触底了')
      this.pageIndex++
      this.getComments()
    },
  },
}
</script>

<style lang="scss" scoped>
.comments {
  .item {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .time {
      margin-top: 10px;
      height: 30px;
      line-height: 30px;
      color: #9f9f9f;
      font-size: 14px;
    }
    .origin {
      color: #9e9e9e;
      margin-top: 10px;
      padding: 10px;
      background-color: #e4e4e4;
      p {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
      }
    }
    .reply {
      margin-top: 10px;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
    }
    .title {
      margin-top: 10px;
      display: flex;
      p {
        flex: 1;
        color: #898989;
      }
      i {
        width: 50px;
        text-align: right;
      }
    }
  }
}
</style>
