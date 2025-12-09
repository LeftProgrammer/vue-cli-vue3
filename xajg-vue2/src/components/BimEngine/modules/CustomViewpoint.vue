<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-tabs v-model="tab" size="small" :animated="false">
        <a-tab-pane :key="1" tab="漫游设置">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" v-bind="layout" @submit="StartCustomViewpointRoam">
            <a-form-model-item label="移动速度(m/s)" prop="moveRate">
              <a-input-number placeholder="0.00" v-model="form.moveRate" :precision="2" :step="0.01"
                style="width:100%;" />
            </a-form-model-item>
            <a-form-model-item label="轨迹创建">
              <a-button ghost @click="AddViewpoint" class="submit-btn">添加视点</a-button>
            </a-form-model-item>
            <div>
              <a-list size="small" :data-source="form.track" bordered class="viewpoint-list scroll-box"
                :locale="{ emptyText: `暂无数据，至少添加两个视点！` }">
                <a-list-item slot="renderItem" slot-scope="item,index">
                  {{ '视点' + (++index) }}
                  <a-space slot="actions">
                    <el-tooltip title="删除">
                      <a-icon type="delete" :style="{ fontSize: '16px', color: '#05a081' }"
                        @click="DelViewPoint(index)" />
                    </el-tooltip>
                  </a-space>
                </a-list-item>
              </a-list>
            </div>
            <a-form-model-item :wrapper-col="{ span: 24 }">
              <a-space class="options-btn">
                <a-button ghost html-type="submit">开始漫游</a-button>
                <a-button ghost @click="EndViewPortRoam">结束漫游</a-button>
              </a-space>
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="漫游历史">
          <a-list size="small" :data-source="historys" :locale="{ emptyText: `暂无漫游历史` }" class="roam-list scroll-box">
            <a-list-item slot="renderItem" slot-scope="item,index">
              {{ '漫游轨迹' + (index + 1) }}
              <a-space slot="actions">
                <el-tooltip title="播放" v-if="item.play === 0">
                  <a-icon type="play-circle" :style="{ fontSize: '16px', color: '#05a081' }" @click="playIR(item)" />
                </el-tooltip>
                <el-tooltip v-else-if="item.play === 1" title="暂停">
                  <a-icon type="pause-circle" :style="{ fontSize: '16px', color: '#05a081' }"
                    @click="playIRPause(item)" />
                </el-tooltip>
                <el-tooltip v-else-if="item.play === 2" title="继续">
                  <a-icon type="play-circle" :style="{ fontSize: '16px', color: '#05a081' }"
                    @click="playIRContinue(item)" />
                </el-tooltip>
                <el-tooltip title="取消">
                  <a-icon type="stop" :style="{ fontSize: '16px', color: '#05a081' }" @click="playCancle(item)" />
                </el-tooltip>
                <el-tooltip title="删除">
                  <a-icon type="delete" :style="{ fontSize: '16px', color: '#05a081' }" @click="delCamera(item, index)" />
                </el-tooltip>
              </a-space>
            </a-list-item>
          </a-list>
        </a-tab-pane>
      </a-tabs>
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
    store: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      tab: 1,
      historys: [],
      form: {
        moveRate: 2, //视角移动速度，单位米
        track: []
      },
      rules: {
        moveRate: [{ required: true, message: '请输入移动速度' }],
      },
      layout: {
        labelCol: { span: 11 },
        wrapperCol: { span: 11 },
      },
      sharedMessage: {
        title: '漫游分享',
        shareType: 2,
      },
      sharedFatherState: false,
    }
  },
  async mounted() {
    //初始化漫游历史
    this.getRoamingList()
  },
  methods: {
    getRoamingList() {
      const that = this
      const historys = that.store.state.bim.customViewpointList
      if (historys.length > 0) historys.forEach((x) => (x.play = 0))
      this.historys = historys
    },
    StartCustomViewpointRoam(e) {
      //开始漫游
      e.preventDefault()
      const that = this
      that.$refs.ruleForm.validate((valid) => {
        if (valid) {
          that.form.track.length > 0 ? null : that.$message.open({ content: '请先添加漫游轨迹', top: `50%`, duration: 2, maxCount: 1 })
          that.historys.push(Object.assign({}, that.form, {
            play: 0
          }))
          that.store.dispatch('setCustomViewpointList', that.historys)
          api.Camera.startViewPortRoam(that.form.track, that.form.moveRate, (data) => {
            that.tab = 2
            that.form = {
              moveRate: 2,
              track: []
            };
          });
        }
      })
    },
    EndViewPortRoam() {
      //结束漫游
      api.Camera.stopViewPortRoam();
    },
    playIR(data) {
      //播放 play 0未播放 1播放 2暂停
      const that = this
      if (that.historys.findIndex((x) => x.play === 1) > -1) {
        //暂停正在播放的
        this.historys.find((x) => x.play === 1).play = 0
      }
      data.play = 1
      api.Camera.startViewPortRoam(data.track, data.moveRate, (res) => {
        data.play = 0
      });
    },
    playIRPause(data) {
      //暂停播放
      data.play = 2
      api.Camera.pauseViewPortRoam(false);
    },
    playIRContinue(data) {
      //继续播放
      data.play = 1
      if (this.historys.findIndex((x) => x.play === 1) > -1) {
        this.historys.find((x) => x.play === 1).play = 0
      }
      api.Camera.pauseViewPortRoam(true);
    },
    playCancle(data) {
      //取消播放
      if (data.play === 1) {
        data.play = 0
        api.Camera.stopViewPortRoam();
      }
    },
    delCamera(data, index) {
      //删除漫游
      const that = this
      that.$confirm({
        cancelText: '取消',
        okText: '确定',
        title: `确定要删除此次漫游吗？`,
        onOk() {
          that.historys.splice(index, 1)
          that.store.dispatch('setCustomViewpointList', that.historys)
          that.$message.success('删除成功！')
        },
      })
    },
    AddViewpoint() {
      const that = this;
      that.form.track.push(api.Camera.getViewPort());
    },
    DelViewPoint(index) {
      const that = this;
      that.form.track.splice(--index, 1)
    }
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>

<style lang="scss" scoped>
.viewpoint-list {
  height: 18vh;
  overflow-y: auto;
  margin: 8px 10px 15px;

  /deep/.ant-list-item {
    padding: 5px 10px;
    margin: 0 10px;
  }
}

/deep/.ant-space {
  width: 100%;
  justify-content: space-around;

  .ant-space-item {
    margin: 0;
  }
}

.roam-list {
  height: 48vh;
  overflow-y: auto;
}
</style>
