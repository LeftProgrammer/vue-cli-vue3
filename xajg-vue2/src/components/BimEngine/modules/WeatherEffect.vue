<template>
  <div class="weather-box">
    <el-tooltip v-for="item in weatherList" :key="item.id" :title="item.name" @click="FunctionChoose(item.id)"
      :class="selectedStatus == item.id ? 'iconfont-select' : ''">
      <span class="iconfont" :class="'icon-' + item.icon"></span>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weatherList: [
        {
          id: 'rain',
          icon: 'xiaoyu',
          name: '下雨效果',
        },
        {
          id: 'snow',
          icon: 'xue',
          name: '下雪效果',
        },
        {
          id: 'fog',
          icon: 'wu1',
          name: '雾天效果',
        },
        {
          id: 'clear',
          icon: 'qiangzhiqingchu',
          name: '清除效果',
        }
      ],
      selectedStatus: undefined,
      weather: undefined,
    }
  },
  mounted() {
    this.weather = api.Plugin.initWeatherSource();
    api.Public.SetSceneRender(false); // 保持实时刷新
  },
  methods: {
    FunctionChoose(id) {
      const that = this;
      that.selectedStatus = id;
      that.ClearWeather();
      switch (id) {
        case "rain":
          that.weather.addRain({ tiltAngle: 0.1, rainSize: 0.5, rainSpeed: 60 });
          break;
        case "snow":
          that.weather.addSnow({ snowSize: 0.02, snowSpeed: 40 });
          break;
        case "fog":
          that.weather.addFog({ visibility: 0.2, color: new Cesium.Color(0.8, 0.8, 0.8, 0.5) });
          break;
      }
    },
    ClearWeather() {
      const that = this;
      that.weather.destroySnow()
      that.weather.destroyRain()
      that.weather.destroyFog()
    }
  }

}
</script>

<style lang="scss" scoped>
.weather-box {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .iconfont {
    font-size: 24px;
    line-height: 24px;
    padding: 10px;
    cursor: pointer;
  }

  .iconfont-select {
    background: #fff3;
    border-radius: 5px;
    color: #02f3be;
  }
}
</style>

