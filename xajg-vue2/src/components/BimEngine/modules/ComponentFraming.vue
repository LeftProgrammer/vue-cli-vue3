<template>
  <div class="tips">
    {{ currentDeviceType ? '切换后清除' : '请点击选择起始位置后拖拽框选，右键恢复模型' }}
  </div>
</template>

<script>
export default {
  props: {
    projectMessage: {
      type: Object,
      default: null,
    },
    currentDeviceType: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectFeatures: new Map()
    }
  },
  mounted() {
    const that = this;
    api.Feature.boxSelect(
      function (data) {
        data.forEach(element => {
          let modelId = element[0].split("^")[0];
          let lastList = that.selectFeatures.get(modelId)
          if (lastList) {
            element.push(...lastList);
            that.selectFeatures.set(modelId, [...new Set(element)]);
          } else {
            that.selectFeatures.set(modelId, [...new Set(element)]);
          }
          api.Feature.setColor([...new Set(element)].join("#"), 255, 0, 0, 1);
        });
      }
    );
    api.Public.event("RIGHT_CLICK", function (click) {
      that.selectFeatures.forEach((val, key) => {
        api.Model.OriginalModel(key);
      })
      that.selectFeatures = new Map();
    });
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>