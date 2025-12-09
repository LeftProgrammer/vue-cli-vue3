<template>
  <div ref="wrap">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-space>
        <a-button ghost @click="CreateSelfLuminous">新建自发光</a-button>
      </a-space>
      <a-list size="small" :data-source="selfLuminousList" :locale="{ emptyText: `暂无数据` }"
        class="viewpoint-list scroll-box">
        <a-list-item slot="renderItem" slot-scope="item,index">
          <a-space class="label-control">
            <a-switch checked-children="显示" un-checked-children="隐藏" v-model="item.isopen"
              @change="DisplayStatusChange($event, item)" />
          </a-space>
          <a-space class="label-title">{{ item.title }}</a-space>
          <a-space slot="actions">
            <el-tooltip title="删除">
              <a-icon type="delete" @click="DelSelfLuminous(item, index)" />
            </el-tooltip>
          </a-space>
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal title="自发光效果" :width="340" :visible="visible" :confirm-loading="confirmLoading" @ok="SaveSelfLuminous"
      @cancel="handleCancel" cancel-text="取消" ok-text="确定" :getContainer="() => this.$refs.wrap">
      <a-form :form="formFolder">
        <a-form-item label="名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-input placeholder="请输入"
            v-decorator="['title', { initialValue: this.defaultVal.title, rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
        <a-form-item label="光照强度" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-input placeholder="请输入光照强度"
            v-decorator="['strength', { initialValue: this.defaultVal.strength, rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
        <a-form-item label="光照半径" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-input placeholder="请输入光照半径"
            v-decorator="['radius', { initialValue: this.defaultVal.radius, rules: [{ required: true, message: '请输入!' }] }]" />
        </a-form-item>
        <a-form-item label="发光颜色" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" class="color-picker"
          v-show="selfLuminousList.length < 1">
          <a-input placeholder="请输入" v-model="glowColor" :disabled="false" />
          <colorPicker v-model="glowColor"></colorPicker>
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
      selfLuminousList: [],
      defaultVal: {
        title: "",
        strength: 1.5,
        radius: 0.1,
      },
      glowColor: '#ffff00',
      currentFeature: '',
    }
  },
  mounted() {
    const that = this;
    that.formFolder.resetFields(); //清空表单
    let selfLuminousList = JSON.parse(localStorage.getItem("selfLuminousList_" + that.projectMessage.id));
    that.selfLuminousList = selfLuminousList ? selfLuminousList : [];
  },
  methods: {
    CreateSelfLuminous() {
      const that = this;
      that.$message.info('请点击选择自发光构件！');
      api.Public.event("LEFT_CLICK", function (click) {
        api.Feature.getByEvent(click.position, function (json) {
          if (json != undefined) {
            let haveList = that.selfLuminousList.findIndex(item => item.id == json.id)
            if (haveList != -1) {
              that.$message.info('该构件已存在自发光效果');
            } else {
              that.currentFeature = json.id;
              that.visible = true;
              api.Feature.clearSelectColor();
            }

          }
        });
      });
    },
    SaveSelfLuminous(e) {
      const that = this
      e.preventDefault()
      that.formFolder.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          var tempmap = new Map();
          tempmap.set(that.currentFeature, -1);//batchId如果没有传入-1
          var options = {
            featureIds: tempmap,
            isopen: true,
            tagname: that.currentFeature.split("^")[0],
            bloomColor: Cesium.Color.fromCssColorString(that.glowColor),
            bloomStrength: values.strength,
            bloomRadius: values.radius,
            title: values.title,
            id: that.currentFeature
          };
          api.Lights.addUnrealBloom(options);
          that.selfLuminousList.push(options)
          that.confirmLoading = false;
          that.visible = false
          that.formFolder.resetFields() //清空表单
          localStorage.setItem("selfLuminousList_" + that.projectMessage.id, JSON.stringify(that.selfLuminousList));
        }
      })
    },
    handleCancel() {
      const that = this;
      that.visible = false;
      that.formFolder.resetFields() //清空表单
    },
    DelSelfLuminous(data, index) {
      const that = this
      var options = {
        featureIds: data.featureIds,
        isopen: false,
      };
      api.Lights.addUnrealBloom(options);
      that.selfLuminousList.splice(index, 1);
      that.selfLuminousList.length == 0 ? api.Lights.removeUnrealBloom() : null;
      that.$message.success('删除成功');
      localStorage.setItem("selfLuminousList_" + that.projectMessage.id, JSON.stringify(that.selfLuminousList));
    },
    DisplayStatusChange(event, data) {
      const that = this;
      var options = {
        featureIds: data.featureIds,
      };
      if (event) {
        options.isopen = true;
      } else {
        options.isopen = false;
      }
      api.Lights.addUnrealBloom(options);
      localStorage.setItem("selfLuminousList_" + that.projectMessage.id, JSON.stringify(that.selfLuminousList));
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