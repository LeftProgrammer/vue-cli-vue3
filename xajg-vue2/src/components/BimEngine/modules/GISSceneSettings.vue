<template>
  <div ref="wrap">
    <a-modal v-model="visible" title="GIS场景设置" @ok="SaveSetting" @cancel="CancelSetting" :width="350"
      :getContainer="() => this.$refs.wrap">
      <a-space>
        <div>Gis场景：</div>
        <a-radio-group v-model="setItem.scene">
          <a-radio value="true">开启</a-radio>
          <a-radio value="false">关闭</a-radio>
        </a-radio-group>
      </a-space>
      <a-space>
        <div>地形：</div>
        <a-radio-group v-model="setItem.terrain">
          <a-radio value="true">开启</a-radio>
          <a-radio value="false">关闭</a-radio>
        </a-radio-group>
      </a-space>
      <a-space>
        <div>加载动画：</div>
        <a-radio-group v-model="setItem.loadAnimation">
          <a-radio value="true">开启</a-radio>
          <a-radio value="false">关闭</a-radio>
        </a-radio-group>
      </a-space>
      <a-space>
        <div>坐标校正：</div>
        <a-radio-group v-model="correction" @change="CoordinateCorrectionChange">
          <a-radio value="true">开启</a-radio>
          <a-radio value="false">关闭</a-radio>
        </a-radio-group>
      </a-space>
    </a-modal>
    <a-modal v-model="coordinateCorrectionVisible" title="坐标校正" :width="350" @ok="SaveCoordinateCorrection"
      @cancel="CancelCoordinateCorrection" :getContainer="() => this.$refs.wrap" :confirm-loading="confirmLoading">
      <a-space>
        <div>Gis场景：</div>
        <a-select v-model='coordinateSystem'>
          <a-select-option value="0">WGS-84坐标系</a-select-option>
          <a-select-option value="1">GCJ-02坐标系</a-select-option>
          <a-select-option value="2">百度坐标系</a-select-option>
          <a-select-option value="3">CGCS2000</a-select-option>
        </a-select>
      </a-space>
      <a-space>
        <div>坐标类型：</div>
        <a-select v-model="coordinateType">
          <a-select-option value="1">角度</a-select-option>
          <a-select-option value="2">弧度</a-select-option>
        </a-select>
      </a-space>
      <a-space>
        <div>{{ coordinateSystem == '3' ? 'X：' : 'L(经度)：' }}</div>
        <a-input-number v-model="longitude" placeholder="请输入经度" />
      </a-space>
      <a-space>
        <div>{{ coordinateSystem == '3' ? 'Y：' : 'B(纬度)：' }}</div>
        <a-input-number v-model="latitude" placeholder="请输入纬度" />
      </a-space>
    </a-modal>
  </div>
</template>

<script>
import { uploadCoordinate } from '@/components/BimEngine/api/document'
import { gcj02towgs84, bd09_to_wgs84, GaussPrjInvCalculate } from './correcting'
export default {
  props: {
    settingVisible: {
      type: Boolean,
      required: true,
    },
    projectMessage: {
      type: Object,
      default: undefined,
    },
    InitEngine: {
      type: Function
    }
  },
  data() {
    return {
      setItem: {
        scene: 'false',
        terrain: 'false',
        loadAnimation: 'false',
      },
      correction: 'false',
      visible: this.settingVisible,
      coordinateCorrectionVisible: false,
      coordinateSystem: '0', //坐标系
      coordinateType: '2', //坐标类型
      latitude: '',
      longitude: '',
      confirmLoading: false,
    }
  },
  mounted() {
    const that = this;
    const defaults = { ...that.$store.state.bim.defaults }
    that.setItem.scene = defaults.openearth ? 'true' : 'false';
    that.setItem.terrain = defaults.openterrain ? 'true' : 'false';
    that.setItem.loadAnimation = defaults.loading ? 'true' : 'false';
  },
  methods: {
    SaveSetting() {
      const that = this;
      const defaults = { ...that.$store.state.bim.defaults }
      defaults.openearth = that.setItem.scene == 'true' ? true : false;
      defaults.openterrain = that.setItem.terrain == 'true' ? true : false;
      defaults.loading = that.setItem.loadAnimation == 'true' ? true : false;
      this.$store.dispatch('setConfigurationItem', defaults)
      this.visible = false;
      this.$emit('update:settingVisible', this.visible)
      api.Public.clearScene();
      this.$emit('InitEngine')
    },
    CoordinateCorrectionChange(e) {
      const that = this;
      that.coordinateCorrectionVisible = true;
      that.visible = false;
    },
    CancelSetting() {
      this.visible = false;
      this.$emit('update:settingVisible', this.visible)
    },
    SaveCoordinateCorrection() {
      const that = this;
      if (that.longitude == '' || that.latitude == '' || that.longitude == null || that.latitude == null) {
        that.$message.warning('校正坐标不能为空')
        return false
      }
      let LongitudeValue = that.longitude
      let LatitudeValue = that.latitude
      if (that.coordinateType == '2') {
        LongitudeValue = (180 / Math.PI) * LongitudeValue
        LatitudeValue = (180 / Math.PI) * LatitudeValue
      }
      if (that.coordinateSystem == '1') {
        var changgc1 = gcj02towgs84(LongitudeValue, LatitudeValue)
        LongitudeValue = changgc1[0]
        LatitudeValue = changgc1[1]
      } else if (that.coordinateSystem == '2') {
        var changgc2 = bd09_to_wgs84(LongitudeValue, LatitudeValue)
        LongitudeValue = changgc2[0]
        LatitudeValue = changgc2[1]
      } else if (that.coordinateSystem == '3') {
        var changgc3 = GaussPrjInvCalculate(LongitudeValue, LatitudeValue, 2)
        LongitudeValue = changgc3[0]
        LatitudeValue = changgc3[1]
      }
      LongitudeValue = (LongitudeValue * Math.PI) / 180
      LatitudeValue = (LatitudeValue * Math.PI) / 180
      that.confirmLoading = true;
      uploadCoordinate({
        LightweightName: that.projectMessage.modelName,
        lon: LongitudeValue,
        lat: LatitudeValue,
        height: 0,
      }).then((retdata) => {
        that.confirmLoading = false;
        if (retdata.code == 1) {
          that.$message.success('坐标校正成功')
          api.Model.remove(that.projectMessage.id)
          setTimeout(() => {
            that.$emit('AddModel', that.projectMessage.modelList[0])
          }, 2000)
          that.coordinateCorrectionVisible = false;
          that.correction = 'false'
          that.visible = true;
        } else {
          that.$message.warning(retdata.codeMsg)
        }
      })
    },
    CancelCoordinateCorrection() {
      const that = this;
      that.coordinateCorrectionVisible = false;
      that.correction = 'false'
      that.visible = true;
    }
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>

<style lang="scss" scoped>
.ant-space {
  width: 100%;
  color: #ffffff;
  line-height: 40px;

  >.ant-space-item:first-child {
    width: 30%;
    text-align: right;
  }

  >.ant-space-item:last-child {
    width: 60%;

    .ant-radio-group {
      width: 100%;

      .ant-radio-wrapper {
        width: 45%;
        color: #ffffff;

        /deep/.ant-radio-inner {
          background: #fff0;
        }
      }
    }
  }
}

/deep/.ant-modal-content {
  background-color: #001529cc;
  color: #fff;

  .ant-modal-header {
    background-color: transparent;

    .ant-modal-title {
      color: #ffffff;
    }
  }

  .ant-modal-close {
    color: #ffffff;
  }

  .ant-select {
    width: 100%;

    .ant-select-selection {
      background-color: transparent;
      color: #ffffff;
    }

    .ant-select-arrow {
      color: #ffffff;
    }
  }

  .ant-input-number {
    background-color: transparent;
    color: #ffffff;
    width: 100%;
  }
}
</style>