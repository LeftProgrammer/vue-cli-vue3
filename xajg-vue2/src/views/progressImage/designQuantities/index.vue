<template>
  <div id="office-home"
       class="page-list w-100pre h-100pre box"
       :style="{ zoom: scaleFactor }">
      <el-row style="height: 100%;">
        <el-col :span="4">
          <el-tree
            :data="typeOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            ref="tree"
            node-key="corpId"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-col>
        <el-col :span="20" style="height: 100%;">
          <el-table
            ref="pbsTable"
            :data="tableData"
            style="width: 100%;height:100%;overflow: auto"
            border
            lazy
            :load="load"
            @current-change="handleCurrentRowChange"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
          >
            <el-table-column
              prop="name"
              label="工程部位名称"
              :className="'text-left'"
              width="300"
            >
            </el-table-column>
            <el-table-column align="center" prop="designQuantitiesDetail.planStartDate" label="计划开始时间">
              <template slot-scope="scope">
                {{(scope.row.designQuantitiesDetail && scope.row.designQuantitiesDetail.planStartDate)?timeFormat(scope.row.designQuantitiesDetail.planStartDate,'YYYY-MM-DD'):'-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="designQuantitiesDetail.planEndDate" label="计划结束时间">
              <template slot-scope="scope">
                {{(scope.row.designQuantitiesDetail && scope.row.designQuantitiesDetail.planEndDate)?timeFormat(scope.row.designQuantitiesDetail.planEndDate,'YYYY-MM-DD'):'-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('DSKW')" prop="designQuantitiesDetail.dskw" label="洞身开挖(m)"><template slot-scope="{row}"> {{formatText(row,'dskw')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('DSZH')" prop="designQuantitiesDetail.dszh" label="洞身支护(m)"><template slot-scope="{row}"> {{formatText(row,'dszh')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('DSCC')" prop="designQuantitiesDetail.dscc" label="洞身衬砌(m)"><template slot-scope="{row}"> {{formatText(row,'dscc')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('DDWYJ')" prop="designQuantitiesDetail.ddwyj" label="多点位移计（套）"><template slot-scope="{row}"> {{formatText(row,'ddwyj')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('MGYLJ_T')" prop="designQuantitiesDetail.mgyljT" label="锚杆应力计(套)"><template slot-scope="{row}"> {{formatText(row,'mgyljT')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('TSFKW')" prop="designQuantitiesDetail.tsfkw" label="土石方开挖（m³）"><template slot-scope="{row}"> {{formatText(row,'tsfkw')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('BPZH_MG')" prop="designQuantitiesDetail.bpzhMg" label="边坡支护-锚杆（根）"><template slot-scope="{row}"> {{formatText(row,'bpzhMg')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('BPZH_MGS')" prop="designQuantitiesDetail.bpzhMgs" label="边坡支护-锚杆束（束）"><template slot-scope="{row}"> {{formatText(row,'bpzhMgs')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('BPZH_MS')" prop="designQuantitiesDetail.bpzhMs" label="边坡支护-锚索（束)"><template slot-scope="{row}"> {{formatText(row,'bpzhMs')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('LMDCJYJLM')" prop="designQuantitiesDetail.lmdcjyjlm" label="路面垫层及永久路面（m）"><template slot-scope="{row}"> {{formatText(row,'lmdcjyjlm')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('ECCC')" prop="designQuantitiesDetail.eccc" label="二次衬砌（m）"><template slot-scope="{row}"> {{formatText(row,'eccc')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('QBQW')" prop="designQuantitiesDetail.qbqw" label="清表清危（m³）"><template slot-scope="{row}"> {{formatText(row,'qbqw')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('ZDW')" prop="designQuantitiesDetail.zdw" label="主动网（m²）"><template slot-scope="{row}"> {{formatText(row,'zdw')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('BDW')" prop="designQuantitiesDetail.bdw" label="被动网（m）"><template slot-scope="{row}"> {{formatText(row,'bdw')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('MG')" prop="designQuantitiesDetail.mg" label="锚杆（根）"><template slot-scope="{row}"> {{formatText(row,'mg')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('MGS')" prop="designQuantitiesDetail.mgs" label="锚杆束（束）"><template slot-scope="{row}"> {{formatText(row,'mgs')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('MS')" prop="designQuantitiesDetail.ms" label="锚索（束）"><template slot-scope="{row}"> {{formatText(row,'ms')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('WXZ')" prop="designQuantitiesDetail.wxz" label="微芯桩（套）"><template slot-scope="{row}"> {{formatText(row,'wxz')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('GNSS')" prop="designQuantitiesDetail.gnss" label="GNSS（套）"><template slot-scope="{row}"> {{formatText(row,'gnss')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('MGYLJ_Z')" prop="designQuantitiesDetail.mgyljZ" label="锚杆应力计（支）"><template slot-scope="{row}"> {{formatText(row,'mgyljZ')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('MSCLJ')" prop="designQuantitiesDetail.msclj" label="锚索测力计（支）"><template slot-scope="{row}"> {{formatText(row,'msclj')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('ZJKW')" prop="designQuantitiesDetail.zjkw" label="桩基开挖（m）"><template slot-scope="{row}"> {{formatText(row,'zjkw')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('ZJJZ')" prop="designQuantitiesDetail.zjjz" label="桩基浇筑（m）"><template slot-scope="{row}"> {{formatText(row,'zjjz')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('QTJZ')" prop="designQuantitiesDetail.qtjz" label="桥台浇筑（m³）"><template slot-scope="{row}"> {{formatText(row,'qtjz')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('JJDJZ')" prop="designQuantitiesDetail.jjdjz" label="交界墩浇筑（m）"><template slot-scope="{row}"> {{formatText(row,'jjdjz')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('GJGZZ')" prop="designQuantitiesDetail.gjgzz" label="钢结构制作（吨）"><template slot-scope="{row}"> {{formatText(row,'gjgzz')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('GXBZ')" prop="designQuantitiesDetail.gxbz" label="空心板制（块）"><template slot-scope="{row}"> {{formatText(row,'gxbz')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('GZJZ')" prop="designQuantitiesDetail.gzjz" label="拱座浇筑（m³）"><template slot-scope="{row}"> {{formatText(row,'gzjz')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('TFKW')" prop="designQuantitiesDetail.tfkw" label="土方开挖（m³）"><template slot-scope="{row}"> {{formatText(row,'tfkw')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('ZJSG')" prop="designQuantitiesDetail.zjsg" label="桩基施工（m）"><template slot-scope="{row}"> {{formatText(row,'zjsg')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('ZTJGHNT')" prop="designQuantitiesDetail.ztjghnt" label="主体结构混凝土（m³）"><template slot-scope="{row}"> {{formatText(row,'ztjghnt')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('ECJGQZ')" prop="designQuantitiesDetail.ecjgqz" label="二次结构砌筑（m³）"><template slot-scope="{row}"> {{formatText(row,'ecjgqz')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('JGGC')" prop="designQuantitiesDetail.jggc" label="机电工程（%）"><template slot-scope="{row}"> {{formatText(row,'jggc')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('ZXGC')" prop="designQuantitiesDetail.zxgc" label="装修工程（%）"><template slot-scope="{row}"> {{formatText(row,'zxgc')}} </template></el-table-column>
            <el-table-column align="center" :key="Math.random()" v-if="isShowFiled('YLGC')" prop="designQuantitiesDetail.ylgc" label="园林工程（%）"><template slot-scope="{row}"> {{formatText(row,'ylgc')}} </template></el-table-column>
            <el-table-column align="center" prop="pbsLayer" label="操作" width="120">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  plain
                  :key="Math.random()"
                  v-if="scope.row.hasChild !== 1"
                  @click="editHandle(scope.row)"
                >
                  编辑
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

    <dataform
      :checkNode="checkNode"
      :type="type"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="oprateRow.dialogShow = false"
      @ok="loadTree"
    >
    </dataform>
  </div>
</template>

<script>
import { list, getConfigureList, getById } from './api';
import { ListMixin } from "@/mixins/ListMixin";
import dataform from "./dataform";
import { dateFormat } from '@/utils';

let _type = {
  id: "id",
  code: "code",
};

export default {
  name: "designQuantities",
  components: {
    dataform
  },
  mixins: [ListMixin],
  watch:{
    'checkDefault':function(newVal,oldVal){
      if(newVal){
        this.$nextTick(()=>{
            document.querySelectorAll('.el-tree-node__content')[1].click();
        })
      }
    }
  },
  data() {
    return {
      type: '',
      title: '',
      checkNode: {},
      oprateRow: {},
      scaleFactor: 1, // 默认缩放比例为 1
      typeOptions: [],
      defaultProps: {
        children: 'children',
        label: 'belongProject'
      },
      /**显示弹窗 */
      visible: false,
      /**已经选中pbs信息 */
      selection: [],

      /**pbs数据 */
      pbs: {},


      /**弹窗显示 */
      dialogShow: false,
      tableData: [],
      checkDefault: [],
      /**请求参数 */
      queryParams: { pid: 0 },

      /**form组件 */
      formVue: null,

      /**组件是否可用 */
      disabled: false,
      expandRowKeysList:[]
    };
  },
  async mounted() {
    //所属工程
    await this.getTypeDictMap();
    // this.load();
  },
  methods: {
    formatText(row, filed) {
      return (row.designQuantitiesDetail && row.designQuantitiesDetail[filed]) ? row.designQuantitiesDetail[filed] : '-';
    },
    isShowFiled(field){
      console.log(this.checkNode)
      return this.checkNode?.quantityTarget?.split(",").includes(field);
    },
    /**树节点点击 */
    async handleNodeClick(data) {
      this.checkNode = data;
      this.checkNode.id = this.checkNode.pbsId;
      await this.loadTree();
    },
    async loadTree(){
      this.tableData = [];
      await this.load(this.checkNode);
    },
    editHandle(row){
      console.log(row)
      this.type = "edit";
      this.title = "编辑";
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
      this.$forceUpdate();
    },
    /* 获取字典 */
    async getTypeDictMap() {
      const { data } = await getConfigureList();
      if(data){
        this.checkDefault.push(data[0].id)
      }
      this.typeOptions.push({
        belongProject: '所属工程',
        pid: '0',
        children: data
      })
      console.log("typeOptions",this.typeOptions);
    },

    /**获取列表数据 */
    load(tree, treeNode, resolve) {
      console.log("load", tree, treeNode, resolve);
      let queryParams = {};
      if (tree) {
        queryParams.pid = tree.id;
      } else {
        queryParams.pid = 0;
      }
      queryParams.isParent = resolve?false:true;
      list(queryParams).then((res) => {
        if (res.success) {
          if (resolve) {
            resolve(res.data);
          } else {
            res.data.hasChild = 1;
            this.tableData = [res.data];
            this.$nextTick(()=>{
              this.$refs.pbsTable.store.loadOrToggle(res.data);
            })
            console.log("pbs数据", res.data);
          }
        }
      });
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    showRow(row) {
      //赋值给radio
      this.radio = this.tableData.indexOf(row);
    },
    handleCurrentRowChange(currentRow, oldCurrentRow) {
      this.pbs = currentRow;
      // //加载子级数据
      // this.getCurrentRow(this.tableData.indexOf(currentRow));
    },
    getCurrentRow(val) {
      console.log(val);
    },
    /**确认时 */
    confirmHandle() {
      this.dialogShow = false;
      // this.$emit("childEvt", this.currentRow);
      // let codes = this.currentRow.code;
      // this.pbs = { ...this.currentRow };
      let value = this.pbs.code;
      console.log("confirmHandle", this.pbs);
      if (this.type === _type.id) {
        value = this.pbs.id;
      }
      this.$emit("change", value, this.pbs);
      // console.log("confirmHandle", JSON.stringify(this.pbs));
    },
    closedHandle() {
      this.$emit("closed");
    },
    //选择
    choose() {
      if (this.disabled || this.readonly) {
        this.$message.warning("当前为只读模式，无法选择");
        return;
      }
      this.dialogShow = true;
    },
    /**
     * 获取父元素实例
     */
    getParent() {
      // if (this.formVue) return;
      let parent = this.$parent;
      if (!parent) {
        return null;
      }
      let el = parent.$el || {};
      let classList = el.classList;
      let tagName = el.tagName || "";
      while (
        !(classList && classList.contains("el-form")) ||
        tagName.toLocaleLowerCase() !== "form"
      ) {
        parent = parent.$parent;

        if (!parent) return null;

        el = parent.$el || {};
        classList = el.classList;
        tagName = el.tagName || "";
      }
      this.formVue = parent;
      return parent;
    },
    /**
     * 获取disabled
     */
    getIsDisabled() {
      let formVue = this.getParent();
      if (formVue && formVue.disabled !== false) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">


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

/deep/ .el-range-editor--medium .el-range-input {
  font-size: 12px;
}

/deep/ .el-table__header-wrapper{
  border-radius: 5px;
}

/deep/ .el-table__header .el-table__cell{
  text-align: center;
  background-color: #1298fa;
  .cell{
    color: #fff;
  }
}
</style>
