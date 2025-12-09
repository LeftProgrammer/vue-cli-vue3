<template>
  <div class="ConstructionBim">
    <bim-engine ref="bimEngine" @LoadComplete="LoadComplete" />
    <el-form :inline="true" :model="pageParams">
      <el-form-item label="标段">
        <el-select
          v-model="pageParams.sectionId"
          placeholder="请选择"
          @change="sectionChange"
        >
          <el-option
            v-for="item in sectionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划名称">
        <el-select
          v-model="pageParams.planId"
          placeholder="请选择"
          @change="planChange"
        >
          <el-option
            v-for="item in planList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div
      class="bottom"
      :style="{ transform: `translateY(${showGantt ? '-100%' : '-46px'})` }"
    >
      <div ref="DragLine" class="DragLine" />
      <div class="progress" v-if="ganttData.length > 0">
        <i
          :class="isPlay ? 'el-icon-video-pause' : 'el-icon-video-play'"
          @click="play"
        />
        <el-slider
          v-model="progress"
          :format-tooltip="(value) => formatTooltip(value)"
          @change="progressChange"
        ></el-slider>
        <i
          :class="showGantt ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
          @click="showGantt = !showGantt"
        ></i>
      </div>
      <gantt ref="gantt" :style="{ height: `${ganttHeight}px` }" />
      <!-- 图例 -->
      <div class="Legend">
        <div>
          <span></span>
          <span>提前</span>
        </div>
        <div>
          <span></span>
          <span>延期</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { page, subPlan } from '../plan/api'
import { getSectionByCorpId } from '@/api//measure.js'
import { dateFormat } from '@/utils'
import BimEngine from '@/components/BimEngine/index'
import gantt from './gantt'
import moment from 'moment'
export default {
  name: 'ConstructionBim',
  components: {
    gantt,
    BimEngine
  },
  mixins: [],
  beforeRouteLeave(to, from, next) {
    this.showPlan = false
    this.showDayPlan = false
    next()
  },
  data() {
    return {
      pageParams: {},
      tableData: [],
      isPlay: false,
      timer: null,
      // gantt
      ganttData: [],
      sectionList: [],
      planList: [],
      showGantt: true,
      progressData: {},
      modelId: '',
      api: null,
      progress: 0,
      glidState: {
        AdvanceCompleted: [], //提前完成
        DelayedCompleted: [], //延期完成
        thatDayCompleted: [], //当前完成
        planNoStart: [], //计划未开始
        planStart: [], //计划开始
        realStart: [] //实际开始
      },
      showGlid: '',
      CompletedGlid: '',
      NoCompletedGlid: '',
      AdvanceCompleted: '',
      DelayedCompleted: '',
      actualStarGlid: '',
      enableMove: false,
      clientY: 0,
      moveY: 0,
      ganttHeight: 300
    }
  },
  created() {
    this.getDictItemList()
  },
  mounted() {
    this.$refs.bimEngine.InitEngine('pbsBim')
    this.$refs.gantt.restGanttConfig([])
    this.$refs.DragLine.addEventListener('mousedown', (e) => {
      this.handelMouseDown(e)
    })
  },
  methods: {
    dateFormat,
    LoadComplete(api, modelList) {
      this.modelId = modelList[0].id
      this.api = api
      api.Public.setSunshineDuration('15:00')
      api.Model.setSaturation(this.modelId, 0.4)
      api.viewer.scene.requestRender()
      api.Public.setSceneLight(1, true)
    },
    /**获取字典 */
    async getDictItemList() {
      // 获取标段
      this.current = this.$getStorage('userInfo')
      await this.getSectionList(this.current.corpId)
      // if (this.sectionList.length > 0) this.sectionChange(this.sectionList[0].id);
    },
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSectionByCorpId({
          corpId: corporateId
        })

        if (!success) {
          this.$message.error('查询标段失败：' + message)
          return false
        }
        this.sectionList = data
        return data
      } catch (err) {
        console.error(err)
        this.$message.error('查询标段失败')
        return false
      }
    },
    formatTooltip(value) {
      const keys = Object.keys(this.progressData)
      if (value == 0) return keys[0]
      return keys[Math.ceil(value / (100 / keys.length)) - 1]
    },
    /**
     * @description 标段选择
     */
    sectionChange(val) {
      this.pageParams.sectionId = val
      this.pageParams.planId = ''
      page({
        entity: { sectionId: val, flowStatus: 2 },
        pageSize: 999,
        size: 999,
        current: 1
      }).then((res) => {
        if (res.success) {
          this.planList = res.data.records
          if (this.planList.length > 0) {
            // this.planChange(this.planList[0].id);
          }
        }
      })
    },
    planChange(val) {
      this.pageParams.planId = val
      subPlan({ id: val }).then((res) => {
        this.tableData = res.data
        this.api.Model.setVisible(this.modelId, false) //隐藏模型
        this.transitionData(res.data)
        this.statisticsData(res.data)
        this.ganttData = res.data.map((x) => {
          x.parent = x.pid
          x.planDay = moment(x.endDate).diff(moment(x.startDate), 'days')
          x.start_date = x.startDate.split('-').reverse().join('-')
          x.end_date = x.endDate.split('-').reverse().join('-')
          return x
        })
        this.$nextTick(() => {
          this.$refs.gantt.restGanttConfig(res.data)
        })
      })
    },
    /**
     * @description 统计数据
     */
    statisticsData(data) {
      // 1.实际已完成：可见，不透明
      //    1.1.提前完成：绿色
      //    1.2.延期完成：红色
      // 2.实际未开始：
      //    2.1.计划未开始：不可见
      //    2.2.计划已开始：可见，半透明
      // 3.实际已开始：可见，半透明，蓝色
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item.bimCode) {
          console.log(item.bimCode)
          if (item.actualEndDate) {
            if (moment(item.endDate).isBefore(item.actualEndDate)) {
              this.glidState.DelayedCompleted.push(item.bimCode)
            } else if (moment(item.actualEndDate).isBefore(item.endDate)) {
              this.glidState.AdvanceCompleted.push(item.bimCode)
            } else {
              this.glidState.thatDayCompleted.push(item.bimCode)
            }
          } else if (moment(item.startDate).isBefore(moment())) {
            this.glidState.planStart.push(item.bimCode)
          } else if (item.actualStartDate) {
            this.glidState.realStart.push(item.bimCode)
          }
        }
      }
      this.api.Feature.setVisible(
        [
          ...this.glidState.AdvanceCompleted,
          ...this.glidState.DelayedCompleted,
          ...this.glidState.planStart,
          ...this.glidState.realStart,
          ...this.glidState.thatDayCompleted
        ].join('#'),
        true,
        this.modelId,
        false
      )
      this.api.Feature.setColor(
        this.glidState.AdvanceCompleted.join('#'),
        0,
        255,
        0,
        1,
        this.modelId
      )
      this.api.Feature.setColor(
        this.glidState.DelayedCompleted.join('#'),
        255,
        0,
        0,
        1,
        this.modelId
      )
      this.api.Feature.setColor(
        this.glidState.realStart.join('#'),
        0,
        0,
        255,
        1,
        this.modelId
      )
      this.api.Feature.setAlpha(
        this.glidState.realStart.join('#'),
        0.5,
        this.modelId
      )
      this.api.Feature.setAlpha(
        this.glidState.planStart.join('#'),
        0.5,
        this.modelId
      )
    },
    /**
     * @description 按天来统计每天完成部位
     */
    transitionData(data) {
      const result = {}

      // 辅助函数：生成两个日期之间的所有日期
      function getDatesInRange(startDate, endDate) {
        const dates = []
        let currentDate = new Date(startDate)
        const lastDate = new Date(endDate)

        while (currentDate <= lastDate) {
          dates.push(currentDate.toISOString().split('T')[0])
          currentDate.setDate(currentDate.getDate() + 1)
        }
        return dates
      }

      // 处理每个数据项
      data.forEach((item) => {
        // 如果没有开始日期或结束日期，跳过
        if (!item.startDate || !item.endDate) return
        const dates = getDatesInRange(item.startDate, item.endDate)
        dates.forEach((date) => {
          if (!result[date]) {
            result[date] = item.bimCode
          } else {
            // 如果已经有值，则追加新的glid
            result[date] = `${result[date]},${item.bimCode}`
          }
        })
      })
      this.progressData = result
    },
    progressChange(value) {
      const keys = Object.keys(this.progressData)
      if (value == 0) return keys[0]
      const date = keys[Math.ceil(value / (100 / keys.length)) - 1]
      this.showGlid = ''
      this.CompletedGlid = ''
      this.NoCompletedGlid = ''
      this.AdvanceCompleted = ''
      this.DelayedCompleted = ''
      this.tableData.forEach((item) => {
        if (moment(date).isAfter(moment(item.startDate)) && item.bimCode) {
          this.showGlid = this.showGlid.concat('#', item.bimCode)
          if (
            item.actualStartDate &&
            moment(date).isAfter(moment(item.actualStartDate))
          ) {
            this.actualStarGlid = this.actualStarGlid.concat('#', item.bimCode)
          }
          if (
            item.actualEndDate &&
            moment(date).isAfter(moment(item.actualEndDate))
          ) {
            this.CompletedGlid = this.CompletedGlid.concat('#', item.bimCode)
            if (moment(item.actualEndDate).isBefore(moment(item.endDate))) {
              this.AdvanceCompleted = this.AdvanceCompleted.concat(
                '#',
                item.bimCode
              )
            } else if (
              moment(item.endDate).isBefore(moment(item.actualEndDate))
            ) {
              this.DelayedCompleted = this.DelayedCompleted.concat(
                '#',
                item.bimCode
              )
            }
          } else {
            this.NoCompletedGlid = this.NoCompletedGlid.concat(
              '#',
              item.bimCode
            )
          }
        }
      })
      this.api.Feature.setVisible(this.showGlid, true, this.modelId, false)
      this.api.Feature.setAlpha(this.showGlid, 0.5, this.modelId)
      this.api.Feature.setColor(this.actualStarGlid, 0, 0, 255, 1, this.modelId)
      this.api.Feature.setAlpha(this.CompletedGlid, 1, this.modelId)
      this.api.Feature.setColor(
        this.AdvanceCompleted,
        0,
        255,
        0,
        1,
        this.modelId
      )
      this.api.Feature.setColor(
        this.DelayedCompleted,
        255,
        0,
        0,
        1,
        this.modelId
      )
    },
    play() {
      this.isPlay = !this.isPlay
      if (!this.isPlay) {
        clearInterval(this.timer)
        return
      }
      if (this.progress >= 100) this.progress = 0
      this.timer = setInterval(() => {
        this.progress += 5
        if (this.progress >= 100) {
          this.progress = 100
          this.isPlay = false
          clearInterval(this.timer)
        }
        this.progressChange(this.progress)
      }, 1000)
    },
    handelMouseDown(event) {
      this.enableMove = true
      this.clientY = event.clientY
      document.addEventListener('mousemove', this.handelMouseMove)
      document.addEventListener('mouseup', this.handelMouseUp)
    },
    handelMouseUp(event) {
      this.enableMove = false
      document.removeEventListener('mousemove', this.handelMouseMove)
      document.removeEventListener('mouseup', this.handelMouseUp)
      this.ganttHeight += -this.moveY
    },
    handelMouseMove(event) {
      if (!this.enableMove) {
        return
      }
      let moveY = event.clientY - this.clientY
      this.moveY = moveY
    }
  }
}
</script>

<style scoped lang="scss">
.ConstructionBim {
  height: 100%;
  padding: 0 !important;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .EnginePage {
    // position: absolute;
    width: 100%;
    height: 100%;
    flex: 1;
  }
  .el-form {
    position: absolute;
    top: 16px;
    left: 16px;
  }
  .bottom {
    position: relative;
    // bottom: 0;
    transition: all 0.5s;
    // z-index: 10;
    width: 100%;
    .DragLine {
      position: absolute;
      top: 0;
      width: 100%;
      height: 1px;
      cursor: row-resize;
      z-index: 100;
      &:hover {
        height: 5px;
        background-color: #e4e1e1;
      }
    }
    #gantt_bim {
      width: 100%;
    }
    .progress {
      background-color: white;
      display: flex;
      gap: 32px;
      align-items: center;
      padding: 4px 16px;
      .el-slider {
        flex: 1;
      }
      i {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .Legend {
      position: absolute;
      top: 0;
      right: 16px;
      transform: translateY(calc(-100% - 8px));
      padding: 6px 4px;
      border-radius: 8px;
      background-color: rgba(0, 21, 41, 0.8);
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 4px 0;
        font-size: 12px;
        color: #fff;
        span {
          margin: 0 8px;
          &:first-child {
            width: 36px;
            height: 15px;
            display: inline-block;
          }
        }
        &:first-child {
          span {
            &:first-child {
              background-color: green;
            }
          }
        }
        &:last-child {
          span {
            &:first-child {
              background-color: red;
            }
          }
        }
      }
    }
  }
}
</style>
