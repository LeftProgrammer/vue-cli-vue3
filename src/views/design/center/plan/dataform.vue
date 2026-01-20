<template>
  <div class="page-leave">
    <DefaultTitle title="基本信息" />
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="160px"
        :disabled="readonly"
      >
        <el-col :span="12">
          <el-form-item label="计划年:" prop="year">
            <el-date-picker
              v-model="formData.year"
              type="year"
              placeholder="选择年"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划名称:" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入计划名称"
              width="100%"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划开始日期:" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="选择开始日期"
              :disabled-date="disabledStartDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划结束日期:" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="选择结束日期"
              :disabled-date="disabledEndDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="附件" prop="uploadFile">
            <uploadFile v-model="formData.uploadFile" :readonly="readonly" />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <DefaultTitle title="计划任务项列表" />
    <el-form ref="dataFormtable">
      <el-table
        ref="multipleTable"
        border
        :data="tableData"
        :span-method="arraySpanMethod"
      >
        <el-table-column
          label="序号"
          width="54"
          align="center"
          fixed="left"
          prop="sortNum"
        >
          <template #default="{ row }">
            <span v-show="row.isClassify === true">{{ row.sortNum }}</span>
            <el-input
              v-show="row.isClassify !== true"
              v-model="row.sortNum"
              placeholder="请输入序号"
              :disabled="true"
              readonly
            />
          </template>
        </el-table-column>
        <el-table-column
          class-name="taskname"
          label="任务项名称"
          fixed="left"
          prop="taskName"
          min-width="180"
          align="center"
        >
          <template #default="{ row }">
            <span v-show="row.isClassify === true">{{ row.taskName }}</span>
            <el-form-item :error="row.error">
              <el-input
                v-show="row.isClassify !== true"
                v-model="row.taskName"
                class="custom-rule"
                type="textarea"
                :rows="1"
                placeholder="请输入任务项名称"
                :disabled="readonly"
                maxlength="150"
                show-word-limit
                :autosize="{ minRows: 1, maxRows: 6 }"
                @blur="tableParValueChange(row)"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="专业"
          prop="profession"
          align="center"
          width="120"
        >
          <template #default="{ row }">
            <span v-if="ishowselect(row)">
              <span v-show="row.isClassify === true">{{ row.profession }}</span>
              <el-select
                v-show="row.isClassify !== true"
                ref="professionRef"
                v-model="row.profession"
                placeholder="请选择专业"
                clearable
                :disabled="readonly"
              >
                <el-option
                  v-for="item in designProfessionOptions"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="taskname"
          label="计划供应日期"
          prop="planStartDate"
          align="center"
          width="160"
        >
          <template #default="{ row }">
            <span v-if="ishowselect(row)">
              <span v-show="row.isClassify === true">
                {{ row.planTime ? timeFormat(row.planTime, "YYYY-MM-DD") : "" }}
              </span>
              <el-form-item :error="row.dateError">
                <el-date-picker
                  v-show="row.isClassify !== true"
                  v-model="row.planTime"
                  class="custom-rule"
                  placeholder="请选择"
                  :disabled="readonly || isCanchooseDate"
                  style="width: 140px"
                  :disabled-date="(date) => disabledRowDate(date, row)"
                  @blur="tableParValueChange(row)"
                />
              </el-form-item>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="工程部位"
          min-width="180"
          prop="projectPbs"
          align="center"
        >
          <template #default="{ row }">
            <span v-if="ishowselect(row)">
              <span v-show="row.isClassify === true">
                {{ row.projectPbsName }}
              </span>
              <el-form-item :error="row.pbsError">
                <pbs-select
                  v-show="row.isClassify !== true"
                  v-model="row.projectPbs"
                  :readonly="readonly"
                  @change="tableParValueChange(row)"
                />
              </el-form-item>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="负责人"
          prop="charge"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="ishowselect(scope.row)">
              <span v-show="scope.row.isClassify === true">
                {{ scope.row.charge }}
              </span>
              <user
                v-show="scope.row.isClassify !== true"
                v-model="scope.row.charge"
                :multiple="false"
                :readonly="readonly"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否为现场需解决事项"
          prop="bIsScene"
          align="center"
          width="180"
        >
          <template #default="scope">
            <span v-if="ishowselect(scope.row)">
              <span v-show="scope.row.isClassify === true">
                {{ scope.row.bIsScene }}
              </span>
              <el-checkbox
                v-show="scope.row.isClassify !== true"
                :checked="scope.row.bIsScene"
                :disabled="readonly"
                @change="(val) => bIsSceneChangeHandle(val, scope)"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center">
          <template #default="{ row }">
            <span v-if="ishowselect(row)">
              <span v-show="row.isClassify === true">{{ row.remark }}</span>
              <el-input
                v-show="row.isClassify !== true"
                v-model="row.remark"
                type="textarea"
                :rows="1"
                placeholder="请输入备注"
                :disabled="readonly"
                maxlength="20"
                show-word-limit
                :autosize="{ minRows: 1, maxRows: 6 }"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="name"
          width="240"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              v-if="ishowClass(scope.row)"
              type="primary"
              link
              :disabled="readonly"
              @click="handelAdd(scope.$index, scope.row, tableData, 'class')"
            >
              新增下级分类
            </el-button>
            <el-button
              v-if="ishowTask(scope.row)"
              type="primary"
              link
              :disabled="readonly"
              @click="handelAdd(scope.$index, scope.row, tableData, 'task')"
            >
              新增下级任务
            </el-button>
            <el-button
              type="danger"
              link
              :class="deleteRed ? '' : 'el-delete'"
              :disabled="
                readonly ||
                  scope.row.id === '0' ||
                  (scope.row.children && scope.row.children.length > 0)
              "
              @click.prevent="deleteRow(scope.$index, tableData, 'task')"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <user-select
      :show="personDialog.show"
      :users="personDialog.selection"
      @update:show="personDialog.show = $event"
      @user-checked="getUsers"
    />
  </div>
</template>

<script>
import { list, save, getSection } from "./api";
import { dateFormat } from "@/utils";
import UserSelect from "@/components/newUserSelect/index.vue";
import PbsSelect from "@/components/PbsSelect/index.vue";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { numberParseChina } from "@/utils/math";
import { getId } from "@/api/common";

export default {
  name: "Dataform",
  components: {
    UserSelect,
    PbsSelect,
  },
  mixins: [FlowFormMixin],
  props: {
    dataAll: {
      type: Object,
      default: () => ({}),
    },
    page: {
      type: String,
      default: "",
    },
    propReadonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      addAble: true,
      options: [],
      sectionList: [],
      tableData: [],
      query: {
        applyUser: "",
        applyDate: "",
        pageSize: 20,
        current: 1,
        total: 0,
      },
      showDialog: false,
      formData: {
        id: null,
        deleteStatus: 0,
        uploadFile: "[]",
      },
      orignDate: "",
      formDataRules: {
        startDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        sectionId: [
          { required: true, message: "请选择标段", trigger: "change" },
        ],
        endDate: [{ required: true, message: "请选择日期", trigger: "change" }],
        year: [
          {
            validator: this.validFile,
            message: "请选择计划年",
            required: true,
          },
        ],
        name: [{ required: true, message: "请填写计划名称", trigger: "blur" }],
        secretary: [
          { required: true, message: "请选择业主单位文秘", trigger: "change" },
        ],
      },
      readonly: false,
      personDialog: {
        selection: [],
        show: false,
      },
      pbsDialog: {
        selection: [],
        show: false,
      },
      curRow: null,
      deptShow: false,
      dutyOptions: [],
      leaveCategoryOptions: [],
      designClassifyOptions: [],
      designClassifyCode: "DESIGN_CLASSIFY",
      designProfessionCode: "DESIGN_PROFESSION",
      designProfessionOptions: [],
      businessId: "",
      pacId: "",
      url: {
        list: "/api/design/plan/page",
      },
      specialDate: new Date("2023-09-15"),
      yearList: [],
      secretaryList: [],
    };
  },
  computed: {
    deleteRed() {
      return this.readonly;
    },
    isCanchooseDate() {
      return !(this.formData.startDate && this.formData.endDate);
    },
  },
  watch: {
    tableData: {
      handler() {
        if (this.tableData && this.tableData.length) {
          this.formData.designPlanDetailList = this.tableData
            .filter((x) => x.isClassify === false)
            .map((x) => {
              x.bIsScene = x.isScene ? true : false;
              return x;
            });
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getYearList();
    this.getSection();
  },
  created() {
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.$nextTick(() => {
      // 外部传入的 propReadonly 优先
      if (this.propReadonly) {
        this.readonly = true;
      } else if (this.fromapp) {
        if (this.$route.query.businessId) {
          this.getDataById(this.$route.query.businessId);
          this.readonly = true;
        }
      }
    });
  },
  methods: {
    disabledStartDate(date) {
      if (this.formData?.endDate) {
        return date > this.formData.endDate;
      }
      return false;
    },
    disabledEndDate(date) {
      if (this.formData?.startDate) {
        return date < this.formData.startDate;
      }
      return false;
    },
    disabledRowDate(date, row) {
      return date < this.formData.startDate || date > this.formData.endDate;
    },
    async getSection() {
      const { data } = await getSection({});
      this.sectionList = data;
    },
    getDataById(id) {
      let params = { id: id };
      list(params).then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          this.setFormData(res.data[0]);
        }
      });
    },
    getYearList() {
      let params = { deleteStatus: 0 };
      list(params).then((data) => {
        if (data) {
          let planList = data.data;
          let result = [];
          planList.forEach((plan) => {
            result.push(plan?.year);
          });
          this.yearList = result;
        }
      });
    },
    changeDate(value) {
      console.log("计划开始时间 结束之间是否填写", value);
    },
    ishowselect(row) {
      if (Object.prototype.hasOwnProperty.call(row, "type")) {
        return row.type !== "class";
      }
      return false;
    },
    ishowClass(row) {
      if (Object.prototype.hasOwnProperty.call(row, "type")) {
        return row.type === "class";
      }
      return true;
    },
    ishowTask(row) {
      if (Object.prototype.hasOwnProperty.call(row, "type")) {
        return row.type === "class";
      }
      return true;
    },
    tableParValueChange(row) {
      if (row.taskName && row.taskName !== "") {
        row.error = "";
      } else {
        row.error = "任务名称不能为空";
      }
      if (row.planTime && row.planTime !== "") {
        row.dateError = "";
      } else {
        row.dateError = "计划供应日期不能为空";
      }
      if (row.projectPbs && row.projectPbs !== "") {
        row.pbsError = "";
      } else {
        row.pbsError = "工程部位不能为空";
      }
    },
    bIsSceneChangeHandle(checked, scope) {
      scope.row.bIsScene = checked;
      scope.row.isScene = checked ? 1 : 0;
    },
    getUsers(data) {
      if (this.curRow) {
        this.curRow.charge = data.valueText || "";
        this.curRow.chargeName = data.text || "";
      }
      this.tableData[this.curRow.$index] = { ...this.curRow };
    },
    showPerson(row, index) {
      if (this.readonly) return;
      this.personDialog.selection = row.charge ? [row.charge] : [];
      row.bIsScene = !!row.isScene;
      row.$index = index;
      this.curRow = row;
      this.personDialog.show = true;
    },
    clearEvt(row, type) {
      if (type === "person") {
        row.charge = "";
        row.chargeName = "";
      }
      if (type === "pbs") {
        row.projectPbs = "";
        row.projectPbsName = "";
      }
    },
    showPbs(row, index) {
      if (this.readonly) return;
      this.pbsDialog.selection = row.projectPbs ? [row.projectPbs] : [];
      row["$index"] = index;
      this.curRow = row;
      this.pbsDialog.show = true;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.isClassify) {
        if (columnIndex === 0 || columnIndex === 8) {
          return [1, 1];
        } else if (columnIndex === 1) {
          return [1, 7];
        } else {
          return [0, 0];
        }
      }
    },
    getFormData() {
      this.getFlowRow().then((row) => {
        this.setFormData(row);
      });
    },
    setFormData(row) {
      if (row) {
        this.orignDate = row.year;
        this.formData = row;
        let detailList = this.formData.designPlanDetailList;
        this.getDictItemList(this.designClassifyCode, () => {
          this.getSubTableData(row.id, detailList);
        });
      } else {
        this.getDictItemList(this.designClassifyCode, () => {
          this.getSubTableData(this.businessId);
        });
      }
      this.$nextTick(() => {
        this.$refs.dataFormRef?.clearValidate();
      });
    },
    getSubTableData(businessId, detailList) {
      let tableData = [];
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
          isScene: 0,
          bIsScene: false,
          isClassify: true,
        };
        if (detailList && detailList.length > 0) {
          let curDetailList = detailList.filter(
            (x) => x.classify === option.dictCode
          );
          for (let j = 0; j < curDetailList.length; j++) {
            let child = curDetailList[j];
            child.isClassify = false;
            child.children = this.computeChildren(child.id, detailList);
          }
          row.children = curDetailList.filter((x) => x.pid === "0");
          tableData.push(row);
          tableData.push(...curDetailList);
        } else {
          tableData.push(row);
        }
      }
      this.tableData = tableData;
    },
    computeChildren(pid, detailList) {
      let children = detailList.filter((x) => x.pid === pid);
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        child.isClassify = false;
        child.children = this.computeChildren(child.id, detailList);
      }
      return children;
    },
    save(fields, callback, event) {
      fields.year = dateFormat(fields.year, "YYYY");
      fields.startDate = dateFormat(fields.startDate, "YYYY-MM-DD");
      fields.endDate = dateFormat(fields.endDate, "YYYY-MM-DD");

      let detailList = fields.designPlanDetailList;
      const isMaintenance = event?.data?.btnKey === "maintenance";
      if (detailList && detailList.length > 0) {
        fields.designPlanDetailList = detailList.map((x) => {
          x.isScene = x.bIsScene ? 1 : 0;
          return x;
        });
      }

      let isok = true;
      this.tableData.forEach((item) => {
        if (item.pid == 0 && item.id == 0) {
          // 跳过顶级分类
        } else {
          if (!item.taskName) {
            isok = false;
            item.error = "任务名称不能为空";
          }
          if (item.type === "task") {
            if (!item.planTime) {
              isok = false;
              item.dateError = "计划供应日期不能为空";
            }
            if (!item.projectPbs) {
              isok = false;
              item.pbsError = "工程部位不能为空";
            }
          }
        }
      });

      if (!isok) return;
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: "maintenance",
          },
          event.origin
        );
        return;
      }
      save(fields)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },
    getDictItemList(code, callback) {
      if (code === this.designClassifyCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designClassifyOptions = items;
            callback && callback();
          });
        } else {
          callback && callback();
        }
      }
      if (code === this.designProfessionCode) {
        if (
          !this.designProfessionOptions ||
          this.designProfessionOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designProfessionOptions = items;
          });
        }
      }
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    handelAdd(index, row, rows, type) {
      if (!this.formData.startDate || !this.formData.endDate) {
        this.$message.warning("请选择计划开始、截至时间");
        return;
      }
      let i = index;
      if (row.children && row.children.length > 0) {
        let childs = rows.filter((x) => {
          if (row.isClassify === true) {
            return row.classify === x.classify;
          } else {
            if (x.isClassify === true) return false;
            if (row.classify !== x.classify) return false;
            return x.sortNum.indexOf(row.sortNum) === 0;
          }
        });
        i += childs.length;
      } else {
        i += 1;
        row.children = [];
      }
      let sortNum = this.getSortNum(row);
      getId()
        .then((res) => {
          if (res.success) {
            let newId = res.data;
            let newRow = {
              id: newId,
              pid: row.id,
              taskName: "",
              sortNum: sortNum,
              baseId: row.baseId,
              classify: row.classify,
              classifyName: row.classifyName,
              isClassify: false,
              type: type,
              planTime: "",
            };
            row.children.push(newRow);
            rows.splice(i, 0, newRow);
            this.tableData[index] = { ...row };
          } else {
            console.error("获取唯一id异常");
          }
        })
        .catch(() => {
          console.error("获取唯一ID异常");
        });
    },
    getSortNum(row) {
      let sortNum = "1";
      let count = 0;
      if (row.children && row.children.length) {
        count = row.children.length;
      }
      if (row.isClassify === false) {
        if (row.sortNum) {
          sortNum = row.sortNum + "." + (count + 1);
        }
      } else {
        sortNum = (count + 1).toString();
      }
      return sortNum;
    },
    async deleteRow(index, rows) {
      let _rows = [...rows];
      try {
        let row = rows[index];
        if (row && row.children && row.children.length > 0) {
          this.$message("当前节点存在子级，无法删除！");
          return;
        }
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        // 父级的children删除数据
        for (let i = 0; i < rows.length; i++) {
          const item = rows[i];
          if (item.id === row.pid && item.children) {
            for (let j = 0; j < item.children.length; j++) {
              item.children.splice(j, 1);
              if (item.children.length === 0) {
                this.tableData[i] = { ...item };
              }
              break;
            }
          }
        }
        rows.splice(index, 1);

        let sortNumArrs = row.sortNum.split(".");
        let sortNumLen = sortNumArrs.length;
        for (let i = 0; i < rows.length; i++) {
          const _row = rows[i];
          if (
            (_row.classify === row.classify && i < index) ||
            _row.classify != row.classify
          ) {
            continue;
          }
          let _sortNumArrs = _row.sortNum.split(".");
          let _sortNumLen = _sortNumArrs.length;
          if (_sortNumLen < sortNumLen) continue;

          const preRow = rows[i - 1];
          let preSortNumArrs = [];
          if (!preRow.isClassify) {
            preSortNumArrs = preRow.sortNum.split(".");
          }
          let preSortNumLen = preSortNumArrs.length;
          if (preRow.id === _row.pid) {
            _sortNumArrs = [...preSortNumArrs, "1"];
          } else if (preSortNumLen > _sortNumLen) {
            _sortNumArrs[_sortNumLen - 1] =
              parseInt(preSortNumArrs[_sortNumLen - 1]) + 1;
          } else {
            for (let idx = 0; idx < _sortNumLen; idx++) {
              if (idx < _sortNumLen - 1) {
                _sortNumArrs[idx] = preSortNumArrs[idx];
              } else {
                _sortNumArrs[idx] = parseInt(preSortNumArrs[idx]) + 1;
              }
            }
          }
          _row.sortNum = _sortNumArrs.join(".");
        }
      } catch (e) {
        console.error(e);
      }
    },
    handelShowDialog() {
      this.showDialog = true;
    },
    beforeSubmit() {
      let res = true;
      let extData = {};
      if (this.formData.secretary) {
        extData["yzdwwm"] = {
          type: "user",
          value: this.formData.secretary,
        };
      }
      this.sendFlowJson = extData;
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          res = false;
        }
      });
      return res;
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
    :deep(.el-table__row .cell button) {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
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

:deep(.el-col .el-input) {
  width: 100%;
}

.el-delete {
  color: red;
}

:deep(.el-input-group__append) {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

:deep(.taskname) {
  .el-form-item__content {
    top: 8px !important;

    .el-input__count {
      height: 25px;
      line-height: 25px;
      bottom: 3px;
    }
  }
}

:deep(.taskname .cell) {
  overflow: visible;
}

:deep(.el-button .is-disabled) {
  background-color: transparent !important;
}

:deep(.el-textarea .el-input__count) {
  color: #909399;
  background: #fff;
  position: absolute;
  font-size: 12px;
  bottom: 7px;
  right: 10px;
  height: 24px;
  overflow: hidden;
}
</style>
