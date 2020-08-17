<template>
  <div class="test">
    <vue-cropper
      ref="cropper"
      :img="option.img"
      :outputSize="option.outputSize"
      :outputType="option.outputType"
      :info="option.info"
      :canScale="option.canScale"
      :autoCrop="option.autoCrop"
      :autoCropWidth="option.autoCropWidth"
      :autoCropHeight="option.autoCropHeight"
      :fixed="option.fixed"
      :fixedNumber="option.fixedNumber"
    ></vue-cropper>
    <van-button @click="crop" class="crop" type="primary">确认裁剪</van-button>
    <van-button class="cancel" type="danger">取消选择</van-button>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import img from 'assets/001.jpg'
export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      //裁剪组件的基础配置option
      option: {
        img: img, // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
      },
    }
  },
  methods: {
    crop() {
      // 获取截图的base64 数据
      this.$refs.cropper.getCropData((data) => {
        // do something
        console.log(data)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.test {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .crop {
    position: absolute;
    left: 20px;
    bottom: 20px;
  }
  .cancel {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
