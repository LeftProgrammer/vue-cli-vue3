<template>
  <div>
    <el-dialog
      :title="title"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      v-draggable
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="60%"
      @closed="closedHandle"
    >
      <div style="height: 60vh">
        <el-row>
          <el-col :span="24">
            <div>基本信息</div>
            <el-divider></el-divider>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 30px">
          <el-form
            ref="dataFormRef"
            :model="formData"
            :rules="formDataRules"
            label-width="120px"
            :disabled="readonly"
          >
            <el-row>
              <el-col :span="11">
                <el-form-item label="计划名称" prop="name">
                  <el-input
                    v-model="formData.name"
                    placeholder="请输入内容"
                    show-word-limit
                    maxlength="100"
                  />
                </el-form-item>
                <div style="margin-left: 120px; color: #9a9a9a">
                  注意：系统会自动在计划名称后添加后缀"培训计划"字样
                </div>
              </el-col>
              <el-col :span="11">
                <el-form-item label="年度" prop="year">
                  <el-date-picker
                    v-model="formData.year"
                    value-format="yyyy"
                    type="year"
                    placeholder="选择年"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row class="table">
          <content-layout
            :page="pageParams"
            @query="handleQuery"
            title="计划培训项列表"
            :showPage="false"
            :showSearchBtns="false"
          >
            <template slot="form">
              <el-form :model="query" :inline="true"> </el-form>
            </template>
            <template slot="opratebtns">
              <el-button type="primary" @click="add" :disabled="type == 'view'">
                新 增
              </el-button>
            </template>
            <template slot="table">
              <el-table
                ref="multipleTable"
                border
                :data="tableData"
                style="width: 100%"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  width="50"
                  align="center"
                />
                <el-table-column label="培训名称" prop="name" align="center">
                  <template slot="header">
                    <span style="color: #f56c6c">*</span> 培训名称
                  </template>
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.name"
                      placeholder="请输入培训名称"
                      :disabled="readonly"
                      maxlength="100"
                      show-word-limit
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="组织单位" prop="unit" align="center">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.unit"
                      placeholder="请输入组织单位"
                      :disabled="readonly"
                      maxlength="50"
                      show-word-limit
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="计划培训时间"
                  prop="trainDate"
                  sortable
                  align="center"
                  width="160"
                >
                  <template slot="header">
                    <span style="color: #f56c6c">*</span> 计划培训时间
                  </template>
                  <template slot-scope="scope">
                    <el-date-picker
                      placeholder="请选择"
                      v-model="scope.row.trainDate"
                      :disabled="readonly"
                      style="width: 135px"
                    >
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="培训内容" prop="content" align="center">
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      autosize
                      :rows="1"
                      placeholder="请输入培训内容"
                      v-model="scope.row.content"
                      :disabled="readonly"
                      maxlength="500"
                      show-word-limit
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="培训对象"
                  prop="trainObject"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.trainObject"
                      placeholder="请输入培训对象"
                      :disabled="readonly"
                      maxlength="200"
                      show-word-limit
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="培训目的"
                  prop="trainTarget"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      :rows="1"
                      placeholder="培训目的"
                      v-model="scope.row.trainTarget"
                      :disabled="readonly"
                      maxlength="200"
                      show-word-limit
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" align="center">
                  <template slot-scope="scope">
                    <el-input
                      type="textarea"
                      :rows="1"
                      placeholder="请输入备注"
                      v-model="scope.row.remark"
                      :disabled="readonly"
                      maxlength="100"
                      show-word-limit
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template slot-scope="scope">
                    <!-- <el-button @click.native.prevent="saveRow(scope.row)" type="text" size="small">
                    保存
                  </el-button> -->
                    <el-popconfirm
                      :disabled="getDle(scope.row)"
                      title="确定删除吗？"
                      @confirm="deleteRow(scope.$index, scope.row)"
                    >
                      <el-link
                        slot="reference"
                        type="danger"
                        plain
                        :disabled="getDle(scope.row)"
                      >
                        删除
                      </el-link>
                    </el-popconfirm>
                    <!-- <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">
                    删除
                  </el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </content-layout>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-debounce="[childEvtHandle, `click`, 300]"
          type="primary"
          v-if="type != 'view'"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  save,
  remove,
  update,
  page,
  page1,
  save1,
  remove1,
  update1,
} from "./api";
import { dateFormat } from "@/utils";
import { getDictItemList } from "@/api/dict";
import CorSelect from "@/components/CorSelect/dialog/index.vue";
import { mapGetters } from "vuex";
import { numberParseChina } from "@/utils/math";
import PbsSelect from "@/components/PbsSelect/index.vue";
import ContentLayout from "@/components/ContentLayout/Table";
import { FormMixin } from "@/mixins/FormMixin";
import MonthlyPlan from "@/components/MonthlyPlan/index.vue";
export default {
  name: "dataform",
  mixins: [FormMixin],
  components: {
    CorSelect,
    PbsSelect,
    ContentLayout,
    MonthlyPlan,
  },
  data() {
    return {
      // readonly: true,
      component: "MonthlyPlan",
      uploadFileList: [],
      dialogPlanVisible: false,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },
      DitSpeciality: [],
      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
      },
      formDataRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        year: [{ required: true, message: "请选择年度", trigger: "blur" }],
      },
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      tableData: [],
      query: {
        baseId: null,
      },
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

      /**类型字典 */
      jcxm: {
        code: "pxzllx",
        options: [],
      },
      userId: "",
      dle: false,
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
  },
  async created() {
    this.getTableData();
    this.jcxmDictItem(this.jcxm.code);
    this.userId = this.$getStorage("userInfo").userId;
    if (this.formData.name.endsWith("培训计划") && !this.readonly) {
      this.formData.name = this.formData.name.substring(
        0,
        this.formData.name.length - 4
      );
    }
  },
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    getDle(row) {
      let dle = false;
      if (!row.createUser) {
        return false;
      }
      if (row.createUser !== this.userId) {
        dle = true;
      } else if (this.readonly) {
        dle = true;
      }
      return dle;
    },
    // 查询表格数据
    getTableData() {
      if (this.formData.id) {
        this.query.baseId = this.formData.id;
        page1(this.query).then((res) => {
          this.tableData = res.data;
        });
      } else {
        this.tableData = [{}];
      }
    },
    saveRow(e, id) {
      if (e.name == "") {
        this.$message("请输入名称");
        return;
      }
      if (e.trainDate == "") {
        this.$message("请选择时间");
        return;
      }
      let fields = { ...e, baseId: id };
      if (fields.id !== "") {
        save1(fields)
          .then((res) => {
            const { success, message, data } = res;
            if (!success) {
              return this.$message.error("保存失败：" + message);
            } else {
              this.$emit("ok");
            }
          })
          .catch((err) => {
            console.error(err);
            // this.$message.error("新增失败");
          });
      } else {
        update1(fields)
          .then((res) => {
            const { success, message, data } = res;
            if (!success) {
              return this.$message.error("保存失败：" + message);
            } else {
              this.$emit("ok");
            }
          })
          .catch((err) => {
            this.$message.error("更新失败");
          });
      }
    },
    deleteRow(e, a) {
      console.log(e, a, "deeeee");
      if (a.id) {
        remove1({
          id: a.id,
        }).then((res) => {
          if (!res.success) {
            return this.$message.error("删除失败：" + res.message);
          }

          this.$nextTick(() => {
            this.tableData.splice(e, 1);
          });
          this.$message.success("删除成功");
        });
      }
    },
    add() {
      console.log(this.tableData, "add");
      this.tableData.push({
        isClassify: false,
        name: "",
        unit: "",
        trainDate: "",
        content: "",
        trainObject: "",
        trainTarget: "",
        remark: "",
      });
      console.log(this.tableData, "add");
    },

    /**
     * 附件预览
     */
    handlePreview(index, file) {
      window.open(window.location.origin + `/${file.requestUri}`, "_blank");
    },
    /**
     * 附件上传前
     */
    attachmentsBeforeUpload(file) {
      const isRightSize = file.size / 1024 / 1024 < 20;
      if (!isRightSize) {
        this.$message.error("文件大小超过 20MB");
        return false;
      }
      return isRightSize;
    },
    //获取监测项目字典
    async jcxmDictItem(code) {
      const { data } = await getDictItemList(code);
      this.DitSpeciality = data;
    },
    /** 选择PBS */
    showPbs() {
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      this.formData.pbsCode = pbs.code;
      this.formData.pbsName = pbs.name;
    },
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      //做业务数据的保存,修改。
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          // view   false  return
          if (this.type == "view") {
            this.dialogShow = false;
            return;
          }
          let fields = { ...this.formData };
          fields.name = fields.name + "培训计划";
          if (this.type == "add") {
            save(fields)
              .then((res) => {
                const { success, message, data } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  // this.$message.success("新增成功");
                  this.$emit("ok");
                  this.tableData &&
                    this.tableData.forEach((item) => {
                      item.name &&
                        item.trainDate &&
                        this.saveRow(item, data.id);
                    });
                }
                setTimeout(() => {
                  this.closedHandle();
                }, 200);
              })
              .catch((err) => {
                console.error(err);
                // this.$message.error("新增失败");
              });
          } else {
            update(fields)
              .then((res) => {
                const { success, message, data } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  // this.$message.success("新增成功");
                  this.$emit("ok");
                  this.tableData &&
                    this.tableData.forEach((item) => {
                      item.name &&
                        item.trainDate &&
                        this.saveRow(item, this.query.baseId);
                    });
                }
                setTimeout(() => {
                  this.closedHandle();
                }, 200);
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("更新失败");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          let newData = { ...this.data };
          this.formData = newData;
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

  .el-button--text {
    color: #f56c6c;
  }

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

/deep/.el-input.is-disabled .el-input__inner {
  color: #c0c4cc !important;
}
</style>
<style scoped lang="scss">
.el-form {
  .el-row {
    margin-bottom: 8px;
  }
}
</style>
