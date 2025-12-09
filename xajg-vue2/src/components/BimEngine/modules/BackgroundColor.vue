<template>
  <div>
    <div class="set-box">
      <div>背景色：</div>
      <a-input type="text" v-model="configureColor" />
      <colorPicker class="color-picker" v-model="configureColor" />
    </div>
    <div class="options-btn">
      <a-button ghost @click="saveBgColor">保存背景色</a-button>
      <a-button ghost @click="recoverBgColor">恢复背景色</a-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      configureColor: '#87CEFA'
    }
  },
  mounted() {
    this.configureColor = this.store.state.bim.defaults.bgcolor;
  },
  methods: {
    saveBgColor() {
      let defaults = {
        bgcolor: Cesium.Color.fromCssColorString(this.configureColor),
      };
      api.updateConfig(defaults, api);
      this.store.dispatch('setConfigurationItem', {
        bgcolor: this.configureColor,
      })
    },
    recoverBgColor() {
      let defaults = {
        bgcolor: Cesium.Color.fromCssColorString('#87CEFA')
      };
      this.configureColor = '#87CEFA';
      api.updateConfig(defaults, api);
      this.store.dispatch('setConfigurationItem', {
        bgcolor: '#87CEFA',
      })
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
  margin: 10px 8px;

  >div {
    white-space: nowrap;
  }

  .sign-box {
    width: 13%;
    text-align: right;
  }

  /deep/.ant-slider {
    width: 60%;
    margin: 0;
  }

  .color-picker {
    border: 1px solid #fff;
    padding: 7px;
    box-sizing: border-box;
    width: 32px;
    height: 32px;
    margin-left: 5px;
    border-radius: 3px;
  }


}

.options-btn {
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
}
</style>
<style lang="scss">
.set-box {
  .m-colorPicker .box {
    position: fixed;
    right: 36px;
  }
}
</style>