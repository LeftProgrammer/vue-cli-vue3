<template>
  <div class="">
    <div class="flex justify-between align-center">
      <div></div>
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
          <!-- <el-table-column type="index" label="序号" width="50">
          </el-table-column> -->
          <el-table-column :label="tableTitle" prop="name" align="center">
            <template slot-scope="{ row, $index }">
              <el-form-item :error="row.errorCorpId">
                <el-select @visible-change="$visibleChange($event, 'el-popper')"
                  :disabled="row.corpId ? true : false"
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
                  <!--
                    v-for="item in row.unitOptions"

                 -->
                  <el-option
                    v-for="item in unitList"
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
            label="单位文秘"
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
import { unitList, getPermissionCorporates, getSecretary } from "./api.js";
export default {
  props: {
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
    /**选择的用户单位 */
    userCorpId: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      tableData: [],
      unitList: [], //源数据
      value: "",
    };
  },
  mounted() {
    this.getUnitList();
  },
  computed: {},
  watch: {
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
    // 切换 事件 释放之前的选中
    handleNowChoose(row, index) {
      return;
      row.corpId = row.oldUnitId;
      // 新增 直接删除
      if (!row?.corpId) return;
      // 需要做一件事 从原数据中找到 row.corpId  的项  然后 循环this.tableData  添加到每个单位的源数据中
      let item = this.unitList.find((x) => x.corpId === row.corpId);
      console.log("删除成功", item);
      if (item) {
        // 当前页面 释放的单位  往单位源数据中添加
        this.tableData.forEach((x, n) => {
          if (index !== n) {
            x.unitOptions.push(item);
          }
        });
      }
      // 其他页面释放单位
      this.$emit("deleteChange", row);
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
      console.log("校验", row);
      if (row[key]) {
        console.log("通过");
        this.$set(row, type, "");

        // 处理人员选择
        // this.$set(row, "sendUser", "");
        let params = {
          corpId: row.corpId,
          roleName: "文秘",
        };
        let res = await getSecretary(params);
        const { data, success, message } = res;
        if (!success) {
          this.$message.error(message);
          return;
        }
        // 把数据赋值给当前的人员数据源
        this.$set(row, "sendUserOptions", data);
        // 剔除已经被选中的单位
        this.$emit("chooseChange", this.tableData);
        return;
        // 需要做一件事 就是tableData中的每一个 单位源数据 剔除当前选中的项目
        this.tableData.forEach((item, n) => {
          let i = item.unitOptions.findIndex((x) => x.corpId === row.corpId);
          console.log("当前index", i);
          if (i !== -1) {
            // 排除自己删除
            if (index != n) {
              item.unitOptions.splice(i, 1);
            }
          }
        });
        // 剔除已经被选中的单位
        this.$emit("chooseChange", this.tableData);
        if (row.oldUnitId) {
          // 当前
          // 释放之前选中的单位 将旧址更新为新值 把旧值 释放  相当于删除
          this.handleNowChoose({ ...row }, index);
          this.$set(row, "oldUnitId", row.corpId);
        } else {
          this.$set(row, "oldUnitId", row.corpId);
        }
        // 处理人员选择
        // this.$set(row, "sendUser", "");
        // let params = {
        //   corpId: row.corpId,
        //   roleName: "文秘",
        // };
        // let res = await getSecretary(params);
        // const { data, success, message } = res;
        // if (!success) {
        //   this.$message.error(message);
        //   return;
        // }
        // 把数据赋值给当前的人员数据源
        this.$set(row, "sendUserOptions", data);

        // 刷新组件  否则第一次点击 数据不会展示
        this.$forceUpdate();
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
      // console.log(" 删除", this.tableData);
      // // 新增 直接删除
      // if (!row?.corpId) return;
      // // 需要做一件事 从原数据中找到 row.corpId  的项  然后 循环this.tableData  添加到每个单位的源数据中
      // let item = this.unitList.find((x) => x.corpId === row.corpId);
      // console.log("删除成功", item);
      // if (item) {
      //   this.tableData.forEach((x) => {
      //     x.unitOptions.push(item);
      //   });
      // }
      this.$emit("deleteChange", row, this.tableData);
    },
    //获取单位列表 作为源数据
    getUnitList() {
      console.log("this.userCorpId", this.userCorpId);
      getPermissionCorporates(this.userCorpId, "sgdw")
        .then((result) => {
          console.log("单位获取", result);
          const { data, success } = result;
          if (!success) {
            this.$message.error("获取单位列表失败");
          }
          let unitList = data
            .filter((item) => {
              return item.corpLeaf !== 0 && item.corpType == "sgdw";
            })
            .sort((a, b) => {
              return a.corpSort - b.corpSort;
            });
          console.log("单位列表", unitList);
          let a = unitList;
          this.unitList = [...a];
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    // 增加单位选中
    addUnit() {
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
      this.$set(this, "tableData", table);
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
      margin-bottom: 6px !important;
    }
  }
}
</style>
