<template>
  <div
    ref="wrapper"
    class="wrapper"
    @scroll="onScroll"
  >
    <div
      class="background"
      :style="{height:`${total_height}px`}"
    />
    <div
      ref="container"
      class="list"
    >
      <div
        v-for="item in runList"
        :key="item.data[keyName]"
      >
        <!-- <el-checkbox :label="item">{{ item.realName }}</el-checkbox> -->
        <slot :item="item.data" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualScroll',
  props: {
    cacheScreens: {
      // 缓冲的屏幕数量
      type: Number,
      default: 1
    },
    itemHeight: {
      type: Number,
      default: 1,
      require: true
    },
    items: {
      type: Array,
      require: true,
      default: function() {
        return []
      }
    }, // 源数据
    keyName: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      list: [],
      runList: [], // 运行时的列表
      total_height: 0, // 列表总高度
      maxNum: 0, // 一屏幕容纳的最大数量
      distance: 0 // 存储滚动的距离
    }
  },
  watch: {
    items: {
      handler: function(newVal) {
        if (Array.isArray(newVal)) {
          this.list = newVal || []
          this.$nextTick(() => {
            this.init()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.genData()
      const containerHeight = parseInt(
        getComputedStyle(this.$refs.wrapper).height
      )

      const list_height = this.list[this.list.length - 1].top
      //  列表总高度
      if (list_height <= containerHeight) {
        this.total_height = containerHeight
      } else {
        this.total_height = list_height - containerHeight
      }
      // 一屏的最大数量
      this.maxNum = Math.ceil(containerHeight / this.min_height)
      if (this.maxNum * 5 > this.list.length) {
        // 如果列表太短, 则不用启用虚拟列表
        this.runList = this.list
      } else {
        this.getRunData()
        this.onScroll({ target: { scrollTop: this.distance }})
      }
    },
    onScroll(e) {
      if (this.ticking) {
        return
      }
      this.ticking = true
      requestAnimationFrame(() => {
        this.ticking = false
      })
      const distance = e.target.scrollTop
      this.distance = distance
      this.getRunData(distance)
    },
    // 二分法计算起始索引
    getStartIndex(scrollTop) {
      let start = 0
      let end = this.list.length - 1
      while (start < end) {
        const mid = Math.floor((start + end) / 2)
        const { top, height } = this.list[mid]
        if (scrollTop >= top && scrollTop < top + height) {
          start = mid
          break
        } else if (scrollTop >= top + height) {
          start = mid + 1
        } else if (scrollTop < top) {
          end = mid - 1
        }
      }
      return start
    },
    getRunData(distance = null) {
      // 滚动的总距离
      const scrollTop = distance || this.$refs.container.scrollTop

      // 在哪个范围内不执行滚动
      if (this.scroll_scale) {
        if (
          scrollTop > this.scroll_scale[0] &&
          scrollTop < this.scroll_scale[1]
        ) {
          return
        }
      }
      // 起始索引
      let start_index = this.getStartIndex(scrollTop)
      start_index = start_index < 0 ? 0 : start_index

      // 上屏索引
      let upper_start_index = start_index - this.maxNum * this.cacheScreens
      upper_start_index = upper_start_index < 0 ? 0 : upper_start_index

      // 调整offset
      this.$refs.container.style.transform = `translate3d(0,${this.list[upper_start_index].top}px,0)`

      // 中间屏幕的元素
      const mid_list = this.list.slice(start_index, start_index + this.maxNum)

      // 上屏
      const upper_list = this.list.slice(upper_start_index, start_index)

      // 下屏元素
      let down_start_index = start_index + this.maxNum

      down_start_index =
        down_start_index > this.list.length - 1
          ? this.list.length
          : down_start_index

      this.scroll_scale = [
        this.list[Math.floor(upper_start_index + this.maxNum / 2)].top,
        this.list[Math.ceil(start_index + this.maxNum / 2)].top
      ]

      const down_list = this.list.slice(
        down_start_index,
        down_start_index + this.maxNum * this.cacheScreens
      )

      this.runList = [...upper_list, ...mid_list, ...down_list]
    },
    // 生成数据
    genData() {
      let total_height = 0
      const list = this.list.map((data, index) => {
        const height = this.itemHeight
        const ob = {
          index,
          height,
          top: total_height,
          data
        }
        total_height += height
        return ob
      })
      //   this.total_height = total_height //  列表总高度
      this.list = list
      this.min_height = this.itemHeight // 最小高度是50
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }
  .list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
}
</style>
