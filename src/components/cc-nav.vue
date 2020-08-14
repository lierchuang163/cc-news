<template>
  <div class="nav" @click="handleClick">
    <div class="left">{{ name }}</div>
    <div class="center">{{ desc }}</div>
    <div class="right">
      <i class="iconfont iconjiantou1"></i>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    },
  },
  props: {
    name: {
      type: String,
      default: '导航内容',
    },
    desc: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  height: 50px;
  line-height: 50px;
  text-align: center;
  padding: 0 20px;
  border-bottom: 1px solid #ccc;
  .left {
    font-size: 14px;
    color: #202020;
    font-weight: 500;
  }
  .center {
    flex: 1;
    color: #a1a1a1;
    text-align: right;
    padding-right: 5px;
  }
  .right {
    i {
      color: #999;
    }
  }
}
</style>
