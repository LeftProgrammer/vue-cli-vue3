<template>
  <div>
    <div class="set-box">
      <div>颜色对比度：</div>
      <a-slider @change="ContrastRatioChange" :max="1" :min="-1" v-model="contrastRatio" :step="0.1"
        :tooltip-visible="false" />
      <div class="sign-box">{{ contrastRatio }}</div>
    </div>
    <div class="set-box">
      <div>颜色饱和度：</div>
      <a-slider @change="ModelSaturationChange" :max="1" :min="-1" v-model="saturationValue" :step="0.1"
        :tooltip-visible="false" />
      <div class="sign-box">{{ saturationValue }}</div>
    </div>
    <div class="set-box">
      <div>颜色曝光度：</div>
      <a-slider @change="ModelExposureChange" :max="1" :min="-1" v-model="exposureValue" :step="0.1"
        :tooltip-visible="false" />
      <div class="sign-box">{{ exposureValue }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    projectMessage: {
      type: Object,
      default: null,
    },
    store: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      modelList: [],
      contrastRatio: 0, //对比度
      saturationValue: 0,  //饱和度
      exposureValue: 0,   //曝光度
    }
  },
  mounted() {
    const that = this;
    that.contrastRatio = that.store.state.bim.modelEffect.contrastRatio   //在vuex中读取，根据自身业务需要调整
    that.saturationValue = that.store.state.bim.modelEffect.saturationValue   //在vuex中读取，根据自身业务需要调整
    that.exposureValue = that.store.state.bim.modelEffect.exposureValue   //在vuex中读取，根据自身业务需要调整
    for (let i = 0; i < that.projectMessage.modelList.length; i++) {
      that.modelList.push(that.projectMessage.modelList[i].id)
    }
  },
  methods: {
    ContrastRatioChange(value) {
      const that = this;
      that.modelList.forEach(element => {
        api.Model.setContrast(element, value)
      });
      api.viewer.scene.requestRender()
    },
    ModelSaturationChange(value) {
      const that = this;
      that.modelList.forEach(element => {
        api.Model.setSaturation(element, value)
      });
      api.viewer.scene.requestRender()
    },
    ModelExposureChange(value) {
      const that = this;
      that.modelList.forEach(element => {
        api.Model.setLuminance(element, value)
      });
      api.viewer.scene.requestRender()
    }
  },
  destroyed() {
    const that = this;
    that.store.dispatch('setModelEffect', {
      contrastRatio: that.contrastRatio, //对比度
      saturationValue: that.saturationValue,  //饱和度
      exposureValue: that.exposureValue,   //曝光度
    }) //在vuex中存储设置时间，根据自身业务需要调整
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

  >div:first-child {
    white-space: nowrap;
  }

  .sign-box {
    width: 13%;
    text-align: right;
  }

  /deep/.ant-slider {
    width: 55%;
    margin: 0;
  }
}
</style>