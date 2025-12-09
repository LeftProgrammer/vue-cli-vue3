<template>
  <div class="page-list">
    <table-layout title="进度模拟" :showPage="false" class="layout">
      <template slot="table">
        <bim-engine
          :cid="bimconfig.id"
          ref="bimEngine"
          @datainited="bimDataInited"
          @inited="bimInited"
        ></bim-engine>
      </template>
    </table-layout>

    <div class="pbstree-container" :class="{ hidden: !treeObj.show }">
      <div class="pbs-title">
        <span class="text">PBS目录树</span>
        <!--        <i class="icon" :class="{ 'icon-open': treeObj.show }" @click="treeObj.show=!treeObj.show"></i>-->
      </div>
      <el-tree
        ref="pbsTree"
        class="pbs-tree"
        node-key="code"
        :data="treeObj.data"
        :props="defaultProps"
        highlight-current
        :load="loadNode"
        lazy
        @node-click="handleTreeNodeClick"
      ></el-tree>
    </div>

    <div class="right-container">
      <div class="pbs-title">
        <!--        <i class="icon" :class="{ 'icon-open': countInfo.show }" @click="countInfo.show=!countInfo.show"></i>-->
        <span class="text">工程部位</span>
      </div>
      <div class="content">
        <div v-for="item in countInfo" :key="item.dictCode">
          <div :span="12" style="font-size: 13px">{{ item.dictName }}：{{ item.count }} 份</div>
        </div>
        <!-- <el-row style="margin-bottom: 10px">
          <el-col :span="12">设计图纸：{{ countInfo.sjtzNum }} 份</el-col>
          <el-col :span="12">设计报告：{{ countInfo.sjReportNum }} 份</el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="12">科研报告：{{ countInfo.kybgNum }} 份</el-col>
          <el-col :span="12">设计交底：{{ countInfo.sjjdNum }} 次</el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="12">设计变更：{{ countInfo.sjbgNum }} 次</el-col>
        </el-row> -->
      </div>
    </div>

    <div class="bottom-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="水电成果" name="6">
          <achievement-list
            ref="child6"
            pathForFlowInfo="/design/hydroStandard"
            :pbsCode="pbsCode"
          ></achievement-list>
        </el-tab-pane>
        <el-tab-pane label="营地成果" name="7">
          <achievement-list
            ref="child7"
            pathForFlowInfo="/design/campsiteMarker"
            :pbsCode="pbsCode"
            :pageType="2"
          ></achievement-list>
        </el-tab-pane>
        <el-tab-pane label="设计交底" name="4">
          <DesignDisclosure
            ref="child4"
            @relevancyBim="handleRelevancyBim"
            v-show="activeName === '4'"
            :pageType="'DesignApplication'"
            :pathForFlowInfo="'/design/DesignDisclosure'"
          ></DesignDisclosure>
        </el-tab-pane>
        <el-tab-pane label="设计变更" name="5">
          <changeApply
            ref="child5"
            @relevancyBim="handleRelevancyBim"
            v-show="activeName === '5'"
            :pageType="'DesignApplication'"
            :pathForFlowInfo="'/designChanges/changeApply'"
          ></changeApply>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import BimEngine from "@/components/BimEngine/index";
import { bimconfig } from "@/config/bimconfig";
import {
  designChangePage,
  designPage,
  explainPage,
  statisticsResultsType
} from "./api";
import { list as pbslist } from "@/views/project/pbs/api";
import AchievementList from "./components/AchievementSection.vue";
import DesignDisclosure from "../../design/DesignDisclosure/index.vue";
import changeApply from "../../designChanges/changeApply/index.vue";
import { getByCode } from "@/components/PbsSelect/api";

export default {
  name: "design-application",
  components: {
    TableLayout,
    BimEngine,
    DesignDisclosure,
    changeApply,
    AchievementList
  },
  data() {
    return {
      activeName: "6",
      /**树结构数据 */
      defaultProps: {
        children: "children",
        label: "name"
      },
      currentNodekey: "",
      treeObj: {
        data: [],
        show: true
      },
      //统计信息
      countInfo: [],
      countInfo2: {
        show: true,
        sjtzNum: 0,
        sjReportNum: 0,
        kybgNum: 0,
        sjjdNum: 0,
        sjbgNum: 0
      },
      /**查询条件 */
      query: {
        planId: "",
        planType: 0
      },
      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {},
      pbsCode: "",
      pbsName: "",

      //设计成果类型-营地标段
      sjcgYdbdCode: "cglx-ydbd",
      //设计成果类型-水电标段
      sjcgSdbdCode: "design_sjcglx"
    };
  },
  created() {
    this.countData();
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name;
      this.$nextTick(() => {
        this.searchTable();
      });
    },
    //初始化变量
    reset() {},
    /**获取列表数据 */
    loadNode(node, resolve) {
      if (!resolve) {
        this.treeObj.data = [];
      }
      let queryParams = {};
      if (node && node.data) {
        queryParams.pid = node.data.id;
      } else {
        queryParams.pid = 0;
      }
      pbslist(queryParams).then((res) => {
        if (res.success) {
          if (resolve) {
            resolve(res.data);
          }
        }
      });
    },
    /**
     * 树节点点击
     * 传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
     */
    handleTreeNodeClick(data, node, ve) {
      //展示进度数据
      console.log(data, node);
      this.countData(data);
      this.searchTable();
      //模型处理
      let bimCode = data.bimCode;
      if (bimCode) {
        // //通过code进行渲染
        this.$refs.bimEngine.render(bimCode);
      } else {
        // //设置bim高亮显示
        // this.$refs.bimEngine.setColor([]);
      }
    },
    searchTable() {
      if (this.activeName === "1") {
        this.$refs.child1.getTableData({}, this.pbsCode);
      } else if (this.activeName === "2") {
        this.$refs.child2.getTableData({}, this.pbsCode);
      } else if (this.activeName === "3") {
        this.$refs.child3.getTableData({}, this.pbsCode);
      } else if (this.activeName === "4") {
        this.$refs.child4.getTableData({}, this.pbsCode);
      } else if (this.activeName === "5") {
        this.$refs.child5.getTableData({}, this.pbsCode);
      } else if (this.activeName === "6") {
        this.$refs.child6.getTableData({}, this.pbsCode);
      } else if (this.activeName === "7") {
        this.$refs.child7.getTableData({}, this.pbsCode);
      }
    },
    /**重置数据*/
    initCountInfo() {
      this.countInfo = {
        show: true,
        projectName: "",
        planWorkList: []
      };
    },
    //模型加载后
    bimInited() {
      console.log("bimInited");
      //模型虚化
      if (this.$refs.bimEngine) {
        this.$refs.bimEngine.initModelAlpha();
      }
    },
    bimDataInited() {
      console.log("bimDataInited");
      this.reset();
    },
    handleRelevancyBim(pbsCode) {
      console.log("handleRelevancyBim", pbsCode);
      if (pbsCode) {
        this.currentNodekey = pbsCode;
        this.$nextTick(() => {
          this.$refs.pbsTree.setCurrentKey(this.currentNodekey); //一定要加这个选中了否则样式没有出来
          // 默认展开keys
          // this.defaultExpandedKeys = [highlightRect.nodeKey];
          this.$nextTick(() => {
            // 获取高亮节点
            let highlightNode = document.getElementsByClassName("is-current");
            if (highlightNode && highlightNode.length) {
              highlightNode[0].scrollIntoView();
            }
            // 统计信息关联显示
            this.countData({ code: pbsCode });
          });
        });
        getByCode(pbsCode).then((res) => {
          if (res.success) {
            if (res.data.bimCode) {
              //通过code进行渲染
              this.$refs.bimEngine.render(res.data.bimCode);
            } else {
              //设置bim高亮显示
              // this.$refs.bimEngine.setColor([]);
            }
          }
        });
      }
    },
    countData(data) {
      this.pbsCode = data?.code || "";
      this.pbsName = data?.name || "";
      this.countInfo = {};
      statisticsResultsType(this.pbsCode).then((res) => {
        if (res.success) {
          this.countInfo = res.data;
        }
      });
    },
    countData2(data) {
      this.pbsCode = data.code;
      this.pbsName = data.name;

      //设计图纸pageParams: {
      let pageParams = { entity: {}, current: 1, size: 1 };
      pageParams.entity.type = "1";
      pageParams.entity.pbsCode = this.pbsCode;
      designPage(pageParams).then((res) => {
        if (res.success) {
          this.countInfo.sjtzNum = res.data.total;
        }
      });
      //设计报告
      pageParams.entity.type = "2";
      designPage(pageParams).then((res) => {
        if (res.success) {
          this.countInfo.sjReportNum = res.data.total;
        }
      });
      //科研报告
      pageParams.entity.type = "3";
      designPage(pageParams).then((res) => {
        if (res.success) {
          this.countInfo.kybgNum = res.data.total;
        }
      });
      //设计交底
      explainPage(pageParams).then((res) => {
        if (res.success) {
          this.countInfo.sjjdNum = res.data.total;
        }
      });
      //设计变更
      designChangePage(pageParams).then((res) => {
        if (res.success) {
          this.countInfo.sjbgNum = res.data.total;
        }
      });
    }
  },
  computed: {
    /**表格树数据*/
    treeNodeMapComputed() {
      return JSON.parse(JSON.stringify(this.treeNodeMap));
      // 因为计算属性一开始就执行了一次,相当于在一开始就深拷贝拿到了oldvalue,改变之后又再一次深拷贝,每一次深拷贝生成的对象都是指向不同的地址,所以oldvalue和newvalue是两个不同的地址.
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.page-list {
  position: relative;
  height: 100%;
  width: 100%;

  // el-tree 选中项背景颜色
  ::v-deep
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    // 设置颜色
    background-color: #e6f9ff; // 背景色
    font-weight: bold; // 字体加粗

    .el-tree-node__label {
      color: #1298fa; // 节点的字体颜色
    }
  }

  // el-tree 悬浮样式
  ::v-deep .el-tree-node__content:hover {
    .el-tree-node__label {
      color: #5bacf8;
    }

    background-color: #e8f9ff;
  }

  // el-tree 鼠标聚焦样式
  ::v-deep .el-tree-node:focus > .el-tree-node__content {
    background-color: #ffffff;
  }
}

.layout {
  height: 100%;
}

/deep/ .model-list {
  display: none !important;
}

.pbstree-container {
  height: 50%;
  position: absolute;
  top: 0;
  min-width: 260px;
  background: #fff;
  padding: 15px;

  .pbs-title {
    height: 40px;
    line-height: 40px;
    background: #fff;
    font-size: 1.2rem;

    .icon {
      position: absolute;
      right: 10px;
      top: 28px;
      cursor: pointer;
    }
  }

  .icon {
    cursor: pointer;
    filter: invert(0.5);
    content: url("../../../../public/iconPic/levelOne.png");
  }

  .icon-open {
    transform: rotateZ(180deg);
  }

  .pbs-tree {
    height: calc(100% - 40px);
    overflow-y: auto;
  }

  &.hidden {
    width: 40px;

    .text {
      display: none;
    }

    .pbs-tree {
      display: none;
    }
  }
}

$sideBarWidth: 400px;

.right-container {
  height: calc(50% - 120px);
  position: absolute;
  top: 120px;
  right: 0;
  width: $sideBarWidth;
  background: #fff;
  padding: 15px;

  .icon {
    position: absolute;
    top: 18px;
    cursor: pointer;
    filter: invert(0.5);
    transform: rotateZ(-180deg);
    content: url("../../../../public/iconPic/levelOne.png");
  }

  .icon-open {
    transform: rotateZ(0deg);
  }

  .content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 10px;

    div {
      padding: 3px 5px;
    }
  }

  .text {
    font-size: 1.2rem;
    margin-left: 15px;
  }

  &.hidden {
    width: 40px;
    height: 50px;

    .text {
      display: none;
    }

    .content {
      display: none;
    }
  }
}

.bottom-container {
  height: 47%;
  padding: 15px;
  position: absolute;
  bottom: 0;
  width: calc(100% - 30px);
  background: #fff;

  ::v-deep {
    .el-tabs {
      height: 100%;

      .el-tabs__content {
        height: calc(100% - 40px - 15px);

        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
}

// // 1080p以下自适应样式
// @media screen and (max-width: 1440px) {
//   .bottom-container{
//     ::v-deep {
//       .el-tabs {
//         .el-tabs__content {
//           height: calc(100% + 15px);
//         }
//       }
//     }
//   }
// }
// // 1080p自适应样式
// @media screen and (min-width: 1441px) and (max-width: 1920px) {
//   .bottom-container{
//     ::v-deep {
//       .el-tabs {
//         .el-tabs__content {
//           height: calc(100% + 15px);
//         }
//       }
//     }
//   }
// }
</style>
