<template>
  <div class="set-box">
    <div>大小：</div>
    <a-slider v-model="scaleValue" :tooltip-visible="false" @change="ModelTransparentChange" :max="10" :min="0.1"
      :step="0.1" />
    <div class="sign-box">{{ scaleValue }}</div>
  </div>
</template>

<script>
export default {
  props: {
    projectMessage: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      scaleValue: 1,
      modelList: [],
      lastScaleValue: 1
    }
  },
  mounted() {
    const that = this;
    for (let i = 0; i < that.projectMessage.modelList.length; i++) {
      that.modelList.push(that.projectMessage.modelList[i].id)
    }
  },
  methods: {
    ModelTransparentChange(value) {
      const that = this;
      for (let i = 0; i < that.modelList.length; i++) {
        api.Model.scale(that.modelList[i], value / that.lastScaleValue);
      }
      that.lastScaleValue = value;
    }
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>

<style lang="scss" scoped>
.set-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 50px;
  margin: 0 8px;

  .sign-box {
    width: 13%;
    text-align: right;
  }

  /deep/.ant-slider {
    width: 60%;
    margin: 0;
  }
}
</style>