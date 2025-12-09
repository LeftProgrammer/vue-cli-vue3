<template>
  <div ref="wrap">
    <a-card size="small" :bordered="false" class="card-custom-style">
      <a-space>
        <a-button ghost @click="DeleteAllFeature">全部删除</a-button>
      </a-space>
      <a-list size="small" :data-source="featureList" :locale="{ emptyText: `暂无数据` }" class="viewpoint-list scroll-box">
        <a-list-item slot="renderItem" slot-scope="item,index">
          <a-space class="label-control">
            <div :style="{ background: item.color }" class="color-sign"></div>
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
    <a-modal title="设置构件颜色" :width="300" :visible="visible" @ok="SaveFeatureColor" @cancel="handleCancel"
      cancel-text="取消" ok-text="确定" :getContainer="() => this.$refs.wrap">
      <a-form>
        <a-form-item label="选择颜色" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" class="color-picker">
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
    }
  },
  data() {
    return {
      featureId: undefined,
      visible: false,
      color: '#ff0000',
      featureList: []

    }
  },
  mounted() {
    const that = this;
    that.$message.info('请点击选择要设置颜色的构件！');
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
      api.Feature.setColor(featureList.join("#"), 255, 255, 255, 1);
      api.Feature.clearSelectColor();
      that.featureList = [];
    },
    DelFeature(data, index) {
      const that = this
      api.Feature.setColor(data.id, 255, 255, 255, 1);
      that.featureList.splice(index, 1);
      that.$message.success('删除成功');
      api.Feature.clearSelectColor();
    },
    DisplayStatusChange(event, data) {
      const that = this;
      api.Feature.setVisible(data.id, event);
    },
    SaveFeatureColor() {
      const that = this;
      let color = that.hexToRgb(that.color)
      api.Feature.setColor(that.featureId, color.r, color.g, color.b, 1);
      let haveList = that.featureList.findIndex(item => item.id == that.featureId)
      haveList == -1 ?
        that.featureList.push({
          id: that.featureId,
          color: that.color
        })
        :
        that.featureList[haveList].color = that.color
      that.visible = false;
    },
    handleCancel() {
      const that = this
      that.visible = false;
    },
    hexToRgb(val) {   //HEX十六进制颜色值转换为RGB(A)颜色值
      // 16进制颜色值的正则
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      // 把颜色值变成小写
      var color = val.toLowerCase();
      var result = '';
      if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
          var colorNew = "#";
          for (var i = 1; i < 4; i += 1) {
            colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
          }
          color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
          colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        result = "rgb(" + colorChange.join(",") + ")";
        return { rgb: result, r: colorChange[0], g: colorChange[1], b: colorChange[2] };
      } else {
        result = '无效';
        return { rgb: result };
      }

    }
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

.color-sign {
  width: 21px;
  height: 21px;
}
</style>