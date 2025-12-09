<template>
  <div class="page-list" id="popmenu">
    <content-layout :showHeader="true" :showPage="false" :defaultPercent="20">
      <template slot="headerrow">
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addHandle('001')"
              :disabled="btnDisabledObj.jzw"
            >
              建筑物
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addHandle('002')"
              :disabled="btnDisabledObj.fbjg"
            >
              分部结构
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addHandle('003')"
              :disabled="btnDisabledObj.xbjg"
            >
              细部结构
            </el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addHandle('004')"
              :disabled="btnDisabledObj.fl"
            >
              分类
            </el-button>
          </el-col>
        </el-row>
      </template>
      <!-- <template slot="tree">
        <div class="tree-content">
          <div class="tree-title" @click="handleTreeNodeClick({ id: '0' })">
            PBS（工程部位）
          </div>
          <el-tree
            class="tree-dom"
            ref="pbsTree"
            node-key="id"
            :data="treeData"
            :props="defaultProps"
            :load="loadNode"
            highlight-current
            lazy
            :expand-on-click-node="false"
            @node-click="handleTreeNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <el-tooltip
                class="item"
                effect="dark"
                :content="node.label"
                placement="top-start"
              >
                <span class="node-label">
                  {{ node.label }}
                </span>
              </el-tooltip>

              <span class="command-content" v-if="data.id != '0'">
                <el-dropdown
                  @command="
                    (command) => {
                      handleCommand(command, data, node);
                    }
                  "
                >
                  <span>
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </div>
      </template> -->
      <template slot="table">
        <div class="table-content">
          <div class="tree-content">
            <el-tree
              class="tree-dom"
              ref="pbsTree"
              node-key="id"
              :data="treeData"
              :props="defaultProps"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleTreeNodeClick"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="node.label"
                  placement="top-start"
                >
                  <span class="node-label">
                    {{ node.label }}
                  </span>
                </el-tooltip>

                <span class="command-content">
                  <el-dropdown
                    @command="
                      (command) => {
                        handleCommand(command, data, node);
                      }
                    "
                  >
                    <span>
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </span>
            </el-tree>
          </div>
          <div class="bim-content">
            <bim-engine
              :cid="bimconfig.id"
              ref="bimEngine"
              @inited="bimInited"
              @modelLoadAfterHandle="modelLoadAfterHandle"
            ></bim-engine>
          </div>

          <div class="form-content">
            <el-table :data="fieldTableData" border style="width: 100%">
              <el-table-column prop="propertyname" label="属性名称"> </el-table-column>
              <el-table-column prop="value" label="属性值"> </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </content-layout>

    <dataform
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      @closed="closedDialog"
      @ok="saveAfter"
    ></dataform>
  </div>
</template>

<script>
import { remove, bimTree, bimProperty } from "./api";
import enums from "@/config/enums";
import { bimconfig } from "@/config/bimconfig";
import { dateFormat } from "@/utils";
import { BaseMixin } from "@/mixins/BaseMixin";
import ContentLayout from "@/components/ContentLayout/TreeTable";
import dataform from "./components/dataform";
import BimEngine from "@/components/BimEngine/index";
// /**
//      * 单体建筑物
//      */
//     DTJZW("001"),
//     /**
//      *  分部结构
//      */
//     FBJG("002"),
//     /**
//      *  细部结构
//      */
//     XBJG("003");

//     public String type;
export default {
  name: "project-pbs",
  mixins: [BaseMixin],
  components: {
    ContentLayout,
    dataform,
    BimEngine
  },
  data() {
    return {
      /**新增按钮是否可以 */
      btnDisabledObj: {
        /**建筑物 */
        jzw: false,
        /**分部结构 */
        fbjg: true,
        /**细部结构 */
        xbjg: true,
        /**分类 */
        fl: false
      },
      /**属性列表 */
      fieldTableData: [],
      /**当前选择树节点 */
      currentTreeData: {},
      currentTreeNode: {},
      oprateRow: {
        /** 信息弹窗*/
        dialogShow: false,
        /**当前行数据 */
        data: {},
        /**是否是查看 */
        isView: false
      },

      /**树结构默认属性 */
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeData: [],
      /**请求参数 */
      queryParams: { pid: 0 },
      url: { list: "/api/project/section/page" },

      /**层级 */
      pbsLayerOptions: enums.PBS_LAYER_ENUM,
      /**类型 */
      pbsTypeOptions: enums.PBS_TYPE_ENUM,

      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {}
    };
  },
  computed: {},
  created() {
    this.initTree();
  },
  mounted() {
    // 默认阻止右键事件冒泡
    this.$nextTick(() => {
      document.oncontextmenu = () => {
        return false;
      };
    });
  },
  methods: {
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    // 模型加载完成后
    modelLoadAfterHandle(model, datas, engine) {
      //设置模型虚化
      engine.initModelAlpha(model.modelid);
    },
    //模型加载后
    bimInited() {
      //隐藏相关构件
      this.$refs.bimEngine.setItemVisible(["1956081757168"], false);
      //设置模型虚化
      this.$refs.bimEngine.initModelAlpha();
    },
    /**初始化 */
    initTree() {
      this.treeData = [];
      this.loadNode();
    },
    removeTreeNode(node, data) {
      const parent = node.parent;
      const children = parent.childNodes || [];
      const index = children.findIndex((d) => d.data.id === data.id);
      if (index >= 0) {
        children.splice(index, 1);
      }
    },
    appendTreeNode(data) {
      this.$message.error("appendTreeNode方法中代码id未被定义，已被注释");
      //
      // const newChild = { id: id++, label: "testtest", children: [] };
      // if (!data.children) {
      //   this.$set(data, "children", []);
      // }
      // data.children.push(newChild);
    },

    /**保存成功以后 */
    saveAfter(data) {
      //判断是新增还是编辑，树上能不能直接处理好
      // this.initTree();
      console.log("this.currentTreeData", this.currentTreeData, data);
      if (this.currentTreeNode && this.currentTreeData.id === data.id) {
        //编辑
        this.currentTreeNode.data = { ...data };
      } else {
        //新增
        if (data.pid === "0") {
          this.$refs.pbsTree.append(data);
        } else {
          this.$refs.pbsTree.append(data, this.currentTreeData);
          this.currentTreeNode.isLeaf = false;
          this.$forceUpdate();
        }
      }
    },
    /**树节点操作 */
    handleCommand(command, data, node) {
      console.log("handleCommand", command, data);
      if (command === "edit") {
        this.oprateRow.dialogShow = true;
        data.pName = node.parent.data.name;
        data.pSectionId = node.parent.data.sectionId;
        this.oprateRow.data = data;
      }
      if (command === "delete") {
        this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning"
        })
          .then(() => {
            remove({ id: data.id }).then((res) => {
              if (res.success) {
                this.removeTreeNode(node, data);
                this.$message.success("删除成功");
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {});
      }
    },
    /** 获取所有树数据 */
    async loadNode() {
      // 从根节点开始获取所有数据
      this.treeData = await this.loadAllTreeData();
    },

    /** 递归获取所有子树数据 */
    async loadAllTreeData(id) {
      // 1. 获取当前节点数据
      const nodeData = await this.fetchNodeData(id);

      // 2. 对每个节点，如果有子节点则递归获取
      for (const item of nodeData) {
        if (item.externalId === "0") {
          // 假设这是判断是否有子节点的条件
          item.children = await this.loadAllTreeData(item.glid);
        }
      }

      return nodeData;
    },

    /** 获取节点数据方法保持不变 */
    fetchNodeData(id) {
      return new Promise((resolve) => {
        bimTree({
          Pid: id || "",
          LightweightName: "5256654945835191723"
        }).then((res) => {
          resolve(res.datas);
        });
      });
    },
    /**查找树*/
    treeFind(tree, func) {
      for (const data of tree) {
        if (func(data)) return data;
        if (data.children) {
          const res = this.treeFind(data.children, func);
          if (res) return res;
        }
      }
      return null;
    },
    /**判断分类是否有建筑物父级*/
    flHasJzwParent(node) {
      if (node.pid === "0") return false;
    },
    /**
     * 树节点点击
     * 传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
     */
    handleTreeNodeClick(data, node, ve) {
      this.$refs.bimEngine.api.Feature.zoomTo(
        "3a192a82-9466-a292-8181-ed0f6347a3d8" + "^" + data.glid,
        "3a192a82-9466-a292-8181-ed0f6347a3d8",
        true,
        1
      );
      bimProperty({
        ExternalId: data.glid,
        LightweightName: "5256654945835191723"
      }).then((res) => {
        this.fieldTableData = res.datas;
      });
    },
    /**模型处理 */
    bimHandle(bimCode) {
      let modelid;
      if (bimCode && bimCode.indexOf("^") > 0) {
        modelid = bimCode.split("^")[0];
        this.$refs.bimEngine.location(modelid);
      }
      //通过code进行渲染
      this.$refs.bimEngine.render(bimCode);
    },
    /**设置新增按钮是否可点击 */
    setAddBtnDisabled(data) {
      console.log(this.treeData);
      //根节点
      if (data.id === "0") {
        this.btnDisabledObj.jzw = false;
        this.btnDisabledObj.fbjg = true;
        this.btnDisabledObj.xbjg = true;
        this.btnDisabledObj.fl = false;
      }
      //建筑物
      if (data.pbsLayer === "001") {
        this.btnDisabledObj.jzw = true;
        this.btnDisabledObj.fbjg = false;
        this.btnDisabledObj.xbjg = false;
        this.btnDisabledObj.fl = false;
      }
      //分部结构
      if (data.pbsLayer === "002") {
        this.btnDisabledObj.jzw = true;
        this.btnDisabledObj.fbjg = false;
        this.btnDisabledObj.xbjg = false;
        this.btnDisabledObj.fl = false;
      }
      //细部结构
      if (data.pbsLayer === "003") {
        this.btnDisabledObj.jzw = true;
        this.btnDisabledObj.fbjg = true;
        this.btnDisabledObj.xbjg = true;
        this.btnDisabledObj.fl = true;
      }
      //分类
      if (data.pbsLayer === "004") {
        this.btnDisabledObj.jzw = false;
        this.btnDisabledObj.fbjg = false;
        this.btnDisabledObj.xbjg = true;
        this.btnDisabledObj.fl = false;
      }
    },
    /**新增 */
    addHandle(layer) {
      let data = this.currentTreeData;
      console.log("addHandle data", data);
      this.oprateRow.data = {
        pid: data.id,
        pbsLayer: layer,
        sectionId: data.sectionId,
        pSectionId: data.sectionId,
        pName: data.name
      };
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    /** 删除*/
    deleteHandle(row) {
      remove({
        id: row.id
      }).then((res) => {
        if (!res.success) {
          return this.$message.error("删除失败：" + res.message);
        }
        this.$message.success("删除成功");
        this.getTableData();
      });
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      // const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      let data = [];
      // console.log("enums.FLOW_STATUS_ENUM", enums.FLOW_STATUS_ENUM);
      let options = enums.FLOW_STATUS_ENUM;
      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name
        });
      }
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;

  // el-tree 选中项背景颜色
  ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    // 设置颜色
    background-color: #e6f9ff; // 背景色
    font-weight: bold; // 字体加粗

    .node-label {
      color: #1298fa; // 节点的字体颜色
    }
  }

  // el-tree 悬浮样式
  ::v-deep .el-tree-node__content:hover {
    .node-label {
      color: #5bacf8;
    }

    background-color: #e8f9ff;
  }

  // el-tree 鼠标聚焦样式
  ::v-deep .el-tree-node:focus > .el-tree-node__content {
    background-color: #ffffff;
  }

  .tree-title {
    margin: 5px;
    cursor: pointer;
  }

  .tree-content {
    height: 100%;
    border: 1px solid #eee;

    .tree-dom {
      margin: 10px;
      margin-left: 0px;
      height: calc(100% - 40px);
      overflow-y: auto;
    }
  }

  .custom-tree-node {
    width: 100%;
    display: flex;
    justify-content: space-between;

    //&:hover {
    //  .command-content {
    //    display: block;
    //  }
    //}

    .node-label {
      width: calc(100% - 40px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .command-content {
      position: absolute;
      right: 0px;
      z-index: 1;
      display: none;
    }

    .el-icon-more {
      transform: rotate(90deg);
    }
  }

  .table-content {
    width: 100%;
    height: calc(100% - 10px);
    position: relative;
    display: flex;
    .tree-content {
      width: 20%;
    }
    .bim-content {
      border: 1px solid #eee;
      width: 60%;
      margin: 0px 10px 10px 10px;
      border-right: 1px solid #eee;
    }

    .form-content {
      margin: 0px 10px 10px 0px;
      border: 1px solid #eee;
      width: 20%;
    }
  }
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}

/deep/ .el-tree-node:focus > .el-tree-node__content {
  background-color: white !important;
}
</style>
