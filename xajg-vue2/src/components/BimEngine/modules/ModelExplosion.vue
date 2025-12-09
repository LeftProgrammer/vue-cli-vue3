<template>
  <div class="set-box">
    <div>爆炸：</div>
    <a-slider @change="ModelExplosionChange" :max="1" :min="0" :step="0.01" :tooltip-visible="false" />
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
      modelList: [],
      lastExplosion: 0
    }
  },
  mounted() {
    const that = this;
    for (let i = 0; i < that.projectMessage.modelList.length; i++) {
      that.modelList.push(that.projectMessage.modelList[i].id)
    }
  },
  methods: {
    ModelExplosionChange(value) {
      const that = this;
      api.Model.modelsBlow(value - that.lastExplosion, that.modelList);
      that.lastExplosion = value;
    }
  },
  destroyed(){
    this.ModelExplosionChange(0)
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>

<style lang="scss" scoped>
.set-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 50px;
  margin: 0 8px;

  /deep/.ant-slider {
    width: 80%;
    margin: 0;
  }
}
</style>