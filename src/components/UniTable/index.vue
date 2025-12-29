<template>
  <div class="" v-loading="tableTitle === '主送单位' ? loading : false">
    <div class="flex justify-end align-center">
      <el-button
        v-if="tableTitle === '主送单位'"
        size="small"
        type="primary"
        :disabled="disableTable || loading"
        @click="addAllUnit"
        >选择全部单位</el-button
      >
      <el-button
        size="small"
        type="primary"
        :disabled="disableTable"
        @click="addUnit"
        >新增</el-button
      >
    </div>
    <div class="line"></div>
    <el-form ref="dataFormtable">
      <el-row class="table">
        <el-table
          ref="multipleTable"
          class="w-100pre"
          :data="tableData"
          :border="true"
          id="uniTable"
        >
          <el-table-column :label="tableTitle" prop="name" align="center">
            <template #default="{ row, $index }">
              <el-form-item :error="row.errorCorpId">
                <el-select
                  v-if="(row.corpId ? true : false) || pageType !== 4"
                  @visible-change="$visibleChange($event, 'el-popper')"
                  :disabled="row.corpId ? true : false"
                  filterable
                  @change="
                    tableUniChange(
                      $index,
                      row,
                      'corpId',
                      'errorCorpId',
                      `${tableTitle}不能为空`
                    )
                  "
                  v-model="row.corpId"
                  placeholder="请选择"
                  class="w-100pre"
                >
                  <el-option
                    v-for="item in unitList"
                    :key="item.corpId"
                    :label="item.corpName"
                    :value="item.corpId"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-else
                  @visible-change="$visibleChange($event, 'el-popper')"
                  :disabled="row.corpId ? true : false"
                  filterable
                  @change="
                    tableUniChange(
                      $index,
                      row,
                      'corpId',
                      'errorCorpId',
                      `${tableTitle}不能为空`
                    )
                  "
                  v-model="row.corpId"
                  placeholder="请选择"
                  class="w-100pre"
                >
                  <el-option
                    v-for="item in filterUnitList"
                    :key="item.corpId"
                    :label="item.corpName"
                    :value="item.corpId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="收文人"
            prop="size"
            width="150"
            align="center"
          >
            <template #default="{ row, $index }">
              <el-form-item :error="row.errorSendUser">
                <el-select
                  @visible-change="$visibleChange($event, 'el-popper')"
                  :disabled="disableTable"
                  v-model="row.sendUser"
                  placeholder="请选择"
                  class="w-100pre"
                  @change="
                    tableSendUserChange(
                      $index,
                      row,
                      'sendUser',
                      'errorSendUser',
                      '收文人不能为空'
                    )
                  "
                >
                  <el-option
                    v-for="item in row.sendUserOptions"
                    :key="item.userId"
                    :label="item.realName"
                    :value="item.userId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showOpration"
            label="操作"
            prop="name"
            width="60"
            align="center"
          >
            <template #default="{ row, $index }">
              <el-button
                v-if="disableTable"
                type="text"
                size="small"
                disabled
              >
                删除
              </el-button>
              <el-popconfirm
                v-else
                title="确定删除吗？"
                @confirm="handleRemoveText($index, row)"
              >
                <template #reference>
                  <el-button
                    type="text"
                    size="small"
                    :style="{ color: 'red' }"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  unitAllList,
  getSecretary,
  getSecretarys,
  getUserList,
  sectionList,
  getDepartmentsByUnit,
} from "./api.js";

// 动态导入字典 API
let getDictItemList = null;
try {
  getDictItemList = require("@/api/dict").getDictItemList;
} catch (e) {
  console.warn("字典 API 未找到，部分功能可能受限");
  getDictItemList = () => Promise.resolve({ success: false, data: [] });
}

export default {
  name: "UniTable",
  emits: ['chooseChange', 'userChange', 'deleteChange'],
  props: {
    showOpration: {
      default: true,
      type: Boolean,
    },
    selfUnit: {
      default: "",
      type: [String, Number],
    },
    pageType: {
      default: "",
      type: [String, Number],
    },
    disAdd: {
      default: false,
      type: Boolean,
    },
    disableTable: {
      default: false,
      type: Boolean,
    },
    title: {
      default: "主送",
      type: String,
    },
    selectedUniIds: {
      default: () => [],
      type: Array,
    },
    deleteUniId: {
      default: "",
      type: String,
    },
    tableTitle: {
      default: "主送单位",
      type: String,
    },
  },
  data() {
    return {
      timeoutId: "",
      tableData: [],
      unitList: [],
      filterUnitList: [],
      value: "",
      loading: false,
      unitListAll: [],
      gldwmcNameList: [],
      corpId2UserListMap: new Map(),
      requestingCorpIdList: [],
    };
  },
  watch: {
    tableData: {
      handler(val) {
        if (val && Array.isArray(val) && val.length > 0) {
          val.forEach((x) => {
            let item = this.unitList.find((y) => y.corpId == x.corpId);
            if (!item) {
              let it = this.unitListAll.find((y) => y.corpId == x.corpId);
              if (it) {
                this.unitList.push(it);
              }
            }
          });
        }
      },
    },
    selfUnit: {
      handler(newValue) {
        this.tableData = [];
        if (this.unitListAll.length > 0) {
          this.getselectionUnitList();
        } else {
          let timer = null;
          let timeIndex = 0;
          timer = setInterval(() => {
            if (this.unitListAll.length > 0) {
              timeIndex = 0;
              clearInterval(timer);
              timer = null;
              this.getselectionUnitList();
            } else {
              timeIndex = timeIndex + 1;
              if (timeIndex >= 50) {
                timeIndex = 0;
                clearInterval(timer);
                timer = null;
              }
            }
          }, 500);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getGldwmcItemList();
    this.getUnitList();
  },
  methods: {
    getWMSecretary(corpList) {
      if (!corpList || corpList.length === 0) {
        return;
      }
      let corpIds = [];
      for (let i = 0; i < corpList.length; i++) {
        const item = corpList[i];
        let corpId =
          item.unitOrDepart === "depart" ? item.corpId_back : item.corpId;
        if (!this.corpId2UserListMap.has(corpId)) {
          corpIds.push(corpId);
        }
      }
      if (corpIds.length == 0) {
        return;
      }
      this.loading = true;
      let params = {
        corpIds: corpIds.join(","),
        roleName: "文秘",
      };
      getSecretarys(params).then((res) => {
        if (!res.success) {
          this.$message.error("获取文秘失败");
        } else {
          for (let corpId in res.data) {
            this.corpId2UserListMap.set(corpId, res.data[corpId]);
          }
        }
        this.loading = false;
      });
    },
    getGldwmcItemList() {
      this.gldwmcNameList = [];
      if (getDictItemList) {
        getDictItemList("gldwmc").then((res) => {
          if (res.success) {
            this.gldwmcNameList = res.data.map((x) => x.dictName);
          }
        });
      }
    },
    async addAllUnit() {
      this.loading = true;
      let arr = [];
      let disabledUnitIds = [];
      let userInfo = this.$getStorage("userInfo");
      if (userInfo?.ascriptions && Array.isArray(userInfo.ascriptions)) {
        userInfo.ascriptions.forEach((x) => {
          disabledUnitIds.push(x.corpId);
        });
      }
      if (this.selectedUniIds && Array.isArray(this.selectedUniIds)) {
        disabledUnitIds = [...disabledUnitIds, ...this.selectedUniIds];
      }
      if (this.tableData && Array.isArray(this.tableData)) {
        let ids = this.tableData.map((x) => x.corpId);
        disabledUnitIds = [...disabledUnitIds, ...ids];
      }
      if (this.pageType === 4) {
        disabledUnitIds = this.unitList
          .filter((item) => this.gldwmcNameList.includes(item.corpName))
          .map((x) => x.corpId);
      }
      const fetchUnitData = async (item) => {
        try {
          let params = {
            corpId:
              item.unitOrDepart === "depart" ? item.corpId_back : item.corpId,
            roleName: "文秘",
          };
          let userData = this.corpId2UserListMap.get(params.corpId);
          if (item.unitOrDepart == "depart") {
            if (userData && Array.isArray(userData)) {
              userData = userData.filter((x) => x.departId == item.departId);
            }
          }
          let userInfo = userData.find((x) => x.realName.includes("收发文"));
          let userId = "";
          if (userInfo) {
            userId = userInfo.userId;
          } else {
            userId = userData[0].userId;
          }
          arr.push({
            corpId: item.corpId,
            sendUser: userId,
            sendUserOptions: userData,
            item: userInfo || userData[0],
          });
        } catch (error) {
          console.error("请求失败", error);
        }
      };

      const loopUnits = async () => {
        let unitList = this.unitList || [];
        for (let i = 0; i < unitList.length; i++) {
          let item = unitList[i];
          if (disabledUnitIds.indexOf(item.corpId) === -1) {
            await fetchUnitData(item);
          }
        }
        this.$nextTick(() => {
          this.tableData = [...this.tableData, ...arr];
          this.loading = false;
          this.$emit("chooseChange", this.tableData);
          this.$emit("userChange", this.tableData);
        });
      };
      loopUnits();
    },
    checkRequired(type) {
      let isok = true;
      if (type == "send" && this.tableData.length == 0) {
        isok = false;
        this.$message.error("请选中主送单位及收文人");
      } else {
        this.tableData.forEach((item, index) => {
          if (!item.corpId) {
            isok = false;
            item.errorCorpId = `${this.tableTitle}不能为空`;
          }
          if (!item.sendUser) {
            isok = false;
            item.errorSendUser = "收文人不能为空";
          }
        });
      }
      return isok;
    },
    tableSendUserChange(index, row, key, type, errType) {
      if (row[key]) {
        row[type] = "";
        if (Array.isArray(row.sendUserOptions)) {
          let item = row.sendUserOptions.find((x) => x.userId === row.sendUser);
          if (item) {
            row.item = item;
            row.sendUser = item.userId;
          } else {
            row.item = "";
          }
        } else {
          row.item = "";
        }
      } else {
        row[type] = errType;
        row.item = "";
      }
      this.$nextTick(() => {
        this.$emit("userChange", this.tableData);
      });
    },
    async tableUniChange(index, row, key, type, errType) {
      if (row[key]) {
        row[type] = "";
        let unitItem = this.unitList.find((item) => item.corpId == row.corpId);
        let params = {
          corpId: row.corpId,
          roleName: "文秘",
        };
        if (unitItem && unitItem.unitOrDepart == "depart") {
          params.corpId = unitItem.corpId_back;
        }
        let data = this.corpId2UserListMap.get(params.corpId);
        if (unitItem && unitItem.unitOrDepart == "depart") {
          if (data && Array.isArray(data)) {
            data = data.filter((item) => item.departId == unitItem.departId);
          }
        }
        row.sendUserOptions = data;
        this.$emit("chooseChange", this.tableData);
        return;
      } else {
        row[type] = errType;
      }
    },
    handleRemoveText(index, row) {
      if (index || index === 0) {
        this.tableData.splice(index, 1);
      }
      this.$emit("deleteChange", row, this.tableData);
    },
    async getselectionUnitList() {
      const { documentType, unitType } = this.$route.meta || {};
      if (unitType == 4 && documentType == 2) {
        this.unitList = this.unitListAll.filter((x) => x.corpType != "yzdw");
        this.getWMSecretary(this.unitList);
        return;
      }
      let params = {
        type: this.title,
      };
      const { data, success } = await sectionList(params);
      if (!success) {
        this.$message.error("获取标段列表失败");
      }
      let unitList = [];
      if (data && Array.isArray(data)) {
        data.forEach((children) => {
          if (children.secondUnit === this.selfUnit) {
            unitList.push(children.ownerUnit);
            if (children?.children && Array.isArray(children.children)) {
              let unitIdList = children.children.map((x) => x.unitId);
              unitList = [...unitList, ...unitIdList];
            }
          }
        });
        unitList = [...new Set(unitList)];
        unitList = unitList.filter((x) => x != this.selfUnit);
        let manergeUnit = this.unitListAll.find((x) => x.corpType == "yzdw");
        if (manergeUnit) {
          unitList = unitList.filter((x) => x != manergeUnit.corpId);
        }
        let option = [];
        unitList.forEach((x) => {
          option.push(this.unitListAll.find((y) => y.corpId == x));
        });
        const result = await getDepartmentsByUnit(manergeUnit.corpId);
        if (result.success && result?.data && Array.isArray(result.data)) {
          let list = result.data;
          let filterUnit = this.$store.state.customizedFilterunits || [];
          let ownDepart = [];
          list.forEach((item) => {
            let a = filterUnit.find((x) => x.cordId == item.departId);
            if (!a) {
              ownDepart.push(item);
            }
          });
          ownDepart.forEach((item) => {
            option.push({
              unitOrDepart: "depart",
              ...item,
              corpId_back: item.corpId,
              corpId: item.departId,
              corpName: `${item.corpName}-${item.departName}`,
            });
          });
        }
        this.unitList = option;
        this.getWMSecretary(this.unitList);
      } else {
        this.unitList = [];
      }
    },
    async getUnitList() {
      try {
        const { data, success } = await unitAllList();
        if (!success) {
          this.unitListAll = [];
          this.$message.error("获取单位列表失败");
          return;
        }
        let unitList = data
          .filter((item) => {
            return item.corpLeaf !== 0;
          })
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
        this.unitListAll = [...unitList];
        this.filterUnitList = unitList.filter(
          (item) => !this.gldwmcNameList.includes(item.corpName)
        );
      } catch (err) {
        console.log("err", err);
      }
    },
    addUnit() {
      let isok = true;
      this.tableData.forEach((item, index) => {
        if (!item.corpId) {
          isok = false;
          item.errorCorpId = `${this.tableTitle}不能为空`;
        }
        if (!item.sendUser) {
          isok = false;
          item.errorSendUser = "收文人不能为空";
        }
      });
      if (isok) {
        this.tableData.push({
          corpId: "",
          sendUser: "",
          sendUserOptions: [],
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.line {
  height: 1px;
  background-color: #e5e6eb;
  margin: 10px 0;
}
.w-100pre {
  width: 100%;
}
</style>
