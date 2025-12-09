<template>
  <div class="page-leave">
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-form
      ref="dataFormRef"
      :model="formData"
      :rules="formDataRules"
      label-width="auto"
      :disabled="readonly"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文件编号" prop="designSupply.code">
            <el-input
              show-word-limit
              :maxlength="100"
              :disabled="orignDisabled"
              v-model="formData.designSupply.code"
              placeholder="请输入编号"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件名称" prop="designSupply.name">
            <el-input
              show-word-limit
              :maxlength="100"
              :disabled="orignDisabled"
              v-model="formData.designSupply.name"
              placeholder="请输入文件名称"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="关联计划任务项" prop="planId">
            <div :class="{ readonly: readonly }">
              <el-input disabled placeholder="请选择" v-model="planId">
                <template slot="append">
                  <div @click="changePlan">选择</div>
                </template>
              </el-input>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="专业" prop="designSupply.profession">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.designSupply.profession"
              placeholder="请选择"
            >
              <el-option
                v-for="item in DitSpeciality"
                :key="item.value"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="工程部位" prop="designSupply.pbsCode">
            <pbs-select
              v-model="formData.designSupply.pbsCode"
              :readonly="readonly"
            ></pbs-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="实际供应日期" prop="actualDate">
            <el-date-picker
              v-model="formData.actualDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" size="mini" prop=".remark">
            <el-input
              v-model="formData.remark"
              show-word-limit
              :maxlength="50"
              placeholder="请输入备注"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业主单位文秘:" prop="secretary">
            <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="formData.secretary" class="w-100pre">
              <el-option
                :label="item.realName"
                :value="item.userId"
                v-for="(item, index) in secretaryList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <uploadFileTable
        :readonly="readonly"
        v-model="formData.designSupplyFileList"
        :maxSize="500"
      >
        <template slot="title">
          <div class="flex align-end">
            <div class="font-w-600">报告文件列表</div>
            <div class="font-12 ml-20">请上传500M以内的文件</div>
          </div>
        </template>
      </uploadFileTable>
    </div>
    <el-dialog
      width="80%"
      v-draggable
      title="关联计划项选择"
      :visible.sync="dialogPlanVisible"
    >
      <MonthlyPlan :type="2" :page="'report2'" ref="MonthlyPlan"> </MonthlyPlan>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPlanVisible = false">取 消</el-button>
        <el-button type="primary"  @click="sure"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import PbsSelect from "@/components/PbsSelect/index.vue";
import MonthlyPlan from "@/components/MonthlyPlan/index.vue";

import { mapGetters } from "vuex";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { unitList } from "../drawingSend/components/api";
import { getSecretary } from "../../../../components/UniTable/api";
export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    PbsSelect,
    MonthlyPlan
  },
  data() {
    return {
      canDeleteRow: false,
      pbsName: "",
      dialogPlanVisible: false,
      actualDate: true,
      dialogBim: false,
      DitSpeciality: [],
      planId: "",
      orignDisabled: false,
      pageName: "",
      query: {
        applyUser: "",
        applyDate: "",
        pageSize: 20,
        current: 1,
        total: 0
      },
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },
      showDialog: false,
      uploadFileList: [],
      formData: {
        designSupply: {
          id: "",
          name: "",
          code: "",
          pbsCode: "",
          profession: ""
        },
        planId: "",
        actualDate: "",
        remark: "",
        designSupplyFileList: []
      },
      formDataRules: {
        "designSupply.name": [
          { required: true, message: "请输入图纸名称", trigger: "blur" }
        ],

        "designSupply.code": [
          { required: true, message: "请输入图纸编号", trigger: "blur" }
        ],
        "designSupply.pbsCode": [
          { required: true, message: "请选择工程部位", trigger: "change" }
        ],

        actualDate: [
          {
            required: true,
            message: "请选择日期"
          }
        ],
        secretary: [
          { required: true, message: "请选择业主单位文秘", trigger: "change" }
        ]
      },

      currentSection: [],
      dictList: [],
      /**表单是否只读 */
      readonly: false,

      /**人员选择 */
      persons: [],
      personnelShow: false,
      /**组织机构选择 */
      deptShow: false,
      /**岗位 */
      dutyOptions: [],
      /**请假类型 */
      leaveCategoryOptions: [],
      /**分类类型 */
      designClassifyOptions: [],
      /**设计分类类型字典code */
      designClassifyCode: "DESIGN_CLASSIFY",
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      businessId: "",
      pacId: "",
      url: {
        list: "/api/design/supply/detail/page"
      },
      secretaryList: []
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"])
  },
  async created() {
    // this.getDictItemList(this.designClassifyCode);
    // this.getDictItemList(this.designProfessionCode);
    this.getFlowPROFESSION();
    //获取数据
    this.getSecretaryList();
  },
  mounted() {
    // 这里直接调用 getFormData   方法 比watch 监听要快一些 所以  混入中的this.flowId  就拿不到
    setTimeout(() => {
      this.getFormData();
    }, 500);
  },
  methods: {
    sure() {
      let currentRow = this.$refs.MonthlyPlan.currentRow;
      console.log("关闭选择", currentRow);
      if (currentRow) {
        // 2023-08 xxxxx图纸
        this.planId = `${currentRow.month} ${currentRow.taskName}`;
        this.formData.planId =
          currentRow.pid + "&&&" + currentRow.id + "&&&" + currentRow.taskName;
        if (currentRow?.projectPbs && currentRow?.projectPbsName) {
          this.formData.designSupply.pbsCode = currentRow.projectPbs;
        } else {
          this.formData.designSupply.pbsCode = "";
        }
        this.pbsName = currentRow?.projectPbsName || "";
        this.formData.designSupply.profession = currentRow?.profession || "";
        // this.pbsName = currentRow?.taskName || "";
      }
      this.$nextTick(() => {
        this.dialogPlanVisible = false;
      });
    },
    changePlan() {
      if (this.readonly) return;
      this.dialogPlanVisible = true;
      this.$nextTick(() => {
        this.$refs.MonthlyPlan.toDay();
      });
    },

    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      console.log("专业", data);
      this.DitSpeciality = data;
    },
    getPbsName(val) {
      let text = "*";
      console.log("getPbsName", val);
      let a = val?.split("&&&")[1];
      if (a) {
        text = a;
      }
      return text;
    },

    /**
     * 获取表单数据
     */
    getFormData() {
      this.getFlowRow().then((row) => {
        console.log("获取表单数据", row);
        if (row) {
          if (row.createUser == this.$getStorage("userInfo").userId) {
            this.canDeleteRow = false;
          } else {
            this.canDeleteRow = true;
          }
          row.actualDate = this.timeFormat(row.actualDate, "YYYY-MM-DD");
          if (row.planId && row.planId.includes("&&&")) {
            this.planId = row.planId.split("&&&")[2];
          }
          if (row.designSupply && row.designSupply.pbsCode) {
            this.pbsName = this.getPbsName(row.designSupply.pbsCode);
          }
          this.formData = row;
          console.log("formData", this.formData);
        } else {
          //新增时
        }
      });
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      console.log("save fields", fields);
      //做业务数据的保存,修改。
      save(fields)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
            // this.$message.success("新增成功");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },
    //通过permCode获取按钮权限
    getMenuButtonItems(menus, permCode) {
      if (!permCode) {
        return null;
      }
      if (menus.length === 0) {
        return [];
      }
      let item = menus.find((x) => x.permCode === permCode);
      if (item && item.children && item.children.length) {
        return item.children.filter((x) => x.permType === 2);
      } else {
        let childs = [];
        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];
          if (menu.children && menu.children.length > 0) {
            childs.push(...menu.children);
          }
        }
        return this.getMenuButtonItems(childs, permCode);
      }
    },
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designClassifyCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.designClassifyOptions = res.data;
              callback && callback();
            }
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
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.designProfessionOptions = res.data;
            }
          });
        }
      }
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /** 选择PBS */
    showPbs() {
      if (this.readonly) return;
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      console.log("pbs", pbs);
      this.formData.designSupply.pbsCode = pbs.code + "&&&" + pbs.name;
      this.pbsName = pbs.name;
    },
    //获取管理局文秘
    getSecretaryList() {
      this.secretaryList = [];
      unitList()
        .then((result) => {
          const { data, success } = result;
          if (!success) {
            this.$message.error("获取单位列表失败");
          }
          let unitList = data
            .filter((item) => {
              return item.corpLeaf !== 0 && item.corpType == "yzdw";
            })
            .sort((a, b) => {
              return a.corpSort - b.corpSort;
            });
          if (unitList.length == 1) {
            let unit = unitList[0];
            let params = {
              corpId: unit.corpId,
              roleName: "文秘"
            };
            getSecretary(params).then((res) => {
              const { data, success } = res;
              if (!success) {
                this.$message.error("获取业主单位文秘失败");
              } else {
                this.secretaryList = data;
              }
            });
          } else {
            this.$message.error("获取单位列表失败");
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    beforeSubmit() {
      let res = true;
      let extData = {};
      if (this.formData.secretary) {
        extData["yzdwwm"] = {
          type: "user",
          value: this.formData.secretary
        };
      }
      this.sendFlowJson = extData;
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      return res;
    }
  }
};
</script>

<style scoped lang="scss">
// .page-leave > div:nth-last-child(2) {
//   width: 0 !important;
//   overflow: hidden;
// }

.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  // // page-leave 下的最后一个div
  // .el-input-group--append {
  //   display: none;
  // }

  .table {
    /deep/ .el-table__row .cell button {
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

::v-deep {
  .el-col .el-input {
    width: 100%;
  }
}

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

.line {
  background-color: #dcdfe6;
  height: 1px;
  margin: 5px 0 10px 0;
}

.readonly {
  ::v-deep .el-input-group__append {
    color: grey;
    border-color: #e4e7ed;
  }
}
</style>
