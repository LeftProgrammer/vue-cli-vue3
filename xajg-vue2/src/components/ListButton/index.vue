<template>
  <div class="list-button-container">
    <!-- 显示更多 -->
    <template v-if="showMore">
      <el-link
        v-for="(item, index) in btns.slice(0, 2)"
        :key="index"
        :type="item.method == 'delete' ? 'danger' : item.type || 'primary'"
        :underline="false"
        :disabled="typeof item.disabled === 'boolean' ? item.disabled : disabledBtn(item)"
        plain
        @click="handleClick(item, data)"
      >
        {{ item.title }}
      </el-link>

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          更多<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in btns.slice(2, btns.length)"
            :key="index"
            :command="item.method"
            :disabled="
              typeof item.disabled === 'boolean' ? item.disabled : disabledBtn(item)
            "
          >
            {{ item.title }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <!-- 没有更多 -->
    <template v-else>
      <el-link
        v-for="(item, index) in btns"
        :key="index"
        :type="item.method == 'delete' ? 'danger' : item.type || 'primary'"
        :disabled="typeof item.disabled === 'boolean' ? item.disabled : disabledBtn(item)"
        :underline="false"
        plain
        @click="handleClick(item, data)"
      >
        {{ item.title }}
      </el-link>
    </template>

    <!-- <el-divider direction="vertical" v-if="showEdit && showView"></el-divider>
    <el-link
      type="primary"
      :disabled="isDisabledPromise(data, 'edit')"
      plain
      v-if="showEdit"
      @click="editHandle(data)"
    >
      {{ editHandleText }}
    </el-link>
    <el-divider
      direction="vertical"
      v-if="showDelete && (showEdit || showView)"
    ></el-divider>
    <template v-if="showDelete">
      <el-link
        v-if="!isDisabledPromise(data, 'delete') && !isSystem && !isMdgAdmin"
        @click="deleteHandle(data)"
        slot="reference"
        type="danger"
        plain
      >
        删除
      </el-link>
      <el-link
        v-else
        v-show="!isSystem && !isMdgAdmin"
        slot="reference"
        type="danger"
        :disabled="disDelete || createDisabled(data)"
        plain
        @click="deleteHandle(data)"
      >
        删除
      </el-link>
    </template>
    <template v-if="isSystem">
      <el-divider direction="vertical"></el-divider>
      <el-link type="danger" plain @click="deleteHandle(data)"> 管理员删除 </el-link>
    </template> -->
  </div>
</template>
<script>
import { BaseMixin } from "@/mixins/BaseMixin";
export default {
  name: "ListButton",
  mixins: [BaseMixin],
  props: {
    /**流程业务信息 */
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    editHandleText: {
      default: "编辑",
      type: String
    },
    /**数据所在index行数 */
    index: {
      type: Number || Object,
      default: null
    },
    /**显示哪些按钮 */
    btns: {
      type: Array || Object,
      default: () => [
        {
          title: "编辑",
          method: "edit"
        },
        {
          title: "删除",
          method: "delete"
        }
      ]
    },
    // disabledBtns: {
    //   type: Array || Object,
    //   default: () => null
    // },
    fromParent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showMore() {
      return (
        this.btns.filter(
          (x) =>
            (typeof x.visible === "boolean" && x.visible) ||
            typeof x.visible !== "boolean"
        ).length > 3
      );
    },
    userId() {
      return this.$getStorage("userInfo").userId;
    },
    disabledBtn() {
      return ({ disabled, method }) => {
        if (this.isSystem) return false;
        else {
          return (
            disabled ||
            (method == "edit" || method == "delete"
              ? this.data.createUser !== this.userId
              : false)
          );
        }
      };
    }
    // showView() {
    //   return !this.btns || this.btns.includes("view");
    // },
    // showEdit() {
    //   if (this.isSystem || this.isMdgAdmin) return false;
    //   return !this.btns || this.btns.includes("edit");
    // },
    // showDelete() {
    //   if (this.isSystem || this.isMdgAdmin) return false;

    //   return !this.btns || this.btns.includes("delete");
    // },
    // disView() {
    //   return !this.disabledBtns || this.disabledBtns.includes("view");
    // },
    // disEdit() {
    //   return !this.disabledBtns || this.disabledBtns.includes("edit");
    // },
    // disDelete() {
    //   return this.disabledBtns && this.disabledBtns.includes("delete");
    // }
  },
  data() {
    return {};
  },
  methods: {
    /**
     * @description: 点击按钮触发的事件
     */
    handleClick({ method, confirm, title }) {
      // 需要二次提醒
      if (method === "delete" || confirm) {
        this.$confirm(`确认${title}吗?`, "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$emit(method, this.data);
          })
          .catch(() => {});
      } else {
        this.$emit(method, this.data);
      }
    },
    /**
     * @description: 点击更多按钮触发的事件
     */
    handleCommand(command) {
      const btn = this.btns.find((item) => item.method === command);
      this.handleClick(btn);
    },
    // 之前这个按钮一直是被禁用的  所以默认返回true
    createDisabled(data) {
      let bool = true;
      // 前提条件是当前人 现在针对材料检测需要根据业务上来判断
      if (data.createUser == this.$getStorage("userInfo").userId) {
        bool = false;
        if (typeof this.$attrs.customDisabledFun === "function") {
          bool = this.$attrs.customDisabledFun(data);
        }
      }
      return bool;
    },
    isDisabledPromise(data, type) {
      let bool = false;
      // 第一步 判定是不是传入了权限按钮   如果传入就说明的 不验证 是不是本人创建的
      if (this.disabledBtns && this.disabledBtns.includes(type)) {
        bool = false;
      } else {
        bool = this.isDisabled(data);
      }
      // sendStatus 0  1 2   未提交 待签收 已完成
      // signStatus 0 1 2 3 4  未签收 部分签收 已签收  拒签  签收退回
      if (data.hasOwnProperty("signStatus")) {
        if (data.sendStatus == 2) {
          bool = true;
        } else {
          if (type == "edit") {
            if (data.sendStatus == 1) {
              // 退回 是可以编辑的 拒签也是可以编辑
              if (data.signStatus == 3 || data.signStatus == 4) {
                bool = false;
              } else {
                bool = true;
              }
            } else {
              bool = false;
            }
          } else {
            if (data.sendStatus == 0) {
              bool = false;
            } else {
              bool = true;
            }
          }
        }
      }
      //材料检测
      if (type == "edit") {
        if (data.hasOwnProperty("classification") && data.hasOwnProperty("source")) {
          console.log(data, type);
          //本人，报检通知人员才可编辑
          bool = !this.isDisabledByTest(data);
        }
      }
      return bool;
    },
    isEmpty(data) {
      if (data === "" || data === null || data === undefined) {
        return true;
      } else {
        return false;
      }
    },
    isIncludes(data) {
      let targetValue = this.$getStorage("userInfo").userId; // 目标值
      if (data && data.length > 0) {
        let constructionUnits = data.split(","); // 将逗号分隔的字符串转换为数组
        if (constructionUnits.includes(targetValue)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    isDisabledByTest(row) {
      //如果存在附加信息不可编辑
      if (row.hasOwnProperty("testDate") && !this.isEmpty(row.testDate)) {
        return false;
      }
      if (row.hasOwnProperty("needTest") && !this.isEmpty(row.needTest)) {
        return false;
      }
      // 只有当前的状态是本人
      if (
        row.createUser == this.$getStorage("userInfo").userId ||
        row.userId == this.$getStorage("userInfo").userId ||
        this.isIncludes(row.constructionUnitLaboratory) ||
        this.isIncludes(row.testSupervisionEngineer) ||
        this.isIncludes(row.testCenter)
      ) {
        return true;
      } else {
        return false;
      }
    },

    isDisabled(row) {
      // 只有当前的状态是本人
      if (
        row.createUser == this.$getStorage("userInfo").userId ||
        row.userId == this.$getStorage("userInfo").userId
      ) {
        return this.fromParent;
      } else {
        return true;
      }
    },
    getListVueComp(v) {
      let listVueComp = null;
      while (v.$parent) {
        if (v.$parent.oprateRow) {
          return v.$parent;
        }
        return this.getListVueComp(v.$parent);
      }
      return null;
    },
    /** 查看*/
    viewHandle(row) {
      let parent = this.getListVueComp(this);
      if (parent && parent.oprateRow) {
        if (this.index === 0 || this.index) {
          row.$index = this.index;
        }
        parent.oprateRow.data = row;
        parent.oprateRow.dialogShow = true;
        parent.oprateRow.isView = true;
        console.log("parent.oprateRow", parent.oprateRow);
      }
      this.$emit("view", row, true);
    },
    /** 编辑*/
    editHandle(row) {
      let parent = this.getListVueComp(this);
      if (parent && parent.oprateRow) {
        if (this.index === 0 || this.index) {
          row.$index = this.index;
        }
        parent.oprateRow.data = row;
        parent.oprateRow.dialogShow = true;
        parent.oprateRow.isView = false;
      } else {
        console.log("parent oprateRow 获取为空");
      }
      this.$emit("edit", row, false);
    },
    /** 删除*/
    deleteHandle(row) {
      this.$confirm("确认删除吗?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let parent = this.getListVueComp(this);
          if (parent && parent.oprateRow) {
            if (typeof parent.removeHandle === "function") {
              parent.removeHandle(row);
            }
          } else {
            console.log("parent oprateRow 获取为空");
          }
          this.$emit("delete", row);
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.list-button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  > * {
    padding: 0 8px;
  }
  .el-dropdown {
    .el-dropdown-link {
      height: 100%;
      color: #014acb;
      cursor: pointer;
    }
  }
}
</style>
