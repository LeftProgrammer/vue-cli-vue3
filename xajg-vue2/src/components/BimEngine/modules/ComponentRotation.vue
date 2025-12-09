<template>
  <a-card size="small" :bordered="false" class="card-custom-style">
    <a-row>
      <a-col :span="4">X轴</a-col>
      <a-col :span="14">
        <a-slider v-model="xSliderValue" :min="0" :max="360" @change="XSliderOffect" />
      </a-col>
      <a-col :span="6" class="input-offect">
        <a-input-number v-model="xSliderValue" :min="0" :max="360" @blur="XSliderOffect" />
        <span>度</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="4"> Y轴</a-col>
      <a-col :span="14">
        <a-slider v-model="ySliderValue" :min="0" :max="360" @change="YSliderOffect" />
      </a-col>
      <a-col :span="6" class="input-offect">
        <a-input-number v-model="ySliderValue" :min="0" :max="360" @blur="YSliderOffect" />
        <span>度</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="4">Z轴</a-col>
      <a-col :span="14">
        <a-slider v-model="zSliderValue" :min="0" :max="360" @change="ZSliderOffect" />
      </a-col>
      <a-col :span="6" class="input-offect">
        <a-input-number v-model="zSliderValue" :min="0" :max="360" @blur="ZSliderOffect" />
        <span>度</span>
      </a-col>
    </a-row>
  </a-card>
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
      xSliderValue: 0,
      ySliderValue: 0,
      zSliderValue: 0,
      featureList: [],
      featureId: undefined
    }
  },
  mounted() {
    const that = this;
    that.featureList = that.store.state.bim.featureRotateList
    that.$message.info('请点击要偏移的构件！');
    api.Public.event("LEFT_CLICK", function (click) {
      api.Feature.getByEvent(click.position, function (json) {
        if (json != undefined) {
          that.visible = true;
          that.featureId = json.id
          let haveList = that.featureList.findIndex(item => item.id == that.featureId)
          if (haveList == -1) {
            that.featureList.push({
              id: json.id,
              x: 0,
              y: 0,
              z: 0
            })
            that.xSliderValue = 0;
            that.ySliderValue = 0;
            that.zSliderValue = 0;
          } else {
            that.xSliderValue = that.featureList[haveList].x;
            that.ySliderValue = that.featureList[haveList].y;
            that.zSliderValue = that.featureList[haveList].z;
          }
        } else {
          api.Feature.clearSelectColor();
        }
      });
    });
    api.Public.event("RIGHT_CLICK", function (click) {
      for (let i = 0; i < that.featureList.length; i++) {
        api.Feature.clearRotate(that.featureList[i].id);
      }
      that.featureList = [];
      that.xSliderValue = 0;
      that.ySliderValue = 0;
      that.zSliderValue = 0;
      api.Feature.clearSelectColor();
      that.featureId = undefined;
    });
    that.$notification.open({
      key: 'TipsKey',
      message: `提示`,
      description: '右键恢复模型',
      class: 'engine-notification tip-notification',
      duration: null,
      placement: 'bottomRight',
      showClose: false,
      style: {
        width: '105px',
        marginRight: `20px`,
      },
    })
  },
  methods: {
    XSliderOffect() {
      const that = this;
      if (that.featureId == undefined) {
        return false;
      }
      let index = that.featureList.findIndex(item => item.id == that.featureId)
      api.Feature.rotate(that.featureId, 1, 0, 0, that.xSliderValue - that.featureList[index].x);
      that.featureList[index].x = that.xSliderValue;
    },
    YSliderOffect() {
      const that = this;
      if (that.featureId == undefined) {
        return false;
      }
      let index = that.featureList.findIndex(item => item.id == that.featureId)
      api.Feature.rotate(that.featureId, 0, 1, 0, that.ySliderValue - that.featureList[index].y);
      that.featureList[index].y = that.ySliderValue;
    },
    ZSliderOffect() {
      const that = this;
      if (that.featureId == undefined) {
        return false;
      }
      let index = that.featureList.findIndex(item => item.id == that.featureId)
      api.Feature.rotate(that.featureId, 0, 0, 1, that.zSliderValue - that.featureList[index].z);
      that.featureList[index].z = that.zSliderValue;
    },
  },
  destroyed() {
    const that = this;
    that.$notification.close('TipsKey');
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
    that.store.dispatch('setFeatureRotateList', that.featureList) //在vuex中存储，根据自身业务需要调整
  }

}
</script>

<style lang="scss" scoped>
.name-style {
  white-space: nowrap;
}

/deep/.ant-input-number {
  width: 60px;

  .ant-input-number-handler-wrap {
    display: none;
  }

  .ant-input-number-input {
    padding: 0;
    text-align: center;
  }
}

.input-offect {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/deep/.ant-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;

  .ant-input-number {
    width: 34px;
  }
}
</style>