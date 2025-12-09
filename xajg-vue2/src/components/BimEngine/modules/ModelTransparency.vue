<template>
  <div class="set-box">
    <div>透明度：</div>
    <a-slider v-model="sliderValue" :tooltip-visible="false" @change="ModelTransparentChange" />
    <div class="sign-box">{{ sliderValue }}%</div>
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
      sliderValue: 0,
      modelList: []
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
        api.Model.SetModelAlpha(that.modelList[i], (1 - (value / 100)).toFixed(2));
      }
    }
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