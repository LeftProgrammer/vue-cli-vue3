<template>
  <div ref="wrap">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-space>
        <a-button ghost @click="DeleteAllFeature">全部删除</a-button>
      </a-space>
      <a-list size="small" :data-source="featureList" :locale="{ emptyText: `暂无数据` }" class="viewpoint-list scroll-box">
        <a-list-item slot="renderItem" slot-scope="item,index">
          <a-space class="label-title">{{ item.id.split("^")[1] }}</a-space>
          <a-space slot="actions">
            <el-tooltip title="删除">
              <a-icon type="delete" @click="DelFeature(item, index)" />
            </el-tooltip>
          </a-space>
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal title="设置构件透明" :width="300" :visible="visible" @ok="SaveFeatureTransparent" @cancel="handleCancel"
      cancel-text="取消" ok-text="确定" :getContainer="() => this.$refs.wrap">
      <a-form>
        <a-form-item label="透明度" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-input placeholder="请输入" v-model="transparent" />
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
    }
  },
  data() {
    return {
      featureId: undefined,
      visible: false,
      transparent: 0.5,
      featureList: []

    }
  },
  mounted() {
    const that = this;
    that.$message.info('请点击要设置透明的构件！');
    api.Public.event("LEFT_CLICK", function (click) {
      api.Feature.getByEvent(click.position, function (json) {
        if (json != undefined) {
          that.visible = true;
          that.featureId = json.id
        }
      });
    });
  },
  methods: {
    DeleteAllFeature() {
      const that = this;
      let featureList = []
      that.featureList.forEach(element => {
        featureList.push(element.id)
      });
      api.Feature.setAlpha(featureList.join("#"), 1);
      api.Feature.clearSelectColor();
      that.featureList = [];
    },
    DelFeature(data, index) {
      const that = this
      api.Feature.setAlpha(data.id, 1);
      that.featureList.splice(index, 1);
      that.$message.success('删除成功');
      api.Feature.clearSelectColor();
    },
    SaveFeatureTransparent() {
      const that = this;
      api.Feature.setAlpha(that.featureId, that.transparent);
      let haveList = that.featureList.findIndex(item => item.id == that.featureId)
      haveList == -1 ?
        that.featureList.push({
          id: that.featureId,
          transparent: that.transparent
        })
        :
        that.featureList[haveList].transparent = that.transparent
      that.visible = false;
    },
    handleCancel() {
      const that = this
      that.visible = false;
    },
  },
  destroyed() {
    const that = this;
    that.DeleteAllFeature();
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
    width: 70%;
    cursor: pointer;

    .ant-space-item {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.color-sign {
  width: 21px;
  height: 21px;
}
</style>