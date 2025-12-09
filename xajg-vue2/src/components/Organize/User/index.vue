<template>
  <div
    class="Organize-User"
    :class="{
      readonly: readonly || disabled
    }"
  >
    <div class="choose-dev">
      <div class="tags text" v-if="userNames.length == 0">请选择</div>
      <div class="tags" v-else>
        <el-tag v-for="(name, i) in userNames" :key="i" type="info">
          {{ name }}
        </el-tag>
      </div>
      <div class="choosebtn" @click="choose">
        <i class="el-icon-arrow-right"></i>
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
    />
    <el-dialog
      title="选择人员"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      :width="fromapp ? '100vw' : '960px'"
      v-draggable
      @closed="closedHandle"
    >
      <div class="user-main" :class="{ single: !multiple }">
        <div class="user-table">
          <TreeTableLayout v-if="dialogShow" :showSearchBtns="false" :showPage="false">
            <template slot="form">
              <el-form :model="queryParams" :inline="true" @submit.native.prevent>
                <el-form-item label="姓名:" prop="username">
                  <el-input
                    v-model="queryParams.username"
                    size="mini"
                    placeholder="请输入姓名"
                    @keyup.native.enter="searchUserList"
                  >
                    <i
                      slot="suffix"
                      @click="searchUserList"
                      class="el-input__icon el-icon-search"
                      style="cursor: pointer"
                    ></i>
                  </el-input>
                </el-form-item>
              </el-form>
            </template>
            <template slot="table">
              <div class="content">
                <div class="left-content">
                  <div class="tree-wrapper" :style="{ width: '300px' }">
                    <el-tree
                      class="tree-dom"
                      ref="userTree"
                      highlight-current
                      node-key="id"
                      :data="treeData"
                      :props="defaultProps"
                      :expand-on-click-node="false"
                      :default-expanded-keys="unitIds"
                      @node-click="handleTreeNodeClick"
                      default-expand-all
                    >
                    </el-tree>
                  </div>
                </div>
                <div class="table-wrapper">
                  <el-table
                    ref="userTable"
                    :data="tableData"
                    stripe
                    height="100%"
                    border
                    style="width: 100%"
                    highlight-current-row
                    row-key="id"
                    @current-change="handleCurrentRowChange"
                    @selection-change="handleSelectionChange"
                    @row-click="handleRowClick"
                  >
                    <el-table-column v-if="multiple" type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="realName" width="200" label="姓名">
                    </el-table-column>
                    <el-table-column prop="departName" label="所属部门">
                    </el-table-column>
                    <el-table-column prop="corpName" label="所属单位"> </el-table-column>
                  </el-table>
                </div>
              </div>
            </template>
          </TreeTableLayout>
          <!-- <content-layout
            v-if="dialogShow"
            :showForm="false"
            :showPage="false"
            :defaultPercent="30"
            :showSearchBtns="false"
          >
            <template slot="form">
              <el-form :model="queryParams" :inline="true" @submit.native.prevent>
                <el-form-item label="姓名:" prop="username">
                  <el-input
                    size="mini"
                    v-model="queryParams.username"
                    placeholder="请输入姓名"
                    @keyup.native.enter="searchUserList"
                  >
                    <i
                      slot="suffix"
                      @click="searchUserList"
                      class="el-input__icon el-icon-search"
                      style="cursor: pointer"
                    ></i>
                  </el-input>
                </el-form-item>
              </el-form>
            </template>
            <template slot="tree">
              <div class="tree-content">
                <el-tree
                  class="tree-dom"
                  ref="userTree"
                  highlight-current
                  node-key="id"
                  :data="treeData"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :default-expanded-keys="unitIds"
                  @node-click="handleTreeNodeClick"
                >
                </el-tree>
              </div>
            </template>
            <template slot="table">
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
                  <el-table-column prop="realName" width="200" label="姓名">
                  </el-table-column>
                  <el-table-column prop="departName" label="所属部门"> </el-table-column>
                  <el-table-column prop="corpName" label="所属单位"> </el-table-column>
                </el-table>
              </el-form>
            </template>
          </content-layout> -->
        </div>
        <div class="user-choosed">
          <div class="total">已选（{{ choosedUsers.length }}）</div>
          <div class="choose-user">
            <div
              v-for="(user, i) in choosedUsers"
              :key="user.userId"
              class="choose-user-item"
            >
              <el-tag
                closable
                size="medium"
                effect="dark"
                @close="() => delChoosedUsers(user, i)"
              >
                {{ user.realName }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" v-if="!readonly">
        <el-form>
          <el-button type="primary" @click="confirmHandle"> 确 定 </el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ContentLayout from "@/components/ContentLayout/TreeTable";
import * as api from "./api";
import section from "@/views/project/section/index.vue";
import { getSectionUnitIds } from "./api";
import { BelongTo } from "@/views/progress/SupervisionLog/api";
import { fromApp } from "@/utils/index";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";

// @Component({
//   name: "ExeCorModal"
// })
/**单位类型 */
let _CorpTypes = ["yzdw", "sjdw", "jldw", "sgdw", "dsfdw"];
export default {
  name: "Organize-User-Index",
  components: {
    ContentLayout,
    TreeTableLayout
  },
  model: {
    prop: "userId",
    event: "change"
  },
  props: {
    /**已经选中user对应的信息 */
    userId: {
      type: String | Array,
      default: ""
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
    SelectedByDefault: {
      type: Boolean,
      default: false
    },
    // /**默认显示指定的5种单位类型的单位 */
    // corpTypes: {
    //   type: Array,
    //   default: () => _CorpTypes,
    //   // validator: function (value) {
    //   //   // 这个值必须匹配下列字符串中的一个
    //   //   return [_OrgType.unit, _OrgType.dept].indexOf(value) !== -1;
    //   // },
    // },
    /**单位id */
    unitId: {
      type: [String, Array]
    },
    needSection: {
      type: Boolean,
      default: false
    },
    // 是否启用 节流
    enableThrottle: {
      type: Boolean,
      default: false
    },
    sectionId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      //5种单位类型
      _CorpTypes: _CorpTypes,
      //搜索条件
      queryParams: { username: "" },
      //类型
      OrgType: {
        unit: "corporate",
        dept: "department"
      },
      /**树结构默认属性 */
      defaultProps: {
        children: "children",
        label: "name"
        // isLeaf: "leaf",
      },
      /**弹窗显示 */
      dialogShow: false,
      /**已经选择 */
      choosedUsers: [],
      /**名称 */
      userName: "",

      //列表数据
      tableData: [],
      //树结构
      treeData: [],

      /**组件是否可用 */
      disabled: false,
      //当前行选中
      currentRow: null,
      // //当前行勾选
      // multipleSelection: [],
      //单位id
      unitIds: [],
      //当前选中树节点
      currentNode: null,

      //当前是否正在初始化选中状态
      isSelectedRendering: false,
      // 仅显示文秘
      onlyShowSecretary: false
    };
  },
  mounted() {
    // this.getOrganizationTree();
  },
  methods: {
    /**设置当前节点 */
    setCurrentUnit() {
      // 是否 默认选中当前登录人的单位  如果传递  SelectedByDefault
      console.log("this.treeData", this.treeData);
      if (this.SelectedByDefault) {
        console.log("this.treeData", this.treeData);
        if (this.treeData && Array.isArray(this.treeData) && this.treeData.length > 0) {
          //设置 SelectedByDefault  为 true  就表示取 雄安项目参建单位
          this.$nextTick(() => {
            let curData = this.treeData.find((item) => item.pid == 0);
            this.$refs.userTree && this.$refs.userTree.setCurrentKey(curData.id);
            this.handleTreeNodeClick(curData);
          });
        }
      } else {
        let corpId = this.userInfo.corpId;
        if (this.unitId) {
          if (Array.isArray(this.unitId)) {
            if (this.unitId.length > 0) {
              corpId = this.unitId[0];
            }
          } else {
            corpId = this.unitId;
          }
        }
        if (corpId) {
          let curData = this.treeData.find((x) => x.id === corpId);
          if (!curData && this.treeData.length > 0 && this.treeData[0].children) {
            curData = this.treeData[0].children.find((x) => x.id === corpId);
          }
          if (curData) {
            this.$nextTick(() => {
              this.$refs.userTree && this.$refs.userTree.setCurrentKey(corpId);
              this.handleTreeNodeClick(curData);
            });
          }
        }
      }
    },
    /**搜索用户时 */
    searchUserList() {
      this.isSelectedRendering = true;
      this.getUserList();
    },
    /**删除当前用户 */
    delChoosedUsers(user, i) {
      console.log("delChoosedUsers", user, i);
      if (this.$refs.userTable) {
        if (this.multiple) {
          let item = this.tableData.find((x) => x.userId === user.userId);
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
      if (!userId) {
        return;
      }
      if (userId.indexOf("_") >= 0) {
        this.getCurrentUserByKeyId(userId, dialogShow);
      } else {
        this.getCurrentUserByUserId(userId, dialogShow);
      }
    },
    /**获取当前用户 */
    getCurrentUserByUserId(userId, dialogShow) {
      let userids = [];
      if (Array.isArray(userId)) {
        userids = userId;
      } else {
        userids = (userId && userId.split(",")) || [];
      }
      this.userName = "";
      this.choosedUsers = [];
      if (userids.length == 0) {
        return;
      }
      api.getUserListByIds(userids, this.enableThrottle).then((res) => {
        if (res.success) {
          this.choosedUsers = res.data.filter((x) => x);
          this.userName = res.data.map((x) => x.realName).join(",");
        }
      });
    },
    /**获取当前用户 */
    getCurrentUserByKeyId(keyId, dialogShow) {
      let userids = [];
      let deptIds = [];
      let unitIds = [];
      if (Array.isArray(keyId)) {
        userids = keyId.map((x) => this.getUserIdByKeyid(x));
        deptIds = keyId.map((x) => this.getDeptIdByKeyid(x));
        unitIds = keyId.map((x) => this.getUnitIdByKeyid(x));
      } else {
        userids = (keyId && keyId.split(",").map((x) => this.getUserIdByKeyid(x))) || [];
        deptIds = (keyId && keyId.split(",").map((x) => this.getDeptIdByKeyid(x))) || [];
        unitIds = (keyId && keyId.split(",").map((x) => this.getUnitIdByKeyid(x))) || [];
      }
      this.keyValue = keyId;
      this.choosedUsers = [];
      if (userids.length == 0) {
        return;
      }
      api.searchAllUserList("", deptIds).then((res) => {
        console.log("res", res.data);
        if (res.success) {
          // this.choosedUsers = res.data.filter((x) =>
          //   userids.includes(x.userId)
          // );
          // this.userName = this.choosedUsers.map((x) => x.realName).join(",");
          let arr = res.data.filter((x) => userids.includes(x.userId));
          // 从arr 中过滤出 同单位 同部门 同一个人的 人员
          let chooseList = [];
          arr.forEach((x) => {
            let i = unitIds.findIndex((y) => y == x.corpId);
            if (i == 0 || i) {
              if (deptIds[i] == x.departId && userids[i] == x.userId) {
                chooseList.push(x);
              }
            }
          });
          this.choosedUsers = chooseList;
          this.userName = chooseList.map((x) => x.realName).join(",");
        }
      });
    },
    /**通过keyId获取用户id */
    getUserIdByKeyid(keyId) {
      if (!keyId) {
        return "";
      }
      if (typeof keyId === "number") {
        keyId = keyId.toString();
      }
      if (keyId.indexOf("_") === -1) {
        return keyId;
      }
      let arr = keyId.split("_");
      if (arr.length < 2) {
        return "";
      }
      return arr[0];
      // return keyId.substring(keyId.lastIndexOf("_") + 1, keyId.length);
    },
    /**通过keyId获取部门id */
    getDeptIdByKeyid(keyId) {
      if (!keyId) {
        return "";
      }
      if (typeof keyId === "number") {
        keyId = keyId.toString();
      }
      if (keyId.indexOf("_") === -1) {
        return keyId;
      }
      let arr = keyId.split("_");
      if (arr.length < 2) {
        return "";
      }
      return arr[1];
    },
    getUnitIdByKeyid(keyId) {
      if (!keyId) {
        return "";
      }
      if (typeof keyId === "number") {
        keyId = keyId.toString();
      }
      if (keyId.indexOf("_") === -1) {
        return keyId;
      }
      let arr = keyId.split("_");
      if (arr.length < 2) {
        return "";
      }
      return arr[2];
    },
    /**单位选择时 */
    handleTreeNodeClick(data, node, ve) {
      this.isSelectedRendering = true;
      this.currentNode = data;
      this.getUserList();
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
      console.log("this.isSelectedRendering", this.isSelectedRendering, val.length);
      // this.multipleSelection = val;

      if (!this.isSelectedRendering && this.currentNode) {
        //当前选中组织为部门或者单位
        let curOrgId = this.currentNode.data?.departId;
        let curOrgIds = [];
        if (!curOrgId) {
          if (this.currentNode.pid === "0") {
            curOrgId = this.currentNode.data?.corpId;
            curOrgIds = this.currentNode.children?.map((x) => x.data?.corpId);
          } else {
            curOrgId = this.currentNode.data?.corpId;
            curOrgIds = [curOrgId];
          }
        } else {
          curOrgIds = [curOrgId];
        }

        //记录选中的用户
        let choosedUsers = [...this.choosedUsers];

        //记录当前列表选中的用户
        let curUnitUserIds = val.map((x) => x.userId);

        for (let i = choosedUsers.length - 1; i >= 0; i--) {
          const choosedUser = choosedUsers[i];
          if (
            !curUnitUserIds.includes(choosedUser.userId) &&
            (curOrgIds.includes(choosedUser.departId) ||
              curOrgIds.includes(choosedUser.corpId))
            // (choosedUser.departId == curOrgId || choosedUser.corpId == curOrgId)
          ) {
            //删除取消勾选的用户
            choosedUsers.splice(i, 1);
          }
        }

        //记录新加的选中的用户
        let addUsers = val.filter((x) => !this.userIds.includes(x.userId));
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
      let value = "";
      let items = [];
      if (!this.multiple) {
        if (this.currentRow) {
          value = this.currentRow.userId;
          items = this.currentRow;
          // this.userName = items.realName;
          this.choosedUsers = [items];
        } else {
          // let msg = "用户";
          // this.$message.warning(`请选择${msg}`);
          // return;
        }
      } else {
        if (this.choosedUsers.length > 0) {
          value = this.choosedUsers.map((x) => x.userId).join(",");
          items = this.choosedUsers;
          // this.userName = items.map((x) => x.realName).join(",");
          // this.choosedUsers = items;
        } else {
          // let msg = "用户";
          // this.$message.warning(`请选择${msg}`);
          // return;
        }
      }
      if (Array.isArray(items)) {
        this.userName = items.map((x) => x.realName).join(",");
      } else {
        this.userName = items.realName;
      }
      this.dialogShow = false;
      this.$emit("change", value, items);
      // console.log("confirmHandle", JSON.stringify(value));
    },
    //选择
    choose() {
      if (this.disabled || this.readonly) {
        this.$message.warning("当前为只读模式，无法选择");
        return;
      }
      if (this.needSection && !this.sectionId) {
        this.$message.warning("请先选择施工标段！");
        return;
      }
      this.$set(this.queryParams, "username", "");
      if (this.fromapp) {
        window.scrollTo({
          left: 0,
          top: "15vh"
        });
      }
      this.dialogShow = true;
    },
    /**关闭时 */
    closedHandle() {
      this.$emit("closed");
    },
    /**获取人员列表 */
    getUserList() {
      let unitid, departid;
      let data = this.currentNode;
      if (!data) {
        return;
      }
      if (data.type === this.OrgType.unit) {
        if (data.pid === "0") {
          if (data.children) {
            unitid = data.children.map((x) => x.id);
          }
        } else {
          unitid = data.id;
        }
      } else {
        departid = data.id;
        unitid = data.treePid;
      }

      this.tableData = [];
      if (departid || this.queryParams.username || Array.isArray(unitid)) {
        api.searchUserList(this.queryParams.username, departid || unitid).then((res) => {
          if (res.success) {
            if (this.needSection && this.sectionId) {
              // 根据标段过滤
              api.getSectionUnitIds(this.sectionId).then((res1) => {
                if (res1.success) {
                  let sectionUnitIds = res1.data;
                  this.tableData = res.data.filter((item) =>
                    sectionUnitIds.includes(item.corpId)
                  );
                }
              });
            } else {
              this.tableData = res.data;
            }
            this.setToggleRowSelected(res.data);
          }
        });
      } else {
        api.getUserList(unitid).then((res) => {
          if (res.success) {
            console.log("getUserList", res);
            // onlyShowSecretary
            // if(this.onlyShowSecretary){
            //   this.tableData = res.data.filter((x) => x.isSecretary);
            // }
            if (this.needSection && this.sectionId) {
              // 根据标段过滤
              api.getSectionUnitIds(this.sectionId).then((res1) => {
                if (res1.success) {
                  let sectionUnitIds = res1.data;
                  this.tableData = res.data.filter((item) =>
                    sectionUnitIds.includes(item.corpId)
                  );
                }
              });
            } else {
              this.tableData = res.data;
            }
            this.setToggleRowSelected(res.data);
          }
        });
      }
    },
    /**设置人员选中 */
    setToggleRowSelected(rows) {
      if (this.multiple) {
        this.$nextTick(() => {
          for (let index = 0; index < rows.length; index++) {
            const item = rows[index];

            if (this.userIds.includes(item.userId)) {
              this.$refs.userTable.toggleRowSelection(item, true);
            }
          }

          this.isSelectedRendering = false;
        });
      } else {
        if (this.$refs.userTable) {
          for (let index = 0; index < rows.length; index++) {
            const item = rows[index];

            if (this.userIds.includes(item.userId)) {
              this.$refs.userTable.setCurrentRow(item);
              break;
            }
          }
        }
      }
    },
    /* 获取整体单位树*/
    async getOrganizationTree() {
      this.tableData = [];
      let fun = api.getOrganizationTree;
      try {
        const { success, message, data } = await fun();
        if (!success) {
          return this.$message.error("获取单位树失败:" + message);
        }
        let datas = data || [];
        // this.getUnitIds(datas);
        console.warn("getOrganizationTree", datas);

        //只展开一级的单位目录
        // datas.forEach((item) => {
        //   this.unitIds.push(item.id);
        // });
        let corps = this.reGetUnitArray(datas);
        this.unitIds = corps.map((x) => x.id);

        //通过单位id过滤
        if (this.unitId) {
          let unitids;
          if (Array.isArray(this.unitId)) {
            unitids = this.unitId.map((x) => x + "");
          } else {
            unitids = [this.unitId + ""];
          }
          if (datas.length > 0) {
            let corpIds = [];
            let curCorps = corps.filter((x) => unitids.includes(x.id));
            for (let i = 0; i < curCorps.length; i++) {
              let corp = curCorps[i];
              let _corpIds = corp.data.corpIdPath.split(",");
              corpIds.push(..._corpIds);
            }

            for (let i = 0; i < datas.length; i++) {
              let item = datas[i];
              if (item.children && item.children.length > 0) {
                item.children = item.children.filter(
                  (x) => x.type === this.OrgType.unit && corpIds.includes(x.id)
                );
              }
            }
          }
        }
        // /**通过单位类型过滤，先不考虑多层属性结构的 */
        // if (datas.length > 0) {
        //   for (let i = 0; i < datas.length; i++) {
        //     let item = datas[i];
        //     if (item.children && item.children.length > 0) {
        //       item.children = item.children.filter(
        //         (x) =>
        //           x.type === this.OrgType.unit &&
        //           this.corpTypes.includes(x.corpType)
        //       );
        //     }
        //   }
        // }

        // 根据登录人单位过滤
        if (this.sectionId) {
          // 获取当前人的所属机构
          const userInfo = this.$getStorage("userInfo");
          let params = {
            userId: userInfo.userId
          };
          const res = await BelongTo(params);
          const { data, success } = res;
          datas[0].children = datas[0].children.filter((i) => {
            return data.findIndex((j) => j.corpId === i.id) > -1;
          });
        }

        this.treeData = datas;

        //默认选中当前用户的单位
        this.setCurrentUnit();
      } catch (error) {
        this.$message.error("获取单位树失败:" + error);
      }
    },

    //递归获取单位数组
    reGetUnitArray(datas) {
      let units = [];
      // //只展开一级的单位目录
      // datas.forEach((item) => {
      //   this.unitIds.push(item.id);
      // });
      if (datas.length > 0) {
        for (let i = 0; i < datas.length; i++) {
          let data = datas[i];

          if (data.data && !data.data.departId) {
            units.push(data);
            if (Array.isArray(data.children) && data.children.length > 0) {
              let corps = data.children.filter((x) => x.type === this.OrgType.unit);
              if (corps.length > 0) {
                let subCorps = this.reGetUnitArray(corps);
                units.push(...subCorps);
              }
            }
          }
        }
      }
      return units;
    },

    /**获取单位id，用与左侧列表展开 */
    getUnitIds(treeData) {
      let unittype = this.OrgType.unit;
      if (!treeData || treeData.length === 0) {
        return;
      }
      treeData.forEach((item) => {
        if (item.type === unittype) {
          this.unitIds.push(item.id);
        }
        if (item.children && item.children.length > 0) {
          this.getUnitIds(item.children);
        }
      });
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
      let formVue = this.getParent();
      if (formVue && formVue.disabled !== false) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    }
  },
  watch: {
    dialogShow: {
      handler(newValue) {
        if (newValue) {
          this.getCurrentUser(this.userId, newValue);
          this.getOrganizationTree();
        } else {
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
    userId: {
      handler(newValue) {
        if (newValue) {
          this.getCurrentUser(newValue, this.dialogShow);
        } else {
          this.choosedUsers = [];
          // this.userName = "";
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
    userIds() {
      let users = this.choosedUsers || [];
      return users.map((x) => x.userId);
    },
    userInfo() {
      return this.$getStorage("userInfo");
    },

    userNames() {
      let names = this.userName.split(",").filter((x) => x);
      // console.log("names", names, this.userName);
      return names;
    }
  }
};
</script>

<style scoped lang="scss">
.Organize-User {
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
    width: 56px;
    align-items: center;
    cursor: pointer;
    border-left: 1px solid #dcdfe6;
    // color: #1298fa;
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

.user-main {
  height: 460px;

  .user-table {
    height: calc(100% - 80px);
    .content {
      display: flex;
      height: 100%;
      .left-content {
        overflow: auto;
      }
      .table-wrapper {
        flex: 1;
        width: 0;
      }
    }
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

// .tags-etx {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

/deep/ .el-tag--medium {
  line-height: 26px;
}

//
.tree-content {
  height: 100% !important;
  overflow: auto !important;
}
</style>
