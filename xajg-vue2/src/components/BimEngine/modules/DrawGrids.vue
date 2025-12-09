<template>
  <div>
    <div class="set-box">
      <div>选择楼层：</div>
      <a-select v-model="floorSelect" :options="floorList" class="select-box"></a-select>
    </div>
    <div class="set-box">
      <div>选择标注：</div>
      <a-select v-model="selectDimension" class="select-box">
        <a-select-option value="false">隐藏标注</a-select-option>
        <a-select-option value="true">显示标注</a-select-option>
      </a-select>
    </div>
    <div class="options-btn">
      <a-button ghost @click="StartDrawing">开始绘制</a-button>
      <a-button ghost @click="ClearGrid">清除轴网</a-button>
    </div>
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
      floorList: [],
      floorSelect: '',
      selectDimension: "false",
      gridsList: []
    }
  },
  mounted() {
    const that = this;
    fetch(`${that.store.getters.modelUrl}/tools/output/model/${that.projectMessage.modelName}/GridJson.json`).then(res => res.json())
      .then(jsonData => {
        jsonData.forEach(item => {
          that.floorList.push({ value: item.LevelName, label: item.LevelName })
        })
        that.gridsList = jsonData
        that.floorSelect = jsonData[0].LevelName
      }).catch((res) => {
        that.$message.warning('该模型暂无轴网数据');
      })
  },
  methods: {
    StartDrawing() {
      const that = this;
      api.Model.DrawGrid(that.projectMessage.id, that.gridsList, that.floorSelect, that.selectDimension == 'false' ? false : true);
    },
    ClearGrid() {
      api.Model.clearGrid()
    }
  }
}
</script>

<style lang="scss" scoped>
.set-box {
  display: flex;
  align-items: center;
  line-height: 36px;
  margin: 0px 8px;
  margin-top: 10px;

  >div {
    white-space: nowrap;
  }

  .select-box {
    width: 72%;
  }
}

.options-btn {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>