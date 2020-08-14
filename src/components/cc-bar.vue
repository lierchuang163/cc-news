<template>
  <div class="cc-bar">
    <div class="left" @click="$router.go(-1)">
      <slot name="left">
        <i class="iconfont iconjiantou2"></i>
      </slot>
    </div>
    <div class="center">
      <h2>{{ title }}</h2>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '导航标题',
    },
  },
}
</script>

<style lang="scss" scoped>
.cc-bar {
  display: flex;
  height: 50px;
  line-height: 50px;
  text-align: center;
  .left,
  .right {
    width: 30px;
    height: 50px;
  }
  .center {
    flex: 1;
    h2 {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
