<template>
  <div class="screen-header" :class="{ bg: $route.name === 'home' }">
    <div class="logo-box">
      <!-- <img
        class="text1"
        src="@/assets/screen/header1.png"
        alt=""
      >
      <img
        class="text2"
        src="@/assets/screen/header2.png"
        alt=""
      > -->
      <!-- <img src="@/assets/screen/logo.png" alt=""> -->
      <h4>雄安水电站前期工程现场数字化指挥平台</h4>
    </div>
    <div class="menu-box">
      <template v-if="!hiddenSystem">
        <span class="business" @click="$router.push('/home')">
          <img style="width: 32px" src="@/assets/screen/business.png" alt="" />
          <span>业务系统</span>
        </span>
        <i class="split">|</i>
      </template>

      <div class="weather">
        {{ weather.todayInfo || "" }}
        <!-- <img
          class="icon"
          src="@/assets/screen/cloud.png"
          alt=""
        > -->
        <i class="weather-icon" :class="weatherIcon" />
        <i class="temp">{{ weather.temp || "" }}</i>
        <i class="unit"> ℃</i>
      </div>
      <div class="logout" title="退出登录" @click="logout">
        <i class="el-icon-switch-button" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import { getWeatherToday } from '@/api/weather'
import { socket } from "@szgc/plt-core";

export default {
  name: "Header",
  props: {
    hiddenSystem: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      weather: {},
      weatherIcon: "el-icon-cloudy"
    };
  },
  computed: {
    ...mapGetters(["selectedStation"]),
    localStorageSelectedStation() {
      return JSON.parse(localStorage.getItem("selectedStation") || "{}");
    },
    computedWeatherIcon() {
      const info = this.weather.todayInfo;
      if (info) {
        if (info.includes("大雨")) {
          return "el-icon-heavy-rain";
        }
        if (info.includes("多云")) {
          return "el-icon-cloudy";
        }
        if (info.includes("雷")) {
          return "el-icon-lightning";
        }
        if (info.includes("多云转晴")) {
          return "el-icon-cloudy-and-sunny";
        }
        if (info.includes("雾")) {
          return "el-icon-partly-cloudy";
        }
        if (info.includes("雨")) {
          return "el-icon-light-rain";
        }
      }
      return "el-icon-sunny";
    }
  },
  mounted() {
    // console.log(this.$route)
    this.getWeatherToday();
  },
  methods: {
    gotoStartUp() {
      this.$router.push("/start-up");
    },
    logout() {
      this.$store.dispatch("user/logout").then((res) => {
        // 取消订阅
        socket.off("NOTICE");
        this.$router
          .push(`/login?redirect=${this.$route.fullPath}`)
          .then(() => {
            // location.reload();
          });
      });
    },
    async getWeatherToday() {
      // try {
      //   const { data, success, message } = await getWeatherToday({
      //     weatherId: this.$format(new Date())
      //   })
      //   if (!success) {
      //     return this.$message.error('获取天气信息失败: ' + message)
      //   }
      //   data.todayInfo = data.todayInfo.replace('今天：', '')
      //   data.temp = data.temp.replace('℃', '')
      //   this.weather = data || {}
      // } catch (error) {
      //   console.error(error)
      //   // this.$message.error('获取天气信息失败')
      // }
    }
  }
};
</script>

<style scoped lang="scss">
.screen-header {
  height: 100%;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  &.bg {
    background-color: rgba(28, 163, 143, 0.63);
  }
  .logo-box {
    width: 870px;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 0 0 25px;
    color: #ffffff;
    h4 {
      margin-left: 10px;
      margin-right: 32px;
      font-size: 24px;
      font-weight: normal;
      // cursor: pointer;
    }
    span {
      font-size: 30px;
      letter-spacing: 4px;
    }
  }
  .weather-icon {
    font-size: 38px;
    margin: 0 10px 0 20px;
  }
  .menu-box {
    width: calc(100% - 870px);
    height: 100%;
    padding: 0 36px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-bottom: 1px solid;
    border-image: radial-gradient(
        circle,
        rgba(34, 195, 191, 1),
        rgba(0, 0, 0, 0)
      )
      2 2;
    .business {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #00faed;
      line-height: 27px;
      cursor: pointer;
      img {
        margin-right: 7px;
      }
    }
    .split {
      margin: 0 30px;
    }
    .weather {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
      display: flex;
      align-items: center;
      .icon {
        width: 40px;
        margin: 0 10px 0 20px;
      }
      .temp {
        font-size: 36px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
      }
    }
    .logout {
      height: 100%;
      color: #fff;
      font-size: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 56px;
      cursor: pointer;
    }
  }
}
</style>
