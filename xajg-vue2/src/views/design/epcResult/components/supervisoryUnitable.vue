<template>
  <div class="" v-loading="tableTitle === '主送单位' ? loading : false">
    <div class="flex justify-end align-center">
      <!-- <el-button
        size="small"
        type="primary"
        :disabled="disableTable || loading"
        @click="addAllUnit"
        >选择全部单位</el-button
      > -->
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
          id="supervisoryUnitable"
        >
          <!-- <el-table-column type="index" label="序号" width="50">
          </el-table-column> -->
          <el-table-column :label="tableTitle" prop="name" align="center">
            <template slot-scope="{ row, $index }">
              <el-form-item :error="row.errorCorpId">
                <!-- :disabled="row.corpId ? true : false" -->
                <el-select @visible-change="$visibleChange($event, 'el-popper')"
                  :disabled="disableTable"
                  @change="
                    tableUniChange(
                      $index,
                      row,
                      'corpId',
                      'errorCorpId',
                      `${tableTitle}不能为空,且不能重复`
                    )
                  "
                  v-model="row.corpId"
                  placeholder="请选择"
                  class="w-100pre"
                >
                  <!--
                    v-for="item in row.unitOptions"
                 -->
                  <el-option
                    v-for="item in row.unitOptions"
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
            <template slot-scope="{ row, $index }">
              <el-form-item :error="row.errorSendUser">
                <el-select @visible-change="$visibleChange($event, 'el-popper')"
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
                    v-for="item in reciveUser(row.corpId)"
                    :key="item.userId"
                    :label="item.realName"
                    :value="item.userId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="60" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                v-if="disableTable"
                type="text"
                size="small"
                slot="reference"
                disabled
              >
                删除
              </el-button>
              <el-popconfirm
                v-else
                title="确定删除吗？"
                @confirm="handleRemoveText($index, row)"
              >
                <el-button
                  type="text"
                  size="small"
                  slot="reference"
                  :style="{ color: 'red' }"
                >
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { unitAllList, getSecretary, sectionList } from "./api.js";
export default {
  props: {
    sgdwxs: {
      default: "",
      type: String,
    },
    // defaultUnit 默认选中项目
    defaultUnit: {
      default: () => [],
      type: Array,
    },
    // 过滤当前单位相同类型的单位
    selfUnit: {
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
    tableTitle: {
      default: "主送单位",
      type: String,
    },
    // 用来区分是施工单位还是抄送单位
    type: {
      default: "",
      type: String,
    },
    uniType: {
      default: "sgdw",
      type: String,
    },
  },
  data() {
    return {
      timeoutId: "", //确保单位请求回来了
      tableData: [],
      unitList: [], //单位选项
      loading: false,
      formData: [],
    };
  },
  computed: {
    reciveUser() {
      return (e) => {
        let item = this.unitList.find((item) => item.corpId == e);
        return item?.SecretaryList || [];
      };
    },
  },
  watch: {},
  mounted() {
    this.getDefauleValue();
  },
  methods: {
    // 添加所有的单位
    addAllUnit() {
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
      //console.log("所有需要过滤的单位", disabledUnitIds);
      // 循环所有的单位 过滤不在disabledUnitIds  下的单位  然后请求单位下的人员数据
      const fetchUnitData = async (item) => {
        // console.log("fetchUnitData", item);
        try {
          // 发起请求获取单位下的人员数据
          let params = {
            corpId:
              item.unitOrDepart === "depart" ? item.corpId_back : item.corpId,
            roleName: "文秘",
          };
          const response = await getSecretary(params); // 替换成实际的 API 调用
          let userData = response.data; // 假设响应中包含人员数据
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
        // console.log("this.unitList-------------", this.unitList);
        let unitList = this.unitList || [];
        // console.log("所有的全选下拉选项", unitList);
        for (let i = 0; i < unitList.length; i++) {
          let item = unitList[i];
          if (disabledUnitIds.indexOf(item.corpId) === -1) {
            await fetchUnitData(item);
          }
        }
        // 所有请求完成后，可以在这里处理结果
        //console.log("所有单位数据", arr);
        this.$nextTick(() => {
          this.tableData = [...this.tableData, ...arr];
          // console.log("this.tableData", this.tableData);
          this.loading = false;
          this.$emit("chooseChange", this.tableData);
          // this.$emit("userChange", this.tableData);
        });
      };
      // 调用循环函数
      loopUnits();
    },
    checkRequired() {
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
      return isok;
    },
    // 人员选中切换
    tableSendUserChange(index, row, key, type, errType) {
      // console.log("当前列", row);
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
      console.log("当前列", this.tableData);
      this.$bus.emit("supervisoryUnitable", {
        type: this.type,
        value: this.tableData,
      });
    },
    //table  单位 校验
    async tableUniChange(index, row, key, type, errType) {
      // console.log("校验", row, this.unitList);
      if (row[key]) {
        row.sendUser = "";
        // console.log("通过");
        this.$set(row, type, "");
        // 判断当前选中的单位是不是在table 中已经被选中
        // console.log(" this.tableData", this.tableData, row);
        const count = this.tableData.reduce((acc, curr) => {
          if (curr.corpId === row.corpId) {
            return acc + 1;
          } else {
            return acc;
          }
        }, 0);
        if (count > 1) {
          this.$set(row, type, errType);
        } else {
          this.$bus.emit("supervisoryUnitable", {
            type: this.type,
            value: this.tableData,
          });
        }
      } else {
        // console.log("不通过");
        this.$set(row, type, errType);
      }
    },
    // 删除类型是 text
    handleRemoveText(index, row) {
      if (index || index === 0) {
        this.tableData.splice(index, 1);
      }
      this.$bus.emit("supervisoryUnitable", {
        type: this.type,
        value: this.tableData,
      });
    },

    //获取单位列表 作为源数据
    async getDefauleValue() {
      let resUnit = await this.getUnitList();
      console.log("获取组织架构getDefauleValue", resUnit);
      const { data, success } = await sectionList({});
      if (!success) {
        this.$message.warning("获取标段管理失败");
        return;
      }
      let unitId = this.selfUnit;
      if (!unitId) {
        unitId = this.$getStorage("userInfo").corpId;
      }
      // console.log("获取到单位id", unitId);
      let unitListIds = []; //放与自己相关的标段
      data.forEach((item) => {
        // console.log("item", item);
        if (item.secondUnit == unitId) {
          if (item.children) {
            item.children?.forEach((x) => {
              if (x.type == this.uniType) {
                unitListIds.push(x.unitId);
              }
            });
          }
        }
      });
      console.log("获取到最终需要展现在页面上的施工单位", unitListIds);
      let unitList = [];
      unitListIds.forEach((id) => {
        let item = resUnit.find((x) => x.corpId == id);
        if (item) {
          unitList.push(item);
        } else {
          this.$message.warning(`获取施工单位id:{${id}}失败`);
        }
      });
      // 这里 所有数据请求 完毕 需要处理一件就是把默认选中的放进去
      console.log("this.defaultUnit", this.defaultUnit);
      if (
        this.defaultUnit &&
        Array.isArray(this.defaultUnit) &&
        this.defaultUnit.length > 0
      ) {
        this.defaultUnit.forEach((item) => {
          // 找出默认单位id 是不是已经存在unitList 如果不存在就从 resUnit中找出来
          let isExist = unitList.find((x) => x.corpId == item.corpId);
          if (!isExist) {
            let defaultItem = resUnit.find((x) => x.corpId == item.corpId);
            if (defaultItem) {
              unitList.push(defaultItem);
            } else {
              this.$message.warning(
                `默认单位【${item.corpName}】,id:{${item.corpId}}未在单位列表中！请核对字典！`
              );
            }
          }
          this.tableData.push({
            corpId: item.corpId,
            sendUser: "",
            unitOptions: unitList,
          });
        });
        console.log("this.tableData", this.type, this.tableData);
        this.$bus.emit("supervisoryUnitable", {
          type: this.type,
          value: this.tableData,
        });
      }
      let request = [];
      unitList.forEach((item) => {
        let params = {
          corpId: item.corpId,
          roleName: "文秘",
        };
        request.push(getSecretary(params));
      });
      let promiseList = await Promise.all(request);
      //console.log("promiseList", promiseList);

      unitList.forEach((item, index) => {
        item.SecretaryList = promiseList[index].data;
      });
      this.unitList = unitList;
      this.$emit("tableOK", this.type);
    },
    // 获取所有得单位
    async getUnitList() {
      try {
        // console.log("获取所有的单位");
        const result = await unitAllList();
        const { data, success } = result;
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
        return unitList;
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
        unitOptions: this.unitList,
      });
    },
    // 校验收文人
    receiverPerson() {
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
      return isok;
    },

    // 查看编辑  初始化表格
    initTable(table) {
      //console.log("初始化表格", table);
      if (table) {
        //console.log("查看", this.unitList);
        // 循环添加选项以及 人员
        table.forEach((item) => {
          item.unitOptions = this.unitList;
        });
        //console.log(" 人员", table);
        this.$set(this, "tableData", table);
      }
      this.loading = false;
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

#supervisoryUnitable {
  /deep/ .el-table__row {
    .el-form-item__content {
      // margin-bottom: 6px !important;
    }
  }
}

/deep/ .el-table__body-wrapper {
  max-height: 300px;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}
</style>
