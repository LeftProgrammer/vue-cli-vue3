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
          id: 'flame',
          icon: 'huore',
          name: '火焰效果',
        },
        {
          id: 'smoke',
          icon: 'jianzhuanquan',
          name: '烟雾效果',
        },
        {
          id: 'fountain',
          icon: 'a-151-shuidi',
          name: '喷泉效果',
        },
        {
          id: 'clear',
          icon: 'qiangzhiqingchu',
          name: '清除效果',
        }
      ],
      selectedStatus: undefined,
      weather: undefined,
      openFlame: false,
      openSmoke: false,
      openFountain: false,
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
      switch (id) {
        case "flame":
          that.openFlame = !that.openFlame;
          if (that.openFlame) {
            that.$message.info('请点击拾取效果增加的位置！');
            api.Public.event("LEFT_CLICK", function (click) {
              api.Public.pickupCoordinate(click.position, function (data) {
                api.ParticleSystem.add("flameId", "fire", {
                  image: '/static/Cesium/Assets/Images/fire.png',
                  emitterRadian: 20.0,
                  position: data,//传入弧度制地理坐标
                });
              });
            });
          } else {
            api.ParticleSystem.remove('flameId');
          }
          break;
        case "smoke":
          that.openSmoke = !that.openSmoke;
          if (that.openSmoke) {
            that.$message.info('请点击拾取效果增加的位置！');
            api.Public.event("LEFT_CLICK", function (click) {
              api.Public.pickupCoordinate(click.position, function (data) {
                api.ParticleSystem.add("smokeId", "smoke", {
                  image: '/static/Cesium/Assets/Images/smoke.png',
                  emitterRadian: 20.0,
                  emissionRate: 15,
                  lifetime: 60.0,
                  position: data,//传入弧度制地理坐标
                  positionOffset: [0, 0, 0],
                });
              });
            });
          } else {
            api.ParticleSystem.remove('smokeId');
          }
          break;
        case "fountain":
          that.openFountain = !that.openFountain;
          if (that.openFountain) {
            that.$message.info('请点击拾取效果增加的位置！');
            api.Public.event("LEFT_CLICK", function (click) {
              api.Public.pickupCoordinate(click.position, function (data) {
                api.ParticleSystem.add("fountainId", "fountain", {
                  image: '/static/Cesium/Assets/Images/fountain.png',
                  emitterRadian: 5.0,
                  position: data,//传入弧度制地理坐标
                  positionOffset: [0, 0, 0],
                });
              });
            });
          } else {
            api.ParticleSystem.remove('fountainId');
          }
          break;
        case "clear":
          that.ClearWeather();
          break;
      }
    },
    ClearWeather() {
      const that = this;
      api.ParticleSystem.removeAll();
      that.openFlame = false;
      that.openSmoke = false;
      that.openFountain = false;
      api.viewer.scene.requestRender();
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

