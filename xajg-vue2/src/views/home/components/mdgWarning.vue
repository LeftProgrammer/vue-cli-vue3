<template>
  <div class="inner-div">
    <div class="warning-item" v-for="item in warningData">
      <el-image class="icon" :src="require('../../home/assets/star.png')"/>
      <span class="title"
      >{{ item.POINT_TYPE === 'YLJC' ? '雨量预警' : (item.POINT_TYPE === 'QXJC' ? '气象预警' : '泥位预警') }}</span>
      <span class="number">{{ item.COUNT }}</span>
      <span class="unit">条</span>
    </div>
    <div class="goto">
      <span style="cursor: pointer;" @click="goto()">立即前往></span>
    </div>
  </div>
</template>

<script>
import { Notification } from 'element-ui';
import { warningStatByType } from '@/views/home/api';

export default {
  mixins: [],
  components: {},
  props: {
    appVueModel: {
      default: {},
      type: Object
    },
    warningData: {
      default: [],
      type: Array
    }
  },
  data() {
    return {
      warningData: []
    };
  },
  computed: {},
  async created() {

  },
  methods: {
    goto() {
      console.log('跳转');
      Notification.closeAll();
      this.appVueModel.$router.push({
        path: '/monitor/data?permCode=monitor-data&name=防汛监测记录',
        query: { pageType: 'fromNotify', pointType: this.warningData[0].POINT_TYPE.toLowerCase() }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.inner-div {
  margin-top: 30%;
}

.warning-item {
  display: flex;
  align-items: center;
  width: 365px;
  height: 35px;
  background: linear-gradient(90deg, #9CC7FF 0%, #E6F2FE 100%);
  border-radius: 0px 0px 0px 0px;
  margin-bottom: 10px;

  .icon {
    width: 12px;
    height: 12px;
    margin: 0 12px;
  }

  .title {
    width: 80%;
    color: #000000;
  }

  .number {
    color: #FF2E2E;
  }

  .unit {
    color: #1E1E1E;
    font-size: 14px;
    margin: 0 30px 0 5px;
  }

  .title, .number {
    font-weight: bold;
    font-size: 16px;
  }
}

.goto {
  position: absolute;
  bottom: 20px;
  text-align: center;
  width: 90%;
  font-size: 16px;
  color: #F53F3F;
}
</style>
