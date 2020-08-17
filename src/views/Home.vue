<template>
  <div class="home">
    <div class="header">
      <div class="index" @click="$router.push('/home')">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="search">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="user" @click="$router.push('/profile')">
        <i class="iconfont iconwode"></i>
      </div>
    </div>
    <div class="tab">
      <!-- vmodel绑定一个值,用于指定当前激活的tab栏的下标,下标0开始
      2.sticky 吸顶粘性布局
      3.animated切换动画
      4.swipeable滑动切换效果
       -->
      <van-tabs v-model="active" sticky animated swipeable>
        <van-tab :title="item.name" v-for="item in tabList" :key="item.id">
          <van-pull-refresh v-model="item.isLoading" @refresh="onRefresh">
            <van-list
              v-model="item.loading"
              :finished="item.finished"
              finished-text="没有更多了"
              @load="onLoad"
              :offset="50"
              :immediate-check="false"
            >
              <cc-post
                v-for="post in item.posts"
                :key="post.id"
                :post="post"
              ></cc-post>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: localStorage.getItem('token') ? 1 : 0,
      tabList: [],
      pageSize: 5,
    }
  },
  async created() {
    // 只有先获得tab栏中的数据,才能接着请求文章的数据
    await this.getTabList()
    this.getPostList()
  },
  methods: {
    async getTabList() {
      const res = await this.$axios.get('/category')
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 获取的data也是一个数组,直接给他添加上posts空数组,专门用于存放获取到的文章列表
        data.forEach((item) => {
          item.posts = []
          // 每个tab都有自己的pageIndex,记录着每个tab加载到了第几页
          item.pageIndex = 1
          // 下拉时没有发送请求
          item.loading = false
          // 还有数据可以请求
          item.finished = false
          // 是否可以处于下拉刷新
          item.isLoading = false
        })
        // 然后再赋值给列表
        this.tabList = data
        // console.log(this.tabList)
        // tabList下每一个tab,都应该有自己的一个posts数组,专门用于存放已经加载到的文章,列表
        // 循环遍历这个列表,给这个列表添加一个属性,但是这样添加的属性,不是数据双向绑定的
        // this.tabList.forEach((item) => {
        //   item.posts = []
        // })
        // 解决方案一,给tabList中的每一项动态添加属性,实现数据双向绑定
        // this.tabList.forEach((item) => {
        //   this.$set(item,'posts',[])
        // })
      }
    },
    // 每个分类都有分类的id,要根据id来获取数据,那么先根据索引找到分类
    async getPostList() {
      const index = this.active
      // 根据索引来拿列表中数据的id
      const id = this.tabList[index].id
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.tabList[index].pageIndex,
          pageSize: this.pageSize,
        },
      })
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tabList[index].posts = [...this.tabList[index].posts, ...data]
        // 需要将loading的状态改为false,才能进行下一次的触发底部发送请求
        this.tabList[index].loading = false
        // 判断还有没有更多的数据,如果请求回来的数据小于每页的条数,就不用了在发送请求了
        if (data.length < this.pageSize) {
          this.tabList[index].finished = true
        } else {
          this.tabList[index].finished = false
        }
      }
    },
    onLoad() {
      setTimeout(() => {
        const index = this.active
        // 让当前页的pageIndex进行++
        this.tabList[index].pageIndex++
        // 继续下一页的渲染
        this.getPostList()
        console.log('触底了')
      }, 1000)
    },
    onRefresh() {
      console.log('下拉刷新了')
      setTimeout(() => {
        const index = this.active
        // 下来刷新,要清空当前这一栏之前存的数据
        this.tabList[index].posts = []
        // 且在下拉刷新的时候,应该重置从第一页开始展示,重置pageIndex,loading.finshed
        this.tabList[index].pageIndex = 1
        this.tabList[index].loading = false
        this.tabList[index].finished = false
        // 重新获取当前页的数据
        this.getPostList()
        this.tabList[index].finished = true
        // 下拉刷新完成了,当前页的isLoading页需要改为false
        this.tabList[index].isLoading = false
        // 给用于一个提示刷新成功
        this.$toast('下拉刷新成功')
      }, 1000)
    },
  },
  // 监视active的变化变化后获取分类下的文章
  watch: {
    active() {
      const index = this.active
      // 插件在切换tab时,有时会卡在加载中,可以在切换时最好重置loading和finished
      // loading是必写的,finished可写可不写
      this.tabList[index].loading = false
      this.tabList[index].finished = false
      // 如果当前tab页中有数据将了,就没必要再一次发一次请求了
      if (this.tabList[index].posts.length > 0) return
      // 重新获取最新一栏的文章数据
      this.getPostList()
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  .header {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    background-color: #ff0000;
    .index {
      width: 70px;
      text-align: center;
      i {
        font-size: 50px;
        color: #fffcfc;
      }
    }
    .search {
      flex: 1;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-top: 10px;
      border-radius: 15px;
      background-color: #f97979;
      i {
        font-size: 16px;
        margin-right: 10px;
        color: #fee5e5;
      }
      span {
        font-size: 13px;
        color: #feffff;
      }
    }
    .user {
      width: 70px;
      text-align: center;
      i {
        font-size: 20px;
        color: #fffcfc;
      }
    }
  }
}
</style>
