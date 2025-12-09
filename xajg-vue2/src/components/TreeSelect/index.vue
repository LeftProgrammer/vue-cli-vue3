<!--
 树状下拉选择框:
 1、加载树结构，实现树状下拉选择组件；
 2、可通过关键词实现本地和远程过滤；
 3、高亮选择行；
 4、设置默认选择行；
 5、可直接应用在form表单；
-->
<template>
  <el-select
    ref="selectRef"
    filterable
    v-model="currentLabel"
    @visible-change="handleVisibleChange"
    @clear="handleClear"
  >
    <el-option style="height: 100%; padding: 0">
      <el-tree
        ref="treeRef"
        :data="dataOfTree"
        :node-key="defaultProps.value"
        :props="defaultProps"
        highlight-current
        default-expand-all
        :current-node-key="selectedNode.value"
        :expand-on-click-node="false"
        @node-click="handleNodeClicked"
        :filter-node-method="filterNode"
      >
      </el-tree>
    </el-option>

  </el-select>
</template>
<script>

export default {
  name: 'SelectTree',
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String
    },
    // 默认选中值
    defaultValue: {
      type: String
    },
    // 是否支持搜索，本地搜索，与远程搜索配置互斥。
    filterable: {
      type: Boolean,
      default: false
    },
    treeOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label',
          value: 'id'
        }
      }
    }
  },
  watch: {
    treeOptions: {
      handler(newValue) {
        this.loading = false
        this.dataOfTree = JSON.parse(JSON.stringify(newValue))
        // 保留源数据；
        this.dataSource = JSON.parse(JSON.stringify(newValue))
      },
      deep: true,
      immediate: false
    },
    defaultValue: {
      handler(newValue) {
        this.selectedNode = {}
        this.currentLabel = undefined
        this.currentValue = newValue
        this.$nextTick(() => {
          // 过滤方式是通过value还是label;
          this.isFilterWithValue = true
          if (this.dataOfTree) {
            this.$refs.treeRef.filter(newValue)
          }
        })
      },
      deep: true,
      immediate: true
    },
    value: {
      handler(newValue) {
        console.log(">>>>>>>>>>>>>>", newValue)
        if (newValue) {
          this.selectedNode = {}
          this.currentLabel = undefined
          this.currentValue = newValue
          this.$nextTick(() => {
            if (this.dataOfTree) {
              this.$refs.treeRef.filter(newValue)
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
  },
  data() {
    return {
      selectedNode: {},
      loading: false,
      currentValue: undefined,
      currentLabel: undefined,
      dataOfTree: []
    }
  },
  created() {
    this.dataOfTree = JSON.parse(JSON.stringify(this.treeOptions))
    // 保留源数据；
    this.dataSource = JSON.parse(JSON.stringify(this.treeOptions))
  },
  mounted() {
  },
  methods: {
    handleClear() {
      // 如果内容被清空
      this.selectedNode = {}
      this.currentLabel = undefined
      this.currentValue = undefined
      //const result = this.buildEmptyResult()
      this.$emit('change', {})
    },
    handleVisibleChange(visible) {
      if (!visible) {
        // 先移除所有数据；
        this.dataOfTree.splice(0)
        // 恢复原来的所有数据；
        this.dataOfTree.splice(0, 0, ...this.dataSource)
        // 本地过滤
        this.$refs.treeRef.filter('')
      }
    },
    filterNode(value, data) {
      if (!value) {
        return data
      }
      if (this.isFilterWithValue) {
        if (data[this.defaultProps.value] === value) {
          this.selectedNode = data
          this.currentLabel = data[this.defaultProps.label]
          this.$refs.treeRef.setCurrentKey(this.selectedNode[this.defaultProps.value])
          //const result = this.buildResultByNodeData(data)
          this.$emit('change', data.dictCode)
        }
      } else {
        return data[this.defaultProps.label].indexOf(value) !== -1
      }
      return data
    },
    closeSelect() {
      this.$refs.selectRef.blur()
    },
    /**
     * @param data
     * @param node
     * @param comp
     */
    handleNodeClicked(data, node, comp) {
      this.selectedNode = data
      this.currentLabel = data[this.defaultProps.label]
      this.currentValue = data[this.defaultProps.value]
      //const result = this.buildResultByNodeData(data)
      this.$emit('change', data.dictCode)
      this.closeSelect()
    },
  }
}
</script>

<style lang='scss' scoped>
</style>
