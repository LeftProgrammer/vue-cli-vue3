<template>
  <div
    id="office-home"
    class="w-100pre h-100pre box"
    :style="{ zoom: scaleFactor }"
  >
    <div class="doc">
      <!-- 收发文 -->
      <ReceiveSend />
      <!-- 处理时间 -->
      <DocDisposeTime />
    </div>
    <div class="money bg-fff">
      <TopTitle title="资金调拨分析" />
      <FundAllocation />
    </div>
    <div class="train bg-fff">
      <TopTitle title="培训情况" />
      <TrainSituation />
    </div>
  </div>
</template>
<script>
import ReceiveSend from './components/ReceiveSend'
import TopTitle from '@/components/TopTitle'
import DocDisposeTime from './components/DocDisposeTime'
import FundAllocation from './components/FundAllocation'
import TrainSituation from './components/TrainSituation'
import { corporates } from './api'

export default {
  components: {
    ReceiveSend,
    DocDisposeTime,
    TopTitle,
    FundAllocation,
    TrainSituation
  },
  data() {
    return {
      scaleFactor: 1 // 默认缩放比例为 1
    }
  },
  mounted() {
    // 监听屏幕变化
    window.addEventListener('resize', this.initScalc)
    this.$nextTick(() => {
      this.initScalc()
    })
    // 获取单位列表
    corporates().then((res) => {
      const data = res.data
        .filter((item) => {
          return item.corpLeaf !== 0
        })
        .sort((a, b) => {
          return a.corpSort - b.corpSort
        })
      this.$children.forEach((x) => {
        if (x.getData) x.getData(data)
      })
    })
  },
  methods: {
    initScalc() {
      // 以1920x1080的设计分辨率为例
      var designWidth = 1920
      var designHeight = 1080

      // 调用函数获取缩放比例
      var scaleFactors = this.setScalc(designWidth, designHeight)
      this.scaleFactor = scaleFactors.scaleX
      // console.log('缩放比例', scaleFactors.scaleX, scaleFactors.scaleY)
    },
    setScalc(designWidth, designHeight) {
      // 获取当前屏幕宽度和高度
      var screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      var screenHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

      // 计算缩放比例
      var scaleX = screenWidth / designWidth
      var scaleY = screenHeight / designHeight

      // 返回一个包含缩放比例的对象
      return {
        scaleX: scaleX,
        scaleY: scaleY
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
#office-home {
  background-color: #F7F8FA;
  height: 100%;
  overflow: auto;
  .doc {
    height: 442px;
    display: flex;
    margin-bottom: 15px;
  }
  .money {
    @extend .box-padding, .box-radius;
    height: 442px;
    margin-bottom: 15px;
  }
  .train {
    @extend .box-padding, .box-radius;
    height: 442px;
  }
}
</style>
