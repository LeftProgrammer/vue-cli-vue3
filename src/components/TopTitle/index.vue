<template>
  <div class="topTitle">
    <div class="tip" />
    <div class="title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'TopTitle',
  props: {
    title: {
      default: '',
      type: String
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.topTitle {
  border-bottom: 2px solid #e5e6eb;
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  box-sizing: border-box;
  height: 30px;
  .tip {
    margin-right: 5px;
    width: 3px;
    height: 10px;
    background: linear-gradient(322deg, #1298fa 0%, #6fcbff 100%);
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
    color: #1d2129;
  }
}
</style>
