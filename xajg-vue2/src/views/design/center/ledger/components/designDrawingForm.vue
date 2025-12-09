<template>
  <!--查看设计图纸供应-->
  <el-dialog
    title="查看-设计图纸"
    custom-class="wbench-el-dialog"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    fullscreen
    @closed="closedHandle"
  >
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        label-width="160px"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="图纸名称:" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入名称"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图纸编号:" size="mini" prop="code">
              <el-input
                v-model="formData.code"
                placeholder="请输入编号"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业:" size="mini" prop="profession">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.profession"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in designProfessionOptions"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程部位:" size="mini" prop="pbsCode">
              <el-input
                v-model="formData.pbsName"
                placeholder="请输入工程部位"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(version, index) in versions"
          :key="version.id"
          :label="'V' + (versions.length - index)"
          :name="version.id"
        >
        </el-tab-pane>

        <el-row>
          <el-col :span="24">
            <div>附件列表</div>
            <el-divider></el-divider>
          </el-col>
        </el-row>
        <el-row>
          <el-table border :data="tableData">
            <el-table-column type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column label="文件名称" prop="name" align="center">
            </el-table-column>
            <el-table-column label="文件大小" prop="size" align="center">
              <template slot-scope="scope">
                <span>{{ $computedSzie(scope.row.size) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="文件格式"
              prop="type"
              align="center"
              width="165"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              prop="name"
              width="220"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-button type="text" @click="$previewFileById(row)">
                  预览
                </el-button>
                <el-button
                  @click="$downFileById(row)"
                  type="text"
                  size="small"
                  :disabled="row.id === '0'"
                >
                  下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="mt-20">
          <el-col :span="24">
            <div>供应信息</div>
            <el-divider></el-divider>
          </el-col>
        </el-row>
        <el-row>
          <el-form
            ref="supplyFormRef"
            :model="curVersion"
            label-width="160px"
            :disabled="readonly"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="计划供应日期:" prop="name">
                  <el-input
                    v-model="curVersion.planDate"
                    placeholder="请输入计划供应日期"
                    width="100%"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际供应日期:" prop="actualDate">
                  <el-date-picker
                    v-model="curVersion.actualDate"
                    type="date"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div>分发信息</div>
            <el-divider></el-divider>
          </el-col>
        </el-row>
        <el-row>
          <el-form
            ref="supplyFormRef"
            :model="curVersion"
            label-width="160px"
            :disabled="readonly"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="图纸分发状态:" prop="name">
                  <span>{{
                    getDataStatus(curVersion.drawingStatus, curVersion)
                  }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分发记录:" prop="name">
                  <el-link
                    type="primary"
                    @click="openFlowRecord('1', curVersion)"
                    >分发记录</el-link
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div>交底信息</div>
            <el-divider></el-divider>
          </el-col>
        </el-row>
        <el-row>
          <el-form
            ref="supplyFormRef"
            :model="curVersion"
            label-width="160px"
            :disabled="readonly"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="交底状态:" prop="name">
                  <span>{{
                    getDataStatus(curVersion.explainStatus, curVersion)
                  }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="交底记录:" prop="name">
                  <el-link
                    type="primary"
                    @click="openFlowRecord('2', curVersion)"
                  >
                    交底记录
                  </el-link>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <div>变更信息</div>
            <el-divider></el-divider>
          </el-col>
        </el-row> -->
        <!-- <el-row>
          <el-form
            ref="supplyFormRef"
            :model="curVersion"
            label-width="160px"
            :disabled="readonly"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="变更状态:" prop="name">
                  <span>{{
                    getDataStatus(curVersion.changeStatus, curVersion)
                  }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="变更记录:" prop="name">
                  <el-link
                    type="primary"
                    @click="openFlowRecord('3', curVersion)"
                  >
                    变更记录
                  </el-link>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row> -->
      </el-tabs>
    </el-row>

    <!-- <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="() => {}"
      @closed="flowShow = false"
    ></flow-dialog> -->
    <designDisclosureDataform
      ref="designDisclosureDataform"
    ></designDisclosureDataform>
    <drawingSendDataform ref="drawingSendDataform"></drawingSendDataform>
  </el-dialog>
</template>
<script>
import { explainPage, drawingIssuePage } from "../api";
import designDisclosureDataform from "../datafrom/designDisclosureDataform.vue";
import drawingSendDataform from "../datafrom/drawingSendDataform.vue";
import { FormMixin } from "@/mixins/FormMixin";
export default {
  components: { designDisclosureDataform, drawingSendDataform },
  name: "design-center-ledger-designDrawingForm",
  mixins: [FormMixin],
  props: {
    designProfessionOptions: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      //弹窗展示
      dialogShow: false,
      //当前选择
      activeName: "",
      //版本列表
      versions: [],
      //当前版本
      curVersion: {},
      tableData: []
    };
  },
  created() {},
  methods: {
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.professionDict) {
        if (
          !this.professionDictOptions ||
          this.professionDictOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.professionDictOptions = items;
          });
        }
      }
    },

    /**获取数据状态 */
    getDataStatus(status) {
      if (status == 1) {
        return "进行中";
      }
      if (status == 2) {
        return "完成";
      }
      return "未开始";
    },
    /**文件预览 */
    handelFilePreview(row) {
      this.$previewFile(row);
    },
    /**文件下载 */
    handelFileDownload(row) {
      console.log("下载", row);
      this.$downFile(row);
    },
    //点击关闭
    closedHandle() {
      this.$emit("closed");
    },
    handleClick(tab, event) {
      console.log("handleClick", tab, event);
    },
    //点击打开相关数据
    async openFlowRecord(flag, version) {
      // this.$message.info("功能开发中...");
      //先获取流程id和流程任务row
      //分发记录
      if (flag === "1") {
        if (!version.drawingId) return;
        let param = {
          id: version.drawingId
        };
        const res = await drawingIssuePage(param);
        const { success, data } = res;
        if (success) {
          let tableData = data[0] || [];
          this.$refs.drawingSendDataform.dialogShow = true;
          this.$nextTick(() => {
            this.$refs.drawingSendDataform.edit(tableData, true);
          });
        }
      }
      //交底记录
      if (flag === "2") {
        if (!version.explainId) {
          return;
        }
        let param = {
          id: version.explainId
        };
        const res = await explainPage(param);
        const { success, data } = res;
        if (success) {
          let tableData = data[0] || [];
          this.$refs.designDisclosureDataform.dialogShow = true;
          this.$nextTick(() => {
            this.$refs.designDisclosureDataform.edit(tableData, true);
          });
        }
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.formData = { ...val };
          if (
            val.designSupplyDetailVoList &&
            val.designSupplyDetailVoList.length > 0
          ) {
            this.versions = val.designSupplyDetailVoList;
            this.activeName = this.versions[0].id; //"V" + this.versions.length;
          } else {
            this.versions = [];
          }
        }
        console.log("versions", this.versions);
      },
      immediate: true
    },
    visible: {
      handler(newValue) {
        this.dialogShow = newValue;
        console.log("this.dialogShow", this.dialogShow);
      },
      immediate: true
    },
    activeName: {
      handler(newValue) {
        if (this.versions.length > 0) {
          let version = this.versions.find((x) => x.id === newValue) || {};
          this.curVersion = version || {};
          this.tableData = version?.designSupplyFileList || [];
        } else {
          this.curVersion = {};
          this.tableData = [];
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  // max-height: 100% !important;
  // height: 100% !important;
}
</style>
