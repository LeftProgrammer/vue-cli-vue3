<template>
  <div>
    <el-input
      :model-value="pbsName"
      placeholder="请选择"
      :class="readonly ? 'disabledBtn' : 'defaultBtn'"
      disabled
    >
      <template #append>
        <div @click="choose" style="padding: 0 20px">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </template>
    </el-input>
    <!--选择PBS弹窗-->
    <el-dialog
      title="选择工程部位（PBS）"
      v-model="dialogShow"
      custom-class="wbench-el-dialog"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      :width="fromapp ? '100vw' : '960px'"
      v-draggable
      @closed="closedHandle"
    >
      <content-layout v-if="dialogShow" :showForm="false" :showPage="false">
        <template #table>
          <el-table
            :data="tableData"
            style="width: 100%"
            height="400"
            border
            lazy
            :load="load"
            @current-change="handleCurrentRowChange"
            highlight-current-row
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
          >
            <!-- <el-table-column width="50">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index">&nbsp;</el-radio>
            </template>
          </el-table-column> -->
            <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
            <el-table-column prop="name" label="名称" :className="'text-left'" width="500">
            </el-table-column>
            <el-table-column prop="code" label="编码"> </el-table-column>
            <el-table-column prop="pbsLayer" label="层级" width="120">
              <template #default="scope">
                <span v-if="scope.row.pbsLayer === '001'">建筑物</span>
                <span v-if="scope.row.pbsLayer === '002'">分部结构</span>
                <span v-if="scope.row.pbsLayer === '003'">细部结构</span>
                <span v-if="scope.row.pbsLayer === '004'">分类</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </content-layout>
      <template #footer>
        <div class="dialog-footer" v-if="!readonly">
          <el-button type="primary" @click="confirmHandle"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ContentLayout from "@/components/ContentLayout/Table";
import { list, get, getByCode } from "./api";
import { fromApp } from "@/utils/index";
import { ArrowRight } from "@element-plus/icons-vue";

let _type = {
  id: "id",
  code: "code",
};

export default {
  name: "PbsSelectComp",
  components: {
    ContentLayout,
    ArrowRight,
  },
  emits: ["update:pbsId", "change", "closed"],
  data() {
    return {
      /**显示弹窗 */
      visible: false,
      /**已经选中pbs信息 */
      selection: [],

      /**pbs数据 */
      pbs: {},

      /**树节点点击 */
      handleNodeClick(data) {
        console.log(data);
      },
      /**弹窗显示 */
      dialogShow: false,
      tableData: [],
      /**请求参数 */
      queryParams: { pid: 0 },

      /**form组件 */
      formVue: null,

      /**组件是否可用 */
      disabled: false,
    };
  },
  props: {
    /**已经选中pbs对应的code信息 */
    pbsId: {
      type: String,
      default: "",
    },
    /**显示弹窗 */
    readonly: {
      type: Boolean,
      default: false,
    },
    /**值类型 */
    type: {
      default: _type.code,
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return [_type.id, _type.code].indexOf(value) !== -1;
      },
    },
  },
  computed: {
    // /**
    //  * 计算组件是否可用
    //  */
    // disabled() {
    //   if (this.readonly) {
    //     return true;
    //   }
    //   let formVue = this.getParent();
    //   if (formVue && formVue.disabled !== false) {
    //     return true;
    //   }
    //   return false;
    // },
    /**是否来自app */
    fromapp() {
      let fromapp = fromApp();
      return fromapp;
    },
    /**pbs名称 */
    pbsName() {
      let name = this.pbs?.pathName || this.pbs?.name;
      if (!name) {
        return "";
      }
      // 去掉第一个斜杠
      let result = name.replace(/^\//, "");

      // 将后续的斜杠替换为连字符 "-"
      result = result.replace(/\//g, "-");
      return result;
    },
  },
  watch: {
    dialogShow: {
      handler(newValue) {
        // console.log(
        //   "visible",
        //   newValue,
        //   this.pbsId,
        //   this.pbs?.name,
        //   this.readonly
        // );
        if (newValue) {
          this.load();
        } else {
        }
      },
      immediate: true,
      deep: true,
    },
    pbsId: {
      handler(newValue) {
        if (newValue) {
          this.getPbs();
        } else {
          this.pbs = {};
        }
      },
      immediate: true,
      deep: true,
    },
    readonly: {
      handler(newValue) {
        this.getIsDisabled();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    //通过pbsId请求pbs
    getPbs() {
      this.pbs = {};
      if (this.pbsId) {
        let pbsId = this.pbsId;
        let fn = getByCode;
        if (this.type === _type.id) {
          fn = get;
        }
        fn(pbsId).then(res => {
          // console.log(res);
          if (res.success) {
            this.pbs = res.data;
          }
        });
      }
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
      list(queryParams).then(res => {
        if (res.success) {
          if (resolve) {
            resolve(res.data);
          } else {
            this.tableData = res.data;
            console.log("pbs数据", res.data);
          }
        }
      });
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
      this.$emit("update:pbsId", value);
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
      if (this.fromapp) {
        window.scrollTo({
          left: 0,
          top: "15vh",
        });
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
  mounted() {},
};
</script>

<style scoped lang="scss">
.choosebtn {
  height: 100%;
  width: 100%;
  display: block;
}

.disabledBtn {
  :deep(.el-input-group__append) {
    border: 1px solid #dcdfe6 !important;
    color: grey !important;
    cursor: not-allowed;
    padding: 0 !important;
    font-size: 14px;
    :deep(.el-button) {
      width: 34px;
      border: 0px solid #dcdfe6 !important;
    }
    .el-button:hover {
      border: 0px solid #dcdfe6 !important;
      background: none !important;
      color: grey !important;
      cursor: not-allowed;
      border-radius: 0;
    }
  }
}

.defaultBtn {
  :deep(.el-input-group__append) {
    background-color: #fff;
    // border: 1px solid #0096ff !important;
    // color: #0096ff !important;
    padding: 0 !important;
    cursor: pointer;
    .el-button {
      text-align: center;
    }
  }
}

:deep(.text-left) {
  text-align: left !important;
}
</style>
