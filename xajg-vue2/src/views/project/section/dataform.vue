<template>
  <!--选择PBS弹窗-->
  <el-dialog
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="960px"
    :title="title"
    @closed="closedHandle"
    v-draggable
  >
    <!-- <el-row>
      <el-col :span="24">
        <div>合同标段</div>
        <el-divider></el-divider>
      </el-col>
    </el-row> -->
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="100px"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="标段编码" prop="code">
              <el-input
                v-model="formData.code"
                placeholder="请输入"
                width="100%"
                maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标段名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入"
                width="100%"
                maxlength="50"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="建设单位" prop="ownerUnit">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                v-model="formData.ownerUnit"
                placeholder="请选择"
                style="width: 100%"
                clearable
                filterable
                :disabled="readonly"
              >
                <el-option
                  v-for="item in unitData"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工单位" prop="secondUnit">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                v-model="formData.secondUnit"
                placeholder="请选择"
                style="width: 100%"
                clearable
                filterable
                :disabled="readonly"
              >
                <el-option
                  v-for="item in unitData"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="工作范围" prop="scope">
              <el-input
                v-model="formData.scope"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 4 }"
                placeholder="请输入"
                width="100%"
                maxlength="500"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <DefaultTitle title="其他单位">
      <el-button @click="addHandle" type="primary" v-if="!readonly"> 新增 </el-button>
    </DefaultTitle>
    <el-row class="table">
      <el-table ref="multipleTable" border :data="tableData">
        <el-table-column label="单位类型" prop="type" align="center">
          <template slot-scope="scope">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              ref="typeRef"
              v-model="scope.row.type"
              placeholder="请选择单位类型"
              @change="handleChange($event, scope.$index)"
              clearable
              :disabled="readonly"
            >
              <el-option
                v-for="item in unitType.options"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="单位名称" prop="" align="center">
          <template slot-scope="scope">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              v-model="scope.row.unitId"
              placeholder="请选择"
              style="width: 100%"
              clearable
              filterable
              :disabled="readonly"
            >
              <el-option
                v-for="item in scope.row.unitList"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="name" width="120" align="center">
          <template slot-scope="scope">
            <el-link
              type="danger"
              plain
              size="small"
              @click.native.prevent="
                readonly || scope.row.id === '0' ? '' : deleteRow(scope.$index, tableData)
              "
              :disabled="readonly || scope.row.id === '0'"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">
        {{ readonly ? "关闭" : "取消" }}
      </el-button>
      <el-button v-if="!readonly" type="primary" @click="childEvtHandle">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save } from "./api";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import { FormMixin } from "@/mixins/FormMixin";
import * as api from "@/components/CorSelect/api";
export default {
  name: "dataform",
  mixins: [FormMixin],
  data() {
    return {
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
        ownerUnit: "",
        ownerUnitName: "",
        secondUnit: "",
        secondUnitName: ""
      },

      formDataRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        ownerUnit: [{ required: true, message: "请选择", trigger: "change" }],
        secondUnit: [{ required: true, message: "请选择", trigger: "change" }]
      },

      tableData: [],

      /**部门选择 */
      deptDialog: {
        selection: [],
        show: false,

        /**业务数据 */
        data: {},
        /**业务字段 */
        fields: []
      },
      deptTypes: [],

      /**组织机构选择 */
      deptShow: false,

      /**单位类型字典 */
      unitType: {
        code: "UNIT_TYPE",
        options: []
      },
      /**单位下拉列表 */
      unitData: []
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"])
  },
  created() {
    this.getDictItemList(this.unitType);
    console.log("this.$route", this.$route);
  },
  mounted() {
    // this.getCorpTree();
  },
  props: {
    title: {
      type: String,
      default: "新增"
    }
    /**显示弹窗 */
    // dialogtitle: {
    //   type: String,
    //   default: "标题",
    // },
    /**已经选中pbs信息 */
    // data: {
    //   type: Object,
    //   default: {},
    // },
    /**是否只读 */
    // readonly: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  methods: {
    /**新增子表 */
    addHandle() {
      this.tableData.push({
        baseId: this.formData.id,
        unitList: [],
        unitId: "",
        unitIdName: ""
      });
    },
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      if (!this.beforeSubmit(this.dataFormRef)) return;
      let fields = { ...this.formData };
      fields.subDetail = this.tableData;
      //做业务数据的保存,修改。
      save(fields)
        .then((res) => {
          const { success, message } = res;
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
    /** 单位类型选则时间*/
    handleChange(type, index) {
      this.$set(this.tableData[index], "unitId", "");
      this.tableData[index].unitList = this.unitData.filter(
        (item) => item.corpDesc === type
      );
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /**删除子级 */
    async deleteRow(index, rows) {
      try {
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning"
        });
        //删除数据
        rows.splice(index, 1);
      } catch (e) {
        console.error(e);
      }
    },
    /** 获取整体单位树*/
    async getCorpTree() {
      try {
        const { success, message, data } = await api.getTypeCorp();
        if (!success) {
          return this.$message.error("获取单位树失败:" + message);
        }
        let temp = [];
        if (data) {
          temp = data;
        }
        // 所有单位列表
        this.unitData = JSON.parse(JSON.stringify(temp))[0].children
          ? JSON.parse(JSON.stringify(temp))[0].children
          : [];

        // 新增时默认选中第一个业主单位
        if (!this.data.id) {
          let yzdw = this.unitData.filter((item) => item.corpDesc === "yzdw")[0];
          if (yzdw) {
            this.formData.ownerUnit = yzdw.corpId;
            this.formData.ownerUnitName = yzdw.corpName;
          }
        }

        // 查看编辑时回显数据
        this.tableData.forEach((item) => {
          this.$set(
            item,
            "unitList",
            this.unitData.filter((item1) => item1.corpDesc === item.type)
          );
        });
      } catch (error) {
        this.$message.error("获取单位树失败:" + error);
      }
    }
  },
  watch: {
    visible: {
      async handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          // 新增时无需赋值
          if (this.data.id) {
            this.formData = { ...this.data };
          }
          this.tableData = this.data.subDetail || [];
        }
        await this.getCorpTree();
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true
    }
  }
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
