<template>
  <div class="page-data-maintenance-request">
    <TreeTableLayout
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      title="文件列表"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="文件题名">
            <el-input
              v-model="searchData.name"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="文件编号">
            <el-input
              v-model="searchData.code"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="流程状态">
            <el-select
              v-model="searchData.status"
              clearable
              placeholder="请选择"
              style="width: 200px"
            >
              <el-option
                v-for="item in statusList"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发起日期">
            <el-date-picker
              v-model="searchData.date"
              type="date"
              placeholder="选择日期"
              clearable
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelAdd"
          :loading="addButtonLoading"
          >新增</el-button
        >
      </template>
      <template slot="table">
        <div class="content">
          <div class="table-wrapper">
            <el-table
              :data="tableData"
              height="100%"
              stripe
              border
            >
              <el-table-column label="序号" align="center" width="80">
                <template #default="{ $index }">
                  {{
                    $index + 1 + (searchData.current - 1) * searchData.pageSize
                  }}
                </template>
              </el-table-column>

              <el-table-column
                prop="name"
                show-overflow-tooltip
                label="文件题名"
                min-width="400"
                align="left"
              />
              <el-table-column
                prop="code"
                show-overflow-tooltip
                label="文件编号"
                width="120"
                align="left"
              />
              <el-table-column
                prop="version"
                show-overflow-tooltip
                label="版本号"
                width="120"
                align="left"
              />
              <el-table-column
                prop="createCorpName"
                label="责任单位"
                align="left"
                width="120"
              />
              <el-table-column
                prop="createDate"
                label="形成日期"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.createDate) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="uploadDate"
                label="上传日期"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ dateFormat(row.uploadDate) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="文件状态"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  {{ statusListMap[row.status] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="source"
                label="上传单位"
                align="left"
                width="120"
              />
              <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="200"
                fixed="right"
              >
                <template #default="{ row }">
                  <div class="table-btn">
                    <el-button
                      type="text"
                      v-if="row.permssionMap[3]"
                      @click="showRow(row)"
                      >查看</el-button
                    >
                    <el-button
                      type="text"
                      v-if="
                        row.status !== 6 &&
                        row.status !== 7 &&
                        row.status !== 4 &&
                        row.permssionMap[2]
                      "
                      @click="changeRow(row)"
                      >编辑</el-button
                    >
                    <el-button type="text" @click="downloadFile(row.id)"
                      >下载</el-button
                    >
                    <!-- <el-button
                      type="text"
                      v-if="
                        row.status !== 6 &&
                        row.status !== 7 &&
                        row.permssionMap[1]
                      "
                      @click="deleteArchiveFile(row)"
                      >删除</el-button
                    > -->
                    <el-button
                      type="text"
                      v-if="isShowRecodBtn(row) && row.businessId"
                      @click="showRecord(row.businessId)"
                      >审核记录</el-button
                    >
                    <el-button
                      type="text"
                      v-if="row.status === 3"
                      @click="fileSubmit(row.id)"
                      >提交</el-button
                    >
                    <el-button
                      type="text"
                      v-if="row.report"
                      @click="previewFile(row.report)"
                      >四性检测报告</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <el-dialog
      title="流程处理表单"
      custom-class="wbench-el-dialog flow-dialog"
      :visible.sync="flowShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      center
      fullscreen
      @closed="handleClosed"
      :before-close="beforeClosedDialog"
    >
      <SzgcProcessGetor
        ref="SzgcProcessGetor"
        v-if="flowShow"
        :top-show="false"
        :page="detailStatus"
        :dataAll="dataAll"
        @childEvt="childEvtHandle"
      ></SzgcProcessGetor>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSelectArchiveFileList,
  getFlowConfigs,
} from "@/api/archives.js";
import { SzgcProcessGetor } from "@szgc/wbench";

import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import { defineComponent } from "vue";
const DataMaintenanceRequest = defineComponent({
  name: "DataMaintenanceRequest",
  components: { TreeTableLayout, SzgcProcessGetor },
  computed: {
    ...mapGetters(["loginInfo"]),
  },
  data() {
    return {
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        nodeId: "",
        status: "",
        name: "",
        code: "",
        date: ""
      },

      tableData: [],
      statusList: [
        { dictId: 1, dictName: "待鉴定" },
        { dictId: 2, dictName: "鉴定中" },
        { dictId: 3, dictName: "整改中" },
        { dictId: 4, dictName: "待组卷" },
        { dictId: 5, dictName: "无需归档" },
        { dictId: 6, dictName: "已组卷" },
        { dictId: 7, dictName: "已归档" },
      ],
      statusListMap: {
        1: "待鉴定",
        2: "鉴定中",
        3: "整改中",
        4: "待组卷",
        5: "无需归档",
        6: "已组卷",
        7: "已归档",
      },
      flowShow: false,
      flowInfo: {
        businessId: "",
        status: false,
      },
      detailStatus: "mine",
      dataAll: {
        businessId: "",
        taskId: "",
      },
      packageId: "1267434234507689984",
      addButtonLoading: false,
      flowConfigList: [],
    };
  },
  created() {
  },
  mounted() {},
  methods: {
    dateFormat,
    handelSearchButtonClick() {
      this.searchData.current = 1;
      this.searchData.nodeId = "";
      this.getSelectArchiveFileList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.getSelectArchiveFileList();
    },
    async handelAdd() {
      const res = await this.getFlowConfigs();
      if (!res) return;
      this.detailStatus = "mine";
      localStorage.setItem(
        "currentNodeInfo",
        JSON.stringify(this.selectionNode)
      );
      this.flowShow = true;
    },
    // 查表格数据
    async getSelectArchiveFileList() {
      this.tableData = [];
      try {
        const { data, success, message } = await getSelectArchiveFileList(
          this.searchData
        );

        if (!success) {
          this.$message.error("查询表格数据失败：" + message);
          return false;
        }
        this.tableData = data.records;
        this.searchData.total = data.total;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询表格数据失败");
        return false;
      }
    },
    handelPageSizeChange(page) {
      this.searchData.current = 1;
      this.searchData.pageSize = page.pageSize;
      this.getSelectArchiveFileList();
    },
    handelCurrentChange(page) {
      this.searchData.current = page.current;
      this.getSelectArchiveFileList();
    },
    // 点击查看
    async showRow(row) {
      const res = await this.getArchiveFileDetail(row.id);
      if (res) {
        this.fileList = res.archiveFileAttachmentVoList || [];
        this.isAdd = false;
        this.isSHow = true;
      }
    },

    beforeSubmit(name) {
      let res = true;
      this.$refs[name].validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      return res;
    },
    async getFlowConfigs() {
      try {
        this.addButtonLoading = true;
        const { data, success, message } = await getFlowConfigs({
          pacId: this.packageId,
        });
        if (!success) {
          this.$message.error("获取流程配置失败：" + message);
          return false;
        }
        this.flowConfigList = data;
        if (Array.isArray(data) && data.length > 0) {
          this.dataAll = {
            businessId: data[0].flowConfigId,
            taskId: "",
          };
        }
        return data;
      } catch (error) {
        console.error(error);
        this.$message.error("获取流程配置失败");
        return false;
      } finally {
        this.addButtonLoading = false;
      }
    },
    beforeClosedDialog(done) {
      done();
    },
    handleClosed() {
      this.flowShow = false;
    },
    childEvtHandle() {
      this.flowShow = false;
      this.handelSearchButtonClick();
    },
  },
});
export default DataMaintenanceRequest;
</script>

<style scoped lang="scss">
.page-data-maintenance-request {
  height: 100%;
  overflow: hidden;
  color: #fff;
  .content {
    width: 100%;
    display: flex;
    height: 100%;
    .table-wrapper {
      flex: 1;
      width: 0;
    }
  }
  .main {
    height: 100%;
    padding: 20px 20px 20px 0;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .tree-dialog-wrapper {
    height: 50vh;
    overflow: auto;
  }
  .add-form {
    height: 50vh;
    overflow: auto;
  }
  .el-input.input-select {
    /deep/ .el-input__inner {
      cursor: pointer;
    }
    &:hover .pointer {
      display: unset;
    }
    .pointer {
      display: none;
    }
  }
}

.date {
  width: 25%;
  /deep/ .el-form-item__content {
    width: 65%;
  }
  .el-range-editor--small.el-input__inner {
    width: 100%;
  }
}
/deep/ .flow-dialog {
  min-width: 1800px;
  min-height: 900px;
}
/deep/ {
  .wbench-el-dialog.is-fullscreen {
    .el-dialog__body {
      height: calc(100% - 45px);
    }
  }
}
</style>
