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
            <template slot-scope="{ row, $index }">
              <el-form-item :error="row.errorCorpId">
                <div class="w-100pre text-left">
                  <div>单位： {{ getUnitName(row) }}</div>
                  <div>
                    收文人：{{
                      getPersonName(row.sendUser, row.sendUserOptions)
                    }}
                  </div>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { _ } from "core-js";
import {
  unitAllList,
  getSecretary,
  getSecretarys,
  getUserList,
  sectionList,
  getDepartmentsByUnit,
} from "./api.js";
import { getDictItemList } from "@/api/dict";
export default {
  props: {
    fromApp: {
      default: false,
      type: Boolean,
    },
    showOpration: {
      default: true,
      type: Boolean,
    },
    // 过滤当前单位相同类型的单位
    selfUnit: {
      default: "",
      type: [String, Number],
    },
    // 监理 设计 施工 业主  第三方 type 1 2 3 4 5
    pageType: {
      default: "",
      type: [String, Number],
    },
    // 是都可以新增
    disAdd: {
      default: false,
      type: Boolean,
    },
    // 是否禁用
    disableTable: {
      default: false,
      type: Boolean,
    },
    title: {
      default: "主送",
      type: String,
    },
    // 已被选中的单位 要从下拉项中剔除
    selectedUniIds: {
      default: () => [], //测试管理局
      type: Array,
    },
    // 已被删除的单位 要加入到下拉项
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
      timeoutId: "", //确保单位请求回来了
      tableData: [],
      unitList: [], //源数据
      filterUnitList: [], //源数据
      value: "",
      loading: false,
      unitListAll: [],

      //字典数据 过滤单位名称
      gldwmcNameList: [],
      //单位-文秘用户列表：单位id-userList
      corpId2UserListMap: new Map(),
      //正在请求的corpIdList
      requestingCorpIdList: [],
    };
  },
  watch: {
    tableData: {
      handler(val) {
        if (val && Array.isArray(val) && val.length > 0) {
          // 兼容处理、、 之前的数据选的单位没有在标段里面
          // 循环找出当前的 单位是不是在的option里面 如果没有在 就从this.unitListAll 找出 添加进去
          val.forEach((x) => {
            let item = this.unitList.find((y) => y.corpId == x.corpId);
            if (item) {
              // 不做任何处理
            } else {
              // 添加进去
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
        // 指控table
        this.tableData = [];
        // console.log("监听");
        // 检查源数据是否已经准备好
        if (this.unitListAll.length > 0) {
          // 调用处理函数，传入selfUnit和sourceData
          this.getselectionUnitList();
        } else {
          let timer = null;
          let timeIndex = 0;
          // 设置10秒超时定时器
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
    // 监听selectedUniIds变化 让tableData重新获取单位源数据
    selectedUniIds: {
      handler(val) {
        return;
        // 从单位中剔除
        this.tableData.forEach((item, index) => {
          val.forEach((y) => {
            let i = item.unitOptions.findIndex((x) => x.corpId === y);
            if (i !== -1) {
              item.unitOptions.splice(i, 1);
            }
          });
        });
      },
      deep: true,
    },
    // 监听selectedUniIds变化 让tableData重新获取单位源数据
    deleteUniId: {
      handler(val) {
        return;
        // 循环的tableData 往每一个下拉数据源中 添加删除的选项
        this.tableData.forEach((item, index) => {
          let unitItem = this.unitList.find((x) => x.corpId === val);
          if (unitItem) {
            item.unitOptions.push(unitItem);
            // 把数据赋值给当前的人员数据源
            this.$set(item, "unitOptions", item.unitOptions);
            // 刷新组件  否则第一次点击 数据不会展示
            this.$forceUpdate();
          }
        });
      },
      deep: true,
    },
  },
  created() {
    this.getGldwmcItemList();
    this.getUnitList();
  },
  methods: {
    getUnitName(row) {
      console.log("*--------getUnitName", row);
      let options = this.unitList;
      let name = "无";
      let corpId= row.corpId;
      let item = options.find((x) => x.corpId == corpId);
      if (item) {
        name = item.corpName;
      }
      console.log("*--------getUnitName", item, corpId, options);
      return name;
    },
    getPersonName(userId, options) {
      // console.log("*--------//////", userId, options);
      let name = "";
      let item = options.find((x) => x.userId === userId);
      if (item) {
        name = item.realName;
      }
      return name;
    },
    getWMSecretaryExec() {},
    //获取文秘角色
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
    //获取字典 过滤单位名称
    getGldwmcItemList() {
      this.gldwmcNameList = [];
      getDictItemList("gldwmc").then((res) => {
        if (res.success) {
          this.gldwmcNameList = res.data.map((x) => x.dictName);
        }
      });
    },
    // 添加所有的单位
    async addAllUnit() {
      this.loading = true;
      let arr = [];
      let disabledUnitIds = [];
      // 获取 自己的单位 当前已经选择的单位id  以及抄送单位的id
      // 获取所属单位
      let userInfo = this.$getStorage("userInfo");
      if (userInfo?.ascriptions && Array.isArray(userInfo.ascriptions)) {
        userInfo.ascriptions.forEach((x) => {
          disabledUnitIds.push(x.corpId);
        });
      }
      // 获取所属
      if (this.selectedUniIds && Array.isArray(this.selectedUniIds)) {
        disabledUnitIds = [...disabledUnitIds, ...this.selectedUniIds];
      }
      // 如果直接点击选择全部单位  也要剔除
      if (this.tableData && Array.isArray(this.tableData)) {
        // 过滤出所有的单位id
        let ids = this.tableData.map((x) => x.corpId);
        disabledUnitIds = [...disabledUnitIds, ...ids];
      }
      //即使arr 里面有重复的也不要紧
      console.log("所有需要过滤的单位", disabledUnitIds);
      if (this.pageType === 4) {
        //获取字典
        disabledUnitIds = this.unitList
          .filter((item) => this.gldwmcNameList.includes(item.corpName))
          .map((x) => x.corpId);
      }
      // 循环所有的单位 过滤不在disabledUnitIds  下的单位  然后请求单位下的人员数据
      const fetchUnitData = async (item) => {
        console.log("fetchUnitData", item);
        try {
          // 发起请求获取单位下的人员数据
          let params = {
            corpId:
              item.unitOrDepart === "depart" ? item.corpId_back : item.corpId,
            roleName: "文秘",
          };
          // const response = await getSecretary(params); // 替换成实际的 API 调用
          // let userData = response.data; // 假设响应中包含人员数据

          let userData = this.corpId2UserListMap.get(params.corpId);

          // 如果 type 是depart 说明选择的是管理局的部门 就需要过滤出所在部门下的文秘
          if (item.unitOrDepart == "depart") {
            if (userData && Array.isArray(userData)) {
              userData = userData.filter((x) => x.departId == item.departId);
            }
          }
          // 找出当前  包含收文人字段的 人员
          let userInfo = userData.find((x) => x.realName.includes("收发文"));
          let userId = "";
          if (userInfo) {
            userId = userInfo.userId;
          } else {
            userId = userData[0].userId;
          }
          // 在这里处理人员数据，例如将数据存储到数组中
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
        console.log("this.unitList-------------", this.unitList);
        let unitList = this.unitList || [];
        console.log("所有的全选下拉选项", unitList);
        for (let i = 0; i < unitList.length; i++) {
          let item = unitList[i];
          if (disabledUnitIds.indexOf(item.corpId) === -1) {
            await fetchUnitData(item);
          }
        }
        // 所有请求完成后，可以在这里处理结果
        console.log("所有单位数据", arr);
        this.$nextTick(() => {
          this.tableData = [...this.tableData, ...arr];
          console.log("this.tableData", this.tableData);
          this.loading = false;
          this.$emit("chooseChange", this.tableData);
          this.$emit("userChange", this.tableData);
        });
      };
      // 调用循环函数
      loopUnits();
    },
    checkRequired(type) {
      let isok = true;
      console.log(
        "this.tableDatathis.tableDatathis.tableData",
        type,
        this.tableData.length
      );
      if (type == "send" && this.tableData.length == 0) {
        isok = false;
        this.$message.error("请选中主送单位及收文人");
      } else {
        this.tableData.forEach((item, index) => {
          if (!item.corpId) {
            isok = false;
            this.$set(item, "errorCorpId", `${this.tableTitle}不能为空`);
          }
          if (!item.sendUser) {
            isok = false;
            this.$set(item, "errorSendUser", "收文人不能为空");
          }
        });
      }
      return isok;
    },
    // 人员选中切换
    tableSendUserChange(index, row, key, type, errType) {
      if (row[key]) {
        this.$set(row, type, "");
        // 找当当前项目
        if (Array.isArray(row.sendUserOptions)) {
          let item = row.sendUserOptions.find((x) => x.userId === row.sendUser);
          if (item) {
            this.$set(row, "item", item);
            this.$set(row, "sendUser", item.userId);
          } else {
            this.$set(row, "item", "");
          }
        } else {
          this.$set(row, "item", "");
        }
      } else {
        this.$set(row, type, errType);
        this.$set(row, "item", "");
      }
      this.$nextTick(() => {
        this.$emit("userChange", this.tableData);
      });
      this.$forceUpdate();
    },
    //table  单位 校验
    async tableUniChange(index, row, key, type, errType) {
      console.log("校验", row, this.unitList);
      if (row[key]) {
        // console.log("通过");
        this.$set(row, type, "");

        // 找出当前选择的单位 在uniList 中对应的项目，然后判断   unitOrDepart类型  如果是部门 就发送请求的 corpId就取，corpId_back

        // 处理人员选择
        // this.$set(row, "sendUser", "");
        let unitItem = this.unitList.find((item) => item.corpId == row.corpId);

        let params = {
          corpId: row.corpId,
          roleName: "文秘",
        };
        if (unitItem && unitItem.unitOrDepart == "depart") {
          params.corpId = unitItem.corpId_back;
        }
        // let res = await getSecretary(params);
        // let { data, success, message } = res;
        // if (!success) {
        //   this.$message.error(message);
        //   return;
        // }
        let data = this.corpId2UserListMap.get(params.corpId);
        // 如果 type 是depart 说明选择的是管理局的部门 就需要过滤出所在部门下的文秘
        if (unitItem && unitItem.unitOrDepart == "depart") {
          if (data && Array.isArray(data)) {
            data = data.filter((item) => item.departId == unitItem.departId);
          }
        }

        // 把数据赋值给当前的人员数据源
        this.$set(row, "sendUserOptions", data);
        // 剔除已经被选中的单位
        this.$emit("chooseChange", this.tableData);
        return;
      } else {
        console.log("不通过");
        this.$set(row, type, errType);
      }
    },
    // 删除类型是 text
    handleRemoveText(index, row) {
      if (index || index === 0) {
        this.tableData.splice(index, 1);
      }
      this.$emit("deleteChange", row, this.tableData);
    },
    //获取单位列表 作为源数据
    async getselectionUnitList() {
      // console.log("获取单位列表作为源数据*************", this.unitListAll);
      // 如果是业主单位发文 就选出除了自己的其他单位
      const { documentType, unitType } = this.$route.meta;
      // console.log("业主发文", documentType, unitType);
      if (unitType == 4 && documentType == 2) {
        this.unitList = this.unitListAll.filter((x) => x.corpType != "yzdw");
        this.getWMSecretary(this.unitList);
        return;
      }
      // 1.获取标段列表
      let params = {
        type: this.title,
      };
      const { data, success } = await sectionList(params);
      if (!success) {
        this.$message.error("获取标段列表失败");
      }
      let unitList = [];
      // console.log("单位获取======datadata", data);
      if (data && Array.isArray(data)) {
        //2 如果本单位是施工单位 就找乙方单位是本单位的， 是本单位  那么相关单位就是  甲方单位 跟丙方单位  否则  就是从丙方获取是不是有自己的单位 如果有相关单位就是甲、乙、丙方单位
        // 3 先判断当前单位是不是施工单位
        data.forEach((children) => {
          // 判断当前是不是跟乙方单位相同 如果是   甲丙  就是关联单位
          if (children.secondUnit === this.selfUnit) {
            // 把甲方单位
            unitList.push(children.ownerUnit);
            // 丙方单位都放进去
            if (children?.children && Array.isArray(children.children)) {
              let unitIdList = children.children.map((x) => x.unitId);
              unitList = [...unitList, ...unitIdList]; //添加丙方单位
            }
          }
        });
        // console.log("单位获取======", unitList);
        // 去重
        unitList = [...new Set(unitList)];
        // 去除自己得单位
        unitList = unitList.filter((x) => x != this.selfUnit);
        // 找出业主单位  从当前数据中过滤出业主单位
        let manergeUnit = this.unitListAll.find((x) => x.corpType == "yzdw");
        if (manergeUnit) {
          unitList = unitList.filter((x) => x != manergeUnit.corpId);
        }
        // 提出配置文件需要去除的单位
        // this.$store.state.customizedFilterunits
        // console.log("业主单位", manergeUnit);

        let option = [];
        unitList.forEach((x) => {
          option.push(this.unitListAll.find((y) => y.corpId == x));
        });
        // 处理业主单位
        // console.log("其他单位", option);
        // 获取业主单位下的部门
        const result = await getDepartmentsByUnit(manergeUnit.corpId);

        // console.log("部门列表", result);
        if (result.success && result?.data && Array.isArray(result.data)) {
          // 过滤掉配置文件的单位
          let list = result.data;
          let filterUnit = this.$store.state.customizedFilterunits;
          let ownDepart = [];
          list.forEach((item) => {
            let a = filterUnit.find((x) => x.cordId == item.departId);
            if (!a) {
              ownDepart.push(item);
            }
          });

          // console.log("部门列表", ownDepart);
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
    // 获取所有得单位
    async getUnitList() {
      try {
        // console.log("获取所有的单位");
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
        this.getWMSecretary();
        this.unitListAll = [...unitList];
        // console.log("过滤后的单位", this.unitListAll);

        //获取字典
        this.filterUnitList = unitList.filter(
          (item) => !this.gldwmcNameList.includes(item.corpName)
        );
        // console.log("过滤后的单位1", this.filterUnitList);
      } catch (err) {
        console.log("err", err);
      }
    },
    // 增加单位选中
    addUnit() {
      // console.log("添加单位", this.unitList, this.unitListAll);
      // 触发校验  判断表格是不是全部有值
      let isok = true;
      this.tableData.forEach((item, index) => {
        if (!item.corpId) {
          isok = false;
          this.$set(item, "errorCorpId", `${this.tableTitle}不能为空`);
        }
        if (!item.sendUser) {
          isok = false;
          this.$set(item, "errorSendUser", "收文人不能为空");
        }
      });
      if (!isok) return;
      this.tableData.push({
        corpId: "",
        sendUser: "",
      });
      return;
      //从 unitList 中  剔除已经在this.tableData 中的单位
      let uni = this.unitList.filter((item) => {
        return !this.tableData.some((item1) => {
          return item1.corpId === item.corpId;
        });
      });
      //从 uni 中 剔除  item1.corpId 在 this.selectedUniIds的元素
      uni = uni.filter((item) => {
        return !this.selectedUniIds.some((item1) => {
          return item1 == item.corpId;
        });
      });
      //做业务数据的保存,修改。
      this.tableData.push({
        corpId: "",
        unitOptions: [...uni],
      });
    },
    // 查看编辑  初始华表格
    initTable(table) {
      // 写一个定时器 确保 this.unitListAll  有值 ，知道有值才执行
      let timer = setInterval(() => {
        console.log("定时器", this.unitListAll, this.filterUnitList);
        if (this.unitList.length > 0) {
          console.log("初始化表格", table);
          this.$set(this, "tableData", table);
          this.$emit("returntabaleData", table);
          this.loading = false;
          clearInterval(timer);
          timer = null;
        }
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
.line {
  background-color: #dcdfe6;
  height: 1px;
  margin: 5px 0 10px 0;
}

/deep/ .el-form-item__content {
  top: 8px !important;

  .el-input__count {
    height: 25px;
    line-height: 25px;
    background: transparent !important;
    bottom: -3px;
  }
}

/deep/ .el-table__body-wrapper {
  max-height: 300px;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}
</style>
