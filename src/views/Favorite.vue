<template>
  <div class="favorite">
    <cc-bar title="我的收藏"></cc-bar>
    <cc-post v-for="post in list" :key="post.id" :post="post"></cc-post>
    <!-- <div class="item" v-for="item in list" :key="item.id">
      <div class="content">
        <div class="top txt-cut">{{ item.title }}</div>
        <div class="bottom">
          <span>{{ item.user.nickname }}</span>
          <span>{{ item.comments.length }}跟帖</span>
        </div>
      </div>
      <div class="img-box">
        <img :src="item.cover[0].url" alt="" />
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    }
  },
  async created() {
    const res = await this.$axios.get('/user_star')
    console.log(res)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      data.forEach((item) => {
        item.comment_length = item.comments.length
      })
      this.list = data
    }
  },
}
</script>

<style lang="scss" scoped>
// .favorite {
//   .item {
//     margin-top: 5px;
//     display: flex;
//     padding: 10px;
//     border-bottom: 1px solid #ccc;
//     .content {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       justify-content: space-between;
//       padding-top: 5px;
//       .top {
//         font-size: 16px;
//       }
//       .bottom {
//         font-size: 12px;
//         color: #868686;
//         span:first-child {
//           margin-right: 20px;
//         }
//       }
//     }
//     .img-box {
//       width: 120px;
//       height: 75px;
//       img {
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//       }
//     }
//   }
// }
</style>
