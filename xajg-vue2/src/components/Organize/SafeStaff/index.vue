<template>
  <div
    class="Organize-SafeStaff"
    :class="{
      readonly: readonly || disabled || disabledProp,
    }"
  >
    <div class="choose-dev">
      <div class="tags text" v-if="staffNames.length == 0">请选择</div>
      <div class="tags" v-else>
        <el-tag v-for="(name, i) in staffNames" :key="i" type="info">
          {{ name }}
        </el-tag>
      </div>
      <div class="choosebtn" @click="choose">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <!-- 隐藏输入框，用于表单校验 -->
    <el-input
      class="input-hidden"
      v-model="staffName"
      type="hidden"
      placeholder="请选择"
      :title="staffName"
      disabled
    ></el-input>

    <!-- 人员选择对话框 -->
    <el-dialog
      title="选择人员"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      :width="'960px'"
      v-draggable
      @closed="closedHandle"
    >
      <div class="staff-main" :class="{ single: !multiple }">
        <div class="staff-table">
          <!-- 搜索表单 -->
          <div class="search-form">
            <el-form :model="queryParams" :inline="true" @submit.native.prevent>
              <el-form-item label="姓名:" prop="name">
                <el-input
                  size="mini"
                  v-model="queryParams.name"
                  placeholder="请输入姓名"
                  @keyup.native.enter="searchStaffList"
                >
                  <i
                    slot="suffix"
                    @click="searchStaffList"
                    class="el-input__icon el-icon-search"
                    style="cursor: pointer"
                  ></i>
                </el-input>
              </el-form-item>
              <!-- 当没有指定单位时显示单位选择下拉框 -->
              <el-form-item label="单位:" prop="unit" v-if="!unitId">
                <el-select
                  v-model="queryParams.unit"
                  placeholder="请选择单位"
                  clearable
                  size="mini"
                  @change="searchStaffList"
                >
                  <el-option
                    v-for="item in unitOptions"
                    :key="item.corpId"
                    :label="item.corpName"
                    :value="item.corpId"
                  />
                </el-select>
              </el-form-item>
              <!-- 当指定单位时显示单位名称 -->
              <el-form-item
                label="单位:"
                prop="unit"
                v-else-if="unitId && unitName"
              >
                <el-tag type="info" size="mini">
                  {{ unitName }}
                </el-tag>
              </el-form-item>
            </el-form>
          </div>
          <div style="height: 400px; overflow-y: auto;">

            <!-- 人员列表 -->
            <el-table
              ref="staffTable"
              style="width: 100%"
              :data="tableData"
              border
              highlight-current-row
              row-key="id"
              @current-change="handleCurrentRowChange"
              @selection-change="handleSelectionChange"
              @row-click="handleRowClick"
            >
              <el-table-column
                v-if="multiple"
                type="selection"
                width="55"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                width="120"
                label="姓名"
                align="center"
              >
              </el-table-column>
              <el-table-column prop="phone" width="150" label="联系电话">
              </el-table-column>
              <el-table-column prop="agentCard" label="身份证号">
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryParams.pageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="queryParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>

        <!-- 已选人员区域 -->
        <div class="staff-choosed">
          <div class="total">已选（{{ tempSelectedStaffs.length }}）</div>
          <div class="choose-staff">
            <div
              v-for="(staff, i) in tempSelectedStaffs"
              :key="staff.id"
              class="choose-staff-item"
            >
              <el-tag
                size="medium"
                effect="dark"
                @close="() => delChoosedStaffs(staff, i)"
                closable
              >
                {{ staff.name }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 对话框底部按钮 -->
      <div slot="footer" class="dialog-footer" v-if="!readonly">
        <el-form>
          <el-button type="primary" @click="confirmHandle"> 确 定</el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/views/safetyManagement/staffManagement/api";
import { BelongTo } from "@/views/safetyManagement/staffManagement/api";

export default {
  name: "Organize-SafeStaff-Index",
  // v-model绑定配置
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    /** 已经选中staff对应的信息 */
    value: {
      type: [String, Array],
      default: "",
    },
    /** 是否多选 */
    multiple: {
      type: Boolean,
      default: false,
    },
    /** 是否只读 */
    readonly: {
      type: Boolean,
      default: false,
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 默认单位ID，用于筛选特定单位的人员 */
    unitId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      /** 对话框显示状态 */
      dialogShow: false,
      /** 已选择的人员列表 */
      choosedStaffs: [],
      /** 临时存储对话框中的选择，只有确认后才会更新到 choosedStaffs */
      tempSelectedStaffs: [],
      /** 表格数据 */
      tableData: [],
      /** 总记录数 */
      total: 0,
      /** 查询参数 */
      queryParams: {
        name: "",
        unit: "",
        pageNum: 1,
        pageSize: 20,
        entity: {},
      },
      /** 单位选项 */
      unitOptions: [],
      /** 当前选中单位的名称 */
      unitName: "",
      /** 来自props的禁用状态 */
      disabledProp: false,
      /** 表单实例 */
      formVue: null,
      /** 人员名称，用于隐藏输入框的值 */
      staffName: "",
    };
  },
  mounted() {
    this.getIsDisabled();
    this.disabledProp = this.disabled; // 初始化时同步props的disabled状态
  },
  methods: {
    /**
     * 打开选择对话框
     */
    choose() {
      if (this.readonly || this.disabled || this.disabledProp) {
        return;
      }
      // 打开对话框时，将已选人员复制到临时选择中
      this.tempSelectedStaffs = [...this.choosedStaffs];
      this.dialogShow = true;
    },

    /**
     * 获取单位列表
     * @returns {Promise} 返回Promise对象，在获取完成或失败时resolve
     */
    getBelongTo() {
      return new Promise((resolve, reject) => {
        const userInfo = this.$getStorage("userInfo");
        let params = {
          userId: userInfo.userId,
        };

        BelongTo(params)
          .then((res) => {
            this.unitOptions = res.data || [];
            resolve(this.unitOptions);
          })
          .catch((error) => {
            console.error("获取单位列表失败", error);
            reject(error);
          });
      });
    },

    /**
     * 搜索安全人员
     */
    searchStaffList() {
      this.queryParams.pageNum = 1;
      this.getStaffList();
    },

    /**
     * 获取安全人员列表
     */
    getStaffList() {
      // 如果有指定unitId，则使用它
      if (this.unitId) {
        this.queryParams.entity.unit = this.unitId;
      } else if (this.queryParams.unit) {
        this.queryParams.entity.unit = this.queryParams.unit;
      } else {
        this.queryParams.entity.unit = "";
      }

      const params = {
        ...this.queryParams,
        entity: {
          ...this.queryParams.entity,
          name: this.queryParams.name,
        },
      };

      api
        .page(params)
        .then((res) => {
          // 更新表格数据
          this.tableData = res.data.records || [];
          this.total = res.data.total || 0;

          // 表格加载完毕后，将之前选中的项推送到选中状态
          this.$nextTick(() => {
            if (
              this.multiple &&
              this.$refs.staffTable &&
              this.tempSelectedStaffs.length > 0
            ) {
              // 首先清除所有选中状态
              this.$refs.staffTable.clearSelection();

              // 然后选中已选项
              this.tempSelectedStaffs.forEach((staff) => {
                const row = this.tableData.find((item) => item.id === staff.id);
                if (row) {
                  this.$refs.staffTable.toggleRowSelection(row, true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("获取安全人员列表失败", error);
        });
    },

    /**
     * 删除已选择的人员
     */
    delChoosedStaffs(staff, index) {
      // 如果在对话框中，删除临时选择
      if (this.dialogShow) {
        this.tempSelectedStaffs.splice(index, 1);
        // 移除表格中的选中状态
        if (this.multiple && this.$refs.staffTable) {
          const row = this.tableData.find((item) => item.id === staff.id);
          if (row) {
            this.$refs.staffTable.toggleRowSelection(row, false);
          }
        }
      } else {
        // 否则删除确认选择并更新模型
        this.choosedStaffs.splice(index, 1);
        this.updateModel();
      }
    },

    /**
     * 处理当前行变化
     */
    handleCurrentRowChange(row) {
      if (!this.multiple && row) {
        // 单选模式
        this.tempSelectedStaffs = [row];
      }
    },

    /**
     * 处理多选变化
     */
    handleSelectionChange(selection) {
      if (this.multiple) {
        // 将选中的行更新到临时选择中
        this.tempSelectedStaffs = [...selection];
      }
    },

    /**
     * 处理行点击事件
     */
    handleRowClick(row) {
      if (!this.multiple) {
        // 单选模式下，点击行即选择
        this.tempSelectedStaffs = [row];
      } else if (this.$refs.staffTable) {
        // 多选模式下，切换选中状态
        this.$refs.staffTable.toggleRowSelection(row);
      }
    },

    /**
     * 确认选择
     */
    confirmHandle() {
      console.log(
        "确认选择前的临时选择：",
        JSON.stringify(this.tempSelectedStaffs)
      );
      // 将临时选择更新到确认选择
      this.choosedStaffs = [...this.tempSelectedStaffs];
      // 更新模型值
      console.log(
        "更新模型前的choosedStaffs：",
        JSON.stringify(this.choosedStaffs)
      );
      this.updateModel();
      console.log(
        "更新模型后的choosedStaffs：",
        JSON.stringify(this.choosedStaffs)
      );
      // 关闭对话框
      this.dialogShow = false;
    },

    /**
     * 对话框关闭处理
     */
    closedHandle() {
      // 取消选择，恢复原始选择状态
      this.tempSelectedStaffs = [];
    },

    /**
     * 更新模型值
     */
    updateModel() {
      console.log("this.choosedStaffs", this.choosedStaffs);
      if (this.multiple) {
        // 多选模式返回ID数组
        const ids = this.choosedStaffs.map((item) => item.id);
        this.$emit("change", ids);
        this.staffName = this.choosedStaffs.map((item) => item.name).join(",");
        console.log(ids, this.staffName);
      } else {
        // 单选模式返回单个ID
        const id =
          this.choosedStaffs.length > 0 ? this.choosedStaffs[0].id : "";
        this.$emit("change", id);
        this.staffName =
          this.choosedStaffs.length > 0 ? this.choosedStaffs[0].name : "";
      }
    },

    /**
     * 获取已选择人员信息
     */
    getCurrentStaff(selectedIds) {
      console.log("获取人员信息，传入的IDs：", JSON.stringify(selectedIds));
      if (
        !selectedIds ||
        (Array.isArray(selectedIds) && selectedIds.length === 0)
      ) {
        console.log("无效的selectedIds，跳过获取");
        return;
      }

      // 将选定的ID转换为数组
      const idsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
      console.log("要查询的ID数组：", JSON.stringify(idsArray));

      // 确保只获取指定的ID的人员记录
      const params = {
        entity: {},
        pageSize: 999, // 使用更大的值确保获取到所有匹配的人员
        size: 999,
      };

      api
        .page(params)
        .then((res) => {
          const records = res.data.records || [];
          console.log("从服务器获取到的人员记录：", JSON.stringify(records));

          // 过滤出与指定 ID 匹配的记录
          const filteredRecords = records.filter((record) =>
            idsArray.includes(record.id)
          );
          console.log("过滤后的人员记录：", JSON.stringify(filteredRecords));

          if (filteredRecords.length > 0) {
            if (this.multiple) {
              // 多选模式，保留所有匹配的记录
              this.choosedStaffs = filteredRecords;
            } else {
              // 单选模式，只保留第一条记录
              this.choosedStaffs = [filteredRecords[0]];
            }
            // 更新显示的名称
            this.staffName = this.choosedStaffs
              .map((item) => item.name)
              .join(",");

            console.log(
              "设置后的choosedStaffs：",
              JSON.stringify(this.choosedStaffs)
            );
          }
        })
        .catch((error) => {
          console.error("获取人员信息失败", error);
        });
    },

    /**
     * 处理页码变化
     */
    handleCurrentChange(val) {
      this.queryParams.current = val;
      this.getStaffList();
    },

    /**
     * 处理每页条数变化
     */
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.queryParams.size = val;
      this.getStaffList();
    },

    /**
     * 获取父组件
     */
    getParent() {
      let parent = this.$parent;
      let max = 10;
      let i = 0;
      while (
        parent &&
        (!parent.disabled ||
          typeof parent.disabled == "undefined" ||
          !parent.$options ||
          !parent.$options.name ||
          !parent.$options.name.includes("orm")) &&
        i < max
        ) {
        parent = parent.$parent;
        i++;
      }
      this.formVue = parent;
      return parent;
    },

    /**
     * 获取是否禁用状态
     */
    getIsDisabled() {
      if (!this.readonly) {
        return;
      }
      let formVue = this.getParent();
      if (formVue && formVue.disabled !== false) {
      } else {
      }
    },
  },
  watch: {
    disabled: {
      handler(newValue) {
        this.disabledProp = newValue;
      },
      immediate: true,
    },
    dialogShow: {
      handler(newValue) {
        if (newValue) {
          // 打开对话框时获取单位列表和人员列表
          this.getBelongTo().then(() => {
            this.searchStaffList();

            // 设置已选人员在表格中的选中状态
            this.$nextTick(() => {
              if (this.multiple && this.$refs.staffTable) {
                this.tempSelectedStaffs.forEach((staff) => {
                  const row = this.tableData.find(
                    (item) => item.id === staff.id
                  );
                  if (row) {
                    this.$refs.staffTable.toggleRowSelection(row, true);
                  }
                });
              }
            });
          });
        }
      },
    },
    readonly: {
      handler() {
        this.getIsDisabled();
      },
      immediate: true,
    },
    value: {
      handler(newValue) {
        console.log("监听到value变化：", newValue);

        // 检查是否有值（包括各种格式）
        const isEmpty =
          newValue === null || newValue === undefined || newValue === "";

        if (!isEmpty) {
          // 当值不为空时，获取对应的人员信息
          console.log("有值，获取人员信息");
          this.getCurrentStaff(newValue);
        } else {
          // 当值为空时，清空组件内部状态
          console.log("值为空，清空组件内部状态");
          this.choosedStaffs = [];
          this.tempSelectedStaffs = [];
          this.staffName = "";
        }
      },
      immediate: true,
      deep: true,
    },
    unitId: {
      handler(newUnitId) {
        // 清除之前的单位名称
        this.unitName = "";
        this.choosedStaffs = [];
        this.tempSelectedStaffs = [];

        // 如果有指定单位ID，则尝试获取单位名称
        if (newUnitId) {
          // 将单位ID设置到查询参数中
          this.queryParams.entity.unit = newUnitId;

          // 尝试从单位选项中查找单位名称
          if (this.unitOptions && this.unitOptions.length > 0) {
            const unit = this.unitOptions.find(
              (item) => item.corpId === newUnitId
            );
            if (unit) {
              this.unitName = unit.corpName;
            }
          } else {
            // 如果单位选项还未加载，则先加载单位列表
            this.getBelongTo().then(() => {
              const unit = this.unitOptions.find(
                (item) => item.corpId === newUnitId
              );
              if (unit) {
                this.unitName = unit.corpName;
              }
            });
          }
        }

        // 如果对话框已打开，则刷新人员列表
        if (this.dialogShow) {
          this.searchStaffList();
        }
      },
      immediate: true, // 立即执行，确保初始化时获取单位名称
    },
  },
  computed: {
    /**
     * 人员名称数组
     */
    staffNames() {
      console.log("staffName,", this.choosedStaffs);
      // 直接从 choosedStaffs 中提取名称，这样可以确保显示的名称与实际选中的项完全一致
      return this.choosedStaffs.map((item) => item.name);
    },
  },
};
</script>

<style scoped lang="scss">
.Organize-SafeStaff {
  ::v-deep .el-input-group__append {
    background-color: #f5f7fa;
    color: #1298fa;
    border: 1px solid #1298fa;
  }

  ::v-deep .choose-dev {
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
      text-align: left;

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
    display: flex;
    justify-content: center;
    width: 70px;
    align-items: center;
    cursor: pointer;
    border-left: 1px solid #dcdfe6;
    background-color: white;
    border-top-left-radius: 0px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 4px;
  }

  &.readonly {
    ::v-deep .el-input-group__append {
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
}

.staff-main {
  height: 460px;

  .staff-table {
    height: calc(100% - 80px);
    display: flex;
    flex-direction: column;

    .search-form {
      margin-bottom: 10px;
    }

    .pagination-container {
      margin-top: 10px;
      text-align: right;
    }
  }

  .staff-choosed {
    height: 80px;
    display: flex;
    position: relative;
    z-index: 1;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 3px;
    background: #fff;
    margin-top: 10px;

    .total {
      text-indent: 10px;
      line-height: 40px;
      width: 100px;
    }

    .choose-staff {
      display: flex;
      overflow-y: auto;
      flex-wrap: wrap;
      width: calc(100% - 100px);

      .choose-staff-item {
        margin: 5px;
      }
    }
  }
}

.single.staff-main {
  .staff-table {
    height: calc(100% - 40px);
  }

  .staff-choosed {
    height: 40px;
  }

  .choose-staff {
    height: 100%;
  }
}

.input-hidden {
  display: none;
}

/deep/ .el-tag--medium {
  line-height: 26px;
}
</style>
