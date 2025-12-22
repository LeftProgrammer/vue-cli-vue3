<template>
  <div>
    <el-form
      ref="dataFormRef"
      :model="formData"
      :rules="formDataRules"
      label-width="130px"
      :disabled="readonly"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="单元工程名称" prop="name">
            <el-input
              v-model="formData.name"
              :disabled="readonly"
              :maxlength="255"
              show-word-limit
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单元工程编码" prop="code">
            <el-input
              v-model="formData.code"
              :disabled="readonly"
              :maxlength="255"
              show-word-limit
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单元工程量" prop="quantity">
            <el-input
              v-model="formData.quantity"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :disabled="readonly"
              :maxlength="500"
              show-word-limit
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验收状态" prop="qbsStatus">
            <el-select
              v-model="formData.qbsStatus"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="未验收" value="1" />
              <!-- <el-option label="验收中" value="2" /> -->
              <el-option label="已验收" value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验收结论" prop="qualityGrade">
            <el-select
              v-model="formData.qualityGrade"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="不合格" value="0" />
              <el-option label="合格" value="1" />
              <!-- <el-option label="优良" value="2" /> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="施工日期" prop="dateRange">
            <el-date-picker
              v-model="dateRange"
              :disabled="readonly"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              @change="handleDateRangeChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="桩号范围" prop="">
            <div style="display: flex; align-items: center">
              <el-input
                v-model="formData.startStake"
                :controls="false"
                :maxlength="50"
                show-word-limit
                style="width: 50%"
                placeholder="起桩号"
              />
              <span style="margin: 0 8px">至</span>
              <el-input
                v-model="formData.endStake"
                :controls="false"
                :maxlength="50"
                show-word-limit
                style="width: 50%"
                placeholder="止桩号"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高程范围" prop="">
            <div style="display: flex; align-items: center">
              <el-input
                v-model="formData.startElevation"
                :controls="false"
                :maxlength="50"
                show-word-limit
                style="width: 50%"
                placeholder="起高程"
              />
              <span style="margin: 0 8px">至</span>
              <el-input
                v-model="formData.endElevation"
                :controls="false"
                :maxlength="255"
                show-word-limit
                style="width: 50%"
                placeholder="止高程"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请验收日期" prop="qualityStartDate">
            <el-date-picker
              v-model="formData.qualityStartDate"
              :disabled="readonly"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单元工程属性" prop="unitProjectAttr">
            <el-select
              v-model="formData.unitProjectAttr"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="一般单元" value="1" />
              <el-option label="主要单元" value="2" />
              <el-option label="重要隐蔽" value="3" />
              <el-option label="关键部位" value="4" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单元工程类型" prop="unitProjectType">
            <el-select
              v-model="formData.unitProjectType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in unitProjectTypeList"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联工程部位" prop="pbsCode">
            <pbs-select v-model="formData.pbsCode" :readonly="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="施工质量负责人" prop="constructionQuality">
            <user v-model="formData.constructionQuality" :readonly="readonly" />
          </el-form-item>
        </el-col>
        <el-col
          v-if="formData.id && formData.matterTaskTodo?.procTaskName"
          :span="12"
        >
          <el-form-item label="质量监理" prop="qualitySupervisionEngineer">
            <user
              v-model="formData.qualitySupervisionEngineer"
              :readonly="
                flowInfo?.page != 'todo' ||
                  formData.matterTaskTodo?.procTaskName != '施工质量负责人'
              "
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="form-header">
            <span class="form-header-title"> 关联进场报验流程 </span>
            <div>
              <el-button
                type="primary"
                :disabled="readonly"
                @click="addIngressCheck()"
              >
                新增
              </el-button>
            </div>
          </div>
          <el-table
            ref="ingressCheckTable"
            :data="ingressCheckTableData"
            :disabled="readonly"
            border
          >
            <el-table-column
              label="序号"
              type="index"
              width="60"
              align="center"
            />
            <el-table-column prop="name" label="流程名称" min-width="180">
              <template slot-scope="{ row }">
                <el-tooltip :content="row.name" placement="top" effect="dark">
                  <el-link
                    type="primary"
                    class="text-ellipsis"
                    @click="viewIngressCheckDetail(row)"
                  >
                    {{ row.name }}
                  </el-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="所属标段" min-width="180" align="center">
              <template #default="{ row }">
                <div class="text-ellipsis">
                  {{ getSectionName(row.sectionId) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              label="流程编号"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              prop="startDate"
              label="发起日期"
              width="140"
              align="center"
            >
              <template #default="{ row }">
                {{
                  row.startDate ? timeFormat(row.startDate, "YYYY-MM-DD") : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createUsername"
              label="发起人"
              width="120"
              align="center"
            />
            <el-table-column
              prop="flowStatus"
              label="流程状态"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                {{ getFlowStatusName(row.flowStatus) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template #default="{ row }">
                <el-link
                  type="danger"
                  :disabled="readonly"
                  @click="deleteIngressCheck(row)"
                >
                  删除
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="form-header">
              <span class="form-header-title">
                质量验收表单列表（建议将pdf合并完之后再上传）
              </span>
              <div>
                <el-button
                  type="primary"
                  :disabled="readonly"
                  @click="addHandle()"
                >
                  新增
                </el-button>
                <el-button
                  type="danger"
                  :disabled="readonly || multipleSelection.length === 0"
                  @click="batchDeleteDetail()"
                >
                  批量删除
                </el-button>
              </div>
            </div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              :disabled="readonly"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center"
              />
              <el-table-column label="表单名称" prop="qbsName" align="center" />
              <el-table-column
                label="验收时间"
                prop="qualityStartDate"
                width="150"
                align="center"
              >
                <template #default="scope">
                  <span>{{
                    scope.row.qualityStartDate
                      ? dateFormat(
                        scope.row.qualityStartDate,
                        "YYYY-MM-DD HH:mm"
                      )
                      : ""
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                  <el-link
                    type="primary"
                    :disabled="readonly"
                    @click="editDetail(scope.row, scope.$index)"
                  >
                    编辑
                  </el-link>
                  <el-divider direction="vertical" />
                  <el-link
                    type="danger"
                    :disabled="readonly"
                    @click="deleteDetail(scope.$index)"
                  >
                    删除
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="影像资料">
              <uploadFile
                v-model="formData.video"
                :readonly="readonly"
                :limit="10"
                :max-size="50"
                :accept="'mp4,mov,avi,mpg,mpeg,wmv,mkv,flv,webm,wav,ogg,mp3,aac,m4a,jpg,jpeg,png,gif,webp,ico,cur'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件">
              <uploadFile
                v-model="formData.file"
                :readonly="readonly"
                :limit="10"
                :max-size="50"
                :accept="'docx,doc,txt,pdf,zip,rar,7z'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
    </el-form>

    <el-dialog
      v-draggable
      :visible.sync="detailDialogVisable"
      :title="detailDialogTitle"
      width="40%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="detailForm"
        :model="detailFormData"
        :rules="detailFormRules"
        label-width="120px"
        :disabled="detaiDialogType === 'view'"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="表单名称" prop="qbsName">
              <el-input
                v-model="detailFormData.qbsName"
                :disabled="detaiDialogType === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收时间" prop="qualityStartDate">
              <el-date-picker
                v-model="detailFormData.qualityStartDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :disabled="detaiDialogType === 'view'"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="附件">
              <uploadFile
                v-model="detailFormData.file"
                :disabled="detaiDialogType === 'view'"
                :limit="10"
                :max-size="50"
                :accept="'docx,doc,txt,pdf,zip,rar,7z'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisable = false">
          {{ detaiDialogType === "view" ? "关闭" : "取消" }}
        </el-button>
        <el-button
          v-if="detaiDialogType !== 'view'"
          type="primary"
          @click="submit"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 进场报验选择器 -->
    <ingress-check-selector
      :visible.sync="ingressCheckSelectorVisible"
      :value="selectedIngressCheckIds"
      @confirm="handleIngressCheckConfirm"
    />
    <dataform1
      title="查看"
      :visible="ingressCheckVisible"
      :data="ingressCheckOprateRow"
      :readonly="true"
      @sureson="ingressCheckSureson"
    />
  </div>
</template>

<script>
import { save, getDetailList } from "./api";
import { dateFormat } from "@/utils";
import { getDictItemList } from "@/api/dict";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import IngressCheckSelector from "@/components/IngressCheckSelector";
import dataform1 from "../ingressCheck/dataform1.vue";
import { sectionList } from "./api";
export default {
  name: "Dataform",
  components: { IngressCheckSelector, dataform1 },
  mixins: [FlowFormMixin],
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    treeNode: {
      type: Object,
      default: () => ({}),
    },
    sectionId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dateFormat,
      loading: true,
      detailDialogVisable: false,
      detailDialogTitle: "新增",
      detailFormData: {
        id: null,
        qbsName: null,
        qualityStartDate: null,
      },
      detailFormRules: {
        qbsName: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
        ],
        qualityStartDate: [
          { required: true, message: "请选择验收时间", trigger: "change" },
        ],
      },
      detaiDialogType: "add",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
        startStake: null,
        endStake: null,
        unitProjectAttr: "1",
      },
      formDataRules: {
        constructionQuality: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        qualitySupervisionEngineer: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入检验名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入检验编码", trigger: "blur" }],
        constructionUnit: [
          { required: true, message: "请输入施工单位", trigger: "blur" },
        ],
        supervisorUnit: [
          { required: true, message: "请输入监理单位", trigger: "blur" },
        ],
        qualityStartDate: [
          { required: true, message: "请选择申请验收日期", trigger: "change" },
        ],
        qbsStatus: [
          { required: true, message: "请选择验收状态", trigger: "change" },
        ],
        qualityGrade: [
          { required: true, message: "请选择验收结论", trigger: "change" },
        ],
        unitProjectType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        synchronizationDate: [
          { required: true, message: "请选择工程部位", trigger: "change" },
        ],
        pbsCode: [
          { required: true, message: "请选择工程部位", trigger: "change" },
        ],
        sectionId: [
          { required: true, message: "请选择标段", trigger: "change" },
        ],
        constructionStart: [
          { required: true, message: "请选择施工日期", trigger: "change" },
        ],
        constructionEnd: [
          { required: true, message: "请选择施工日期", trigger: "change" },
        ],
        startStake: [
          { required: true, message: "请输入起桩号", trigger: "blur" },
        ],
        endStake: [
          { required: true, message: "请输入止桩号", trigger: "blur" },
        ],
        unitProjectAttr: [
          { required: true, message: "请选择单元工程类别", trigger: "change" },
        ],
      },
      url: {
        list: "/api/quality/assess/info/page",
      },
      tableData: [],
      dialogFile: false,
      tableFile: [],
      dateRange: [],
      unitProjectTypeList: [],
      multipleSelection: [], // 添加多选数组
      editingIndex: null, // 当前编辑的行索引
      acceptance_evaluation: {}, //列表传过来的值
      ingressCheckSelectorVisible: false, // 进场报验选择器显示状态
      selectedIngressCheckIds: [], // 已选择的进场报验ID数组
      ingressCheckTableData: [], // 进场报验表格数据
      sectionOptions: [], // 标段选项列表
      ingressCheckOprateRow: {},
      ingressCheckVisible: false,
    };
  },
  computed: {},
  async created() {
    console.log("create!!!!!");
    this.acceptance_evaluation = this.$getStorage("acceptance_evaluation");
    this.getUnitProjectTypeList();
    console.log(".getSectionList");
    await this.getSectionList();
  },
  methods: {
    addIngressCheck() {
      this.ingressCheckSelectorVisible = true;
    },
    handleIngressCheckConfirm(ids, rows) {
      // 合并数据到进场报验表格，根据id去重，新的覆盖旧的
      // 移除已存在的重复项
      this.ingressCheckTableData = this.ingressCheckTableData.filter(
        (item) => !ids.includes(item.id)
      );

      // 添加新选择的项
      this.ingressCheckTableData.push(...rows);

      // 更新已选择的ID数组
      this.selectedIngressCheckIds = this.ingressCheckTableData.map(
        (item) => item.id
      );

      this.$message.success(`已添加 ${rows.length} 条进场报验记录`);
    },
    getFlowStatusName(status) {
      const statusMap = {
        0: "未提交",
        1: "流转中",
        2: "已完成",
      };
      return statusMap[status] || "";
    },
    timeFormat(time, format = "YYYY-MM-DD HH:mm:ss") {
      return dateFormat(time, format);
    },
    getSectionName(sectionId) {
      if (!sectionId) return "";
      const section = this.sectionOptions.find((item) => item.id == sectionId);
      return section ? section.name : sectionId;
    },
    async getSectionList() {
      try {
        const { data, success, message } = await sectionList({});
        if (success) {
          this.sectionOptions = data || [];
          console.log("所有标段信息", this.sectionOptions);
        } else {
          console.error("查询标段失败：", message);
        }
      } catch (err) {
        console.error("获取标段列表失败：", err);
      }
    },
    deleteIngressCheck(row) {
      this.$confirm("确认删除该进场报验记录?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 从表格数据中移除该记录
          const index = this.ingressCheckTableData.findIndex(
            (item) => item.id === row.id
          );
          if (index !== -1) {
            this.ingressCheckTableData.splice(index, 1);
            // 更新已选择的ID数组
            this.selectedIngressCheckIds = this.ingressCheckTableData.map(
              (item) => item.id
            );
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          // 取消删除操作
        });
    },
    getDetailList() {
      this.loading = true;
      if (!this.formData.id) {
        this.loading = false;
        return;
      }
      getDetailList(this.formData.id)
        .then((res) => {
          this.tableData = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.$message.error("获取质量验收详情记录失败" + err.message);
        });
    },
    getUnitProjectTypeList() {
      getDictItemList("UNIT_PROJECT_TYPE").then((res) => {
        this.unitProjectTypeList = res.data;
      });
    },
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      let extData = {};
      extData["constructionQuality"] = {
        type: "user",
        value: this.formData.constructionQuality,
      };

      this.sendFlowJson = extData;
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    async beforeSubmitButton() {
      let extData = {};
      extData["qualitySupervisionEngineer"] = {
        type: "user",
        value: this.formData.qualitySupervisionEngineer,
      };
      this.sendFlowJson = extData;
    },
    save(fields, callback, event) {
      const isMaintenance = event.data.btnKey === "maintenance";
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: "maintenance",
          },
          event.origin
        );
        return;
      }
      // 确保表格中的日期格式都是标准的年月日时分格式
      const details = (this.tableData || []).map((item) => {
        const newItem = { ...item };
        if (
          newItem.qualityStartDate &&
          newItem.qualityStartDate.includes("T")
        ) {
          // 如果是ISO格式，转换为标准格式
          const date = new Date(newItem.qualityStartDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          newItem.qualityStartDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        }
        return newItem;
      });
      fields.details = details;
      fields.checkInfoVoList = this.ingressCheckTableData;
      if (this.acceptance_evaluation) {
        fields.catalogue = this.acceptance_evaluation.treeNode.code;
        fields.catalogueName = this.acceptance_evaluation.treeNode.nodeName;
        fields.sectionId = this.acceptance_evaluation.sectionId;
      }
      // 确保主表单的日期字段也是标准格式
      if (
        fields.qualityStartDate &&
        typeof fields.qualityStartDate === "string" &&
        fields.qualityStartDate.includes("T")
      ) {
        const date = new Date(fields.qualityStartDate);
        fields.qualityStartDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      }

      // 再次确认所有的日期都是标准格式（而不是ISO格式）
      fields.details.forEach((item) => {
        if (
          item &&
          item.qualityStartDate &&
          typeof item.qualityStartDate === "string" &&
          item.qualityStartDate.includes("T")
        ) {
          const date = new Date(item.qualityStartDate);
          item.qualityStartDate = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(date.getDate()).padStart(
            2,
            "0"
          )} ${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}`;
        }
      });

      // 最后，将整个对象转为JSON再解析回来，确保任何可能的Date对象都被序列化为字符串
      const cleanedFields = JSON.parse(JSON.stringify(fields));

      save(cleanedFields)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },

    handleDateRangeChange(val) {
      if (val) {
        this.formData.constructionStart = val[0];
        this.formData.constructionEnd = val[1];
      } else {
        this.formData.constructionStart = "";
        this.formData.constructionEnd = "";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addHandle() {
      this.detailDialogVisable = true;
      this.detailDialogTitle = "新增";
      this.detaiDialogType = "add";
      this.detailFormData = {
        id: null,
        qbsName: null,
        qualityStartDate: null,
        file: null,
      };
    },
    editDetail(val, index) {
      console.log("sssssssssssssss", val);
      this.detailDialogVisable = true;
      this.detailDialogTitle = "编辑";
      this.detaiDialogType = "edit";
      this.detailFormData = {
        id: val.id,
        qbsName: val.qbsName,
        qualityStartDate: val.qualityStartDate,
        file: val.file,
      };
    },
    submit() {
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          const formData = { ...this.detailFormData };

          if (
            formData.qualityStartDate &&
            formData.qualityStartDate.includes("T")
          ) {
            formData.qualityStartDate = dateFormat(
              formData.qualityStartDate,
              "yyyy-MM-dd HH:mm"
            );
          }

          if (this.detaiDialogType === "add") {
            // 新增
            this.tableData.push(formData);
          } else if (this.detaiDialogType === "edit") {
            // 编辑 - 使用当前编辑的行索引
            if (this.editingIndex !== undefined && this.editingIndex !== null) {
              this.$set(this.tableData, this.editingIndex, formData);
            }
          }
          this.detailDialogVisable = false;
        }
      });
    },
    deleteDetail(index) {
      this.$confirm("确认删除该记录?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message.success("删除成功");
        })
        .catch(() => {
          // 取消删除操作
        });
    },
    batchDeleteDetail() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要删除的记录");
        return;
      }
      this.$confirm(
        `确认删除选中的${this.multipleSelection.length}条记录?`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          // 从后往前删除,避免索引变化影响删除
          const selectedIndexes = this.multipleSelection
            .map((item) => {
              return this.tableData.findIndex(
                (tableItem) => tableItem === item
              );
            })
            .filter((index) => index !== -1)
            .sort((a, b) => b - a);

          selectedIndexes.forEach((index) => {
            this.tableData.splice(index, 1);
          });

          this.$message.success("批量删除成功");
        })
        .catch(() => {
          // 取消删除操作
        });
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow();
      if (row) {
        this.formData = row;
        const start = row.constructionStart;
        const end = row.constructionEnd;
        this.formData.constructionStart = start;
        this.formData.constructionEnd = end;
        this.dateRange = start && end ? [start, end] : [];
        this.getDetailList();
        if (row.checkInfoVoList && row.checkInfoVoList.length > 0) {
          this.ingressCheckTableData = row.checkInfoVoList;
        } else {
          this.ingressCheckTableData = [];
        }
      } else {
        this.dateRange = [];
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return "";
      // 处理时间戳格式，确保为数字
      const ts =
        typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
      if (isNaN(ts)) return "";
      return dateFormat(ts);
    },
    viewIngressCheckDetail(val) {
      this.ingressCheckVisible = true;
      this.ingressCheckOprateRow.dialogShow = true;
      this.ingressCheckOprateRow.data = val;
      this.ingressCheckOprateRow.isView = true;
    },
    ingressCheckSureson() {
      this.ingressCheckOprateRow.dialogShow = false;
      this.ingressCheckVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  .table {
    /deep/ .el-table__row .cell button {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
  }
}

.subTabeHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}

::v-deep {
  .el-col .el-input {
    width: 100%;
  }
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
}

.form-header-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 12px;
}

.form-header-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 4px;
  background-color: #409eff;
  border-radius: 2px;
}
</style>
