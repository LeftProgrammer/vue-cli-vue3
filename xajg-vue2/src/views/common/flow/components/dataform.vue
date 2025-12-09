<template>
  <!--查看消息-->
  <el-dialog
    title="信息"
    custom-class="wbench-el-dialog"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="960px"
    @closed="closedHandle"
  >
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="160px"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="消息标题:" prop="code">
              <el-input
                v-model="formData.noticeTitle"
                placeholder="请输入"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="消息内容:" prop="noticeSchema">
              <el-input
                v-model="formData.noticeSchema"
                placeholder="请输入"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发布人:" prop="sendUserRealName">
              <el-input
                v-model="formData.sendUserRealName"
                placeholder="请输入"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发布时间:" prop="readTime">
              <el-date-picker
                v-model="formData.noticeDate"
                type="date"
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </el-dialog>
</template>

<script>
import { add, save, remove, update, page, list, detailList } from "../api";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import { numberParseChina } from "@/utils/math";
import ContentLayout from "@/components/ContentLayout/Table";
import { FormMixin } from "@/mixins/FormMixin";
export default {
  name: "flow-dataform",
  mixins: [FormMixin],
  components: {
    ContentLayout,
  },
  data() {
    return {
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
      },

      formDataRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        ownerUnit: [{ required: true, message: "请选择", trigger: "blur" }],
        secondUnit: [{ required: true, message: "请选择", trigger: "blur" }],
      },

      tableData: [],

      /**部门选择 */
      deptDialog: {
        selection: [],
        show: false,

        /**业务数据 */
        data: {},
        /**业务字段 */
        fields: [],
      },
      deptTypes: [],

      /**组织机构选择 */
      deptShow: false,

      /**单位类型字典 */
      unitType: {
        code: "UNIT_TYPE",
        options: [],
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
  },
  created() {
    this.getDictItemList(this.unitType);

    console.log("this.$route", this.$route);
  },
  // props: {
  //   /**显示弹窗 */
  //   visible: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   /**已经选中pbs信息 */
  //   data: {
  //     type: Object,
  //     default: {},
  //   },
  //   /**是否只读 */
  //   readonly: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  methods: {
    /**新增子表 */
    addHandle() {
      this.tableData.push({
        baseId: this.formData.id,
      });
    },
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed", this.formData);
    },
    /**确认 */
    childEvtHandle() {
      let fields = { ...this.formData };
      fields.subDetail = this.tableData;
      //做业务数据的保存,修改。
      save(fields)
        .then((res) => {
          const { success, message, data } = res;
          if (!success) {
            return this.$message.error("保存失败：" + message);
          } else {
            // this.$message.success("新增成功");
            this.$emit("ok");
          }
          this.closedHandle();
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },
    /** 部门选择回调*/
    deptSelectHandle(data) {
      //更新字段
      if (
        data.type === "save" &&
        Array.isArray(this.deptTypes) &&
        this.deptTypes.length >= 2
      ) {
        let cors = data.data;
        if (cors.length > 0) {
          let cor = cors[0];
          let row = this.deptDialog.data;
          console.log(
            "this.deptDialog.data.id === this.formData.id",
            row,
            this.formData
          );
          let deptTypes = this.deptTypes;
          if (!(row && (row.$index === 0 || row.$index))) {
            // this.formData[deptTypes[0]] = cor.corpId || "";
            // this.formData[deptTypes[1]] = cor.corpName || "";
            this.$set(this.formData, deptTypes[0], cor.corpId || "");
            this.$set(this.formData, deptTypes[1], cor.corpName || "");
            this.$refs.dataFormRef.validateField(deptTypes[0], (ErrorMsg) => {
              console.log("ErrorMsg", ErrorMsg);
            });
          } else {
            row[deptTypes[0]] = cor.corpId || "";
            row[deptTypes[1]] = cor.corpName || "";
            this.$set(row, deptTypes[0], cor.corpId || "");
            this.$set(row, deptTypes[1], cor.corpName || "");
            this.$set(this.tableData, row.$index, { ...row });
          }
          this.deptTypes = [];
        }
      }
      this.deptDialog.show = false;
      console.log("this.formData", this.formData);
    },
    /**子表点击选择单位 */
    showSubDept({ row, $index }, flags) {
      this.deptTypes = flags;
      this.deptDialog.show = true;
      row.$index = $index;
      this.deptDialog.data = row;
    },
    /** 选择单位点击*/
    showDept(row, flags) {
      this.deptTypes = flags;
      this.deptDialog.show = true;
      this.deptDialog.data = this.formData;
    },
    /** 选择人员清空时*/
    clearEvt(row, types) {
      if (types && Array.isArray(types)) {
        for (let i = 0; i < types.length; i++) {
          const type = types[i];
          row[type] = "";
        }
      }
    },
    /**获取子表数据 */
    getSubTableData(businessId, detailList) {
      let tableData = [];
      console.log("this.designClassifyOptions", this.designClassifyOptions);
      // console.log("numberParseChina", numberParseChina);
      for (let i = 0; i < this.designClassifyOptions.length; i++) {
        const option = this.designClassifyOptions[i];
        let row = {
          id: "0",
          pid: "0",
          taskName: option.dictName,
          sortNum: numberParseChina(i),
          baseId: businessId,
          classify: option.dictCode,
          classifyName: option.dictName,
          isClassify: true,
        };
        if (detailList && detailList.length > 0) {
          let curDetailList = detailList.filter(
            (x) => x.classify === option.dictCode
          );
          for (let i = 0; i < curDetailList.length; i++) {
            let child = curDetailList[i];
            child.isClassify = false;
            child.children = this.computeChildren(child.id, detailList);
          }
          //计算children
          row.children = curDetailList.filter((x) => x.pid === "0");
          tableData.push(row);
          tableData.push(...curDetailList);
        } else {
          tableData.push(row);
        }
      }
      console.log("tableData", tableData);
      this.tableData = tableData;
    },
    //计算children
    computeChildren(pid, detailList) {
      let children = detailList.filter((x) => x.pid === pid);
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        child.isClassify = false;
        child.children = this.computeChildren(child.id, detailList);
      }
      return children;
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /**删除子级 */
    async deleteRow(index, rows) {
      try {
        let row = rows[index];
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        //删除数据
        rows.splice(index, 1);
      } catch (e) {
        console.error(e);
      }
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          this.formData = { ...this.data };
          this.tableData = this.data.subDetail || [];
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  .table {
    /deep/ .el-table__row .cell button {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
  }
}
.subTabeHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

::v-deep {
  .el-col .el-input {
    width: 100%;
  }
}
</style>
