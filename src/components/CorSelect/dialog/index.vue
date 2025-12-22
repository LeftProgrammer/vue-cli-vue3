<template>
  <el-dialog
    v-model="dialogShow"
    title="选择单位"
    modal-class="wbench-el-dialog"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="960px"
    @closed="closedHandle"
  >
    <div class="modal-main">
      <div class="main-box">
        <table class="box" cellpadding="0" cellspacing="0">
          <tr>
            <td class="lt">
              <div class="box-item">可选择单位</div>
              <div class="tree-box">
                <el-tree
                  ref="typeCorpTree"
                  :data="treeData"
                  show-checkbox
                  node-key="id"
                  :check-strictly="true"
                  :props="corpProps"
                  :default-expand-all="true"
                  :expand-on-click-node="false"
                />
              </div>
            </td>
            <td class="md">
              <div class="arrow rt-arrow">
                <span title="添加" @click="addCorps">+</span>
              </div>
            </td>
            <td class="rt">
              <div class="box-item">
                <span>已选择单位</span>
                <span class="del-text text-blue pointer" @click="removeCorps"
                  >删除所选单位</span
                >
              </div>
              <div class="user-list">
                <el-checkbox-group v-model="rtCheckList">
                  <div
                    v-for="(item, index) in checkedList"
                    :key="index"
                    class="user-item"
                  >
                    <el-checkbox :label="item">{{ item.corpName }}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="btn-box">
        <el-button type="primary" size="small" @click="modalEvt('close')"
          >取消</el-button
        >
        <el-button type="primary" size="small" @click="modalEvt('save')"
          >保存</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as api from "../api";

export default {
  name: "ExeCorModal",
  props: {
    single: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: undefined,
    },
  },
  emits: ["update:visible", "update:modelValue", "childEvt", "close"],
  data() {
    return {
      dialogShow: false,
      treeData: [],
      rtCheckList: [],
      checkedList: [],
      corpProps: {
        label: "corpName",
        children: "children",
      },
    };
  },
  watch: {
    visible: {
      handler(newValue) {
        if (this.modelValue !== undefined) {
          return;
        }
        this.reset();
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
    },
    modelValue: {
      handler(newValue) {
        if (newValue === undefined) {
          return;
        }
        this.reset();
        this.dialogShow = newValue;
      },
      immediate: true,
    },
    dialogShow: {
      handler(newValue) {
        if (this.modelValue !== undefined) {
          this.$emit("update:modelValue", newValue);
        }
        this.$emit("update:visible", newValue);
      },
    },
  },
  mounted() {
    this.getTypeCorp();
  },
  methods: {
    reset() {
      this.checkedList = [];
      this.rtCheckList = [];
    },
    closedHandle() {
      this.dialogShow = false;
      this.$emit("update:visible", false);
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
    async getTypeCorp() {
      try {
        const { success, message, data } = await api.getTypeCorp();
        if (!success) {
          return this.$message.error("获取单位树失败:" + message);
        }
        let temp = [];
        if (data) {
          temp = data;
        }
        this.treeData = JSON.parse(JSON.stringify(temp));
      } catch (error) {
        this.$message.error("获取单位树失败:" + error);
      }
    },

    addCorps() {
      const lists = this.$refs.typeCorpTree.getCheckedNodes(false, false);
      if (lists.length === 0) return;
      const tempIds = [];
      const addArrs = [];
      this.checkedList.map((item) => {
        tempIds.push(item.corpId);
      });
      const idStr = tempIds.join(",") + ",";
      lists.map((item) => {
        if (!(idStr.indexOf(item.corpId + ",") > -1)) {
          addArrs.push(item);
        }
      });
      addArrs.map((item) => {
        this.checkedList.push({
          corpId: item.corpId,
          corpName: item.corpName,
        });
      });
      this.$refs.typeCorpTree.setCheckedKeys([]);
    },

    removeCorps() {
      if (this.rtCheckList.length === 0) return;
      const result = [];
      const tempChecked = [];
      this.rtCheckList.map((item) => {
        result.push(item.corpId);
      });
      const idStr = result.join(",") + ",";
      this.checkedList.map((item) => {
        if (!(idStr.indexOf(item.corpId + ",") > -1)) {
          tempChecked.push(item);
        }
      });
      this.checkedList = tempChecked;
      this.rtCheckList = [];
    },

    modalEvt(type) {
      if (type === "save") {
        if (this.checkedList.length === 0) {
          return this.$message.error("请选择单位");
        }
        if (this.single) {
          if (this.checkedList.length > 1) {
            return this.$message.error("只能选择一个单位");
          }
        }
        this.$emit("childEvt", { type: "save", data: this.checkedList });
      } else {
        this.$emit("childEvt", { type: "close" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-main {
  width: 100%;
  padding-top: 5px !important;

  .main-box {
    padding: 0 15px;

    .box {
      margin-top: 10px;
      table-layout: fixed;
      width: 100%;

      td {
        height: 450px;
        border: 1px solid #d8d8d8;
        padding: 10px;

        &.md {
          width: 50px;
          border: none;
        }

        &.ex {
          width: 45px;
          border: none;
          padding: 0 0 0 7px;
        }

        &.lt {
          padding: 0;
          vertical-align: top;

          .box-item {
            line-height: 36px;
          }

          .tree-box {
            height: calc(100% - 58px);
            padding: 5px 0;
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
          }
        }

        &.rt {
          padding: 0;
          vertical-align: top;

          .box-item {
            line-height: 36px;

            &:after {
              display: block;
              width: 0;
              height: 0;
              content: "";
              overflow: hidden;
              clear: both;
            }

            .del-text {
              float: right;
            }
          }

          .user-list {
            height: calc(100% - 56px);
            overflow-x: hidden;
            overflow-y: auto;
            padding: 10px;
            box-sizing: border-box;
          }
        }
      }

      .arrow {
        text-align: center;
        line-height: 32px;
        height: 32px;

        &:first-child {
          margin-bottom: 10px;
        }

        span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          cursor: pointer;
          border: 1px solid #d8d8d8;
          border-radius: 4px;
          user-select: none;
        }

        &.rt-arrow {
          span:hover {
            background: #f6f9f9;
          }
        }
      }

      .box-item {
        background-color: #f6f9f9;
        padding: 10px;
        height: 56px;
        box-sizing: border-box;
        border-bottom: 1px solid #d8d8d8;
      }

      div.user-item {
        margin-bottom: 5px;
      }
    }
  }

  .btn-box {
    margin-top: 10px;
    text-align: right;
    padding: 15px 20px;
  }
}
</style>
