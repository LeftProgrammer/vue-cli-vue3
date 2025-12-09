<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-form-model ref="ruleForm" :model="form" v-bind="layout">
        <a-form-model-item label="构件选择">
          <a-button ghost @click="GetFeatureList" class="submit-btn">拾取构件</a-button>
        </a-form-model-item>
        <div>
          <a-list size="small" :data-source="form.features" bordered class="viewpoint-list scroll-box"
            :locale="{ emptyText: `暂无数据，至少选择一个构件！` }">
            <a-list-item slot="renderItem" slot-scope="item,index">
              {{ item.split("^")[1] }}
              <a-space slot="actions" v-show="startSlice">
                <el-tooltip title="删除">
                  <a-icon type="delete" :style="{ fontSize: '16px', color: '#05a081' }" @click="DelFeature(index)" />
                </el-tooltip>
              </a-space>
            </a-list-item>
          </a-list>
        </div>
        <a-form-model-item :wrapper-col="{ span: 24 }">
          <a-space class="options-btn">
            <a-button ghost @click="StartComponentSectioning">开始剖切</a-button>
            <a-button ghost @click="EndComponentSectioning">结束剖切</a-button>
          </a-space>
        </a-form-model-item>
      </a-form-model>
      <div class="set-box">
        <div>X轴：</div>
        <a-slider range v-model="sliceX" :tooltip-visible="false" @change="FeatureSliceXChange" :max="1" :min="-1"
          :step="0.1" />
      </div>
      <div class="set-box">
        <div>Y轴：</div>
        <a-slider range v-model="sliceY" :tooltip-visible="false" @change="FeatureSliceYChange" :max="1" :min="-1"
          :step="0.1" />
      </div>
      <div class="set-box">
        <div>Z轴：</div>
        <a-slider range v-model="sliceZ" :tooltip-visible="false" @change="FeatureSliceZChange" :max="1" :min="-1"
          :step="0.1" />
      </div>
    </a-card>
  </div>
</template>

<script>




export default {
  name: 'Camera',
  props: {
    projectMessage: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      tab: 1,
      historys: [],
      form: {
        features: []
      },
      layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
      sliceX: [-1, 1],
      sliceXHistory: [-1, 1],
      sliceY: [-1, 1],
      sliceYHistory: [-1, 1],
      sliceZ: [-1, 1],
      sliceZHistory: [-1, 1],
      startSlice: true,
    }
  },
  async mounted() {
  },
  methods: {
    GetFeatureList() {
      const that = this;
      that.$message.info('点击拾取需要剖切的构件');
      that.EndComponentSectioning()
      that.startSlice = true;
      api.Public.event("LEFT_CLICK", function (click) {
        api.Feature.getByEvent(click.position, function (json) {
          if (json != undefined) {
            that.form.features.push(json.id)
          }
        });
      });
    },
    StartComponentSectioning(e) {
      //开始剖切
      e.preventDefault()
      const that = this
      if (that.form.features.length == 0) {
        that.$message.warning('请先选择需要剖切的构件！');
        return false;
      }
      that.startSlice = false
      var mulActorIds = that.form.features.join("#");
      api.Feature.clipFeatures(mulActorIds);
      api.Feature.clearSelectColor();
      api.Public.clearHandler();
    },
    EndComponentSectioning() {
      //结束剖切
      const that = this;
      if (that.form.features.length > 0) {
        var mulActorIds = that.form.features.join("#");;
        api.Feature.cancelClipFeatures(mulActorIds);
        that.form.features = [];
      }
      that.sliceX = [-1, 1];
      that.sliceXHistory = [-1, 1];
      that.sliceY = [-1, 1];
      that.sliceYHistory = [-1, 1];
      that.sliceZ = [-1, 1];
      that.sliceZHistory = [-1, 1];
      api.Feature.clearSelectColor();
      api.Public.clearHandler();
    },
    FeatureSliceXChange(value) {
      const that = this;
      if (that.sliceXHistory[0] != value[0]) {
        api.Feature.setClipDistance('X-MIN', value[0]);
      } else if (that.sliceXHistory[1] != value[1]) {
        api.Feature.setClipDistance('X-MAX', value[1]);
      }
      that.sliceXHistory = value;
    },
    FeatureSliceYChange(value) {
      const that = this;
      if (that.sliceYHistory[0] != value[0]) {
        api.Feature.setClipDistance('Y-MIN', value[0]);
      } else if (that.sliceYHistory[1] != value[1]) {
        api.Feature.setClipDistance('Y-MAX', value[1]);
      }
      that.sliceYHistory = value;
    },
    FeatureSliceZChange(value) {
      const that = this;
      if (that.sliceZHistory[0] != value[0]) {
        api.Feature.setClipDistance('Z-MIN', value[0]);
      } else if (that.sliceZHistory[1] != value[1]) {
        api.Feature.setClipDistance('Z-MAX', value[1]);
      }
      that.sliceZHistory = value;
    },
    DelFeature(index) {
      const that = this;
      that.form.features.splice(index, 1)
    }
  },
  destroyed() {
    this.EndComponentSectioning();
    api.Feature.clearSelectColor();
    api.Public.clearHandler();
  }
}
</script>

<style lang="scss" scoped>
.viewpoint-list {
  height: 18vh;
  margin: 8px 10px 15px;
  overflow-y: auto;

  /deep/.ant-list-item {
    padding: 5px;
    margin: 0 5px;
  }
}

/deep/.ant-space {
  width: 100%;
  justify-content: space-around;

  .ant-space-item {
    margin: 0;
  }
}

/deep/.ant-list-empty-text {
  padding: 5px;
  text-align: left;
}

.roam-list {
  height: 48vh;
  overflow-y: auto;
}

.set-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 30px;
  margin: 0 10px;

  /deep/.ant-slider {
    width: 77%;
    margin: 0;
  }
}
</style>
