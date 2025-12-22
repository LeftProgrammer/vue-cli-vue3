<template>
  <div>
    <el-dialog
      v-draggable :title="title" :visible.sync="dialogShow" :close-on-press-escape="false"
      :close-on-click-modal="false" append-to-body width="40%" @closed="closedHandle"
    >
      <el-form ref="dataFormRef" :model="formData" :rules="formDataRules" label-width="auto" :disabled="data.isView">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="制度名称" prop="regulationName">
              <el-input v-model="formData.regulationName" placeholder="请输入" width="100%" maxlength="255" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制度编号" prop="regulationCode">
              <el-input v-model="formData.regulationCode" placeholder="请输入" width="100%" maxlength="255" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签发单位" prop="issuanceUnit">
              <el-cascader
                v-model="formData.issuanceUnit"
                class="w-100pre"
                :props="unitTreeProps"
                :show-all-levels="false"
                :options="unitTree"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发文日期" prop="issuanceDate">
              <el-date-picker
                v-model="formData.issuanceDate" type="date" clearable value-format="yyyy-MM-dd"
                class="w-100pre"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="上传文件" prop="file">
              <uploadFile
                v-model="formData.file" :readonly="readonly" :limit="5" :max-size="50"
                @change="handleFileChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closedHandle">
          {{ data.isView ? "关闭" : "取消" }}
        </el-button>
        <el-button v-if="!data.isView" type="primary" @click="sure"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save, update, BelongTo, unitList } from "./api";
import { FormMixin } from "@/mixins/FormMixin";
import PbsSelect from "@/components/PbsSelect/index.vue";
import ElQuarterPicker from "@/components/ElQuarterPicker";
import { getSectionByCorpId } from "@/api/measure";
export default {
  name: "Dataform",
  components: {
    PbsSelect,
    ElQuarterPicker
  },
  mixins: [FormMixin],
  props: {
    unitTree: {
      type: Array,
      default: []
    },
    enterAble: {
      type: Boolean,
      default: true
    },
    view: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    }
    // visible{}
  },
  data() {
    return {
      dialogShow: false,
      unitTreeProps: {
        expandTrigger: "hover",
        children: "children",
        emitPath: false,
        label: "corpName",
        value: "corpId",
      },
      formData: {
        name: null,
        params: {
          projectPbs: {
            name: ""
          }
        }
      },
      formDataRules: {
        regulationName: [{ required: true, message: "请输入制度名称", trigger: "blur" }],
        regulationCode: [{ required: true, message: "请输入制度编号", trigger: "blur" }],
        issuanceUnit: [{ required: true, message: "请选择所属单位", trigger: "change" }],
        issuanceDate: [{ required: true, message: "请选择时间", trigger: "blur" }],
        file: [{ required: true, message: "请上传报告文件", trigger: "change" }],
        sectionId: [{ required: true, message: "请选择标段", trigger: "change" }]
      },
      belongUnit: [],
      sectionList: []
    };
  },
  computed: {},
  watch: {
    visible: {
      handler(newValue) {
        this.dialogShow = newValue;
        this.$nextTick(() => {
          this.formData = this.data.data;
        });
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getBelongTo();
  },
  mounted() { },
  methods: {
    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate("file");
      }
    },
    selectDate(val) {
      this.$refs["dataFormRef"].clearValidate("date");
    },
    // 确认按钮
    sure() {
      if (this.data.isView) {
        this.closedHandle();
        return;
      }
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          // this.formData.name = this.getFileName(this.formData.file);
          if (!this.formData.id) {
            this.formData.type = this.date;
            save(this.formData).then((res) => {
              if (res.success) {
                this.$message.success("添加成功");
                this.closedHandle();
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            update(this.formData).then((res) => {
              if (res.success) {
                this.$message.success("修改成功");
                this.closedHandle();
              } else {
                this.$message.error(res.message);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    closedHandle() {
      this.$emit("sureson");
      this.dialogShow = false;
    },
    getFileName(fileName) {
      let name = "";
      let arr = JSON.parse(fileName);
      if (fileName && Array.isArray(arr) && arr.length > 0) {
        name = arr[0].name;
      }
      return name;
    },
    // 获取当前人的所属机构
    async getBelongTo() {
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId
      };
      try {
        // console.log("获取所有的单位");
        const result = await unitList();
        const { data, success } = result;
        if (!success) {
          this.unitListAll = [];
          this.$message.error("获取单位列表失败");
          return;
        }
        let units = data
          // .filter((item) => {
          // return item.corpLeaf !== 0;
          // })
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
        this.belongUnit = units;
        return units;
      } catch (err) {
        console.log("err", err);
      }
    },
    handleSelectChange(value) {
      console.log(value);
      this.$set(this.formData, "sectionId", "");
      // 清除校验
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate("sectionId");
      });
      this.sectionList = [];
      // this.getSectionList(value)
    },
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSectionByCorpId({
          corpId: corporateId
        });

        if (!success) {
          this.$message.error("查询标段失败：" + message);
          return false;
        }
        this.sectionList = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询标段失败");
        return false;
      }
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

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}
</style>
