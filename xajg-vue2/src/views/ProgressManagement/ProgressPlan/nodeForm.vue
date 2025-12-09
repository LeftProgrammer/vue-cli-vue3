<template>
  <div>
    <!-- 头部 -->
    <el-dialog
      :visible.sync="dialogShow"
      :title="title"
      :close-on-click-modal="false"
      @closed="closedDialog"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="readonly"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上级WBS名称:" size="mini">
              <span class="font-w-600 text-333">{{ parentName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="编码" size="mini" prop="code">
              <el-input
                show-word-limit
                maxlength="20"
                class="w-100pre"
                v-model="formData.code"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称" size="mini" prop="name">
              <el-input
                class="w-100pre"
                show-word-limit
                maxlength="30"
                v-model="formData.name"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始日期" size="mini" prop="planStartDate">
              <el-date-picker
                style="width: 100%"
                v-model="formData.planStartDate"
                type="date"
                value-format="timestamp"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束日期" size="mini" prop="planEndDate">
              <el-date-picker
                style="width: 100%"
                v-model="formData.planEndDate"
                type="date"
                value-format="timestamp"
                placeholder="请选择"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="类型" size="mini" prop="type">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.type"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in types"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="工程部位"
              :rules="
                dialogType == 'WORK'
                  ? [{ required: true, message: '请选择' }]
                  : [{ required: false }]
              "
            >
              <el-input
                disabled
                placeholder="请选择"
                v-model="formData.pbsName"
              >
                <template slot="append">
                  <div @click.stop="showPbs">选择</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="dialogType == 'WORK'">
            <el-form-item label="计划起桩号" size="mini" prop="startStakeMark">
              <el-input
                class="w-100pre"
                v-model="formData.startStakeMark"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dialogType == 'WORK'">
            <el-form-item label="计划止桩号" size="mini" prop="endStakeMark">
              <el-input
                class="w-100pre"
                v-model="formData.endStakeMark"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" align="center">
              <template>
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="100"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  placeholder="请输入备注"
                  v-model="formData.remark"
                ></el-input>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer flex justify-end">
        <span>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <pbs-select
      :visible.sync="pbsDialog.show"
      :selection="pbsDialog.selection"
      @childEvt="pbsSelectedHandle"
      @closed="pbsDialog.show = false"
    />
  </div>
</template>

<script>
import PbsSelect from "@/components/PbsSelect/index.vue";
import { getDictItemList } from "@/api/dict";
export default {
  props: {
    title: {
      default: "标题",
      type: String,
    },
    tableData: {
      default: () => [],
      type: Array,
    },
  },
  components: {
    PbsSelect,
  },

  computed: {
    pickerOptions() {
      let _this = this;
      return {
        disabledDate(time) {
          return (
            time.getTime() < new Date(_this.formData.planStartDate).getTime()
          );
        },
      };
    },
  },

  data() {
    return {
      dialogType: "",
      parentName: "",
      dialogShow: false,
      formData: {},
      readonly: false,
      types: [], //类型
      formDataRules: {
        code: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
          },
        ],
        planStartDate: [
          {
            required: true,
            message: "请选择计划开始时间",
            trigger: "change",
          },
        ],

        planEndDate: [
          {
            required: true,
            message: "请选择计划结束时间",
            trigger: "change",
          },
        ],
        // pbsCode: [
        //   {
        //     required: false,
        //     message: "请选择工程部位",
        //     trigger: "blur",
        //   },
        // ],
      },
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },

      //当前选择行
      curRow: null,
    };
  },
  watch: {
    "formData.planStartDate": {
      handler(val) {
        if (this.formData.planEndDate) {
          if (this.formData.planStartDate > this.formData.planEndDate) {
            this.$message.error("计划开始时间不能大于计划结束时间");
            this.formData.planEndDate = null;
          }
        }
        console.log("planEndDate", val, this.formData.planEndDate);
      },
    },
  },
  methods: {
    closedDialog() {
      this.$emit("closedDialog");
    },
    // 新增节点
    add(code, selectItem, row) {
      console.log("setdialogShow", code, selectItem);
      this.dialogShow = true;
      this.$nextTick(() => {
        this.getTypeDit(code);
        // 初始化form
        this.$refs["formData"].resetFields();
        this.formData = {};
        // row 有数据则代表是列表编辑  查看 为null  表示新增
        if (row) {
        } else {
          // 新增  如果有 selectItem说明是 列表页增加子节点 否则增加根目录
          if (selectItem) {
            this.formData.pid = selectItem.id;
            this.parentName = selectItem.name;
          } else {
            this.formData.pid = 0;
            this.parentName = "根目录";
          }
        }
      });
    },
    // 编辑节点
    edit(row, code) {
      let node = { ...row };
      this.parentName = "";
      console.log("编辑", node);
      this.dialogShow = true;
      this.$nextTick(() => {
        this.getTypeDit(code);
        // 初始化form
        this.$refs["formData"].resetFields();
        this.formData = {};
        this.formData = node;
        this.dialogType = node.workType;
      });
    },
    /**获取分类字典 */
    async getTypeDit(code) {
      let { data } = await getDictItemList(code);
      this.types = data;
      console.log("获取分类字典", data);
    },
    // 校验表单数据
    checkForm() {
      let flag = true;
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    // 递归成一维数组
    getTreeData(data, arr = []) {
      // 数据展开成为一维度   递归
      data.forEach((item) => {
        arr.push(item);
        if (item?.children?.length > 0) {
          let children = item?.children;
          this.getTreeData(children, arr);
        }
      });
      return arr;
    },
    /*接收到父级的消息处理完后返回给父级*/
    save() {
      // 获取table的数据
      // 校验表单
      let ok = this.checkForm();
      console.log("ok", ok);
      if (!ok) return;
      //   这里只是让 页面上的数据发生变化而已 并不发送请求
      this.$emit("upload", { ...this.formData });
      this.dialogShow = false;
    },
    /** 选择PBS */
    showPbs() {
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      console.log("pbs", pbs);
      this.formData.pbsCode = pbs.code;
      this.formData.pbsName = pbs.name;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}
</style>
