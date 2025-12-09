<template>
  <div>
    <el-input placeholder="请选择" v-model="bimCode" disabled>
      <template slot="append">
        <el-link type="primary" @click="choose" class="choosebtn"
          >选择
        </el-link>
      </template>
    </el-input>
    <!--BIM显示弹窗-->
    <el-dialog
      :title="'三维模型视图' + '（' + pbsCode + '）'"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      fullscreen
      @closed="closedHandle"
    >
      <vue-splitpane split="vertical" :min-percent="20" :default-percent="30">
        <template slot="paneL">
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            row-key="glid"
            :header-cell-style="{ background: '#fafafa' }"
            border
            :expand-row-keys="expandRowKeys"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @select="selectFun"
            @select-all="selectAllFun"
          >
            <el-table-column
              type="selection"
              width="45"
              :reserve-selection="true"
            />
            <el-table-column
              type
              prop="glid"
              label="BIM模型编码"
              width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="name"
              label="BIM模型名称"
              show-overflow-tooltip
            />
          </el-table>
        </template>
        <template slot="paneR">
          <bim-engine ref="bimEngine" @LoadComplete="LoadComplete" />
        </template>
      </vue-splitpane>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmHandle"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BimEngine from '@/components/BimEngine/index'
import VueSplitpane from 'vue-splitpane'
import { bimTree } from './api'
export default {
  name: 'BimSelectComp',
  model: {
    prop: 'bimCode',
    event: 'change'
  },
  components: {
    BimEngine,
    VueSplitpane
  },
  data() {
    return {
      /**弹窗显示 */
      dialogShow: false,
      /**是否点击确认 */
      isConfirm: false,

      /**左侧列表数据 */
      tableData: [],

      //默认原始传入的值
      bimCodeChild: [],
      //默认展开行
      expandRowKeys: [],
      modelList: []
    }
  },
  props: {
    /**已经选中pbs对应的bim构件信息 */
    bimCode: {
      type: String,
      default: ''
    },
    /**对应pbsCode */
    pbsCode: {
      type: String,
      default: ''
    },
    /**已经选中pbs信息 */
    cid: {
      type: String,
      default: ''
    },
    /**是否只读 */
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  watch: {
    dialogShow: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.isConfirm = false
          if (this.bimCode) {
            this.bimCodeChild = this.bimCode.split('#')
          } else {
            this.bimCodeChild = []
          }
        }
      },
      immediate: true,
      deep: true
    },
    bimCode: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.bimCodeChild = newValue.split('#')
        } else {
          this.bimCodeChild = []
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    // 模型加载完成后
    LoadComplete(api, modelList) {
      this.modelList = modelList
      this.loadNode()
      this.$refs.bimEngine.setModelAlpha(0.1)
    },
    findParentsOptimized(ids) {
      // 第一步：建立子节点到父节点的映射表
      const childToParent = new Map()
      const stack = [...this.tableData]

      while (stack.length) {
        const node = stack.pop()
        if (node.children) {
          for (const child of node.children) {
            childToParent.set(child.glid, node.glid)
            stack.push(child)
          }
        }
      }

      // 第二步：收集所有父级ID并去重
      const parentIds = new Set() // 使用Set自动去重
      const idSet = new Set(ids) // 输入ID转为Set提高查找效率

      for (const id of ids) {
        if (!idSet.has(id)) continue // 确保只处理输入ID

        let currentId = childToParent.get(id)
        while (currentId !== undefined) {
          parentIds.add(currentId) // Set会自动去重
          currentId = childToParent.get(currentId)
        }
      }

      return Array.from(parentIds)
    },
    setSelectedRows(ids) {
      this.traverseTree(this.tableData, (node) => {
        if (ids.includes(node.glid)) {
          this.$refs.multipleTable.toggleRowSelection(node, true)
        }
      })
    },

    // 遍历树形数据的方法
    traverseTree(nodes, callback) {
      nodes.forEach((node) => {
        callback(node)
        if (node.children && node.children.length) {
          this.traverseTree(node.children, callback)
        }
      })
    },
    /** 获取所有树数据 */
    async loadNode() {
      // 从根节点开始获取所有数据
      this.modelList.forEach(async (x) => {
        const data = await this.loadAllTreeData(x.name)
        this.tableData.push({
          children: data[0].children,
          externalId: '0',
          id: x.id,
          glid: x.name,
          name: x.docName,
          level: -1,
          pGlid: -1
        })
      })
      this.expandRowKeys = this.findParentsOptimized(this.bimCodeChild)
      this.setSelectedRows(this.bimCodeChild)
    },
    /** 递归获取所有子树数据 */
    async loadAllTreeData(modelName, id) {
      // 1. 获取当前节点数据
      const nodeData = await this.fetchNodeData(modelName, id)

      // 2. 对每个节点，如果有子节点则递归获取
      for (const item of nodeData) {
        if (item.externalId === '0') {
          // 假设这是判断是否有子节点的条件
          item.children = await this.loadAllTreeData(modelName, item.glid)
        }
      }

      return nodeData
    },
    /** 获取节点数据方法保持不变 */
    fetchNodeData(modelName, id) {
      return new Promise((resolve) => {
        bimTree({
          Pid: id || '',
          LightweightName: modelName
        }).then((res) => {
          resolve(res.datas)
        })
      })
    },
    /**列表选中时触发 */
    selectFun(selection, row) {
      this.$refs.bimEngine.setModelAlpha(0.2)
      this.bimCodeChild = selection.map((x) => x.glid)
      if (!selection.find((x) => x.glid == row.glid)) {
        this.$refs.bimEngine.setFeatureAlpha(row.glid, 0.2)
        this.$refs.bimEngine.clearBOX23line()
      } else {
        // this.$refs.bimEngine.zoomTo(row.glid);
        this.$refs.bimEngine.setFeatureAlpha(row.glid, 1)
      }
    },

    selectAllFun(selection) {
      console.log('🚀 ~ selectAllFun ~ selection:', selection)
    },

    /**确定时 */
    confirmHandle() {
      // console.log("confirmHandle")
      this.dialogShow = false
      this.isConfirm = true
      console.log(
        `🚀 ~ confirmHandle ~  this.bimCodeChild.join("#"):`,
        this.bimCodeChild.join('#')
      )
      this.$emit('update:bimCode', this.bimCodeChild.join('#'))
      // this.$emit("change", this.bimCodeChild.join("#"));
    },
    //选择
    choose() {
      this.tableData = []
      this.dialogShow = true
      this.$nextTick(() => {
        this.$refs.bimEngine.InitEngine('pbsBim')
      })
    },
    //关闭时
    closedHandle() {
      if (!this.isConfirm) {
        this.bimCodeChild = []
        this.dialogShow = false
        this.$emit('closed')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.choosebtn {
  height: 100%;
  width: 100%;
  cursor: pointer;
  display: block;
}

::v-deep .el-dialog__body {
  height: calc(100% - 45px - 57px);
}

::v-deep .splitter-pane {
  .el-table {
    height: 100%;

    .el-table__body-wrapper {
      height: calc(100% - 40px);
      overflow-y: auto;
    }
  }
}

::v-deep .indeterminate {
  .el-checkbox__input {
    .el-checkbox__inner {
      background-color: #409eff !important;
      border-color: #409eff !important;
      color: #fff !important;
    }

    .el-checkbox__inner::after {
      content: '';
      position: absolute;
      display: block;
      background-color: #fff;
      height: 2px;
      transform: scale(0.5);
      left: 0;
      right: 0;
      top: 5px;
      width: auto !important;
    }
  }
}

// .indeterminate .el-checkbox__input .el-checkbox__inner {
//   background-color: #f2f6fc;
//   border-color: #dcdfe6;
// }

.el-checkbox__inner {
  display: block !important;
}

.el-checkbox {
  display: block !important;
}
</style>
