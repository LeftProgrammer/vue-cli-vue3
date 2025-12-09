<template>
  <div ref="wrap">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-space>
        <a-button ghost @click="CreateComponentFilcker">闪烁设置</a-button>
      </a-space>
      <a-list size="small" :data-source="componentFilckerList" :locale="{ emptyText: `暂无数据` }"
        class="viewpoint-list scroll-box">
        <a-list-item slot="renderItem" slot-scope="item,index">
          <a-space class="label-title">闪烁效果 {{ index + 1 }}</a-space>
          <a-space slot="actions">
            <el-tooltip title="删除">
              <a-icon type="delete" @click="DelComponentFilcker(item, index)" />
            </el-tooltip>
          </a-space>
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal title="闪烁设置" :width="340" :visible="visible" :confirm-loading="confirmLoading" @ok="SaveComponentFilcker"
      @cancel="handleCancel" cancel-text="取消" ok-text="确定" :getContainer="() => this.$refs.wrap">
      <a-form :form="formFolder" :hideRequiredMark="true">
        <a-form-item label="闪烁时长(s)" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
          <a-select v-model="blinkingDuration">
            <a-select-option value="0">不限时长</a-select-option>
            <a-select-option value="5">5s</a-select-option>
            <a-select-option value="10">10s</a-select-option>
            <a-select-option value="30">30s</a-select-option>
            <a-select-option value="60">1min</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="间隔时长(s)" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
          <a-input placeholder="请输入间隔时长"
            v-decorator="['intervalLength', { initialValue: this.defaultVal.intervalLength, rules: [{ required: true, message: '请输入!' }] }]" />
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
      componentFilckerList: [],
      defaultVal: {
        intervalLength: 0.5,
      },
      glowColor: '#ffff00',
      currentFeature: '',
      blinkingDuration: '0',
    }
  },
  mounted() {
    const that = this;
    that.formFolder.resetFields(); //清空表单
    let componentFilckerList = JSON.parse(localStorage.getItem("componentFilckerList_" + that.projectMessage.id));
    that.componentFilckerList = componentFilckerList ? componentFilckerList : [];
  },
  methods: {
    CreateComponentFilcker() {
      const that = this;
      that.$message.info('请点击选择闪烁构件！');
      api.Public.event("LEFT_CLICK", function (click) {
        api.Feature.getByEvent(click.position, function (json) {
          if (json != undefined) {
            that.currentFeature = json.id;
            that.visible = true;
          }
        });
      });
    },
    SaveComponentFilcker(e) {
      const that = this
      e.preventDefault()
      that.formFolder.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let colors = [];
          for (let i = 0; i < 3; i++) {
            colors.push(that.fn1())
          }
          api.Feature.flicker(that.currentFeature, true, {
            colors: colors,
            timeInterval: values.intervalLength * 1000,
            totalDuration: that.blinkingDuration * 1000,   //不传或传入0，不限时长
          });
          that.componentFilckerList.push({
            feature: that.currentFeature,
            show: true,
            colors: colors,
            timeInterval: values.intervalLength,
            totalDuration: that.blinkingDuration,
          })
          that.confirmLoading = false;
          that.visible = false
          that.formFolder.resetFields() //清空表单
          localStorage.setItem("componentFilckerList_" + that.projectMessage.id, JSON.stringify(that.componentFilckerList));
          api.Feature.clearSelectColor();
        }
      })
    },
    handleCancel() {
      const that = this;
      that.visible = false;
      that.formFolder.resetFields() //清空表单
    },
    DelComponentFilcker(data, index) {
      const that = this
      api.Feature.flicker(data.feature, false)
      api.Feature.setColor(data.feature, 255, 255, 255, 1);
      that.componentFilckerList.splice(index, 1);
      that.$message.success('删除成功');
      localStorage.setItem("componentFilckerList_" + that.projectMessage.id, JSON.stringify(that.componentFilckerList));
    },
    fn1() {
      return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
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

.select-box {
  display: flex;
  align-items: center;

  /deep/.ant-form-item-children {
    display: flex;

    button {
      background: transparent;
      color: #05a081;
      margin-left: 5px;
      padding: 0 6px;
      border-color: #05a081;
    }
  }
}
</style>