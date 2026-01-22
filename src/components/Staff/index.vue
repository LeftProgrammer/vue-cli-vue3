<template>
  <div
    class="Organize-User"
    :class="{
      readonly: readonly || disabled,
    }"
  >
    <div class="choose-dev">
      <div v-if="userNames.length == 0" class="tags text">请选择</div>
      <div v-else class="tags">
        <el-tag v-for="(name, i) in userNames" :key="i" type="info">
          {{ name }}
        </el-tag>
      </div>
      <div class="choosebtn" @click="choose">
        <i class="el-icon-arrow-right"/>
      </div>
    </div>

    <!--不要删除，需要将父页面组件进行校验及时刷新-->
    <el-input
      v-model="userName"
      class="input-hidden"
      type="hidden"
      placeholder="请选择"
      :title="userName"
      disabled
    ></el-input>
    <el-dialog
      v-model="dialogShow"
      v-draggable
      title="选择人员"
      custom-class="wbench-el-dialog"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      :width="fromapp?'100vw':'960px'"
      @closed="closedHandle"
    >
      <div class="user-main" :class="{ single: !multiple }">
        <div class="user-table">
          <content-layout
            v-if="dialogShow"
            :showForm="false"
            :showPage="false"
            :defaultPercent="30"
            :showSearchBtns="false"
          >
            <template #form>
              <el-form
                :model="queryParams"
                :inline="true"
                @submit.prevent
              >
                <el-form-item label="姓名:" prop="username">
                  <el-input
                    v-model="queryParams.name"
                    size="small"
                    placeholder="请输入姓名"
                    @keyup.enter="searchUserList"
                  >
                    <template #suffix>
                      <i
                        class="el-input__icon el-icon-search"
                        style="cursor: pointer"
                        @click="searchUserList"
                      ></i>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </template>
            <template #table>
              <el-form :inline="true">
                <el-table
                  ref="userTable"
                  style="width: 100%"
                  :data="tableData"
                  border
                  highlight-current-row
                  row-key="id"
                  @current-change="handleCurrentRowChange"
                  @selection-change="handleSelectionChange"
                  @row-click="handleRowClick"
                >
                  <el-table-column v-if="multiple" type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="name" width="200" label="姓名">
                  </el-table-column>
                  <el-table-column prop="phone" width="200" label="联系方式">
                  </el-table-column>
                  <el-table-column prop="corpName" label="所属单位">
                    <template #default="{ row }">
                      <el-tooltip
                        :content="getUnitNameById(row.unit)"
                        placement="top"
                        effect="dark"
                      >
                        <div class="text-ellipsis-clamp">
                          {{ getUnitNameById(row.unit) }}
                        </div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </template>
          </content-layout>
        </div>
        <div class="user-choosed">
          <div class="total">已选（{{ choosedUsers.length }}）</div>
          <div class="choose-user">
            <div
              v-for="(user, i) in choosedUsers"
              :key="user.id"
              class="choose-user-item"
            >
              <el-tag
                closable
                size="medium"
                effect="dark"
                @close="() => delChoosedUsers(user, i)"
              >
                {{ user.name }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div v-if="!readonly" class="dialog-footer">
          <el-form>
            <el-button type="primary"  @click="confirmHandle">
              确 定
            </el-button>
          </el-form>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ContentLayout from '@/components/ContentLayout/TreeTable';
import * as api from './api';
import { fromApp } from '@/utils/index';

export default {
  name: 'StaffIndex',
  components: {
    ContentLayout
  },
  props: {
    /** Vue3 默认 v-model */
    modelValue: {
      type: [String, Array],
      default: ''
    },
    /**已经选中user对应的信息 */
    id: {
      type: [String, Array],
      default: ''
    },
    /**是否多选 */
    multiple: {
      type: Boolean,
      default: false
    },
    /**显示弹窗 */
    readonly: {
      type: Boolean,
      default: false
    },
    selectedByDefault: {
      type: Boolean,
      default: false
    },
    /**单位id */
    unitId: {
      type: [String, Array],
      default: ''
    },
    /**是否启用节流 */
    enableThrottle: {
      type: Boolean,
      default: false
    },
    sectionId: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'update:id', 'change', 'closed'],
  data() {
    return {
      //搜索条件
      queryParams: { name: '' },
      /**弹窗显示 */
      dialogShow: false,
      /**已经选择 */
      choosedUsers: [],
      /**名称 */
      userName: '',
      //列表数据
      tableData: [],
      /**组件是否可用 */
      disabled: false,
      //当前行选中
      currentRow: null,
      //单位id
      unitIds: [],
      //当前是否正在初始化选中状态
      isSelectedRendering: false,
      belongUnit:[]
    };
  },
  mounted() {
  },
  methods: {
    /**搜索用户时 */
    searchUserList() {
      this.isSelectedRendering = true;
      this.getUserList();
    },
    /**删除当前用户 */
    delChoosedUsers(user, i) {
      console.log('delChoosedUsers', user, i);
      if (this.$refs.userTable) {
        if (this.multiple) {
          let item = this.tableData.find((x) => x.id === user.id);
          this.$refs.userTable.toggleRowSelection(item, false);
          this.choosedUsers.splice(i, 1);
        } else {
          this.$refs.userTable.setCurrentRow();
          this.choosedUsers = this.choosedUsers.filter((x) => x);
        }
      }
    },
    /**获取当前用户 */
    getCurrentUser(userId, dialogShow) {
      console.log(">>>>>>>>>>>>>>>>",userId)
      if (!userId) {
        return;
      }
      this.getCurrentUserByUserId(userId, dialogShow);
    },
    /**获取当前用户 */
    getCurrentUserByUserId(userId, dialogShow) {
      let userids = [];
      if (Array.isArray(userId)) {
        userids = userId;
      } else {
        userids = (userId && userId.split(',')) || [];
      }
      this.userName = '';
      this.choosedUsers = [];
      if (userids.length == 0) {
        return;
      }
      api.getStaffListByIds(userids).then((res) => {
        if (res.success) {
          this.choosedUsers = res.data.filter((x) => x);
          this.userName = res.data.map((x) => x.name).join(',');
        }
      });
    },
    /** 单行选择时选中单选框 */
    handleRowClick(row) {
      if (this.multiple) this.$refs.userTable.toggleRowSelection(row);
    },
    /**当前行勾选选择切换 */
    handleSelectionChange(val) {
      if (!this.multiple) {
        return;
      }
      if (!this.isSelectedRendering) {
        //记录选中的用户
        let choosedUsers = [...this.choosedUsers];

        //记录新加的选中的用户
        let addUsers = val.filter((x) => !this.userIds.includes(x.id));
        choosedUsers.push(...addUsers);

        this.choosedUsers = [...choosedUsers];
      }
    },
    /**当前行点击选择切换 */
    handleCurrentRowChange(currentRow, oldCurrentRow) {
      if (this.multiple) {
        return;
      }
      this.choosedUsers = [currentRow];
      this.currentRow = currentRow;
    },
    /**确认时 */
    confirmHandle() {
      let value = '';
      let items = [];
      if (!this.multiple) {
        if (this.currentRow) {
          value = this.currentRow.id;
          items = this.currentRow;
          this.choosedUsers = [items];
        }
      } else {
        if (this.choosedUsers.length > 0) {
          value = this.choosedUsers.map((x) => x.id).join(',');
          items = this.choosedUsers;
        }
      }
      if (Array.isArray(items)) {
        this.userName = items.map((x) => x.name).join(',');
      } else {
        this.userName = items.name;
      }
      this.dialogShow = false;
      this.$emit('update:modelValue', value);
      this.$emit('update:id', value);
      this.$emit('change', value, items);
    },
    //选择
    choose() {
      if (this.disabled || this.readonly) {
        this.$message.warning('当前为只读模式，无法选择');
        return;
      }
      this.queryParams.name = '';
      if (this.fromapp) {
        window.scrollTo({
          left: 0,
          top: '15vh',
        });
      }
      this.dialogShow = true;
    },
    /**关闭时 */
    closedHandle() {
      this.$emit('closed');
    },
    /**获取人员列表 */
    getUserList() {
      api.getStaffList(this.queryParams).then((res) => {
        if (res.success) {
          console.log('getUserList', res);
          this.tableData = res.data;
          this.setToggleRowSelected(res.data);
        }
      });
    },
    /**设置人员选中 */
    setToggleRowSelected(rows) {
      if (this.multiple) {
        this.$nextTick(() => {
          for (let index = 0; index < rows.length; index++) {
            const item = rows[index];

            if (this.userIds.includes(item.id)) {
              this.$refs.userTable.toggleRowSelection(item, true);
            }
          }

          this.isSelectedRendering = false;
        });
      } else {
        if (this.$refs.userTable) {
          for (let index = 0; index < rows.length; index++) {
            const item = rows[index];

            if (this.userIds.includes(item.id)) {
              this.$refs.userTable.setCurrentRow(item);
              break;
            }
          }
        }
      }
    },
    /**
     * 获取disabled
     */
    getIsDisabled() {
      if (!this.readonly) {
        this.disabled = false;
        return;
      }
    },
    getUnitNameById(unitId) {
      let item = this.belongUnit?.find((item) => item.corpId == unitId) || "";
      return item ? item.corpName : "";
    },
    // 获取当前人的所属机构
    async getBelongTo() {
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId,
      };
      try {
        const res = await api.BelongTo(params);
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取当前人的所属机构错误");
          this.belongUnit = [];
          return;
        }
        if (Array.isArray(data) && data?.length > 0) {
          this.belongUnit = data
          console.log("this.belongUnitSouce", this.belongUnit);
        } else {
          this.belongUnit = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },
  },
  watch: {
    dialogShow: {
      handler(newValue) {
        if (newValue) {
          console.log("....................")
          this.getBelongTo();
          this.getUserList();
          this.getCurrentUser(this.effectiveId, newValue);
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
    effectiveId: {
      handler(newValue) {
        if (newValue) {
          this.getCurrentUser(newValue, this.dialogShow);
        } else {
          this.choosedUsers = [];
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    /**是否来自app */
    fromapp() {
      let fromapp = fromApp();
      return fromapp;
    },
    effectiveId() {
      return this.modelValue !== undefined && this.modelValue !== null && this.modelValue !== "" ? this.modelValue : this.id;
    },
    userIds() {
      let users = this.choosedUsers || [];
      return users.map((x) => x.id);
    },
    userInfo() {
      return this.$getStorage('userInfo');
    },
    userNames() {
      let names = this.userName.split(',').filter((x) => x);
      return names;
    }
  }
};
</script>

<style scoped lang="scss">
.Organize-User {
  :deep(.el-input-group__append) {
    background-color: #f5f7fa;
    color: #1298fa;
    border: 1px solid #1298fa;
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
    border-top-left-radius: 0px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 4px;
  }

  &.readonly {
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
}

.user-main {
  height: 460px;

  .user-table {
    height: calc(100% - 80px);
  }

  .user-choosed {
    height: 80px;
    display: flex;
    position: absolute;
    z-index: 1;
    width: calc(100% - 40px);
    border: 1px solid #eee;
    border-radius: 3px;
    background: #fff;

    .total {
      text-indent: 10px;
      line-height: 40px;
      width: 100px;
    }

    .choose-user {
      display: flex;
      overflow-y: auto;
      flex-wrap: wrap;
      width: calc(100% - 100px);

      .choose-user-item {
        margin: 5px;
      }
    }
  }
}

.single.user-main {
  .user-table {
    height: calc(100% - 40px);
  }

  .user-choosed {
    height: 40px;
  }

  .choose-user {
    height: 100%;
  }
}

.user-form {
  height: 100%;
}

.input-hidden {
  display: none;
}

:deep(.el-tag--medium) {
  line-height: 26px;
}

.tree-content {
  height: 100% !important;
  overflow: auto !important;
}
</style>
