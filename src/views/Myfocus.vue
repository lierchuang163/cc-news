<template>
  <div class="my-focus">
    <cc-bar title="我的关注"></cc-bar>
    <div class="details">
      <div class="avatar">
        <img src="~assets/001.jpg" alt="" />
      </div>
      <div class="content">
        <p>火星新闻情报</p>
        <p>2020-08-11</p>
      </div>
      <div class="focus">
        <span>取消关注</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.my-focus {
  padding: 0 20px;
  .details {
    width: 100%;
    height: 100px;
    margin-top: 20px;
    display: flex;
    padding: 25px 0;
    .avatar {
      width: 70px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .content {
      flex: 1;
      p {
        line-height: 25px;
      }
    }
    .focus {
      width: 80px;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      text-align: center;
      background-color: #e1e1e1;
      border-radius: 15px;
    }
  }
}
</style>
