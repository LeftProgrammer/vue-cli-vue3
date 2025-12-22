<template>
  <el-dialog
    v-draggable
    :visible.sync="dialogVisible"
    :title="title"
    width="60%"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <el-form
      ref="addForm"
      :rules="rulesAdd"
      :model="addData"
      label-width="150px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="概算编码" prop="code">
            <el-input v-model="addData.code" :disabled="isSHow" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="概算名称" prop="name">
            <el-input
              v-model="addData.name"
              :disabled="isSHow"
              placeholder="请输入"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属分类" prop="baseId">
            <el-cascader
              ref="cascaderRef"
              :key="dialogKey"
              v-model="addData.baseId"
              :options="folderTreeData"
              :props="cascaderProps"
              :disabled="isSHow"
              clearable
              change-on-select
              placeholder="请选择概算分类"
              style="width: 100%"
              @change="handleTreeSelectChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位" prop="unit">
            <el-input
              v-model="addData.unit"
              :disabled="isSHow"
              placeholder="请输入"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量" prop="quantity">
            <el-input-number
              v-model="addData.quantity"
              :disabled="isSHow"
              placeholder="请输入"
              style="width: 100%"
              @change="calculateTotalPrice"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="概算单价" prop="estimateUnitPrice">
            <el-input-number
              v-model="addData.estimateUnitPrice"
              :disabled="isSHow"
              placeholder="请输入"
              style="width: 100%"
              :precision="2"
              @change="calculateTotalPrice"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="概算合价(万元)" prop="estimateTotalPrice">
            <el-input-number
              v-model="addData.estimateTotalPrice"
              :disabled="true"
              placeholder="自动计算"
              style="width: 100%"
              :precision="2"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预算单价" prop="budgetUnitPrice">
            <el-input-number
              v-model="addData.budgetUnitPrice"
              :disabled="isSHow"
              placeholder="请输入"
              style="width: 100%"
              :precision="2"
              @change="calculateTotalPrice"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预算合价(万元)" prop="budgetTotalPrice">
            <el-input-number
              v-model="addData.budgetTotalPrice"
              :disabled="true"
              placeholder="自动计算"
              style="width: 100%"
              :precision="2"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="概算类型" prop="type">
            <el-select
              v-model="addData.type"
              :disabled="isSHow"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="合同概算" :value="1" />
              <el-option label="非合同概算" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="累计完成" prop="cumulativeCompletion">
            <el-input-number
              v-model="addData.cumulativeCompletion"
              :disabled="isSHow"
              placeholder="请输入"
              style="width: 100%"
              :precision="2"
            />
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="addData.remark"
              type="textarea"
              rows="3"
              placeholder="请输入"
              :disabled="isSHow"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" align="center" class="dialog-footer">
      <el-button @click="handleCancel">{{
        mode === "view" ? "关闭" : "取消"
      }}</el-button>
      <el-button v-if="mode !== 'view'" type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getEstimateItemDetail,
  updateEstimateItem,
  saveEstimateItem,
} from "@/api/estimate.js";
import { SzgcProcessGetor } from "@szgc/wbench";
import CorSelect from "@/components/CorSelect/index";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import ListButton from "@/components/ListButton";
import Decimal from "decimal.js";

export default {
  name: "InvestmentEstimateItem",
  components: {
    CorSelect,
    TreeTableLayout,
    SzgcProcessGetor,
    ListButton,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "add", // 'add', 'edit', 'view'
    },
    nodeData: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: "",
    },
    treeData: {
      type: Array,
      default: () => [],
    },
    parentNode: {
      // 父节点
      type: Object,
      default: () => ({}),
    },
    dialogKey: {
      type: Number,
      default: () => 0,
    },
  },
  computed: {
    ...mapGetters(["loginInfo"]),
    dialogReadonly() {
      return this.mode === "view";
    },
    isAdd() {
      return this.mode === "add";
    },
    isSHow() {
      return this.mode === "view";
    },
    folderTreeData() {
      // 深度过滤函数 - 完全移除 nodeType === 'item' 的节点
      const filterNodes = (nodes) => {
        if (!nodes || !Array.isArray(nodes)) return [];

        return nodes
          .filter((node) => node.nodeType !== "item")
          .map((node) => {
            // 创建节点的副本
            const newNode = { ...node };

            // 递归处理子节点
            if (newNode.children && newNode.children.length) {
              newNode.children = filterNodes(newNode.children);
              // 如果子节点处理后为空数组，则删除 children 属性
              if (newNode.children.length === 0) {
                delete newNode.children;
              }
            } else {
              // 如果没有子节点或子节点数组为空，删除 children 属性
              delete newNode.children;
            }

            return newNode;
          });
      };
      // 返回过滤后的数据
      return filterNodes(JSON.parse(JSON.stringify(this.treeData || [])));
    },
    cascaderProps() {
      return {
        value: "id",
        label: "nodeName",
        children: "children",
        checkStrictly: true,
        expandTrigger: "click",
        emitPath: false,
      };
    },
  },
  data() {
    return {
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: (data) => {
          // 根据节点类型返回不同的属性作为显示文本
          return data.nodeName || data.name || "未命名节点";
        },
      },
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        name: "",
        code: "",
      },
      tableData: [],
      showDialog: false,
      addData: {
        mode: 1,
        baseId: "",
        nodeName: "",
        type: 1,
        quantity: 0,
        estimateUnitPrice: 0,
        estimateTotalPrice: 0,
        budgetUnitPrice: 0,
        budgetTotalPrice: 0,
        cumulativeCompletion: 0,
      },
      selectionNode: {
        id: "",
        nodeName: "",
      },
      rulesAdd: {
        code: {
          required: true,
          message: "请输入概算编码",
          trigger: "change",
        },
        name: {
          required: true,
          message: "请输入概算名称",
          trigger: "change",
        },
        baseId: {
          required: true,
          message: "请选择概算分类",
          trigger: "change",
        },
        type: {
          required: true,
          message: "请选择概算类型",
          trigger: "change",
        },
        cumulativeCompletion: {
          required: true,
          message: "请输入累计完成",
          trigger: "blur",
        },
        quantity: {
          required: true,
          message: "请输入数量",
          trigger: "blur",
        },
        unit: {
          required: false,
          message: "请输入单位",
          trigger: "blur",
        },
        budgetUnitPrice: {
          required: true,
          message: "请输入单价",
          trigger: "blur",
        },
        estimateUnitPrice: {
          required: true,
          message: "请输入概算单价",
          trigger: "blur",
        },
        budgetTotalPrice: {
          required: true,
          message: "请输入预算合价",
          trigger: "blur",
        },
        estimateTotalPrice: {
          required: true,
          message: "请输入概算合价",
          trigger: "blur",
        },
      },
      modalShow: false,
      editRow: null,
      flowShow: false,
      flowInfo: {
        businessId: "",
        status: false,
      },
      detailStatus: "mine",
      dataAll: {
        businessId: "",
        taskId: "",
      },
      treeDialog: false,
      treeDialogSelectNode: {},
      tableMultipleSelection: [],
      treeWidth: 267,
      showNodeEditDialog: false,
      editNodeData: {
        baseId: "",
        nodeName: "",
      },
      editNodeDataRules: {
        nodeName: {
          required: true,
          message: "请选择所属节点",
          trigger: "change",
        },
      },
    };
  },

  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.resetCascader();
        this.dialogVisible = val;
        if (val) {
          this.$nextTick(() => {
            this.initFormData();
          });
        }
      },
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit("close");
      }
    },
    nodeData: {
      handler(newVal) {
        if (newVal && newVal.id) {
          console.log("初始化表单数据", newVal);
          this.addData = JSON.parse(JSON.stringify(newVal)) || {};
        }
      },
      deep: true,
    },
  },
  methods: {
    dateFormat,
    resetCascader() {
      if (this.$refs.cascaderRef) {
        if (
          this.$refs.cascaderRef.$refs &&
          this.$refs.cascaderRef.$refs.panel
        ) {
          this.$refs.cascaderRef.$refs.panel.clearCheckedNodes();
        }
      }
    },
    // 初始化表单数据
    initFormData() {
      // 确保设置selectionNode
      if (this.nodeData && this.nodeData.id) {
        this.selectionNode = this.nodeData;
      }
      // 根据mode初始化表单
      if (this.mode === "add") {
        this.title = "新增";
        this.addData = {
          baseId: this.nodeData.baseId,
          nodeName: this.nodeData.nodeName,
          type: 1,
          quantity: 0,
          name: "",
          estimateUnitPrice: 0,
          estimateTotalPrice: 0,
          budgetUnitPrice: 0,
          budgetTotalPrice: 0,
          cumulativeCompletion: 0,
          unit: "", // 确保单位字段存在
          remark: "", // 确保备注字段存在
        };
        console.log("初始化新增表单", this.addData, "节点数据:", this.nodeData);
      }

      // 确保表单验证状态被重置
      this.$nextTick(() => {
        if (this.$refs.addForm) {
          this.$refs.addForm.clearValidate();
        }
      });
    },
    // 计算合价
    calculateTotalPrice() {
      const quantity = new Decimal(this.addData.quantity || 0);
      const estimateUnitPrice = new Decimal(
        this.addData.estimateUnitPrice || 0
      );
      const budgetUnitPrice = new Decimal(this.addData.budgetUnitPrice || 0);

      // 约定：数量×单价 的计算结果单位为“元”，需要以“万元”返回，保留两位小数
      // 概算合价（万元） = quantity * estimateUnitPrice / 10000
      const estimateTotalWan = quantity
        .times(estimateUnitPrice)
        .div(10000)
        .toFixed(2);
      this.addData.estimateTotalPrice = Number(estimateTotalWan);

      // 预算合价（万元） = quantity * budgetUnitPrice / 10000
      const budgetTotalWan = quantity
        .times(budgetUnitPrice)
        .div(10000)
        .toFixed(2);
      this.addData.budgetTotalPrice = Number(budgetTotalWan);
    },

    // 修改
    async updateEstimateItem() {
      try {
        const { data, success, message } = await updateEstimateItem(
          this.addData
        );
        if (!success) {
          this.$message.error("修改概算项失败" + message);
          return false;
        }
        this.$message.success("修改概算项成功");
        this.dialogVisible = false;
        this.$emit("refresh");
        return true;
      } catch (err) {
        console.error(err);
        this.$message.error("修改概算项失败");
        return false;
      }
    },
    // 关闭dialog
    closeDialog() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.mode === "edit") {
            this.updateEstimateItem();
          } else if (this.mode === "add") {
            this.saveEstimateItem();
          }
        }
      });
    },
    async saveEstimateItem() {
      try {
        const { data, success, message } = await saveEstimateItem(this.addData);
        if (!success) {
          this.$message.error("新增概算项失败" + message);
          return false;
        }
        this.$message.success("新增概算项成功!");
        this.dialogVisible = false;
        this.$emit("refresh");
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("新增概算项失败");
        }
        return false;
      }
    },

    // 查询文件详情
    async getEstimateItemDetail(id) {
      try {
        const { data, success, message } = await getEstimateItemDetail(id);

        if (!success) {
          this.$message.error("获取预算项详情失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取预算项详情失败");
        return false;
      }
    },

    beforeSubmit(name) {
      let res = true;
      this.$refs[name].validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      return res;
    },
    handleTreeSelectChange(value) {
      console.log("选中节点ID:", value);
      // 如果需要获取选中节点的完整数据
    },
    handleCancel() {
      this.dialogVisible = false;
    },
    handleConfirm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.saveEstimateItem();
          } else {
            this.updateEstimateItem();
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
