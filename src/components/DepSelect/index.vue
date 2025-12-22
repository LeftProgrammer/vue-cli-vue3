<template>
  <div class="modal-main">
    <div class="main-box">
      <table class="box" cellpadding="0" cellspacing="0">
        <tr>
          <td class="lt">
            <div class="box-item">可选择部门</div>
            <div class="tree-box">
              <el-tree
                id="typeCorpTree"
                ref="typeCorpTree"
                class="tree-defined modal-tree"
                :data="corpTree"
                node-key="id"
                :props="corpProps"
                :default-expand-all="true"
                :expand-on-click-node="false"
                @node-click="nodeClick"
              >
                <template #default="{ data }">
                  <div class="tree-text-box" :textId="data.corpId">
                    <span>{{ data.corpName }}</span>
                  </div>
                </template>
              </el-tree>
            </div>
            <div class="box-item small" />
            <div class="tree-box">
              <el-tree
                ref="typeDepTree"
                show-checkbox
                :data="depTree"
                node-key="id"
                :check-strictly="true"
                :props="depProps"
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
              <span>已选择部门</span>
              <span class="del-text text-blue pointer" @click="removeCorps"
                >删除所选部门</span
              >
            </div>
            <div class="user-list">
              <el-checkbox-group v-model="rtCheckList">
                <div
                  v-for="(item, index) in checkedList"
                  :key="index"
                  class="user-item"
                >
                  <el-checkbox :label="item">{{ item.departName }}</el-checkbox>
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
</template>

<script>
import * as api from "@/components/CorSelect/api";

export default {
  name: "ExeDepModal",
  props: {
    single: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      corpTree: [],
      corpId: "",
      depTree: [],
      rtCheckList: [],
      checkedList: [],
      corpProps: {
        label: "corpName",
        children: "children",
      },
      depProps: {
        label: "departName",
        children: "children",
      },
    };
  },
  async mounted() {
    await this.getTypeCorp();
    this.$nextTick(() => {
      const root = document.getElementById("typeCorpTree");
      if (!root) {
        return;
      }
      const divs = root.querySelectorAll(".tree-text-box");
      if (divs && divs.length > 0) {
        divs[0].click();
      }
    });
  },
  methods: {
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
        this.corpTree = JSON.parse(JSON.stringify(temp));
      } catch (error) {
        this.$message.error("获取单位树失败:" + error);
      }
    },
    async getTypeDepart() {
      if (!this.corpId) {
        return false;
      }
      try {
        const { success, message, data } = await api.getTypeDepart(this.corpId);
        if (!success) {
          return this.$message.error("获取部门树失败:" + message);
        }
        let temp = [];
        if (data) {
          temp = data;
        }
        this.depTree = JSON.parse(JSON.stringify(temp));
      } catch (error) {
        this.$message.error("获取部门树失败:" + error);
      }
    },
    nodeClick(data) {
      this.corpId = data.corpId;
      this.getTypeDepart();
    },
    addCorps() {
      const lists = this.$refs.typeDepTree.getCheckedNodes(false, false);
      if (lists.length === 0) return;
      const tempIds = [];
      const addArrs = [];
      this.checkedList.map((item) => {
        tempIds.push(item.departId);
      });
      const idStr = tempIds.join(",") + ",";
      lists.map((item) => {
        if (!(idStr.indexOf(item.departId + ",") > -1)) {
          addArrs.push(item);
        }
      });
      addArrs.map((item) => {
        this.checkedList.push({
          departId: item.departId,
          departName: item.departName,
        });
      });
      this.$refs.typeDepTree.setCheckedKeys([]);
    },
    removeCorps() {
      if (this.rtCheckList.length === 0) return;
      const result = [];
      const tempChecked = [];
      this.rtCheckList.map((item) => {
        result.push(item.departId);
      });
      const idStr = result.join(",") + ",";
      this.checkedList.map((item) => {
        if (!(idStr.indexOf(item.departId + ",") > -1)) {
          tempChecked.push(item);
        }
      });
      this.checkedList = tempChecked;
      this.rtCheckList = [];
    },
    modalEvt(type) {
      if (type === "save") {
        if (this.checkedList.length === 0) {
          return this.$message.error("请选择部门");
        }
        if (this.single) {
          if (this.checkedList.length > 1) {
            return this.$message.error("只能选择一个部门");
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

            &.small {
              height: 38px;
              border-top: 1px solid #d8d8d8;
              border-bottom: 1px solid #d8d8d8;
            }
          }

          .tree-box {
            height: calc((100% - 100px) / 2);
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
