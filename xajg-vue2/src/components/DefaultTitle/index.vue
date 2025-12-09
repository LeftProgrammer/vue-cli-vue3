<template>
  <div class="flex items-center justify-between pl-22 mb-8">
    <div class="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "标题"
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped lang="scss">
.title {
  font-family: Alibaba PuHuiTi 2, Alibaba PuHuiTi 20;
  font-weight: normal;
  font-size: 14px;
  color: #1d2129;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    display: inline-block;
    width: 8px;
    height: 8px;
    background: linear-gradient(180deg, #388ff6 0%, #014acb 100%);
    box-shadow: 1px 1px 2px 0px rgba(37, 118, 214, 0.42);
    border-radius: 1px 1px 1px 1px;
    left: -22px;
    top: 4px;
    z-index: 2;
  }
  &::after {
    top: 8px;
    z-index: 1;
    position: absolute;
    left: -19px;
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #8db6ff;
    border-radius: 1px 1px 1px 1px;
  }
}
</style>
