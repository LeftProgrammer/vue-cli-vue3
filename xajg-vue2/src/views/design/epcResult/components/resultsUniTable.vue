<template>
  <div class="" v-loading="tableTitle === '主送单位' ? loading : false">
    <div class="flex justify-end align-center">
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
                <el-select
                  @visible-change="$visibleChange($event, 'el-popper')"
                  clearable
                  :disabled="disableTable"
                  @change="
                    tableUniChange(
                      $index,
                      row,
                      'corpId',
                      'errorCorpId',
                      `${tableTitle}不能为空,且不能重复`,
                      $event
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
                    v-for="(item, index) in row.unitOptions"
                    :key="index"
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
import {
  unitAllList,
  getSecretary,
  sectionList,
  getSecretarys,
  getDepartmentsByUnit,
} from "./api.js";
export default {
  props: {
    isNeedDistribution: {
      default: false,
      type: Boolean,
    },
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
    this.$nextTick(() => {
      this.getselectionUnitList();
    });
  },
  methods: {
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
      this.$bus.emit("unitable", { type: this.type, value: this.tableData });
    },
    //table  单位 校验
    async tableUniChange(index, row, key, type, errType, $event) {
      console.log("校验", index, row, key, type, errType, $event);
      // 存在一个问题 除了业主单位是没有部门的字段信息的  所以需要找出单位id 有就有没有 就算了。
      let select = this.unitList.find((x) => x.corpId == $event);
      console.log("当前选择项目", select);
      if (select) {
        row.departId = select.departId;
      }
      // 所以需要 找出当前单位，this
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
          this.$bus.emit("unitable", {
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
      console.log("this.tableData", this.tableData);
      this.$bus.emit("unitable", { type: this.type, value: this.tableData });
    },

    //获取单位列表 作为源数据
    async getselectionUnitList() {
      let resUnit = await this.getUnitList();
      console.log("其他分发单位-获取组织架构", resUnit);
      let unitList = [];
      // 这里 所有数据请求 完毕 需要处理一件就是把默认选中的放进去
      console.log(
        "this.defaultUnit",
        this.isNeedDistribution,
        this.defaultUnit
      );
      if (
        this.defaultUnit &&
        Array.isArray(this.defaultUnit) &&
        this.defaultUnit.length > 0
      ) {
        console.log("有默认值");
        this.defaultUnit.forEach((item) => {
          // 找出默认单位id 是不是已经存在unitList 如果不存在就从 resUnit中找出来
          let isExist = resUnit.find((x) => x.corpId == item.corpId);
          if (isExist) {
            unitList.push(isExist);
          } else {
            this.$message.warning(
              `默认单位【${item.corpName}】,id:{${item.corpId}}未在单位列表中！请核对字典！`
            );
          }
          if (this.isNeedDistribution) {
            this.tableData.push({
              corpId: item.corpId,
              departId: "",
              sendUser: "",
              unitOptions: unitList,
            });
          }
        });
        console.log("this.tableData", this.type, this.tableData);
      }
      // 第三方单位    // 如果自己的单位在默认单位里面就不需要了
      let thirdUnit = resUnit.filter(
        (x) =>
          x.corpType == "dsfdw" &&
          !this.defaultUnit.find((y) => y.corpId == x.corpId)
      );
      console.log("第三方单位", thirdUnit);
      unitList = unitList.concat(thirdUnit);

      // // 业主单位(只有一个)
      let owner = resUnit.filter((x) => x.corpType == "yzdw");
      console.log("owner", owner);
      let ownerUnit = [];
      if (owner.length > 0) {
        // 请求业主的下的部门
        let { success, data } = await getDepartmentsByUnit(owner[0].corpId);
        if (!success) {
          this.$message.error("获取业主单位部门失败");
          return;
        }
        console.log("获取业主单位部门", data);
        if (data.length > 0) {
          data.forEach((item) => {
            ownerUnit.push({
              corpId: item.corpId + "_" + item.departId,
              departId: item.departId,
              corpName: `${item.corpName}-${item.departName}`,
              corpType: item.corpType,
              SecretaryList: [],
            });
          });
        }
      }
      console.log("ownerUnit部门", ownerUnit);
      unitList = unitList.concat(ownerUnit);
      let corpIds = [];
      unitList.forEach((item) => {
        // 判断当前的 item.corpId 是不是已经存在 corpIds中了
        if (!corpIds.includes(item.corpId)) {
          if (item.corpId.includes("_")) {
            if (!corpIds.includes(item.corpId.split("_")[0])) {
              corpIds.push(item.corpId.split("_")[0]);
            }
          } else {
            corpIds.push(item.corpId);
          }
        }
      });
      let params = {
        corpIds: corpIds.join(","),
        roleName: "文秘",
      };
      console.log("params", params);
      const { success, data } = await getSecretarys(params);
      if (!success) {
        this.$message.error("获取文秘失败");
        return;
      }
      unitList.forEach((item) => {
        if (item.departId) {
          let SecretaryList = data[item.corpId.split("_")[0]];
          if (SecretaryList) {
            item.SecretaryList = SecretaryList.filter(
              (x) => x.departId == item.departId
            );
          } else {
            item.SecretaryList = [];
          }
        } else {
          item.SecretaryList = data[item.corpId];
        }
      });
      this.unitList = unitList;
      console.log("最终单位列表", unitList);

      // 将来默认单位赋值 人员
      // this.tableData.push({
      //       corpId: item.corpId,
      //       departId: "",
      //       sendUser: "",
      //       unitOptions: unitList,
      //     });
      console.log("this.tableData", this.tableData);
      if (
        this.defaultUnit &&
        Array.isArray(this.defaultUnit) &&
        this.defaultUnit.length > 0
      ) {
        this.tableData.forEach((item) => {
          let unitinfo = unitList.find((x) => x.corpId == item.corpId);
          if (unitinfo) {
            let user = unitinfo.SecretaryList?.find((y) =>
              y.realName.includes("收发文")
            );
            if (user) {
              item.sendUser = user.userId;
            } else {
              if (unitinfo.SecretaryList && unitinfo.SecretaryList.length > 0) {
                item.sendUser = unitinfo.SecretaryList[0].userId;
              }
            }
          }
        });
      }
      // 如果没有默认说明  肯定已经发起来了
      console.log("是否需要分发---", this.isNeedDistribution);
      if (
        this.isNeedDistribution &&
        this.defaultUnit &&
        Array.isArray(this.defaultUnit) &&
        this.defaultUnit.length > 0
      ) {
        this.$bus.emit("unitable", { type: this.type, value: this.tableData });
      }
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
        departId: "",
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
      console.log("初始化表格", table);
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

#uniTable {
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
