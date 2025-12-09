<template>
  <div>
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-space>
        <a-button ghost @click="DeleteAllFeature">全部删除</a-button>
      </a-space>
      <a-list size="small" :data-source="featureList" :locale="{ emptyText: `暂无数据` }" class="viewpoint-list scroll-box">
        <a-list-item slot="renderItem" slot-scope="item,index">
          <a-space class="label-control">
            <a-switch checked-children="显示" un-checked-children="隐藏" v-model="item.state"
              @change="DisplayStatusChange($event, item)" />
          </a-space>
          <a-space class="label-title">{{ item.id.split("^")[1] }}</a-space>
          <a-space slot="actions">
            <el-tooltip title="删除">
              <a-icon type="delete" @click="DelFeature(item, index)" />
            </el-tooltip>
          </a-space>
        </a-list-item>
      </a-list>
    </a-card>
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
      featureList: [],
    }
  },
  mounted() {
    const that = this;
    that.$message.info('请点击选择要隐藏的构件！');
    api.Public.event("LEFT_CLICK", function (click) {
      api.Feature.getByEvent(click.position, function (json) {
        if (json != undefined) {
          let haveList = that.featureList.findIndex(item => item.id == json.id)
          if (haveList == -1) {
            that.featureList.push({
              id: json.id,
              state: false
            })
          } else {
            that.featureList[haveList].state = false
          }

          api.Feature.setVisible(json.id, false);
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
      api.Feature.setVisible(featureList.join("#"), true);
      api.Feature.clearSelectColor();
      that.featureList = [];
    },
    DelFeature(data, index) {
      const that = this
      api.Feature.setVisible(data.id, true);
      that.featureList.splice(index, 1);
      that.$message.success('删除成功');
      api.Feature.clearSelectColor();
    },
    DisplayStatusChange(event, data) {
      const that = this;
      api.Feature.setVisible(data.id, event);
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