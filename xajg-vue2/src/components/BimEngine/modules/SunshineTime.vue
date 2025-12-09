<template>
  <div class="set-box">
    <div>时间：</div>
    <a-slider @change="ModelExplosionChange" :max="1440" :min="0" v-model="currentTime" :step="1"
      :tooltip-visible="false" />
    <div class="sign-box">{{ timeValue }}</div>
  </div>
</template>

<script>
export default {
  props: {
    projectMessage: {
      type: Object,
      default: null,
    },
    store: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      modelList: [],
      currentTime: 780,
      timeValue: '13:00'
    }
  },
  mounted() {
    const that = this;
    that.currentTime = that.store.state.bim.sunshineTime   //在vuex中读取设置时间，根据自身业务需要调整
    for (let i = 0; i < that.projectMessage.modelList.length; i++) {
      that.modelList.push(that.projectMessage.modelList[i].id)
    }
  },
  methods: {
    ModelExplosionChange(value) {
      const that = this;
      var hour = parseInt(value / 60)
      var minute = value % 60
      var time = (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute)
      api.Public.setSunshineDuration(time);
      that.timeValue = time;
      api.viewer.scene.requestRender()
    }
  },
  destroyed() {
    const that = this;
    that.store.dispatch('setSunshineTime', that.currentTime) //在vuex中存储设置时间，根据自身业务需要调整
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

  .sign-box {
    width: 13%;
    text-align: right;
  }

  /deep/.ant-slider {
    width: 60%;
    margin: 0;
  }
}
</style>