<template>
  <div class="DesignManage">
    <div class="card-header">
      <img
        class="header-icon"
        src="@/assets/screen/h-icon.png"
        alt=""
      >
      安全管理
    </div>
    <div class="circle-item hidden-trouble">
      <div
        class="num"
        style="color: #34A8FF"
      >63
        <span class="unit">个</span>
      </div>
      <div class="text">隐患数量</div>
    </div>
    <div class="circle-item safe-day">
      <div
        class="num"
        style="color: #00FFD0"
      >1239
        <span class="unit">天</span>
      </div>
      <div class="text">安全生产天数</div>
    </div>
    <div class="circle-item fix-done">
      <div
        class="num"
        style="color: #B43EFE"
      >3
        <span class="unit">个</span>
      </div>
      <div class="text">已整改数</div>
    </div>
    <div class="circle-item accident">
      <div
        class="num"
        style="color: #FFBB00"
      >0
        <span class="unit">个</span>
      </div>
      <div class="text">事故数量</div>
    </div>
    <div class="circle-item train">
      <div
        class="num"
        style="color: #49F196"
      >13
        <span class="unit">次</span>
      </div>
      <div class="text">培训次数</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesignManage',
  data() {
    return {}
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {}
  }
}
</script>

<style scoped lang="scss">
.DesignManage {
  // color: #B4B4B4;
  color: #fff;
  position: relative;
  height: 100%;
  .circle-item {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .num {
      font-size: 24px;
      font-weight: 800;
      .unit {
        font-size: 14px;
      }
    }
    .text {
      font-size: 12px;
      font-weight: 500;
      // color: #A4A4A4;
      color: #fff;
      line-height: 21px;
    }
  }
  .hidden-trouble {
    position: absolute;
    left: 20px;
    top: 38px;
    width: 96px;
    height: 96px;
    background-image: url("~@/assets/screen/screen_30.png");
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .safe-day {
    position: absolute;
    left: 124px;
    bottom: 12px;
    width: 110px;
    height: 110px;
    background-image: url("~@/assets/screen/screen_29.png");
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .fix-done {
    position: absolute;
    right: 144px;
    top: -8px;
    width: 80px;
    height: 80px;
    background-image: url("~@/assets/screen/screen_28.png");
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .accident {
    position: absolute;
    right: 119px;
    bottom: 6px;
    width: 95px;
    height: 95px;
    background-image: url("~@/assets/screen/screen_17.png");
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .train {
    position: absolute;
    right: 23px;
    top: 38px;
    width: 92px;
    height: 92px;
    background-image: url("~@/assets/screen/screen_27.png");
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
