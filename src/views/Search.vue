<template>
  <div class="search">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="back">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="search-box">
        <van-search v-model="keyword" placeholder="请输入搜索关键词" />
      </div>
      <div class="right" @click="search">搜索</div>
    </div>

    <div class="content" v-if="searchList.length === 0">
      <div class="history">
        <h3>历史记录</h3>
        <ul>
          <li @click="hotSearch(item)" v-for="item in historyList" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div class="hot-search">
        <h3>热门搜索</h3>
        <ul>
          <li @click="hotSearch(item)" v-for="item in hotKeys" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 搜索到的文章 -->
    <div class="search-list" v-if="searchList.length > 0">
      <cc-post v-for="item in searchList" :key="item.id" :post="item"></cc-post>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      searchList: [],
      hotKeys: ['说好不哭', '王祖贤', '性感女歌手'],
      historyList: [],
    }
  },
  created() {
    const historyList = JSON.parse(localStorage.getItem('historyList'))
    if (historyList) {
      this.historyList = historyList
    }
  },
  methods: {
    async search() {
      // 首先判断用户输入的是都为空
      if (this.keyword.trim() === '') return
      const res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword,
        },
      })
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 数据请求成功之后,再去判断返回的数据长度是否为0
        if (data.length === 0) {
          this.$toast('暂无搜索结果,请换一个关键词')
        }
        this.searchList = data

        // 如果搜索过的关键词删除掉
        this.historyList = this.historyList.filter(
          (item) => item !== this.keyword
        )
        // 将搜索结果存到历史数组中
        this.historyList.unshift(this.keyword)
        // 并将数组存到本地
        localStorage.setItem('historyList', JSON.stringify(this.historyList))
      }
    },
    hotSearch(item) {
      this.keyword = item
      this.search()
    },
    back() {
      if (this.searchList.length > 0) {
        // 1. 如果有列表内容, 清空列表内容, 清空输入框, 展示搜索历史
        this.postList = []
        this.keyword = ''
      } else {
        // 2. 如果没有列表内容, 返回上一页
        this.$router.go(-1)
      }
    },
  },
  watch: {
    keyword() {
      if (this.keyword.trim() === '') {
        this.searchList = []
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  line-height: 50px;
  display: flex;
  border-bottom: 1px solid #ccc;
  .left {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .search-box {
    flex: 1;
    .van-search {
      background-color: transparent;
      padding: 0;
      margin-top: 7px;
      border: 1px solid #ccc;
      border-radius: 18px;
      // 将溢出盒子的底色隐藏掉, 不然会盖住边框
      overflow: hidden;
    }
  }
  .right {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
  }
}
.history,
.hot-search {
  padding: 10px;
  h3 {
    font-size: 16px;
    font-weight: 700;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      padding: 5px 10px;
      font-size: 14px;
    }
  }
}
</style>
