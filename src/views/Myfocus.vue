<template>
  <div class="my-focus">
    <cc-bar title="我的关注"></cc-bar>
    <div class="details" v-for="item in list" :key="item.id">
      <div class="avatar">
        <img :src="item.head_img | fixUrl" alt="" />
      </div>
      <div class="content">
        <p>{{ item.nickname }}</p>
        <p>{{ item.create_date | time('YYYY-MM-DD HH:mm') }}</p>
      </div>
      <div class="focus" @click="unFocus(item.id)">
        <span>取消关注</span>
      </div>
    </div>
    <p class="nomore" v-if="list.length === 0">亲,暂时无数据哟</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    }
  },
  created() {
    this.getFocus()
  },
  methods: {
    async getFocus() {
      const res = await this.$axios.get('user_follows')
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
      }
    },
    async unFocus(id) {
      await this.$dialog.confirm({
        title: '温馨提示',
        message: '亲,您真的要离开我了吗',
      })
      try {
        const res = await this.$axios.get(`/user_unfollow/${id}`)
        console.log(res)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          this.getFocus()
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.my-focus {
  .details {
    width: 100%;
    height: 100px;
    margin-top: 20px;
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #ccc;
    .avatar {
      width: 70px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .content {
      flex: 1;
      p {
        line-height: 25px;
      }
      p:first-child {
        font-size: 16px;
      }
      p:last-child {
        font-size: 14px;
        color: #707070;
      }
    }
    .focus {
      width: 80px;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      text-align: center;
      background-color: #e1e1e1;
      border-radius: 15px;
    }
  }
  .nomore {
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
