<template>
  <div>
    <div class="set-box" v-for="item in modelList" :key="item.id">
      <div class="set-title">{{ item.docName }}</div>
      <a-input-number v-model="floorLayer" />
      <div class="sign-box">m</div>
    </div>
    <a-space class="options-btn">
      <a-button ghost @click="StartLayering()">开始分层</a-button>
      <a-button ghost @click="ClearLayering()">清除分层</a-button>
    </a-space>
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
      floorLayer: 0,
    }
  },
  mounted() {
    const that = this;
    that.projectMessage.modelList.forEach(element => {
      that.modelList.push(Object.assign(element, { floorLayer: 2 }));
    });
  },
  methods: {
    StartLayering() {
      const that = this;
      that.modelList.forEach(data => {
        fetch(`${that.store.getters.modelUrl}/tools/output/model/${data.name}/${data.name}floor.json`).then(res => res.json()).then(jsonData => {
          api.Model.floorLayering(data.id, jsonData, that.floorLayer, (data1) => {
          })
        })
      })
    },
    ClearLayering() {
      const that = this;
      that.modelList.forEach(data => {
        api.Model.restoreFloorLayering(data.id);
      })
    },
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>

<style lang="scss" scoped>
.set-box {
  display: flex;
  align-items: center;
  justify-content: left;
  line-height: 50px;
  margin: 0 8px;

  .set-title {
    width: 40%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
    margin-right: 5%;
  }

  .sign-box {
    width: 13%;
    text-align: center;
  }

  /deep/.ant-slider {
    width: 60%;
    margin: 0;
  }
}

.options-btn {
  width: 100%;
  justify-content: space-around;
  margin: 10px 0;
}
</style>