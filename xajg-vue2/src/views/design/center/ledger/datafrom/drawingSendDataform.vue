<template>
  <el-dialog
    title="查看-交底信息"
    custom-class="wbench-el-dialog"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    fullscreen
    @closed="closedHandle"
  >
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
            <el-input disabled placeholder="请选择" v-model="formData.code">
              <template slot="append">
                <div @click="chooseDraw">选择</div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图纸名称" prop="name">
            <el-input
              disabled
              v-model="formData.name"
              placeholder="请输入图纸名称"
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
          <el-form-item label="工程部位" prop="pbsCode">
            <pbs-select
              v-model="formData.pbsCode"
              :readonly="readonly"
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

        <el-table-column label="操作" prop="name" width="220" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="$previewFileById(row)"
              >预览</el-button
            >
            <el-button @click="$downFileById(row)" type="text" size="small">
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

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
  </el-dialog>
</template>

<script>
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import UserSelect from "@/components/newUserSelect/index.vue";
import DepSelect from "@/components/DepSelect/index.vue";
import { mapGetters } from "vuex";
import originalDrawing from "@/components/originalDrawing/index.vue";
export default {
  name: "drawingSendDataform",
  components: {
    UserSelect,
    DepSelect,
    originalDrawing,
  },
  data() {
    return {
      canDeleteRow: false,
      dialogShow: false,
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
        name: [{ required: true, message: "请输入图纸名称", trigger: "blur" }],
        code: [{ required: true, message: "请选择图纸", trigger: "blur" }],
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
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
  },
  async created() {
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.getFlowPROFESSION();
    // this.getSupplyList();
    //获取数据
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

    edit(row, disbled) {
      this.readonly = disbled;
      this.formData = row;
      this.tableData = JSON.parse(row.uploadFile || "[]");
    },

    closedHandle() {
      this.dialogShow = false;
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        if (row) {
          const currentUser = this.$getStorage("userInfo").userId;
          this.canDeleteRow = row.createUser !== currentUser;
          this.tableData = JSON.parse(row.uploadFile || "[]");
          this.formData = row;
        }
      } catch (error) {
        // 处理错误，例如打印错误消息或执行其他逻辑
        console.error("Error in getFlowRow:", error);
      }
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
  },
  watch: {},
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
  border: 1px solid #dcdfe6;
  color: #808080;
  cursor: default;
}
/deep/ .el-form.formDisabled {
  .el-input-group__append {
    background-color: #f5f7fa;
    color: #909399;
    border: 1px solid #dcdfe6;
  }
}
.line {
  background-color: #dcdfe6;
  height: 1px;
  margin: 5px 0 10px 0;
}
</style>
