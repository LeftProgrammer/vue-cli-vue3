<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card :bordered="false">
      <a-radio-group
        v-if="viewList.length > 0"
        v-model="currentView"
        @change="ChangeModelView"
      >
        <a-radio
          v-for="(item, index) in viewList"
          :key="index"
          :value="index"
          >{{ item.name }}</a-radio
        >
      </a-radio-group>
      <el-tooltip v-else description="暂无数据" :image="simpleImage" />
    </a-card>
  </div>
</template>
<script>
import { getModelView } from "@/components/BimEngine/api/document";
export default {
  props: {
    projectMessage: {
      type: Object,
      default: undefined,
    },
    store: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      viewList: [],
      currentView: "",
      simpleImage: null,// Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
  mounted() {
    const that = this;
    getModelView({
      LightweightName: that.projectMessage.modelName,
    }).then((res) => {
      if (res.code == 1) {
        that.viewList = res.datas;
      }
    });
  },
  methods: {
    ChangeModelView(e) {
      const that = this;
      let current = that.viewList[e.target.value];
      if (api.Model.get(that.projectMessage.id).show) {
        api.Model.setVisible(that.projectMessage.id, false);
      }
      if (api.Model.get(current.modelName)) {
        api.Model.location(current.modelName);
        api.Model.setVisible(current.modelName, true);
      } else {
        fetch(
          `${that.store.getters.modelUrl}/tools/output/model/${current.modelName}/centerPosition.json`
        )
          .then((res) => res.json())
          .then((jsonData) => {
            api.Model.mergeModel(
              `${that.store.getters.modelUrl}/tools/output/model/${current.modelName}/root.glt`,
              current.modelName,
              null,
              null,
              {
                viewDirection: current.viewDirection.split(",").map(Number),
                viewEye: current.eye.split(",").map(Number),
                viewOffsetEye: [
                  Number(jsonData.centerX),
                  Number(jsonData.centerY),
                  Number(jsonData.centerZ),
                ],
              }
            );
          });
      }
    },
  },
  destroyed() {
    const that = this;
    for (var i = 0; i < that.viewList.length; i++) {
      var m = api.Model.get(that.viewList[i].modelName);
      if (!isEmpty(m)) {
        api.Model.remove(that.viewList[i].modelName);
      }
    }
    api.Model.setVisible(that.projectMessage.id, true);
  },
};
</script>

<style lang="scss" scoped>
.ant-radio-group {
  width: 100%;

  .ant-radio-wrapper {
    color: #ffffff;
    width: 100%;
    line-height: 36px;
    text-indent: 10px;

    /deep/.ant-radio-inner {
      background: #fff0;
    }
  }
}
</style>