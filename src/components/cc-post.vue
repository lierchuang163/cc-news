<template>
  <div class="cc-post" @click="$router.push(`/post-detail/${post.id}`)">
    <!-- 视频类文章,其中type为2,说明其是视频类文章 -->
    <div class="video-post" v-if="post.type === 2">
      <div class="top txt-cut">{{ post.title }}</div>
      <div class="video">
        <img :src="post.cover[0].url" alt="" />
        <i class="iconfont iconshipin"></i>
      </div>
      <div class="bottom">
        <span>{{ post.user.nickname }}</span>
        <span>{{ post.comment_length }}跟帖</span>
      </div>
    </div>

    <!-- 单图片的文章展示 -->
    <div class="single-img-post" v-else-if="post.cover.length < 3">
      <div class="content">
        <div class="top txt-cut">{{ post.title }}</div>
        <div class="bottom">
          <span>{{ post.user.nickname }}</span>
          <span>{{ post.comment_length }}跟帖</span>
        </div>
      </div>
      <div class="img-box">
        <img :src="post.cover[0].url" alt="" />
      </div>
    </div>
    <!-- 多张图片展示的代码 -->
    <div class="multiple-imgs-post" v-else>
      <div class="top txt-cut">{{ post.title }}</div>
      <div class="imgs">
        <img :src="item.url" alt="" v-for="item in post.cover" :key="item.id" />
      </div>
      <div class="bottom">
        <span>{{ post.user.nickname }}</span>
        <span>{{ post.comment_length }}跟帖</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
    },
  },
}
</script>

<style lang="scss" scoped>
.cc-post {
  .top {
    font-size: 14px;
  }
  .bottom {
    font-size: 12px;
    color: #868686;
    span:first-child {
      margin-right: 20px;
    }
  }
  .single-img-post {
    margin-top: 5px;
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-top: 5px;
    }
    .img-box {
      width: 120px;
      height: 75px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        // Object-fit:cover / contain
        // 作用:可以保证图片在定死宽高的情况下,还不失去其宽高比(类似于background-size)
        // cover 铺满
        // contain 包含,可以完整的显示所有的图片内容,但是可能会留白
      }
    }
  }
  .multiple-imgs-post {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .imgs {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      img {
        width: 112px;
        height: 75px;
        object-fit: cover;
      }
    }
  }
  .video-post {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .video {
      position: relative;
      i {
        width: 50px;
        height: 50px;
        line-height: 50px;
        font-size: 50px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: rgba(255, 255, 255, 0.8);
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>
