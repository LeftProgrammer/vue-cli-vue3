<template>
  <div ref="wrap">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-space>
        <a-button ghost @click="CreateLabel">创建标签</a-button>
      </a-space>
      <a-list size="small" :data-source="labelList" :locale="{ emptyText: `暂无标签数据` }" class="viewpoint-list scroll-box">
        <a-list-item slot="renderItem" slot-scope="item,index" v-model="item.state">
          <a-space class="label-control">
            <a-switch checked-children="显示" un-checked-children="隐藏" v-model="item.state"
              @change="DisplayStatusChange($event, item)" />
          </a-space>
          <a-space class="label-title">{{ item.text }}</a-space>
          <a-space slot="actions">
            <el-tooltip title="删除">
              <a-icon type="delete" @click="DelLabel(item, index)" />
            </el-tooltip>
          </a-space>
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal title="创建标签" :width="300" :visible="visible" :confirm-loading="confirmLoading" @ok="SaveLabel"
      @cancel="handleCancel" cancel-text="取消" ok-text="确定" :getContainer="() => this.$refs.wrap">
      <a-form :form="formFolder">
        <a-form-item label="内容" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-input placeholder="请输入" v-decorator="['title', { rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
        <a-form-item label="颜色" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" class="color-picker">
          <a-input placeholder="请输入" v-model="color" /> 
          <colorPicker v-model="color"></colorPicker>
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
      formFolder: this.$form.createForm(this, { name: 'coordinated2' }),
      creatPosition: undefined,
      labelList: [],
      color: '#ffffff'
    }
  },
  mounted() {
    const that = this;
    that.formFolder.resetFields(); //清空表单
    let labelList = JSON.parse(localStorage.getItem("LabelList_" + that.projectMessage.id));
    that.labelList = labelList ? labelList : [];
  },
  methods: {
    CreateLabel() {
      const that = this;
      that.$message.info('请点击要创建标签的位置！');
      api.Public.event("LEFT_CLICK", function (click) {
        api.Public.pickupCoordinate(click.position, function (data) {
          that.visible = true;
          that.creatPosition = data;
        });
      });
    },
    SaveLabel(e) {
      const that = this
      e.preventDefault()
      that.formFolder.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          var opt = {
            axisType: 1,
            id: "label_" + that.genlabID(6),
            position: that.creatPosition,
            text: values.title,
            state: true,
            textColor: that.color
          };
          api.Label.addBalloon(opt, (data) => {
            that.labelList.push(opt)
            that.confirmLoading = false
            that.visible = false
            that.formFolder.resetFields() //清空表单
            localStorage.setItem("LabelList_" + that.projectMessage.id, JSON.stringify(that.labelList));
          });
        }
      })
    },
    handleCancel() {
      const that = this
      that.visible = false;
      that.formFolder.resetFields() //清空表单
    }, 
    DelLabel(data, index) {
      const that = this
      api.Label.removeBalloon(data.id);
      that.labelList.splice(index, 1);
      that.$message.success('删除成功');
      localStorage.setItem("LabelList_" + that.projectMessage.id, JSON.stringify(that.labelList));
    },
    DisplayStatusChange(event, data) {
      const that = this;
      if (api.Label.getBalloonById(data.id)) {
        api.Label.setBalloonVisible(data.id, event);
      } else {
        api.Label.addBalloon(data)
      }
      localStorage.setItem("LabelList_" + that.projectMessage.id, JSON.stringify(that.labelList));
    },
    genlabID(length) {    //随机生成6位数
      return Number(Math.random().toString().substr(3, length));
    }
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
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
    width: 50%;
    cursor: pointer;

    .ant-space-item {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .label-control {
    width: 20%;
  }
}

</style>