<template>
  <div ref="wrap">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-space>
        <a-button ghost @click="CreateScann">扫描设置</a-button>
      </a-space>
      <a-list size="small" :data-source="ScannList" :locale="{ emptyText: `暂无列表数据` }" class="viewpoint-list scroll-box">
        <a-list-item slot="renderItem" slot-scope="item,index" v-model="item.state">
          <a-space class="label-title">{{ "雷达扫描" + (index + 1) }}</a-space>
          <a-space slot="actions">
            <el-tooltip title="删除">
              <a-icon type="delete" @click="DelScann(item, index)" />
            </el-tooltip>
          </a-space>
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal title="扫描设置" :width="340" :visible="visible" :confirm-loading="confirmLoading" @ok="SaveScanning"
      @cancel="handleCancel" cancel-text="取消" ok-text="确定" :getContainer="() => this.$refs.wrap">
      <a-form :form="formFolder">
        <a-form-item label="扫描半径" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
          <a-input-number placeholder="请输入" :min="0"
            v-decorator="['range', { rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
        <a-form-item label="扫描速率" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
          <a-input-number placeholder="请输入" v-decorator="['rate', { rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
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
      visible: false,
      confirmLoading: false,
      formFolder: this.$form.createForm(this, { range: 10, rate: 0.5 }),
      creatPosition: undefined,
      ScannList: [],
      vehicleBorneRadar: undefined
    }
  },
  mounted() {
    const that = this;
    that.formFolder.resetFields(); //清空表单
    let ScannList = JSON.parse(localStorage.getItem("ScannList_" + that.projectMessage.id));
    that.ScannList = ScannList ? ScannList : [];
    that.vehicleBorneRadar = api.Plugin.initVehicleBorneRadar(); //api 引擎实例化对象
  },
  methods: {
    CreateScann() {
      const that = this;
      that.$message.info('请点击选择雷达扫描的位置！');
      api.Public.event("LEFT_CLICK", function (click) {
        api.Public.pickupCoordinate(click.position, function (data) {
          that.visible = true;
          that.creatPosition = data;
        });
      });
    },
    SaveScanning(e) {
      const that = this
      e.preventDefault()
      that.formFolder.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let opt = { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
            id: "scann_" + that.genlabID(6), // ID 唯一
            position: that.creatPosition, // 弧度制经纬度高程
            maxR: values.range,
            deviationR: values.rate * 0.1, //差值 差值越大 速度越快
          }
          that.vehicleBorneRadar.add(Object.assign({
            offsetHeight: 0.5, // 扫描面高度微调偏移，默认0
            minR: 0, //最好为0
            angleX: 90, // 模型方向向量与正北方向的角度    
            eachInterval: 1000, //两个圈的时间间隔
            imageUrl: '/static/Cesium/Assets/Images/renda.png',
          }, opt));
          that.ScannList.push(opt)
          that.confirmLoading = false
          that.visible = false
          localStorage.setItem("ScannList_" + that.projectMessage.id, JSON.stringify(that.ScannList));
          api.viewer.scene.requestRender();
          that.formFolder.resetFields() //清空表单
        }
      })
    },
    handleCancel() {
      const that = this
      that.visible = false;
      that.formFolder.resetFields() //清空表单
    },
    DelScann(data, index) {
      const that = this
      that.vehicleBorneRadar.remove(data.id);
      that.ScannList.splice(index, 1);
      that.$message.success('删除成功');
      localStorage.setItem("ScannList_" + that.projectMessage.id, JSON.stringify(that.ScannList));
    },
    DisplayStatusChange(event, data) {
      const that = this;
      if (api.Label.getBalloonById(data.id)) {
        api.Label.setBalloonVisible(data.id, event);
      } else {
        api.Label.addBalloon(data)
      }
      localStorage.setItem("ScannList_" + that.projectMessage.id, JSON.stringify(that.ScannList));
    },
    genlabID(length) {    //随机生成6位数
      return Number(Math.random().toString().substr(3, length));
    }
  }
}
</script>

<style lang="scss" scoped>
.thumbnail-style {
  width: 100%;
  height: 200px;
}

.viewpoint-list {
  margin-top: 15px;
  height: 48vh;
  overflow-y: auto;
}

/deep/.ant-list-item {
  padding: 8px 5px;

  .label-title {
    width: 70%;
    cursor: pointer;

    .ant-space-item {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

/deep/.ant-input-number {
  width: 100%;
}
</style>