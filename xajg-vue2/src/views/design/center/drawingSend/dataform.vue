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
          <el-form-item label="图纸编号" prop="code">
            <div :class="{ readonly: readonly }">
              <el-input disabled placeholder="请选择" v-model="formData.code">
                <template slot="append">
                  <div @click="chooseDraw">选择</div>
                </template>
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图纸名称" prop="name">
            <el-input
              disabled
              v-model="formData.name"
              placeholder=""
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="专业" prop="profession">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              disabled
              v-model="formData.profession"
              placeholder=""
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
          <el-form-item label="工程部位" prop="pbsCode">
            <pbs-select
              v-model="formData.pbsCode"
              :readonly="true"
            ></pbs-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本" prop="version">
            <el-input
              disabled
              v-model="formData.version"
              placeholder=""
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <div class="flex align-center justify-between">
        <div class="font-w-600">图纸文件列表</div>
      </div>
      <div class="line"></div>
    </div>

    <el-row class="table">
      <el-table ref="multipleTable" :data="tableData" :border="true">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column label="文件名称" prop="name" align="center">
          <template slot-scope="{ row }">
            <span :title="row.name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件大小" prop="size" align="center">
          <template slot-scope="{ row }">
            <span>{{ $computedSzie(row.size) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件格式" prop="type" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" prop="name" width="200" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="$previewFileById(row)"
              >预览</el-button
            >
            <el-button @click="$downFileById(row)" type="text" size="small">
              下载
            </el-button>
            <!--            <el-button-->
            <!--              :disabled="readonly || canDeleteRow"-->
            <!--              @click.native.prevent="deleteRow($index)"-->
            <!--              type="text"-->
            <!--              size="small"-->
            <!--              :style="{ color: (readonly || canDeleteRow) ? '#ccc' : 'red' }"-->
            <!--            >-->
            <!--              删除-->
            <!--            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div>
      <div class="flex align-center justify-between">
        <div class="font-w-600"></div>
      </div>
      <div class="line"></div>
    </div>
    <el-form
      ref="dataFormRefExt"
      :model="formData"
      :rules="formDataRules"
      label-width="auto"
      :disabled="readonly"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="监理单位" prop="supervisionUnit">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.supervisionUnit"
              placeholder="请选择"
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in belongUnit"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监理单位文秘" prop="supervisionUnitPerson">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.supervisionUnitPerson"
              placeholder="请选择"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in persons"
                :key="item.userId"
                :label="item.realName"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="unitsFlag">
          <el-form-item label="施工单位" prop="units">
            <uniTable
              :tableTitle="'施工单位'"
              ref="sendUnits"
              @chooseChange="setSentUnit"
              @deleteChange="deleteSendUniTable"
              @userChange="userChange"
              :userCorpId="formData.supervisionUnit"
              :disableTable="isDisabledMe"
              :disAdd="isDisabledMe"
            ></uniTable>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      width="80%"
      title="关联文件选择"
      v-draggable
      :visible.sync="dialogVisible"
    >
      <components
        :page="'drawingSend'"
        ref="components"
        :is="component"
      ></components>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="sure"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save, supplyList } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import UserSelect from "@/components/newUserSelect/index.vue";
import DepSelect from "@/components/DepSelect/index.vue";
import { mapGetters } from "vuex";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import originalDrawing from "@/components/originalDrawing/index.vue";
import { getSecretary } from "../../../../components/UniTable/api";
import { getCorpList } from "../../../../components/UserSelect/api";
import { getSecretarynew } from "../../../office/SendDocument/api";
import UniTable from "./components/index.vue";
export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    UserSelect,
    DepSelect,
    originalDrawing,
    UniTable,
  },
  data() {
    return {
      canDeleteRow: false,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },

      //当前选择行
      curRow: null,

      component: "originalDrawing",
      tuzhiList: [],
      DitSpeciality: [],
      orignDisabled: false,
      pageName: "",
      //月度计划列表
      tableData: [],
      query: {
        applyUser: "",
        applyDate: "",
        pageSize: 20,
        current: 1,
        total: 0,
      },
      dialogVisible: false,
      uploadFileList: [],
      formData: {
        id: "",
        baseId: "",
        name: "",
        code: "",
        pbsCode: "",
        profession: "",
        designSupplyFileList: [],
      },
      formDataRules: {
        //name: [{ required: true, message: "请输入图纸名称", trigger: "blur" }],
        code: [{ required: true, message: "请选择图纸", trigger: "blur" }],
        supervisionUnit: [
          { required: true, message: "请选择监理单位", trigger: "blur" },
        ],
        supervisionUnitPerson: [
          { required: true, message: "请选择监理单位文秘", trigger: "blur" },
        ],
        units: [
          {
            required: true,
            message: "请添加施工单位,且文秘不能重复",
            trigger: "change",
          },
        ],
        //pbsCode: [{required: true,message: "请选择工程部位",trigger: "change"}],
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
        list: "/api/drawing/issue/page",
      },
      belongUnit: [],
      unitsFlag: false,
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    isDisabledMe() {
      let flag = false;
      if (this.formData?.flowInfo?.page == "fine") {
        flag = true;
      } else {
        if (this.formData?.flowStatus == 2) {
          flag = true;
        } else {
          const currentUser = this.$getStorage("userInfo").userId;
          if (this.formData.supervisionUnitPerson) {
            if (currentUser == this.formData.supervisionUnitPerson) {
              if (this.formData?.taskStatus == 2) {
                flag = true;
              }
            }
          } else {
            flag = false;
          }
        }
      }
      return flag;
    },
  },
  async created() {
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.getFlowPROFESSION();
    // this.getSupplyList();
    //获取数据
    await this.getUnitList();
  },
  mounted() {},
  methods: {
    chooseDraw() {
      if (this.readonly) return;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.components.default();
      });
    },
    async sure() {
      let currentRow = this.$refs.components.currentRow;
      console.log("选择图纸", currentRow);
      if (currentRow) {
        // 如果有code就请求 code 数据返回名称
        this.formData.pbsCode = currentRow.pbsCode || "";
        this.formData.code = currentRow.code;
        this.formData.name = currentRow.name;
        this.formData.profession = currentRow.profession;
        this.formData.baseId = currentRow.allData.id;
        this.formData.version = currentRow.allData.version;
        this.formData.uploadFile = JSON.stringify(
          currentRow.allData.designSupplyFileList || []
        );
        this.tableData = currentRow.allData.designSupplyFileList || [];
        // pbs
      }
      this.dialogVisible = false;
    },

    downFile(row) {
      debugger;
    },
    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.DitSpeciality = data;
    },

    /**
     * 获取表单数据
     */
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        console.log("表单数据", row);
        if (row) {
          this.$nextTick(async () => {
            // 指定流程节点展示 ||流程结束
            const includesTechnical =
              row?.units_NodeAuths?.read || row?.flowStatus == 2 || false;
            if (includesTechnical) {
              this.unitsFlag = true;
            } else {
              this.unitsFlag = false;
            }
            const currentUser = this.$getStorage("userInfo").userId;
            this.canDeleteRow = row.createUser !== currentUser;
            this.tableData = JSON.parse(row.uploadFile || "[]");
            if (row.supervisionUnitPerson && row.units) {
              if (currentUser == row.supervisionUnitPerson) {
                this.unitsFlag = true;
              }
            }
            if (row.supervisionUnit) {
              await this.getPersons(row.supervisionUnit);
            }
            this.formData = row;
            if (row.units && row.persons) {
              this.setTable(row);
            }
          });
        } else {
          // 新增
          this.$nextTick(() => {
            this.$refs.sendUnits.initTable([]);
          });
        }
      } catch (error) {
        // 处理错误，例如打印错误消息或执行其他逻辑
        console.error("Error in getFlowRow:", error);
      }
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      //做业务数据的保存,修改。
      save(fields)
        .then((res) => {
          const { success, message, data } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
            // this.$message.success("新增成功");
          }
        })
        .catch((err) => {
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
        } else {
        }
      }
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /**删除子级 */
    async deleteRow(index) {
      try {
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        //删除数据
        this.tableData.splice(index, 1);
        let fileArr = JSON.parse(this.formData.uploadFile);
        fileArr.splice(index, 1);
        this.formData.uploadFile = JSON.stringify(fileArr);
      } catch (e) {
        console.error(e);
      }
    },
    handleSelectChange(value) {
      //加载对应的监理单位文秘
      this.getPersons(value);
    },
    getPersons(value) {
      let params = {
        corpId: value,
        roleName: "文秘",
      };
      this.formData.supervisionUnitPerson = "";
      getSecretary(params).then((res) => {
        this.persons = [];
        const { data, success, message } = res;
        if (!success) {
          this.$message.error(message);
          return;
        }
        console.log("人员", data);
        this.$set(this, "persons", data);
        this.$forceUpdate();
      });
    },
    async getUnitList() {
      const { data, success } = await getCorpList();
      if (!success) {
        this.$message.error("获取单位失败");
        return;
      }
      console.log("data", data);
      let arr = data[0].children;
      if (arr) {
        this.belongUnit = arr.filter((item) => {
          return item.corpType == "jldw";
        });
      }
    },
    setSentUnit() {
      let sendUnitTable = this.$refs.sendUnits.tableData.map((x) => x.corpId);
      let sendUserTable = this.$refs.sendUnits.tableData.map((x) => x.sendUser);
      // 判断两个数组是不是有重复的数据 判断自己是否有重复单位
      if (this.hasDuplicates(sendUserTable)) {
        this.$message.error("施工单位文秘不能重复");
        this.$set(this.formData, "units", "");
        // 触发校验
        this.$refs.dataFormRef.validate("units");
        return;
      } else {
        this.$set(this.formData, "units", sendUnitTable.toString());
        // 清除校验
        this.$refs.dataFormRef.clearValidate("units");
      }
      return;
    },
    deleteSendUniTable(row, tableData) {
      if (Array.isArray(tableData)) {
        let sendUnitChooseIds = tableData.map((x) => x.corpId);
        this.setSentUnit(sendUnitChooseIds);
      }
      this.userChange();
    },
    // 抄送单位 设置收文人
    userChange() {
      // 把两个table 的人员全部拿到 然后合并在一起   组成    人员id_部门id_单位id,
      this.$nextTick(() => {
        let sendUserTable = this.$refs.sendUnits.tableData.map(
          (x) => x.sendUser
        );
        // 判断两个数组是不是有重复的数据 判断自己是否有重复单位文秘
        if (this.hasDuplicates(sendUserTable)) {
          this.$message.error("施工单位文秘不能重复");
          this.$set(this.formData, "units", "");
          // 触发校验
          this.$refs.dataFormRef.validate("units");
          return;
        } else {
          let tableList = this.$refs.sendUnits.tableData;
          console.log("tableList", tableList);
          let userIds = [];
          tableList.forEach((item) => {
            if (item.item) {
              userIds.push(
                `${item.item.userId}_${item.item.departId}_${item.item.corpId}`
              );
            }
          });
          let str = userIds.join(",");
          this.$set(this.formData, "persons", str);
          // 清除校验
          this.$refs.dataFormRef.clearValidate("units");
        }
      });
    },
    hasDuplicates(array) {
      let bool = new Set(array).size != array.length;
      return bool;
    },
    setTable(row) {
      let sendUnit = row.units;
      let sendUnitArr = [];
      if (sendUnit) {
        sendUnitArr = sendUnit.split(",");
      }
      let sendUnitTableData = [];
      sendUnitArr.forEach(async (val) => {
        // 请求单位下的文秘
        let params = {
          corpId: val,
          roleName: "文秘",
        };
        let res = await getSecretarynew(params);
        const { data, success, message } = res;
        if (!success) {
          this.$message.error(message);
          return;
        }
        //  从sendUser  中获取当前单位选中的人的id
        let sendUser = "";
        if (row.persons) {
          let sendUserArray = row.persons.split(",");
          // 然后循环 判断 是不是包含 当前的单位id
          sendUserArray.forEach((x) => {
            // 判断是否包含 val
            if (x.includes(val)) {
              sendUser = x;
            }
          });
        }
        // 把人员切割出来
        let useId = sendUser.split("_")[0];
        let userIten = data.find((x) => x.userId == useId);
        // 把数据赋值给当前的人员数据源
        sendUnitTableData.push({
          corpId: val,
          sendUser: useId,
          sendUserOptions: data,
          item: userIten, //当前人员的数据
        });
      });
      // console.log("sendUnitTableData", sendUnitTableData);
      this.$refs.sendUnits.initTable(sendUnitTableData);
    },
    /**保存前做数据验证 */
    beforeSubmit() {
      // console.log("提交前");
      let res = true;
      let extData = {};
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      //另一个表单的校验
      this.$refs.dataFormRefExt.validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      //设置监理单位文秘
      if (this.formData.supervisionUnitPerson) {
        extData["jlwm"] = {
          type: "user",
          value: this.formData.supervisionUnitPerson,
        };
      } else {
        this.$message.error("监理单位文秘不能为空");
        return false;
      }
      //设置施工单位文秘
      if (this.formData.persons) {
        let tempArr = this.formData.persons.split(",");
        let users = [];
        tempArr.forEach((item) => {
          if (item) {
            let useId = item.split("_")[0];
            if (useId) {
              users.push(useId);
            }
          }
        });
        if (users) {
          let userIds = users.join(",");
          extData["sgdwwm"] = {
            type: "user",
            value: userIds,
          };
        } else {
          this.$message.error("施工单位文秘不能为空");
          return false;
        }
      }
      this.sendFlowJson = extData;
      return res;
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  // padding: 15px;

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
