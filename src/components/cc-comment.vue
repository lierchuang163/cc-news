<template>
  <div class="cc-comment">
    <div class="content">
      <div class="avatar">
        <img :src="list.user.head_img | fixUrl" alt="" />
      </div>
      <div class="info">
        <span>{{ list.user.nickname }}</span>
        <span>{{ list.create_date | timeCalc }}</span>
      </div>
      <i class="iconfont iconjiantou2" @click="showReply"></i>
      <div class="reply" @click="reply(list.id, list.user.nickname)">回复</div>
    </div>

    <!-- 这是递归组件 -->
    <div v-show="isShowReply">
      <cc-floor
        :index="index"
        v-if="list.parent"
        :list="list.parent"
      ></cc-floor>
    </div>

    <div class="comment">
      {{ list.content }}
    </div>
  </div>
</template>

<script>
import CcFloor from 'components/cc-floor.vue'
export default {
  data() {
    return {
      index: '',
      isShowReply: false,
    }
  },
  components: {
    CcFloor,
  },
  created() {
    // 让list.parent等于一个obj对象
    // 判断每一层list.parent是否为空
    let obj = this.list.parent
    let count = 0
    while (obj) {
      count++
      obj = obj.parent
    }
    this.index = count
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  methods: {
    reply(id, nickname) {
      this.$emit('reply', id, nickname)
    },
    showReply() {
      this.isShowReply = !this.isShowReply
    },
  },
}
</script>

<style lang="scss" scoped>
.cc-comment {
  padding: 0 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #999;
  .content {
    display: flex;
    justify-content: space-between;
    .avatar {
      width: 50px;
      height: 50px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 14px;
      padding-left: 10px;
      span:first-child {
        color: #202020;
      }
      span:last-child {
        color: #707070;
        font-size: 12px;
      }
    }
    .iconjiantou2 {
      height: 16px;
      transform: rotate(-90deg);
      position: relative;
      top: 5px;
      right: 10px;
    }
    .reply {
      font-size: 16px;
      color: #707070;
    }
  }
  .cc-floor {
    border: 1px solid #ccc;
  }
  .comment {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
  }
}
</style>
