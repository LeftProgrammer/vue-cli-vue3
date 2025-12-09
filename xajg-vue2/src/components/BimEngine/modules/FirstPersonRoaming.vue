<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-tabs v-model="tab" size="small" :animated="false">
        <a-tab-pane :key="1" tab="漫游设置">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" v-bind="layout" @submit="startImmersionRoaming">
            <a-form-model-item label="移动速度(m)" prop="moveRate">
              <a-input-number placeholder="0.00" v-model="form.moveRate" :precision="2" :step="0.01" style="width:100%;"
                @change="MoveRateChange" />
            </a-form-model-item>
            <a-form-model-item label="旋转速度(°)" prop="lookFactor">
              <a-input-number placeholder="0.00" v-model="form.lookFactor" :precision="2" :step="0.01"
                style="width:100%;" @change="LookFactorChange" />
            </a-form-model-item>
            <a-form-model-item label="穿过障碍物">
              <a-switch v-model="form.canCrossWall" checked-children=" 开 " un-checked-children=" 关 " default-checked
                @change="CrossWallChnage" />
            </a-form-model-item>
            <a-form-model-item label="重力感应">
              <a-switch v-model="form.canGravity" checked-children=" 开 " un-checked-children=" 关 " default-checked
                @change="GravityChange" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 24 }">
              <a-space class="options-btn">
                <a-button ghost html-type="submit">开始漫游</a-button>
                <a-button ghost @click="endImmersionRoaming">结束漫游</a-button>
              </a-space>
            </a-form-model-item>
          </a-form-model>
          <a-list size="small" :data-source="data" bordered class="option-tip scroll-box">
            <div slot="header"> 操作指南 </div>
            <a-list-item slot="renderItem" slot-scope="item" v-if="item.type">{{ item.type }}</a-list-item>
            <a-list-item slot="renderItem" slot-scope="item" v-else>
              {{ item.option }}
              <span slot="actions">{{ item.title }}</span>
            </a-list-item>
          </a-list>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="漫游历史">
          <a-list size="small" :data-source="historys" :locale="{ emptyText: `暂无漫游历史` }" class="roam-list scroll-box">
            <a-list-item slot="renderItem" slot-scope="item,index">
              {{ item.name }}
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
                  <a-icon type="delete" :style="{ fontSize: '16px', color: '#05a081' }"
                    @click="delCamera(item, index)" />
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
import { setRoamingTrack, getRoamingTrack, deleteRoamingTrack } from '@/components/BimEngine/api/engine'
const data = [
  {
    type: '鼠标',
  },
  {
    option: '滚动滚轮',
    title: '上下调节视角',
  },
  {
    option: '按住滚轮上下移动',
    title: '上浮下沉',
  },
  {
    option: '按住滚轮左右移动',
    title: '左右平移',
  },
  {
    option: '按住鼠标左键前后移动',
    title: '变速前后移动',
  },
  {
    option: '按住鼠标左键左右移动',
    title: '调整方向',
  },
  {
    option: '按住F键',
    title: '配合滚轮上下穿透',
  },
  {
    type: '按键',
  },
  {
    option: '↑ ↓',
    title: '视角前进后退，匀速运动',
  },
  {
    option: '← →',
    title: '视角左右环视，匀速运动',
  },
  {
    option: 'F',
    title: '允许穿墙',
  },
]
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
      data,
      historys: [],
      form: {
        moveRate: 0.1, //视角移动速度，单位米
        lookFactor: 3.0, //视角旋转速度(3°)
        canCrossWall: true, //是否可穿墙，设为true，水平方向可穿墙
        canGravity: true, //是否开启重力感应，默认开启
        bRecordLocus: true, //是否记录轨迹
      },
      rules: {
        moveRate: [{ required: true, message: '请输入移动速度' }],
        lookFactor: [{ required: true, message: '请输入旋转速度' }],
      },
      layout: {
        labelCol: { span: 10 },
        wrapperCol: { span: 12 },
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
    await this.getRoamingList()
  },
  methods: {
    async getRoamingList() {
      const that = this
      const res = await getRoamingTrack({ ModelId: that.projectMessage.id })
      const historys = res.items || []
      if (historys.length > 0) historys.forEach((x) => (x.play = 0))
      this.historys = historys
    },
    startImmersionRoaming(e) {
      //开始漫游
      e.preventDefault()
      const that = this
      that.$refs.ruleForm.validate((valid) => {
        if (valid) {
          that.$message.info('请点击选择漫游起点');
          api.Camera.PickIrBirthplace(function (positions) {
            // 漫游配置
            api.Camera.SetIRConfig(
              Object.assign(that.form, {
                footerHeight: 1,
                onIRStart: function () {
                  that.$message.open({
                    content: '请使用鼠标左键进行操作',
                    top: `50%`,
                    duration: 2,
                    maxCount: 1,
                  })
                },
                onIREnd: function (result) {
                  that.$message.info('结束了漫游');
                  if (result) {
                    // that.getRoamingList();
                    setRoamingTrack({
                      name: `漫游轨迹${that.historys.length + 1}`,
                      modelId: that.projectMessage.id,
                      projectId: that.projectMessage.projectId,
                      time: 0,
                      remark: '',
                      sort: 0,
                      roamingPoints: JSON.parse(result.records),
                    }).then((res) => {
                      res.record = result.records
                      res.play = 0
                      that.historys.push(res) //play 0未播放 1播放 2暂停
                    })
                    that.tab = 2
                  }
                },
              })
            )
            // 拾取起点位置后开启漫游
            api.Camera.StartImmersionRoaming()
          })
        }
      })
    },
    endImmersionRoaming() {
      //结束漫游
      api.Camera.EndImmersionRoaming()
    },
    playIR(data) {
      //播放 play 0未播放 1播放 2暂停
      const that = this
      if (that.historys.findIndex((x) => x.play === 1) > -1) {
        //暂停正在播放的
        this.historys.find((x) => x.play === 1).play = 0
      }
      data.play = 1
      api.Camera.PlayIRCamera({
        records: data.record,
        complete: function () {
          data.play = 0
        },
      })
    },
    playIRPause(data) {
      //暂停播放
      data.play = 2
      api.Camera.PlayIRPause()
    },
    playIRContinue(data) {
      //继续播放
      data.play = 1
      if (this.historys.findIndex((x) => x.play === 1) > -1) {
        this.historys.find((x) => x.play === 1).play = 0
      }
      api.Camera.PlayIRContinue()
    },
    playCancle(data) {
      //取消播放
      if (data.play === 1) {
        data.play = 0
        api.Camera.IRPlayCancle()
      }
    },
    delCamera(data, index) {
      //删除漫游
      const that = this
      that.$confirm({
        cancelText: '取消',
        okText: '确定',
        title: `确定要删除漫游 “${data.name}” 吗？`,
        onOk() {
          that.historys.splice(index, 1)
          deleteRoamingTrack(data.id).then((res) => {
          })
          that.$message.success('删除成功！')
        },
      })
    },
    CrossWallChnage(val) {
      api.Camera.SetIRConfig({
        canCrossWall: val,
      })
    },
    GravityChange(val) {
      api.Camera.SetIRConfig({
        canGravity: val,
      })
    },
    LookFactorChange(val) {
      api.Camera.SetIRConfig({
        lookFactor: val,
      })
    },
    MoveRateChange(val) {
      api.Camera.SetIRConfig({
        moveRate: val,
      })
    },
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>

<style lang="scss" scoped>
.option-tip {
  margin-top: 12px;
  max-height: 25vh;
  overflow-y: auto;
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
