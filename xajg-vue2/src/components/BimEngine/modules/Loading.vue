<template>
  <div class="load-box" v-show="show">
    <div class="content">
      <img src="../../../assets/loading.gif" />
      数字孪生3D轻量化技术专家<b>&nbsp;葛兰岱尔&nbsp;&nbsp;</b>正在为您打开模型！
    </div>
  </div>
</template>

<script >
export default {
  name: 'BimLoading',
  props: {
    show: { type: Boolean, default: false },
  },
}
</script>
<style lang="scss" scoped>
.load-box {
  top: 40%;
  width: 100%;
  position: absolute;
  z-index: 2;
  .content {
    text-align: center;
    width: 560px;
    color: #fff;
    margin: 0 auto;
    background-color: rgba(1, 1, 1, 0.5);
    height: 50px;
    line-height: 50px;
    border-radius: 3px;
    font-size: 16px;
    b{
        font-style: italic;
    }
    img {
      height: 40px;
      margin-right: 10px;
    }
  }
}
</style>