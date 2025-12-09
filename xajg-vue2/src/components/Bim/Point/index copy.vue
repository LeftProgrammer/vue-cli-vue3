<template>
  <div>
    <el-input placeholder="请选择" v-model="bimCodeChild" disabled>
      <template slot="append">
        <el-link type="primary" @click="choose" class="choosebtn">选择 </el-link>
      </template>
    </el-input>
    <!--BIM显示弹窗-->
    <el-dialog :title="'三维模型视图' + '（' + pbsCode + '）'" custom-class="wbench-el-dialog" :visible.sync="dialogShow"
      :destroy-on-close="false" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body fullscreen
      @closed="closedHandle">
      <vue-splitpane split="vertical" :min-percent="20" :default-percent="30">
        <template slot="paneL">
          <el-table ref="multipleTable" :data="tableData" style="width: 100%" row-key="id"
            :row-class-name="rowClassNameFun" :header-row-class-name="headerRowClassName"
            :header-cell-style="{ background: '#fafafa' }" border :expand-row-keys="expandRowKeys"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @select="selectFun"
            @select-all="selectAllFun">
            <el-table-column type="selection" width="45"> </el-table-column>
            <!-- <el-table-column type prop="id" label="id" width="200" show-overflow-tooltip>
            </el-table-column> -->
            <el-table-column type prop="code" label="BIM模型编码" width="200" show-overflow-tooltip>
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
          <bim-engine ref="bimEngine" :cid="cid || bimconfig.id" @pick="pickHandle"
            @modelLoadAfterHandle="modelLoadAfterHandle"></bim-engine>
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
      /**是否点击确认 */
      isConfirm: false,
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
      //默认原始传入的值
      defaultBimCodes: (this.bimCode || "").split(","),
      bimCodeChild: "",
      //是否虚化了
      initedModelAlpha: {},

      //默认展开行
      expandRowKeys: [],

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
    dialogShow: {
      handler(newValue, oldValue) {
        let engine = this.$refs["bimEngine"]
        if (newValue && engine) {
          for (let i = 0; i < engine.modelList.length; i++) {
            let model = engine.modelList[i];
            let query = engine.getQueryParams(model.name, model.id, model.docName);
            this.modelLoadAfterHandle(query, null, engine);
          }
          if (this.bimCode) {
            //切换视角，确保能够加载到对应模型
            this.zoomTo(this.bimCode, engine);
          }
        }
        if (newValue) {
          this.isConfirm = false;
          if (this.bimCode) {
            this.bimCodeChild = this.bimCode
          } else {
            this.bimCodeChild = ""
          }
        }
      },
      immediate: true,
      deep: true,
    },
    bimCode: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.bimCodeChild = newValue
        } else {
          this.bimCodeChild = ""
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    /**
     * 转换视角
     */
    zoomTo(bimCode, engine) {
      let bimCodes = (bimCode || "").split(",");
      if (bimCodes.length == 0) {
        return;
      }

      let featureId = bimCodes[0];
      let modelId = "";
      if (featureId.indexOf("^") != -1) {
        modelId = featureId.split("^")[0];
      }
      let query = { featureId: [featureId], modelId: modelId }
      engine.zoomTo(query);
    },
    // 模型加载完成后
    modelLoadAfterHandle(model, datas, engine) {
      // console.log("modelLoadAfterHandle", model, datas, engine)
      // let query = {
      //   modelid: model.id,
      //   modelname: model.name,
      //   Pid: "RootNode",
      //   LightweightName: model.name,
      // };

      let row = { ...model };
      // row._id = model.modelid;
      row.id = model.dataid;
      row.isSelect = false; //默认为不选中
      // row.parentId = 0; //设置父级id
      // row._name = model.modelname;
      // row.hasChildren = true;
      row.pGlid = 0;
      row.glid = "RootNode";//model.dataid;
      row.code = model.modelid;
      row.name = model.modelname;

      let query = {
        name: model.modelname,
        id: model.modelid,
        dataid: model.dataid,
        modelid: model.modelid,
        modelname: model.modelname,
      };
      if (model.glid) {
        query.Pid = model.glid;
      }
      this.$store.dispatch("bim/getFeatureDatas", model.modelid).then((res) => {
        // console.log("getFeatureDatas", row, res);

        //list递归转成树结构

        if (!res) {
          if (this.bimCode) {
            if (this.bimCode.indexOf(model.modelid)) {
              //模型还没加载
              engine.location(model.modelid);
            }
          } else {
            //模型还没加载
            engine.location(model.modelid);
          }
        } else {

          let chinds = this.list2tree(row, res || []);
          // chinds.map(x => x.pGlid = model.dataid)
          row.children = chinds;
          // row.hasChildren = row.children.length > 0;
          this.tableData.push(row)
          // console.log("this.tableData", this.tableData)

          //默认进行虚化
          if (!this.initedModelAlpha[model.modelid] !== true) {
            engine.initModelAlpha(model.modelid);
            this.initedModelAlpha[model.modelid] = true;
          }

          //通过code进行渲染
          if (this.defaultBimCodes.length > 0) {
            let item = this.defaultBimCodes.find(x => x.startsWith(model.modelid + "^"))
            if (item) {
              //选中对应模型
              engine.render(this.defaultBimCodes, false);

              //todo: 展开并选中对应列表项
              let checkedItems = res.filter(x => this.defaultBimCodes.includes(x.modelid + "^" + x.glid));
              let keys = [];
              for (let i = 0; i < checkedItems.length; i++) {
                let item = checkedItems[i];
                this.getExpandKeys(item, keys)
              }
              this.expandRowKeys = keys;

              console.log(this.$refs.multipleTable.store.states);
              this.$nextTick(() => {
                for (let i = 0; i < checkedItems.length; i++) {
                  let item = checkedItems[i];
                  //设置选中
                  this.$refs.multipleTable.toggleRowSelection(item);
                  //设置父级选中，或者半选中
                  this.setRowIsSelect(item)
                }
              });
            }
          }
        }

      });

    },
    //递归，寻找父级的id
    getExpandKeys(item, keys) {
      if (item.parent && item.parent.id) {
        keys.push(item.parent.id)
        this.getExpandKeys(item.parent, keys)
      }
    },
    // 递归，将list转成tree
    list2tree(item, datas) {
      if (!item.glid) { return []; }
      let childs = datas.filter(x => x.pGlid === item.glid);

      let idset = new Set();
      let children = [];

      for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        child.dataid = item.dataid;
        child.modelid = item.modelid;

        child.id = child.modelid + "^" + child.glid;

        if (idset.has(child.id)) {
          continue;
        }
        idset.add(child.id)

        // 非lazy，不能带 parentId 属性，不然无法展开
        delete child.parentId

        if (child._name && child._name.indexOf("|") >= 0) {
          child.code = child._name.split("|")[0];
          child.name = child._name.split("|")[1];
        }
        if (!child.code) {
          child.code = child.glid;
        }

        // delete child.hasChildren
        child.parent = item;
        child.children = this.list2tree(child, datas);
        if (child.children.length === 0) {
          delete child.children;
        }

        // child.hasChildren = child.children.length > 0;
        children.push(child);
      }
      return children;
    },
    /**列表选中时触发 */
    selectFun(val, row) {
      this.selectedFinish = false;
      // console.log("selectFun", val, row);
      if (this.pin) {
        this.shiftRecordNode.end = row;
        this.selectOnShift();
      } else {
        this.shiftRecordNode.start = row;
      }
      this.setRowIsSelect(row);
      // // console.log('--开始自动加载所有子集--')
      // // 自动加载所有子集
      // this.autoLoadChildren(row, val);
      // // console.log('--结束自动加载所有子集--')
      // 获取所有选中的行
      this.selectedFinish = true;
      //调用模型相关处理
      let selection = this.getSelection(this.tableData); //allitems.filter((x) => x.isSelect);
      let allitems = this.getLowestItems(this.tableData);
      // console.log("allitems", allitems, "selection", selection)
      this.handleSelectionChange(selection, allitems);
    },
    //获取所有选中的最子级
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
        let cdatas = alldatas.filter((x) => !x.children || x.children.length === 0);
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
        let cdatas = alldatas.filter((x) => (!x.children || x.children.length === 0) && x.isSelect);
        allselected.push(...cdatas);
      }
      return allselected;
    },
    //设置行选中
    setRowIsSelect(row) {
      // console.log("setRowIsSelect", row)
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
        if (row.parentId === 0 || row.pGlid === 0) {
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
      //获取明确父级的节点
      function getExplicitNode(data, parentId) {
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.glid === parentId) {
            result = item;
            break;
          }
          if (item.children && item.children.length) {
            // console.log("operateLastLeve 2", item.children, parentId)
            getExplicitNode(item.children, parentId);
          }
        }
        return result;
      }

      function operateLastLeve(row) {
        //操作的是子节点  1、获取父节点  2、判断子节点选中个数，如果全部选中则父节点设为选中状态，如果都不选中，则为不选中状态，如果部分选择，则设为不明确状态
        let selectStatuaArr = [];
        let item = getExplicitNode(that.tableData, row.pGlid);
        selectStatuaArr = getSelectStatus(selectStatuaArr, item.children);
        if (
          selectStatuaArr.every((selectItem) => {
            return true === selectItem;
          })
        ) {
          item.isSelect = true;
          that.$refs.multipleTable.toggleRowSelection(item, true);
        } else if (
          selectStatuaArr.every((selectItem) => {
            return false === selectItem;
          })
        ) {
          item.isSelect = false;
          that.$refs.multipleTable.toggleRowSelection(item, false);
        } else {
          item.isSelect = "";
        }
        //则还有父级
        if (item.pGlid !== 0 && item.pGlid !== "RootNode") {
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
      console.log("handleSelectionChange", val, allitems, this.selectedFinish);
      this.multipleSelection = val;

      // let bimCodes = val
      //   .filter((x) => !x.children || x.children.length === 0)
      //   .map((x) => x.modelid + "^" + x.code);
      let bimCodes = val
        .filter((x) => !x.children || x.children.length === 0)
        .map((x) => x.modelid + "^" + x.glid);
      //通过code进行渲染
      this.bimCodeChild = bimCodes.join(',');
      this.$refs.bimEngine.render(bimCodes);
    },


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
      console.log("load tree", treeData, treeNode);

      let item = {
        name: treeData.modelname,
        id: treeData.modelid,
        dataid: treeData.dataid,
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
            row.dataid = treeData.dataid,
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
        resolve(rows);
      });
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
      // console.log("confirmHandle")
      this.dialogShow = false;
      this.isConfirm = true;
      // let codes = this.multipleSelection.map((x) => x.code);
      this.$emit("change", this.bimCodeChild);
      return;
    },
    //选择
    choose() {
      this.tableData = [];
      this.dialogShow = true;
    },
    //关闭时
    closedHandle() {
      // console.log("closedHandle")
      if (!this.isConfirm) {
        this.bimCodeChild = this.defaultBimCodes.join(",");
        this.dialogShow = false;
        this.$emit("closed");
      }
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
      console.log("autoLoadChildren", treeData, row, this.tableData)
      let data = treeData[row.id];
      let thiss = this;

      // 选中事件
      let handSelect = (row, thiss) => {
        thiss.setRowIsSelect(row);
        //获取所有选中的行
        thiss.selectedFinish = true;
        //调用模型相关处理
        let allitems = thiss.getLowestItems(thiss.tableData);
        let selection = thiss.getSelection(thiss.tableData); //allitems.filter((x) => x.isSelect);
        thiss.handleSelectionChange(selection, allitems);
      }
      console.log("autoLoadChildren", data)
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
