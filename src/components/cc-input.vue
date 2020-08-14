<template>
  <div class="cc-input">
    <input
      @input="hanldeValue"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      :class="{ success: status === 'success', error: status === 'error' }"
    />
    <span class="tips" v-show="isShowTips">{{ errMsg }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: '',
      // isShowTips: '',
    }
  },
  computed: {
    isShowTips() {
      //保证状态处于错误的提示并且有错误提示的内容
      return this.status === 'error' && this.errMsg
    },
  },
  props: {
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: String,
      default: '',
    },
    rules: {
      type: RegExp,
    },
    errMsg: {
      type: String,
      default: '',
    },
  },

  methods: {
    hanldeValue(e) {
      const value = e.target.value
      this.$emit('input', value)
      // console.log(e.target.value)
      //如果没有校验规则,就不需要往下进行了
      if (!this.rules) return
      //每次用户输入,打印一下规则和错误提示
      if (this.rules.test(value)) {
        this.status = 'success'
      } else {
        this.status = 'error'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.cc-input {
  position: relative;
  padding-bottom: 20px;
  input {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #757575;
    background-color: transparent;
    font-size: 18px;
    &.success {
      border-bottom: 1px solid green;
    }
    &.error {
      border-bottom: 1px solid red;
    }
  }
  .tips {
    position: absolute;
    left: 0;
    bottom: 0;
    color: red;
  }
}
</style>
