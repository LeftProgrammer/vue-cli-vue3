<template>
  <div class="statistics">
    <top-left />
    <top-center />
    <top-right />
    <bottom-left />
    <bottom-right />
  </div>
</template>

<script>
import TopLeft from "./components/TopLeft";
import TopCenter from "./components/TopCenter";
import TopRight from "./components/TopRight";
import BottomLeft from "./components/BottomLeft";
import BottomRight from "./components/BottomRight";
export default {
  name: "SafeStatistics",
  components: { TopLeft, TopCenter, TopRight, BottomLeft, BottomRight },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped lang="scss">
.statistics {
  height: 100%;
  background-color: #F0F4F8 !important;
  padding: 0 !important;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  > div {
    height: calc(50% - 9px);
    padding: 16px;
    border-radius: 2px;
    background-color: #fff;
    &:first-child,&:nth-child(4),&:nth-child(5) {
      width: calc(50% - 12px);
    }
    &:nth-child(2),
    &:nth-child(3) {
      width: calc(25% - 12px);
    }

  }
}
</style>
