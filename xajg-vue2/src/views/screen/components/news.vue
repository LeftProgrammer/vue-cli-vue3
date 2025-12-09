<template>
  <div class="projectInfo">
    <div class="card-header">
      <img class="header-icon" src="@/assets/screen/h-icon.png" alt="">
      项目动态
    </div>
    <img src="@/assets/screen/news.jpg" alt="">
    <div class="desc">{{ desc }}</div>
  </div>
</template>

<script>
export default {
  name: 'ProjectInfo',
  data() {
    return {
      // eslint-disable-next-line vue/no-parsing-error
      desc: ''
    }
  }
}
</script>

<style scoped lang="scss">
  .projectInfo{
    // color: #B4B4B4;
    color: #fff;
    font-weight: 500;
    .desc{
      text-indent: 2em;
      font-size: 12px;
      line-height: 18px;
      padding-left: 10px;
      word-break: break-all;
    }
    img{
      width: 427px;
      height: 176px;
    }
  }
</style>
