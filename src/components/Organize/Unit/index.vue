<template>
  <div
    :class="{
      readonly: readonly || disabled
    }"
  >
    <div class="choose-dev">
      <div class="tags text" v-if="orgNames.length == 0">请选择</div>
      <div class="tags" v-else>
        <el-tag v-for="(name, i) in orgNames" :key="i" type="info">
          {{ name }}
        </el-tag>
      </div>
      <div class="choosebtn" @click="choose">
        <i class="el-icon-arrow-right" />
      </div>
    </div>

    <!--不要删除，需要将父页面组件进行校验及时刷新-->
    <el-input
      v-model="orgName"
      class="input-hidden"
      type="hidden"
      placeholder="请选择"
      :title="orgName"
      disabled
    />

    <el-dialog
      v-draggable
      title="选择单位"
      custom-class="wbench-el-dialog"
      v-model="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      :width="fromapp ? '100vw' : '960px'"
      @closed="closedHandle"
    >
      <content-layout v-if="dialogShow" :show-form="false" :show-page="false">
        <template #table>
          <el-table
            ref="unitTable"
            :data="tableData"
            style="width: 100%"
            height="400"
            border
            highlight-current-row
            default-expand-all
            row-key="id"
            :expand-row-keys="unitIds"
            :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
            @current-change="handleCurrentRowChange"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
          >
            <el-table-column v-if="multiple" type="selection" width="55" />
            <el-table-column prop="name" label="单位名称" />
          </el-table>
        </template>
      </content-layout>
      <template #footer>
        <div v-if="!readonly" class="dialog-footer">
          <el-button type="primary" @click="confirmHandle"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ContentLayout from "@/components/ContentLayout/Table";
import * as api from "./api";
import { fromApp } from "@/utils/index";

// 选择器类型
const _OrgType = {
  // 单位选择器
  unit: 1,
  // 部门选择器
  dept: 2
};

/** 单位类型 */
const _CorpTypes = ["yzdw", "sjdw", "jldw", "sgdw", "dsfdw"];

export default {
  name: "OrganizeUnitIndex",
  components: {
    ContentLayout
  },
  emits: ["update:modelValue", "update:orgId", "change", "closed"],
  props: {
    /** Vue3 默认 v-model */
    modelValue: {
      type: [String, Array],
      default: "",
    },
    /** 已经选中unit对应的信息 */
    orgId: {
      type: [String, Array],
      default: "",
    },
    /** 是否多选 */
    multiple: {
      type: Boolean,
      default: false
    },
    /** 显示弹窗 */
    readonly: {
      type: Boolean,
      default: false
    },
    /** 值类型 */
    orgtype: {
      default: _OrgType.unit,
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return [_OrgType.unit, _OrgType.dept].indexOf(value) !== -1;
      }
    },
    /** 默认显示指定的5种单位类型的单位 */
    corpTypes: {
      type: Array,
      default: () => _CorpTypes
      // validator: function (value) {
      //   // 这个值必须匹配下列字符串中的一个
      //   return [_OrgType.unit, _OrgType.dept].indexOf(value) !== -1;
      // },
    }
  },
  data() {
    return {
      // 类型
      OrgType: {
        unit: "corporate",
        dept: "department"
      },
      // 选择器类型
      orgTypeEnum: _OrgType,
      corpTypesEnum: _CorpTypes,
      /** 弹窗显示 */
      dialogShow: false,
      /** 单位名称 */
      orgName: "",
      // 列表数据
      tableData: [],

      /** 组件是否可用 */
      disabled: false,
      // 当前行选中
      currentRow: null,
      // 当前行勾选
      multipleSelection: [],

      // 单位id
      unitIds: [],

      corpProps: {
        label: "corpName",
        children: "children"
      }
    };
  },
  computed: {
    /**是否来自app */
    fromapp() {
      let fromapp = fromApp();
      return fromapp;
    },
    effectiveOrgId() {
      return this.modelValue !== undefined && this.modelValue !== null && this.modelValue !== "" ? this.modelValue : this.orgId;
    },
    /** 是否展开所有 */
    expandAll() {
      return _OrgType.unit === this.orgtype;
    },
    orgNames() {
      return this.orgName.split(",").filter((x) => x);
    }
  },
  watch: {
    dialogShow: {
      handler(newValue) {
        if (newValue) {
          console.log(this.orgId);
          if (this.orgId) {
            this.$nextTick(() => {
              this.tableData.forEach((item) => {
                if (this.orgId.indexOf(item.id) > -1)
                  this.$refs.unitTable.toggleRowSelection(item);
              });
            });
          }
        }
      },
      immediate: true,
      deep: true
    },
    readonly: {
      handler(newValue) {
        this.getIsDisabled();
      },
      immediate: true,
      deep: true
    },
    /** 选择器切换 */
    orgtype: {
      handler(newValue) {
        this.getOrganizationTree();
      },
      immediate: true,
      deep: true
    },
    /** 单位传入 */
    orgId: {
      handler(newValue) {
        if (this.modelValue !== undefined && this.modelValue !== null && this.modelValue !== "") {
          return;
        }
        if (newValue) {
          this.getCurrentOrg(newValue);
        }
      },
      immediate: true,
      deep: true
    },
    modelValue: {
      handler(newValue) {
        if (this.effectiveOrgId) {
          this.getCurrentOrg(this.effectiveOrgId);
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // this.getOrganizationTree();
  },
  methods: {
    /** 获取当前部门、单位 */
    getCurrentOrg(id) {
      let ids = [];
      if (Array.isArray(id)) {
        ids = id;
      } else {
        ids = id.split(",");
      }
      let fun = api.getDeptByIds;
      let field = "departName";
      if (this.orgtype === _OrgType.unit) {
        fun = api.getCorpByIds;
        field = "corpName";
      }
      this.orgName = "";
      fun(ids).then((res) => {
        if (res.success) {
          this.orgName = res.data.map((x) => x[field]).join(",");
        }
      });
    },
    /** 单行选择时选中单选框 */
    handleRowClick(row) {
      this.$refs.unitTable.toggleRowSelection(row);
    },
    /** 当前行勾选选择切换 */
    handleSelectionChange(val) {
      if (!this.multiple) {
        return;
      }
      this.multipleSelection = val;
    },
    /** 当前行点击选择切换 */
    handleCurrentRowChange(currentRow, oldCurrentRow) {
      if (this.multiple) {
        return;
      }
      // 当前是部门选择器，然后当前行是单位
      if (this.orgtype === _OrgType.dept && currentRow.type === this.OrgType.unit) {
        this.currentRow = null;
        return;
      }
      this.currentRow = currentRow;
    },
    /** 确认时 */
    confirmHandle() {
      let value = "";
      let items;
      let orgName = "";
      if (!this.multiple) {
        if (this.currentRow) {
          value = this.currentRow.id;
          items = this.currentRow;
          orgName = items.name;
        } else {
          // const msg = this.orgtype === _OrgType.unit ? '单位' : '部门';
          // this.$message.warning(`请选择${msg}`);
          // return;
        }
      } else {
        if (this.multipleSelection.length > 0) {
          value = this.multipleSelection.map((x) => x.id).join(",");
          items = this.multipleSelection;
          orgName = items.map((x) => x.name).join(",");
        } else {
          // const msg = this.orgtype === _OrgType.unit ? '单位' : '部门';
          // this.$message.warning(`请选择${msg}`);
          // return;
        }
      }
      this.orgName = orgName;
      this.dialogShow = false;
      this.$emit("update:modelValue", value);
      this.$emit("update:orgId", value);
      this.$emit("change", value, items);
      // console.log("confirmHandle", JSON.stringify(this.pbs));
    },
    // 选择
    choose() {
      if (this.disabled || this.readonly) {
        this.$message.warning("当前为只读模式，无法选择");
        return;
      }
      if (this.fromapp) {
        window.scrollTo({
          left: 0,
          top: "15vh"
        });
      }
      this.dialogShow = true;
    },
    /** 关闭时 */
    closedHandle() {
      this.$emit("closed");
    },
    /* 获取整体单位树*/
    async getOrganizationTree() {
      let fun = api.getOrganizationTree;
      if (this.orgtype === _OrgType.unit) {
        fun = api.getTypeCorp;
      }
      try {
        const { success, message, data } = await fun();
        if (!success) {
          return this.$message.error("获取单位树失败:" + message);
        }
        const datas = data || [];

        console.log("getOrganizationTree datas", datas);

        /** 通过单位类型过滤，先不考虑多层属性结构的 */
        // if (datas.length > 0) {
        //   for (let i = 0; i < datas.length; i++) {
        //     const item = datas[i];
        //     if (item.children && item.children.length > 0) {
        //       item.children = item.children.filter(
        //         (x) =>
        //           x.type === this.OrgType.unit &&
        //           (this.corpTypes.includes(x.corpType) ||
        //             (x.data && this.corpTypes.includes(x.data.corpType)))
        //       );
        //     }
        //   }
        // }

        // //只展开一级的单位目录
        // datas.forEach((item) => {
        //   this.unitIds.push(item.id);
        // });
        // const _datas = [];
        // for (let i = 0; i < datas.length; i++) {
        //   const element = datas[i];
        //   _datas.push(...element.children);
        // }

        this.tableData = datas;
        console.log("getOrganizationTree", this.tableData);
      } catch (error) {
        this.$message.error("获取单位树失败:" + error);
      }
    },

    /**
     * 获取父元素实例
     */
    getParent() {
      // if (this.formVue) return;
      let parent = this.$parent;
      if (!parent) {
        return null;
      }
      let el = parent.$el || {};
      let classList = el.classList;
      let tagName = el.tagName || "";
      while (
        !(classList && classList.contains("el-form")) ||
        tagName.toLocaleLowerCase() !== "form"
      ) {
        parent = parent.$parent;

        if (!parent) return null;

        el = parent.$el || {};
        classList = el.classList;
        tagName = el.tagName || "";
      }
      this.formVue = parent;
      return parent;
    },
    /**
     * 获取disabled
     */
    getIsDisabled() {
      if (!this.readonly) {
        this.disabled = false;
        return;
      }
      const formVue = this.getParent();
      if (formVue && formVue.disabled !== false) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
:deep(.el-input-group__append) {
  background-color: #f5f7fa;
  color: #1298fa;
  border: 1px solid #1298fa;

  .choosebtn {
    height: 100%;
    width: 100%;
    display: block;
    cursor: pointer;
  }
}

:deep(.choose-dev) {
  height: 36px;
  background-color: #f5f7fa;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .tags {
    width: calc(100% - 60px);
    height: 100%;
    color: #bbbdc3;
    overflow-y: auto;

    .el-tag {
      margin-left: 5px;
      color: #606266;
    }
  }
  .text {
    text-indent: 15px;
  }
}

.choosebtn {
  height: 100%;
  display: block;
  width: 56px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #0096ff;
  color: #1298fa;

  border-top-left-radius: 0px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 4px;
}

.readonly {
  :deep(.el-input-group__append) {
    color: grey;
    border-color: #e4e7ed;
  }
  .choosebtn {
    cursor: default;
    color: grey;
    border-color: #e4e7ed;
    border-top: none;
    border-right: none;
    border-bottom: none;
  }
}

.input-hidden {
  display: none;
}
</style>
