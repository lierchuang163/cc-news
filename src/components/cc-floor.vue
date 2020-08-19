<template>
  <div class="cc-floor">
    <!-- 这是父评论的样式 -->
    <cc-floor
      v-if="list.parent"
      :list="list.parent"
      :index="index - 1"
    ></cc-floor>
    <div class="main">
      <div class="content">
        <span>{{ index }}楼: {{ list.user.nickname }}</span>
        <span>{{ list.create_date | timeCalc }}</span>
      </div>
      <div class="reply">回复</div>
    </div>
    <div class="footer">
      {{ list.content }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'cc-floor',
  props: {
    list: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
}
</script>

<style lang="scss" scoped>
.cc-floor {
  border-bottom: 1px solid #ccc;
  background-color: #f2f2f2;
  margin-top: 20px;
  .main {
    padding: 0 10px;
    display: flex;
    .content {
      flex: 1;
      height: 30px;
      font-size: 16px;

      span:last-child {
        font-size: 12px;
        padding-left: 10px;
        color: #707070;
      }
    }
    .reply {
      font-size: 16px;
      color: #707070;
    }
  }
  .footer {
    padding: 0 10px;
    font-size: 16px;
  }
}
</style>
