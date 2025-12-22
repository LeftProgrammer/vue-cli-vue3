<template>
  <el-dialog
    v-draggable
    :visible.sync="dialogVisible"
    width="500px"
    :title="title"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-form ref="addForm" :rules="rules" :model="addData" label-width="100px">
      <el-form-item label="父节点">
        <el-input v-model="addData.parentNodeName" disabled />
      </el-form-item>
      <el-form-item label="节点名称" prop="nodeName">
        <el-input
          v-model="addData.nodeName"
          :disabled="isShow"
          placeholder="请输入节点名称"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="节点编码" prop="code">
        <el-input
          v-model="addData.code"
          :disabled="isShow"
          placeholder="请输入节点编码"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer" align="center" class="dialog-footer">
      <el-button @click="closeDialog">{{ isShow ? "关闭" : "取消" }}</el-button>
      <el-button v-if="!isShow" type="primary" @click="handelDialogConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  saveEstimateCatalogueTree,
  updateEstimateCatalogueTree,
} from "@/api/estimate.js";
export default {
  name: "TreeForm",
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
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      addData: {
        pid: "",
        nodeName: "",
        code: "",
        updateUserName: "",
        updateDate: "",
      },
      selectionNode: {
        parentNodeName: "",
        pid: "",
      },
      rules: {
        nodeName: [
          { required: true, message: "请输入节点名称", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入节点编码", trigger: "blur" }],
      },
    };
  },
  computed: {
    isAdd() {
      return this.mode === "add";
    },
    isShow() {
      return this.mode === "view";
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
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
      handler(val) {
        if (this.dialogVisible && val) {
          this.$nextTick(() => {
            this.initFormData();
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    },
    initFormData() {
      console.log("初始化表单数据", this.nodeData, this.parentNode);
      if (this.nodeData) {
        this.addData = { ...this.nodeData };
      }
    },

    handelDialogConfirm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.saveEstimateCatalogueTree();
          } else {
            this.updateEstimateCatalogueTree();
          }
        }
      });
    },
    async saveEstimateCatalogueTree() {
      if (!this.addData.pid) {
        this.addData.pid = 0;
      }
      try {
        const { data, success, message } = await saveEstimateCatalogueTree(
          this.addData
        );
        if (!success) {
          this.$message.error("添加失败：" + message);
          return false;
        }
        this.$message.success("添加成功");
        this.dialogVisible = false;
        this.$emit("refresh");
        return true;
      } catch (err) {
        console.error(err);
        this.$message.error("添加失败");
        return false;
      }
    },
    async updateEstimateCatalogueTree() {
      try {
        const { data, success, message } = await updateEstimateCatalogueTree({
          nodeName: this.addData.nodeName,
          code: this.addData.code,
          id: this.addData.id,
          pid: this.addData.pid,
        });
        if (!success) {
          this.$message.error("修改失败：" + message);
          return false;
        }
        this.$message.success("修改成功");
        this.dialogVisible = false;
        this.$emit("refresh");
      } catch (err) {
        console.error(err);
        this.$message.error("修改失败");
        return false;
      }
    },
  },
};
</script>
