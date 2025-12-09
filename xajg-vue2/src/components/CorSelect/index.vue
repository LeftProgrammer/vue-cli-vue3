<template>
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
              <span title="添加" @click="addCorps" />
            </div>
          </td>
          <td class="rt">
            <div class="box-item">
              <span>已选择单位</span>
              <span class="del-text text-blue pointer" @click="removeCorps">删除所选单位</span>
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
      <el-button
        type="primary"
        icon="el-icon-circle-close"
        size="mini"
        @click="modalEvt('close')"
      >取消
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-check"
        size="mini"
        @click="modalEvt('save')"
      >保存
      </el-button>
    </div>
  </div>
</template>

<script>
// import { Vue, Component } from "vue-property-decorator";
import * as api from "./api";

// @Component({
//   name: "ExeCorModal"
// })
export default {
  name: "ExeCorModal",
  props: {
    single: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      treeData: [],
      rtCheckList: [],
      checkedList: [],
      corpProps: {
        label: "corpName",
        children: "children",
      },
    };
  },
  mounted() {
    this.getTypeCorp();
  },
  methods: {
    /* 获取整体单位树*/
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

    /* 选择单位*/
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
    /* 移出单位*/
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
          // 未选中，代表不取消
          tempChecked.push(item);
        }
      });
      this.checkedList = tempChecked;
      this.rtCheckList = [];
    },
    /* 保存取消*/
    async modalEvt(type) {
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
/deep/ .el-dialog__body {
  max-height: 65vh !important;
}
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
          display: inline-block;
          width: 32px;
          height: 32px;
          background-image: url("../../assets/img/icon32.png");
          background-repeat: no-repeat;
          cursor: pointer;
        }

        &.rt-arrow {
          span {
            background-position: 0 -256px;

            &:hover {
              background-position: -128px -256px;
            }
          }
        }

        &.lt-arrow {
          span {
            background-position: -32px -256px;

            &:hover {
              background-position: -160px -256px;
            }
          }
        }

        &.up-arrow {
          span {
            background-position: -64px -256px;

            &:hover {
              background-position: -192px -256px;
            }
          }
        }

        &.dn-arrow {
          span {
            background-position: -96px -256px;

            &:hover {
              background-position: -224px -256px;
            }
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
