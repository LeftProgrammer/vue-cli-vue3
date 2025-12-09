<template>
  <div>
    <el-input placeholder="请选择" v-model="bimCodeChild" disabled>
      <template slot="append">
        <el-link type="primary" @click="choose" class="choosebtn">选择</el-link>
      </template>
    </el-input>
    <!--BIM显示弹窗-->
    <el-dialog :title="'三维模型视图' + '（' + pbsCode + '）'" custom-class="wbench-el-dialog" :visible.sync="dialogShow"
      :destroy-on-close="true" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body fullscreen
      @closed="closedHandle">
      <vue-splitpane split="vertical" :min-percent="20" :default-percent="30">
        <template slot="paneL">
          <el-table ref="multipleTable" :data="tableData" style="width: 100%" row-key="glid"
            :row-class-name="rowClassNameFun" :header-row-class-name="headerRowClassName"
            :header-cell-style="{ background: '#fafafa' }" border lazy :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @select="selectFun"
            @select-all="selectAllFun">
            <el-table-column type="selection" width="45"> </el-table-column>
            <el-table-column type prop="code" label="BIM模型编码" width="320" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content">{{ scope.row.code }}</div>
                  <span>{{ scope.row.code }}</span>
                </el-tooltip>
              </template> -->
            </el-table-column>
            <el-table-column prop="name" label="BIM模型名称" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content">{{ scope.row.name }}</div>
                  <span>{{ scope.row.name }}</span>
                </el-tooltip>
              </template> -->
            </el-table-column>
          </el-table>
        </template>
        <template slot="paneR">
          <bim-engine ref="bimEngine" v-if="dialogShow" :cid="cid || bimconfig.id" @inited="bimInited"
            @pick="pickHandle"></bim-engine>
        </template>
      </vue-splitpane>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmHandle"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BimEngine from "@/components/BimEngine/index";
import { bimconfig } from "@/config/bimconfig";
import VueSplitpane from "vue-splitpane";
import { debounce } from '@/common/js/base' // 引入防抖函数
// import { list } from "./api";
export default {
  name: "BimSelectComp",
  model: {
    prop: "bimCode",
    event: "change",
  },
  components: {
    BimEngine,
    VueSplitpane,
  },
  data() {
    return {
      /**当前行 */
      currentRow: {},
      /**弹窗显示 */
      dialogShow: false,
      /**请求参数 */
      queryParams: { pid: 0 },

      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {},

      /**左侧列表数据 */
      tableData: [],
      //一级目录数据
      oneLevelDataIsSelect: [],
      //选中情况执行状态
      selectedFinish: false,

      /**左侧列表选中项 */
      multipleSelection: [],
      autoLoaded: false,
      treeNodeMap: new Map(),
      bimCodeChild: this.bimCode,
      pin: false,
      shiftRecordNode: {
        start: '',
        end: '',
      }
    };
  },
  props: {
    /**已经选中pbs对应的bim构件信息 */
    bimCode: {
      type: String,
      default: "",
    },
    /**对应pbsCode */
    pbsCode: {
      type: String,
      default: "",
    },
    /**已经选中pbs信息 */
    cid: {
      type: String,
      default: "",
    },
    /**是否只读 */
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**bimCode切分成的数组 */
    bimCodes() {
      if (this.bimCodeChild) {
        return this.bimCodeChild.split(",");
      }
      return [];
    },
    /**表格树数据*/
    treeNodeMapComputed() {
      return JSON.parse(JSON.stringify(this.treeNodeMap))
      // 因为计算属性一开始就执行了一次,相当于在一开始就深拷贝拿到了oldvalue,改变之后又再一次深拷贝,每一次深拷贝生成的对象都是指向不同的地址,所以oldvalue和newvalue是两个不同的地址.
    },
  },
  watch: {
    // bimCode: {
    //   handler(newValue) {},
    //   immediate: true,
    //   deep: true,
    // },
  },
  mounted() {
    window.addEventListener('keydown', code => this.handleKeyDown(code)) // 监听键盘按下事件
    window.addEventListener('keyup', code => this.handleKeyUp(code)) // 监听键盘松开事件
  },
  beforeDestroy() {
    // 销毁监听键盘事件
    window.removeEventListener('keydown', code => this.handleKeyDown(code))
    window.removeEventListener('keyup', code => this.handleKeyUp(code))
  },
  methods: {
    // 监听按下键盘事件
    handleKeyDown: debounce(function (code) {
      console.log(code)
      if (code.keyCode === 16 && code.shiftKey) { // 判断是否按住shift键，是就把pin赋值为true
        this.pin = true
      }
    }, 500, true),
    handleKeyUp: debounce(function (code) {
      if (code.keyCode === 16) { // 判断是否松开shift键，是就把pin赋值为false
        this.pin = false
      }
    }, 500, true),
    /**树加载 */
    load(treeData, treeNode, resolve) {
      // console.log("load tree", treeData, treeNode);
      if (!resolve) {
        let modelList = this.$refs.bimEngine.modelList.sort((a, b) => {
          return a.name - b.name;
        });
        // console.log("modelList", modelList);
        let rows = [];
        let reqArr = [];
        this.tableData = [];
        for (let i = 0; i < modelList.length; i++) {
          const model = modelList[i];
          let query = {
            modelid: model.id,
            modelname: model.name,
            Pid: "RootNode",
            LightweightName: model.name,
          };
          // item.modelname = query.modelname;
          // item.modelid = query.modelid;
          // reqArr.push(this.$refs.bimEngine.getFloorStructureTree(item));
          // reqArr.push(this.$store.dispatch("bim/getFloorStructure", data));
          //一级一级请求
          this.$store.dispatch("bim/getFloorStructure", query).then((res) => {
            // console.log("getFloorStructure_res", JSON.stringify(res));
            if (res && res.length > 0) {
              for (let j = 0; j < res.length; j++) {
                let row = res[j];
                row._id = row.id;
                row.id = row.glid;
                row.isSelect = false; //默认为不选中
                row.parentId = 0; //设置父级id
                row._name = row.name;
                if (row.externalId === "0") {
                  row.hasChildren = true;
                } else {
                  //构件级别
                }
                if (row._name && row._name.indexOf("|") >= 0) {
                  row.code = row._name.split("|")[0];
                  row.name = row._name.split("|")[1];
                }
                if (!row.code) {
                  row.code = row.glid;
                }
                this.tableData.push(row);
              }
            }
          });
        }
        // 懒加载树数据赋值
        this.treeNodeMap = this.$refs.multipleTable.store.states.lazyTreeNodeMap;
      } else {
        let selectRows = [];

        let item = {
          name: treeData.modelname,
          id: treeData.modelid,
          modelid: treeData.modelid,
          modelname: treeData.modelname,
        };
        if (treeData.glid) {
          item.Pid = treeData.glid;
        }
        this.$refs.bimEngine.getFloorStructureTree(item).then((res) => {
          let rows = [];
          if (res && res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              let row = res[i];
              row._id = row.id;
              row.id = row.glid;
              row.isSelect = false; //默认为不选中
              row.parentId = treeData.id; //设置父级id
              row.modelname = item.name;
              row.modelid = item.id;
              row._name = row.name;
              if (row.externalId == "0") {
                row.hasChildren = true;
              } else {
                //构件级别
              }
              if (row._name && row._name.indexOf("|") >= 0) {
                row.code = row._name.split("|")[0];
                row.name = row._name.split("|")[1];
              }
              if (!row.code) {
                row.code = row.glid;
              }

              // if (this.bimCodes.includes(row.code) || treeData.isSelect) {
              //   selectRows.push(row);
              //   row.isSelect = true;
              // }
              rows.push(row);
            }
          }
          //列表选中状态
          // this.$nextTick(() => {
          //   if (selectRows && selectRows.length > 0) {
          //     selectRows.forEach((row) => {
          //       this.$refs.multipleTable.toggleRowSelection(row);
          //     });
          //   }
          // });
          // treeNode.children = [...rows];
          // treeData.children = [...rows];
          let treeDataGrid = treeData.id;
          let result = this.treeFind(this.tableData, node => node.id === treeDataGrid)
          result.children = [...rows];
          // this.$set(treeData,'children',[...rows]);
          resolve(rows);
        });
      }
    },
    /**查找树*/
    treeFind(tree, func) {
      for (const data of tree) {
        if (func(data)) return data
        if (data.children) {
          const res = this.treeFind(data.children, func)
          if (res) return res
        }
      }
      return null
    },
    /**确定时 */
    confirmHandle() {
      this.dialogShow = false;
      // let codes = this.multipleSelection.map((x) => x.code);
      this.$emit("change", this.bimCodeChild);
    },
    /**列表选中时触发 */
    selectFun(val, row) {
      this.selectedFinish = false;
      console.log("selectFun", val, row);
      if (this.pin) {
        this.shiftRecordNode.end = row;
        this.selectOnShift();
      } else {
        this.shiftRecordNode.start = row;
      }
      // this.setRowIsSelect(row);
      // console.log('--开始自动加载所有子集--')
      // 自动加载所有子集
      this.autoLoadChildren(row, val);
      // console.log('--结束自动加载所有子集--')
      //获取所有选中的行
      // this.selectedFinish = true;
      // //调用模型相关处理
      // let allitems = this.getLowestItems(this.tableData);
      // let selection = this.getSelection(this.tableData); //allitems.filter((x) => x.isSelect);
      // this.handleSelectionChange(selection, allitems);

    },
    /** shift选中 */
    selectOnShift() {
      console.log(this.shiftRecordNode)
      if (this.shiftRecordNode.start && this.shiftRecordNode.end) {
        // todo 选中时只是把子集的bimCode加上，不自动加载子集，展开子集时再进行判断，在bimCode里的自动勾选
        console.log(this.tableData)

        // 处理完成后重置
        this.shiftRecordNode.end = '';
      }
    },
    /** 自动加载所有子集 */
    autoLoadChildren(row, val) {
      let treeData = this.$refs.multipleTable.store.states.treeData;
      let data = treeData[row.id];
      let thiss = this;

      // 选中事件
      let handSelect = function (row, thiss) {
        thiss.setRowIsSelect(row);
        //获取所有选中的行
        thiss.selectedFinish = true;
        //调用模型相关处理
        let allitems = thiss.getLowestItems(thiss.tableData);
        let selection = thiss.getSelection(thiss.tableData); //allitems.filter((x) => x.isSelect);
        thiss.handleSelectionChange(selection, allitems);
      }

      // 已经展开过的无需再次加载，直接设置选中
      if ((data && data.loaded) || !data) {
        handSelect(row, thiss);
      } else {
        // 监听数据treeNodeMapComputed是否发生变化，变化时同步自动加载子集
        const unwatch = this.$watch(
          'treeNodeMapComputed',
          (newValue, oldValue) => {
            // 开始加载的标记
            this.autoLoaded = false;
            if (newValue) {
              Object.keys(newValue).forEach(key => {
                if ((oldValue && !(key in oldValue)) || !oldValue) {
                  // treeNodeMap里新增加的数据
                  if (key) {
                    let children = newValue[key];
                    for (let i = 0; i < children.length; i++) {
                      if (children[i].hasChildren) {
                        // 等待dom页面刷新后触发，继续加载子集
                        this.$nextTick(() => {
                          thiss.$refs.multipleTable.store.loadOrToggle(children[i]);
                        })
                        this.autoLoaded = true;
                      }
                    }
                  }
                }
              })
            }
            // 无子集加载时结束监听
            if (!this.autoLoaded) {
              if (unwatch) unwatch();
              // console.log("结束")
              handSelect(row, thiss);
            } else {
              // console.log("还有子集")
            }
          },
          {
            deep: true
          }
        )
      }


      this.$refs.multipleTable.store.loadOrToggle(row)
    },
    getLowestItems(alldatas) {
      let allitems = [];
      if (alldatas && alldatas.length > 0) {
        let pdatas = alldatas.filter(
          (x) => x.children && x.children.length > 0
        );
        for (let i = 0; i < pdatas.length; i++) {
          const pdata = pdatas[i];
          allitems.push(...this.getSelection(pdata.children));
        }
        let cdatas = alldatas.filter((x) => !x.children);
        allitems.push(...cdatas);
      }
      return allitems;
    },
    getSelection(alldatas) {
      let allselected = [];
      if (alldatas && alldatas.length > 0) {
        let pdatas = alldatas.filter(
          (x) => x.children && x.children.length > 0
        );
        for (let i = 0; i < pdatas.length; i++) {
          const pdata = pdatas[i];
          allselected.push(...this.getSelection(pdata.children));
        }
        let cdatas = alldatas.filter((x) => !x.children && x.isSelect);
        allselected.push(...cdatas);
      }
      return allselected;
    },
    setRowIsSelect(row) {
      // let treeData = this.$refs.multipleTable.store.states.treeData;
      //当点击父级点复选框时，当前的状态可能为未知状态，所以当前行状态设为false并选中，即可实现子级点全选效果
      if (row.isSelect === "") {
        row.isSelect = false;
        this.$refs.multipleTable.toggleRowSelection(row, true);
      }
      row.isSelect = !row.isSelect;
      let that = this;

      function selectAllChildrens(data) {
        data.forEach((item) => {
          item.isSelect = row.isSelect;
          that.$refs.multipleTable.toggleRowSelection(item, row.isSelect);
          if (item.children && item.children.length) {
            selectAllChildrens(item.children);
          }
        });
      }

      function getSelectStatus(selectStatuaArr, data) {
        if (data && data.length) {
          data.forEach((childrenItem) => {
            selectStatuaArr.push(childrenItem.isSelect);
            getSelectStatus(selectStatuaArr, childrenItem.children);
          });
        }
        return selectStatuaArr;
      }
      function getLevelStatus(row) {
        //如果当前节点的parantId =0 并且有子节点，则为1
        //如果当前节点的parantId !=0 并且子节点没有子节点 则为3
        if (row.parentId == 0) {
          if (row.children && row.children.length) {
            return 1;
          } else {
            return 4;
          }
        } else {
          if (!row.children || !row.children.length) {
            return 3;
          } else {
            return 2;
          }
        }
      }
      let result = {};
      //获取明确的节点
      function getExplicitNode(data, parentId) {
        data.forEach((item) => {
          if (item.id == parentId) {
            result = item;
          }
          if (item.children && item.children.length) {
            getExplicitNode(item.children, parentId);
          }
        });
        return result;
      }
      function operateLastLeve(row) {
        //操作的是子节点  1、获取父节点  2、判断子节点选中个数，如果全部选中则父节点设为选中状态，如果都不选中，则为不选中状态，如果部分选择，则设为不明确状态
        let selectStatuaArr = [];
        let item = getExplicitNode(that.tableData, row.parentId);
        selectStatuaArr = getSelectStatus(selectStatuaArr, item.children);
        if (
          selectStatuaArr.every((selectItem) => {
            return true == selectItem;
          })
        ) {
          item.isSelect = true;
          that.$refs.multipleTable.toggleRowSelection(item, true);
        } else if (
          selectStatuaArr.every((selectItem) => {
            return false == selectItem;
          })
        ) {
          item.isSelect = false;
          that.$refs.multipleTable.toggleRowSelection(item, false);
        } else {
          item.isSelect = "";
        }
        //则还有父级
        if (item.parentId != 0) {
          operateLastLeve(item);
        }
      }
      //判断操作的是子级点复选框还是父级点复选框，如果是父级点，则控制子级点的全选和不全选

      //1、只是父级 2、既是子集，又是父级 3、只是子级
      let levelSataus = getLevelStatus(row);
      if (levelSataus == 1) {
        selectAllChildrens(row.children);
      } else if (levelSataus == 2) {
        selectAllChildrens(row.children);
        operateLastLeve(row);
      } else if (levelSataus == 3) {
        operateLastLeve(row);
      }
    },

    selectAllFun(selection) {
      let isAllSelect = this.checkIsAllSelect();
      this.tableData.forEach((item) => {
        item.isSelect = isAllSelect;
        this.$refs.multipleTable.toggleRowSelection(item, !isAllSelect);
        this.selectFun(selection, item);
      });
    },

    checkIsAllSelect() {
      this.oneLevelDataIsSelect = [];
      this.tableData.forEach((item) => {
        this.oneLevelDataIsSelect.push(item.isSelect);
      });
      //判断一级数据是否是全选.如果一级数据全为true，则设置为取消全选，否则全选
      let isAllSelect = this.oneLevelDataIsSelect.every((selectStatusItem) => {
        return true == selectStatusItem;
      });
      return isAllSelect;
    },

    rowClassNameFun({ row }) {
      if (row.isSelect === "") {
        return "indeterminate";
      }
    },
    headerRowClassName({ row }) {
      let oneLevelDataIsSelect = [];
      this.tableData.forEach((item) => {
        oneLevelDataIsSelect.push(item.isSelect);
      });
      if (oneLevelDataIsSelect.includes("")) {
        return "indeterminate";
      }
      return "";
    },

    /**列表选中时触发 */
    handleSelectionChange(val, allitems) {
      // console.log("handleSelectionChange", val.length, this.selectedFinish);
      this.multipleSelection = val;

      // let bimCodes = val
      //   .filter((x) => !x.children || x.children.length === 0)
      //   .map((x) => x.code);
      let bimCodes = val
        .filter((x) => !x.children || x.children.length === 0)
        .map((x) => x.id);
      //通过code进行渲染
      this.bimCodeChild = bimCodes.join(',');
      this.$refs.bimEngine.render(bimCodes);

      // if (this.selectedFinish) {
      //   console.log(val);
      //   if (val && val.length > 0) {
      //     let modelids = val
      //       .filter((x) => !x.children || x.children.length === 0)
      //       .map((x) => x.modelid);
      //     let modelidset = new Set(modelids);
      //     //设置模型取消选中
      //     //设置模型选中
      //     for (const modelid of modelidset) {
      //       let featureids = val
      //         .filter((x) => x.modelid === modelid)
      //         .map((x) => x.glid);
      //       if (featureids.length > 0) {
      //         this.$refs.bimEngine.zoomTo({
      //           featureId: featureids,
      //           modelId: modelid,
      //         });
      //       }
      //     }
      //   }
      // }
    },
    //模型加载后
    bimInited() {
      let featureIds = bimconfig.hiddenId;
      //隐藏相关构件
      if (featureIds && featureIds.length > 0) {
        for (let i = 0; i < featureIds.length; i++) {
          const featureId = featureIds[i];
          let modelTag = featureId.split("^")[0];
          let id = featureId.split("^")[1];
          this.$refs.bimEngine.setItemVisible([id], false, modelTag);
        }
      }

      //通过code进行渲染
      this.$refs.bimEngine.render(this.bimCodeChild);

      //查询模型构件列表
      this.load();
    },
    //选择
    choose() {
      this.tableData = [];
      this.dialogShow = true;
    },
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    pickHandle(feature) {
      if (this.readonly) {
        return;
      }
      // this.$emit("change", feature.id);
    },
  },
};
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
      content: "";
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
