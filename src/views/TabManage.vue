<template>
  <div class="tab-manage">
    <cc-bar>栏目管理</cc-bar>

    <div class="content">
      <div class="title">点击删除以下频道</div>
      <div class="list">
        <div
          @click="del(index)"
          class="item"
          v-for="(item, index) in loveTabsList"
          :key="item.id"
        >
          {{ item.name }}
        </div>
      </div>

      <div class="title">点击添加以下频道</div>
      <div class="list">
        <div
          @click="add(index)"
          class="item"
          v-for="(item, index) in hateTabsList"
          :key="item.id"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loveTabsList: [],
      hateTabsList: [],
    }
  },
  created() {
    // 从本地拿到数据
    const loveTabsList = JSON.parse(localStorage.getItem('loveTabsList'))
    const hateTabsList = JSON.parse(localStorage.getItem('hateTabsList'))
    if (loveTabsList && loveTabsList) {
      this.loveTabsList = loveTabsList
      this.hateTabsList = hateTabsList
    } else {
      this.getTabsList()
    }
  },
  methods: {
    async getTabsList() {
      const res = await this.$axios.get('/category')
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.loveTabsList = data
      }
    },
    del(index) {
      if (index === 0 || index === 1) {
        this.$toast('尊敬的用户, 不可以删除哟')
        return
      }
      // 将要删除的那一项添加进讨厌的数组中
      this.hateTabsList.push(this.loveTabsList[index])
      // 将点击的那一项删除掉
      this.loveTabsList.splice(index, 1)
    },
    add(index) {
      // 将要删除的那一项添加进讨厌的数组中
      this.loveTabsList.push(this.hateTabsList[index])
      // 将点击的那一项删除掉
      this.hateTabsList.splice(index, 1)
    },
  },
  watch: {
    loveTabsList() {
      // 一旦数据将发生变化,将数据存到本地
      localStorage.setItem('loveTabsList', JSON.stringify(this.loveTabsList))
      localStorage.setItem('hateTabsList', JSON.stringify(this.hateTabsList))
    },
  },
}
</script>

<style lang="scss" scoped>
.tab-manage {
  .content {
    padding: 10px;
    .title {
      color: #888;
      padding: 10px 0;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ccc;
        background-color: #ddd;
        margin-right: 8px;
        margin-bottom: 6px;
        font-size: 14px;
      }
    }
  }
}
</style>
