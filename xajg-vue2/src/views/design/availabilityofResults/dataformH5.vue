<template>
  <div class="page-leave apph5-parent">
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
        :rules="formDataRules"
        label-width="85px"
      >
        <el-col :span="24">
          <el-form-item label="成果类型" prop="resultsType">
            <el-select
              :disabled="readonly || formData.parentId ? true : false"
              @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.resultsType"
              @change="changeResultsType"
            >
              <el-option
                v-for="item in sjcgOptions"
                :label="item.dictName"
                :key="item.dictCode"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联计划任务项" prop="planName">
            <el-input
              :class="isDisabled ? '' : 'customStyle'"
              disabled
              placeholder="请选择"
              v-model="planName"
            >
              <template slot="append">
                <div @click="chooseComponent('MonthlyPlan', '关联计划项选择')">
                  选择
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="pageType(['sjbg', 'sjyq', 'kybg', 'ydbsjbg'])">
          <el-form-item
            :label="
              formData.resultsType == 'sjtz2' ||
              formData.resultsType == 'ydbsjtz'
                ? '图纸编号'
                : '文件编号'
            "
            prop="code"
          >
            <el-input
              show-word-limit
              type="text"
              maxlength="150"
              :disabled="readonly || formData.parentId"
              v-model="formData.code"
              placeholder="请输入编号"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            :label="
              formData.resultsType == 'sjtz2' ||
              formData.resultsType == 'ydbsjtz'
                ? '图纸名称'
                : '文件名称'
            "
            prop="name"
          >
            <el-input
              show-word-limit
              type="text"
              maxlength="150"
              :disabled="readonly || formData.parentId"
              v-model="formData.name"
              placeholder="请输入名称"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="pageType(['kcsjyb', 'sdyb', 'jszlaqyb'])">
          <el-form-item label="专业" prop="profession">
            <el-select
              :disabled="readonly || formData.parentId ? true : false"
              @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.profession"
            >
              <el-option
                v-for="item in professionOptions"
                :label="item.dictName"
                :key="item.dictCode"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="24"
          v-if="
            pageType([
              'sjtz',
              'sjggtz',
              'sjbh',
              'jtyb',
              'dzyb',
              'kcsjyb',
              'sdyb',
              'jszlaqyb',
              'ydbsjbgtz',
              'ydb-sjtz',
              'ydb-sjbh',
            ])
          "
        >
          <el-form-item label="供应日期" prop="actualDate">
            <el-date-picker
              :disabled="readonly || formData.parentId ? true : false"
              style="width: 100%"
              v-model="formData.actualDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col
          :span="24"
          v-if="
            pageType([
              'sjtz',
              'sjggtz',
              'sjbh',
              'jtyb',
              'dzyb',
              'kcsjyb',
              'sdyb',
              'sjbg',
              'sjyq',
              'kybg',
              'ydbsjbg',
              'jszlaqyb',
              'ydbsjbgtz',
              'ydb-sjtz',
              'ydb-sjbh',
            ])
          "
        >
          <el-form-item label="是否变更图纸" prop="isChange">
            <el-select
              :disabled="readonly || formData.parentId ? true : false"
              @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.isChange"
            >
              <el-option label="是" :value="'1'"></el-option>
              <el-option label="否" :value="'2'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="formData.isChange === '1'">
          <el-form-item label="关联变更流程" prop="changeProcess">
            <associatedDrawing
              :multiple="false"
              :pageType="getPageType"
              :formDisabled="readonly"
              :ids="formData.changeProcess"
              :names="formData.changeProcessName"
              @confirm="changeProcessConfirm"
            ></associatedDrawing>
          </el-form-item>
        </el-col>

        <el-col
          :span="24"
          v-if="
            pageType([
              'sjbh',
              'kcsjyb',
              'sdyb',
              'sjbg',
              'kybg',
              'ydbsjbg',
              'jszlaqyb',
              'ydb-sjbh',
            ])
          "
        >
          <el-form-item label="工程部位" prop="pbsCode">
            <pbsSelect
              v-model="formData.pbsCode"
              :readonly="isDisabled"
            ></pbsSelect>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-if="
            pageType([
              'sjbh',
              'kcsjyb',
              'sdyb',
              'sjtz2',
              'sjbg',
              'sjyq',
              'kybg',
              'ydbsjtz',
              'jszlaqyb',
              'ydbsjbg',
              'ydb-sjbh',
            ])
          "
        >
          <el-form-item label="所属标段" size="mini" prop="sectionId">
            <div class="custum-input rounded-4">
              <div
                v-for="name in sectionName"
                :key="name"
                class="sectionName mr-5 mb-5 px-8 rounded-4"
              >
                {{ name }}
              </div>
            </div>
            <!-- <el-select
              v-model="formData.sectionId"
              :disabled="false"
              style="width: 100%"
              @visible-change="$visibleChange($event, 'el-popper')"
              multiple
              :class="readonly ? 'tagmul-class' : ''"
              collapse-tags
              :filterable="readonly ? false : true"
              placeholder="请选择"
              :formatter="sectionIdFormatter"
            >
              <el-option
                v-for="item in sectionOptions"
                :key="item.id"
                :label="item.name"
                :disabled="readonly"
                :value="item.id"
              />
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-if="
            pageType([
              'sjggtz',
              'sjbh',
              'jtyb',
              'dzyb',
              'kcsjyb',
              'sdyb',
              'sjtz2',
              'sjbg',
              'sjyq',
              'kybg',
              'ydbsjtz',
              'ydbsjbg',
              'ydbsjbgtz',
              'jszlaqyb',
              'ydb-sjbh',
            ])
          "
        >
          <el-form-item label="关联收文" prop="relatedReceiving">
            <RelatedReceivingDocuments
              :formDisabled="isDisabled"
              :relatedIds="formData.relatedReceiving"
              :titles="formData.relatedReceivingName"
              @relatedConfirm="relatedConfirm"
            ></RelatedReceivingDocuments>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-if="
            pageType([
              'sjbh',
              'jtyb',
              'dzyb',
              'kcsjyb',
              'sdyb',
              'sjtz2',
              'sjbg',
              'sjyq',
              'kybg',
              'ydbsjtz',
              'ydbsjbg',
              'jszlaqyb',
              'ydb-sjbh',
            ])
          "
        >
          <el-form-item label="金额" prop="money">
            <el-input
              v-thousands
              :disabled="isDisabled"
              placeholder="请选择"
              :class="isDisabled ? '' : 'customStyle'"
              v-model="formData.money"
            >
              <template slot="append">
                <div>万元</div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="内部审批人" prop="approver" class="approver">
            <user
              v-model="formData.approver"
              :readonly="isDisabled"
              @change="handlerApprover"
              :unitId="myUnitId"
            ></user>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-col :span="24">
            <el-form-item label="管理局接收部门" prop="receivingDepartment1">
              <el-select
                :disabled="readonly || formData.parentId ? true : false"
                @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.receivingDepartment1"
                @change="changeDepartName"
              >
                <el-option
                  v-for="item in receivingDepartment"
                  :label="'雄安建设管理局-' + item.departName"
                  :key="item.departId"
                  :value="item.departId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" prop="receivingDepartment2">
              <el-select
                :disabled="readonly || formData.parentId ? true : false"
                @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.receivingDepartment2"
              >
                <el-option
                  v-for="item in secretaryOption(formData.receivingDepartment1)"
                  :label="item.realName"
                  :key="item.userId"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col
          :span="24"
          v-if="
            pageType([
              'sjtz',
              'sjggtz',
              'sjbh',
              'jtyb',
              'dzyb',
              'kcsjyb',
              'sdyb',
              'sjyq',
              'kybg',
              'ydbsjbgtz',
              'jszlaqyb',
              'ydb-sjtz',
              'ydb-sjbh',
            ])
          "
        >
          <el-form-item label="备注" size="mini" prop="remark">
            <el-input
              :disabled="readonly || formData.parentId ? true : false"
              v-model="formData.remark"
              type="textarea"
              show-word-limit
              maxlength="500"
              :autosize="{ minRows: 3, maxRows: 6 }"
              placeholder="请输入备注"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <!-- 是否分发 -->
      <!-- v-if="isNeedDistribution || formData.needDistribution" -->
      <el-form
        v-if="isNeedDistribution || formData.needDistribution"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="formData.isDditDistribution == '1'"
        ref="dataFormRef1"
      >
        <el-col :span="24">
          <el-form-item label="是否分发" prop="needDistribution">
            <el-radio-group v-model="formData.needDistribution">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>

      <!-- formData.pageType == '1' &&-->
      <el-form
        v-if="formData.needDistribution == '1'"
        ref="dataFormRef3"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="formData.isDditSupervisoryunit == '1'"
      >
        <el-col :span="24">
          <el-form-item label="监理单位" prop="supervisoryUnit">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              :disableTable="readonly"
              class="w-100pre"
              v-model="formData.supervisoryUnit"
              @change="changeSupervisoryUnit"
              clearable
            >
              <el-option
                v-for="item in supervisoryUnitOption"
                :label="item.corpName"
                :key="item.corpId"
                :value="item.corpId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="" prop="supervisorySecretary">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              :disableTable="readonly"
              class="w-100pre"
              v-model="formData.supervisorySecretary"
            >
              <el-option
                v-for="item in supervisorySecretaryOption(
                  formData.supervisoryUnit
                )"
                :label="item.realName"
                :key="item.userId"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>

      <!-- 分发单位(实际上用的是之前抄送单位字段)   v-if="formData.copyUnit || formData.needDistribution == '1'" -->
      <!--  -->
      <el-form
        v-if="formData.needDistribution == '1'"
        ref="dataFormRef4"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-col :span="24">
          <el-col :span="24" v-loading="copyUnitLoading">
            <!-- readonly   -->
            <el-form-item label="其它分发单位" prop="copyUnit">
              <resultsUniTable
                :sgdwxs="formData.copyUnit"
                :defaultUnit="DefaultCopyUnitList"
                :tableTitle="'其它分发单位'"
                :isNeedDistribution="isNeedDistribution"
                :uniType="'dsfdw'"
                ref="copyUnit"
                :type="'copyUnit'"
                :disableTable="formData.isEditCopyunit == '1'"
                @tableOK="tableInitOK"
              ></resultsUniTable>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>
      <!-- 监理单位选中的施工单位 -->
      <el-form
        v-if="sgdwxs || formData.constructionUnit"
        ref="dataFormRef2"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-col :span="24">
          <el-col :span="24" v-loading="constructionUnitLoading">
            <!-- readonly   -->
            <el-form-item label="施工单位" prop="constructionUnit">
              <supervisoryUnitable
                :sgdwxs="formData.constructionUnit"
                :tableTitle="'施工单位'"
                :uniType="'sgdw'"
                ref="constructionUnit"
                :type="'constructionUnit'"
                :disableTable="formData.isDditConstructionUnit == '1'"
                :selfUnit="formData.supervisoryUnit"
                @tableOK="tableInitOK"
              ></supervisoryUnitable>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>

      <!-- 施工标段 -->
      <el-form
        v-if="formData.parentId"
        ref="dataFormRef5"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="readonly"
      >
        <el-col :span="24">
          <el-form-item label="内部审核人" prop="constructionUnitApprover">
            <user
              v-model="formData.constructionUnitApprover"
              :readonly="isDisApprover"
              @change="handlerconstructionUnitApprover"
              :unitId="myUnitId"
            ></user>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="pt-20">
      <uploadFileTable
        :readonly="isDisabled"
        v-model="formData.designSupplyFileList"
        :maxSize="500"
        :showNtko="showNtko"
        @changeNtkoFile="changeNtkoFile"
        :limit="500"
      >
        <template slot="title">
          <div class="flex align-end">
            <div class="font-w-600">文件列表</div>
            <div class="font-12 ml-20">请上传500M以内的文件</div>
          </div>
        </template>
      </uploadFileTable>
    </div>
    <!-- 附件 -->
    <div class="pt-20" v-if="fflczq">
      <!-- :readonly="reviewIsDisabled" -->
      <uploadFileTable
        :readonly="enclosureFileDisabled"
        v-model="formData.enclosureFile"
        :maxSize="500"
        :limit="500"
      >
        <template slot="title">
          <div class="flex align-end">
            <div class="font-w-600">附件（费用估计文件请上传至本表）</div>
            <div class="font-12 ml-20">请上传500M以内的文件</div>
          </div>
        </template>
      </uploadFileTable>
    </div>
    <!-- 审查意见 营地标/施工标段 :disabled="formData.isDditConstructionUnit == '1'" -->
    <!-- 5182 营地成果供应，西南咨询文秘节点，新增对审核意见进行电子签章，可以对多个审核意见进行电子签章 -->
    <el-form
      v-if="showReviewCommentsFileList"
      ref="dataFormRef6"
      :model="formData"
      :rules="formDataRules"
      label-width="0"
    >
      <el-form-item label="" label-width="0" prop="reviewCommentsFileList">
        <div class="pt-20">
          <uploadFileTable
            :readonly="
              reviewIsDisabled && this.$route.query.maintenance !== '1'
            "
            v-model="formData.reviewCommentsFileList"
            :maxSize="500"
            :limit="500"
            :showNtko="xnzxwmtj"
            @changeNtkoFile="scyjChangeNtkoFile"
            :isNtkotest="'1'"
          >
            <template slot="title">
              <div class="flex align-end">
                <div class="font-w-600">审查意见</div>
                <div class="font-12 ml-20">请上传500M以内的文件</div>
              </div>
            </template>
          </uploadFileTable>
        </div>
      </el-form-item>
    </el-form>

    <el-dialog
      v-draggable
      width="80%"
      :title="dialogTitle"
      :visible.sync="dialogPlanVisible"
    >
      <components
        :page="'drawingSupply'"
        ref="components"
        :type="1"
        :is="component"
      ></components>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPlanVisible = false">取 消</el-button>
        <el-button type="primary"  @click="sure"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RelatedReceivingDocuments from "@/views/office/SendDocument/components/RelatedReceivingDocuments.vue";
import { getDictItemList } from "@/api/dict";
import {
  sectionList,
  BelongTo,
  save,
  unitList,
  getDepartmentsByUnit,
  getSecretary,
  getSecretarysByCode,
} from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import MonthlyPlan from "@/components/MonthlyPlan/index.vue";
import resultsUniTable from "./components/resultsUniTable.vue";
import supervisoryUnitable from "./components/supervisoryUnitable.vue";
import originalDrawing from "@/components/originalDrawing/index.vue";

// 关联图纸列表 关联变更流程
import associatedDrawing from "@/views/design/availabilityofResults/components/associatedDrawing.vue";
import { fromApp } from "@/utils";

let allProps = [
  "resultsType",
  "planName",
  "code",
  "name",
  "profession",
  "actualDate",
  "isChange",
  "pbsCode",
  "sectionId",
  "money",
  "associatedDrawings",
  "relatedReceiving",
  "approver",
  "receivingDepartment1",
  "receivingDepartment2",
  "remark",
];
export default {
  components: {
    RelatedReceivingDocuments,
    MonthlyPlan,
    originalDrawing,
    resultsUniTable,
    associatedDrawing,
    supervisoryUnitable,
  },
  mixins: [FlowFormMixin],

  data() {
    return {
      constructionUnitLoading: false,
      copyUnitLoading: false,
      isDisApprover: false,
      //签章坐标
      signPosition: {},
      //坐标坐标拷贝
      signPositionMsg: {},
      deleteSendUnit: [],
      unitId: [],
      deleteCopyUnit: "", //删除的抄送单位
      supervisoryUnitOption: [], //监理单位
      // supervisorySecretaryOption: [], //监理单位文秘候选项
      receivingDepartment: [], // 接受部门
      // secretaryOption: [], //文秘候选项
      dialogTitle: "",
      ydWmCode: "ydbd-jldw-wm",
      ydWmOption: [],
      dialogPlanVisible: false,
      component: "",
      formType: "",
      myUnitId: [],
      planName: "",
      readonly: false,
      formData: {
        id: "",
        code: "",
        name: "",
        resultsType: "",
        supervisoryUnit: "",
        supervisorySecretary: "",
        approver: "",
        receivingDepartment1: "",
        receivingDepartment2: "",
        sectionId: [],
        pbsCode: "",
        designSupply: {
          id: "",
          name: "",
          code: "",
          pbsCode: "",
          profession: "",
        },
        needDistribution: "",
        isChange: "",
        planId: "",
        actualDate: "",
        remark: "",
        designSupplyFileList: [],
        reviewCommentsFileList: [],
        enclosureFile: [],
      },
      DefaultCopyUnitList: [],
      DefaultCopyUnitCode: "cggy-csmrdw",
      sjcgCode: "design_sjcglx",
      sjcgOptions: [],
      professionCode: "DESIGN_PROFESSION",
      professionOptions: [],
      sectionOptions: [],
      unitList: [], //源数据
      formDataRules: {
        resultsType: [
          { required: true, message: "请选择成果类型", trigger: "change" },
        ],
        // month: [{ required: true, message: "请选择计划月度", trigger: "blur" }],
        code: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        pbsCode: [
          { required: true, message: "请选择工程部位", trigger: "change" },
        ],
        sectionId: [
          { required: true, message: "请选择所属标段", trigger: "change" },
        ],
        approver: [
          { required: true, message: "请选内部审批人", trigger: "change" },
        ],
        receivingDepartment1: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        receivingDepartment2: [
          { required: true, message: "请选择文秘", trigger: "change" },
        ],
        profession: [
          { required: true, message: "请选择专业", trigger: "change" },
        ],
        isChange: [
          { required: true, message: "请选择是否变更图纸", trigger: "change" },
        ],
        changeProcess: [
          { required: true, message: "请选择关联变更流程", trigger: "change" },
        ],
        actualDate: [{ required: true, message: "请选择日期" }],
        needDistribution: [{ required: true, message: "请选择是否分发" }],
        supervisoryUnit: [{ required: false, message: "请选择监理单位" }],
        supervisorySecretary: [
          {
            validator: this.validateSupervisorySecretary,
            trigger: "change",
          },
        ],

        constructionUnit: [
          {
            validator: this.validateConstructionUnit,
            // required: true,
            message: "请添加施工单位",
            trigger: "change",
          },
        ],
        constructionUnitApprover: [
          {
            required: true,
            message: "请选择施工单位内部审核人",
            trigger: "change",
          },
        ],

        money: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur",
          },
        ],
        associatedDrawings: [
          {
            required: false,
            message: "请选择关联图纸",
            trigger: "change",
          },
        ],

        reviewCommentsFileList: [
          {
            validator: this.validateReviewCommentsFileList,
            message: "请上传审查意见",
            trigger: "change",
          },
        ],
      },
      url: {
        list: "/api/design/supply/detail/page",
      },
      isFromApp: false,
    };
  },
  created() {
    this.isFromApp = fromApp();
    this.getDictItemList(this.professionCode);
    // 只有在营地标展示默认单位
    this.getDictItemList(this.DefaultCopyUnitCode);
    // if (this.formData.pageType == "2") {
    //   // this.getDictItemList(this.DefaultCopyUnitCode);
    // }

    //获取标段
    this.getSectionList();
    this.getMyUnitId();
    // 获取缓存
    this.formType = this.$getStorage("formType");
    this.$bus.on("unitable", (event) => {
      if (event.type) {
        if (event.value) {
          console.log("form监听", event.value);
          let json = event.value.map((item) => {
            return {
              corpId: item.corpId,
              sendUser: item.sendUser,
              departId: item.departId,
            };
          });
          this.$set(this.formData, event.type, JSON.stringify(json));
          console.log(event.type, this.formData[event.type]);
        }
      } else {
        this.$message.warning("单位type为传递进组件");
      }
    });
    // 监理选中施工单位
    this.$bus.on("supervisoryUnitable", (event) => {
      if (event.type) {
        if (event.value) {
          console.log("form监听", event.value);
          let json = event.value.map((item) => {
            return {
              corpId: item.corpId,
              sendUser: item.sendUser,
              departId: item.departId,
            };
          });
          this.$set(this.formData, event.type, JSON.stringify(json));
          console.log(event.type, this.formData[event.type]);
        }
      } else {
        this.$message.warning("单位type为传递进组件");
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.getReceivingDepartment();
    });
  },
  computed: {
    sectionName() {
      let name = [];
      if (this.formData.sectionId) {
        if (Array.isArray(this.sectionOptions)) {
          this.formData.sectionId.forEach((item) => {
            let item2 = this.sectionOptions.find((x) => x.id == item);
            if (item2) {
              name.push(item2.name);
            }
          });
        }
        // let item = this.sectionOptions.find(
        //   (x) => x.id == this.formData.sectionId
        // );
        // if (item) {
        //   name = item.name;
        // }
      }
      return name;
    },
    // 何时显示附件
    fflczq() {
      console.log(
        " this.flowAuths?.fflczq",
        this.formData.parentId,
        this.flowAuths
      );
      if (this.formData?.parentId) {
        return false;
      }
      if (
        this.formData.flowStatus == 0 ||
        !this.formData.flowStatus ||
        this.flowAuths?.fflczq?.read ||
        this.formData?.attachmentRecipient?.includes(
          this.$getStorage("userInfo").userId
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    enclosureFileDisabled() {
      if (
        this.$route.query.maintenance === "1" // 数据维护流程时可打开
      ) {
        return false;
      }
      if (
        this.formData.parentId ||
        this.formData.flowStatus == 1 ||
        this.formData.flowStatus == 2
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 何时显示审批意见
    showReviewCommentsFileList() {
      // formData.pageType == '2' && (scyj || formData.reviewCommentsFileList)
      let bool = false;
      if (this.formData.pageType == "2") {
        console.log(
          "显示吟唱",
          Array.isArray(this.formData.reviewCommentsFileList),
          this.formData.reviewCommentsFileList
        );
        // 防止空素组
        if (
          this.scyj ||
          this.formData.parentId ||
          (Array.isArray(this.formData.reviewCommentsFileList) &&
            this.formData.reviewCommentsFileList.length > 0)
        ) {
          bool = true;
        } else {
          bool = false;
        }
      } else {
        return false;
      }
      console.log("返回", bool);
      return bool;
    },
    getPageType() {
      console.log("变更流程，pageTypethis.$route.meta", this.$route.meta);
      let pageType = this.formData.pageType || this.$route.meta?.pageType;
      console.log("变更流程，pageType", pageType);
      return pageType;
    },
    isDisabled() {
      if (this.formData.parentId) {
        return true;
      }
      if (this.readonly) {
        return this.readonly;
      }
    },

    reviewIsDisabled() {
      if (this.formData.parentId) {
        return true;
      }
      if (this.flowAuths?.scyj?.read) {
        return false;
      } else {
        return true;
      }
    },
    showNtko() {
      if (this.flowAuths?.stamp?.read) {
        return true;
      } else {
        return false;
      }
    },
    xnzxwmtj() {
      if (this.flowAuths?.xnzxwmtj?.read) {
        return true;
      } else {
        return false;
      }
    },
    // 管理局接收部门文秘
    secretaryOption() {
      return (e) => {
        if (this.receivingDepartment) {
          let item = this.receivingDepartment.find((x) => x.departId === e);
          return item?.SecretaryList || [];
        } else {
          return [];
        }
      };
    },

    // 监理单位文秘
    supervisorySecretaryOption() {
      return (e) => {
        console.log("监理单位", e, this.supervisoryUnitOption);
        if (this.supervisoryUnitOption) {
          let item = this.supervisoryUnitOption.find((x) => x.corpId === e);
          console.log("item", item);
          return item?.SecretaryList || [];
        } else {
          return [];
        }
      };
    },
    isNeedDistribution() {
      // console.log("this.flowAuths", this.flowAuths);
      if (this.flowAuths?.sfxyff?.read) {
        return true;
      } else {
        return false;
      }
    },
    // 可以優化
    // 是否显示监理单位选项
    jldwxs() {
      if (this.flowAuths?.jldwxs?.read) {
        return true;
      } else {
        return false;
      }
    },

    sgdwxs() {
      if (this.flowAuths?.sgdwxs?.read) {
        // this.sgdwxs = this.flowAuths?.sgdwxs;

        return true;
      } else {
        return false;
      }
    },

    hqry() {
      if (this.flowAuths?.hqry?.read) {
        return true;
      } else {
        return false;
      }
    },
    // 审查意见
    scyj() {
      if (this.flowAuths?.scyj?.read) {
        return true;
      } else {
        return false;
      }
    },
    pageType() {
      // 传递进来的是不显示的
      // 检查 formType 是否不在 fileList 中，如果包含则返回 false
      return (fileList) => {
        // 直接返回 fileList 中是否包含 formType 的布尔值
        return (
          !this.formData.resultsType ||
          !fileList.includes(this.formData.resultsType)
        );
      };
    },
  },
  watch: {
    "formData.reviewCommentsFileList": {
      handler(newVal) {
        console.log("审批意见监听", this.formData.pageType, newVal);
        if (
          this.formData.pageType == "2" &&
          (this.scyj || this.formData.reviewCommentsFileList)
        ) {
          // 审查意见
          this.$nextTick(() => {
            this.beforeSubmit("dataFormRef6");
          });
        }
      },
      immediate: false,
    },
    "formData.resultsType": {
      handler(newVal) {
        console.log("成果类型", newVal);
        this.$nextTick(() => {
          let dataFormRef = this.$refs.dataFormRef.fields;
          let nowProps = dataFormRef.map((item) => item.prop);
          //找出现在的与 allProps  中的比较找出没有的
          const notInAllProps = allProps.filter(
            (prop) => !nowProps.includes(prop)
          );
          notInAllProps.forEach((item) => {
            // 有些需要单独处理 关联图纸以及收发文
            if (item == "associatedDrawings") {
              this.formData.associatedDrawingsName = "";
            } else if (item == "relatedReceiving") {
              this.formData.relatedReceivingName = "";
            } else if (item == "relatedReceiving") {
              this.formData.relatedReceivingName = "";
            } else if (item == "money") {
              console.log("money", item);
              this.$set(this.formData, "money", 0);
            } else if (item == "sectionId") {
              this.$set(this.formData, "sectionId", []);
            } else {
              this.formData[item] = "";
            }
          });
          this.$forceUpdate();
        });
        if (newVal) {
          if (newVal === "jtyb" && !this.formData.profession) {
            this.$set(this.formData, "profession", "jt");
          } else if (newVal === "dzyb" && !this.formData.profession) {
            this.$set(this.formData, "profession", "dz");
          } else if (newVal === "sjtz2" && !this.formData.isChange) {
            this.$set(this.formData, "isChange", "2");
          } else if (newVal === "ydbsjtz" && !this.formData.isChange) {
            this.$set(this.formData, "isChange", "2");
          }
          //专业会在设计通知为非必填
          if (newVal === "sjtz" || newVal === "ydb-sjtz") {
            this.$set(this.formDataRules.profession[0], "required", false);
          } else {
            this.$set(this.formDataRules.profession[0], "required", true);
          }
        }
        //清除校验所属标段
        this.$nextTick(() => {
          this.$refs.dataFormRef.clearValidate();
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 监理文秘校验
    validateSupervisorySecretary(rule, value, callback) {
      if (this.formData.supervisoryUnit && !value) {
        callback(new Error("请选择监理单位文秘"));
      } else {
        callback();
      }
    },
    // 施工单位校验
    validateConstructionUnit(rule, value, callback) {
      console.log("自定义校验", value);
      let json = JSON.parse(value);
      if (Array.isArray(json) && json.length > 0) {
        callback(); // 校验通过
      } else {
        callback(new Error("请填入单位")); // 校验失败
      }
    },
    // 审查意见自定义校验
    validateReviewCommentsFileList(rule, value, callback) {
      console.log("自定义校验");
      if (Array.isArray(value) && value.length > 0) {
        callback(); // 校验通过
      } else {
        callback(new Error("请上传审查意见")); // 校验失败
      }
    },
    // 确保table 组件渲染完成  并且的 this.formData已经赋值成功
    tableInitOK(type) {
      console.log("tableInitOK", type);
      console.log("form数据", this.formData);
      let unitData = this.formData[type];
      console.log("unitData", unitData);
      if (unitData || this.formData.parentId) {
        console.log("unitData----", unitData);
        let json = JSON.parse(unitData);

        if (Array.isArray(json)) {
          this.$refs[type].initTable(json);
          this[`${type}Loading`] = false;
        } else {
          this[`${type}Loading`] = false;
          console.warning("单位数据格式错误");
        }
      }
    },
    // ntko 签名之后
    changeNtkoFile(fileData, fileNtkoIndex) {
      console.log("fileData", fileData);
      let arrFileData = JSON.parse(fileData);
      arrFileData.forEach((item) => {
        if (item.signed == true || item.signed == 1) {
          item.signed = 1;
        } else {
          item.signed = 2;
        }
        item.size = item.size || item.fileSize;
      });
      console.log("最终 的数据", arrFileData);
      this.formData.designSupplyFileList = arrFileData;
    },

    scyjChangeNtkoFile(fileData, fileNtkoIndex) {
      console.log("fileData", fileData);
      let arrFileData = JSON.parse(fileData);
      arrFileData.forEach((item) => {
        if (item.signed == true || item.signed == 1) {
          item.signed = 1;
        } else {
          item.signed = 2;
        }
        item.size = item.size || item.fileSize;
      });
      console.log("scyjChangeNtkoFile最终 的数据", arrFileData);
      this.formData.reviewCommentsFileList = arrFileData;
    },

    changeResultsType() {},
    // 校验函数
    async custumValidate() {
      let bool = true;
      // 是否需要分发
      if (bool && this.$refs.dataFormRef1) {
        bool = this.beforeSubmit("dataFormRef1");
      }
      // 监理单位施工单位
      if (bool && this.$refs.dataFormRef2) {
        bool = this.beforeSubmit("dataFormRef2");
      }
      // 监理单位 以及选择监理文秘
      if (bool && this.$refs.dataFormRef3) {
        bool = this.beforeSubmit("dataFormRef3");
      }
      // 施工单位选择 以及文秘
      if (bool && this.$refs.dataFormRef4) {
        bool = this.beforeSubmit("dataFormRef4");
        console.log("bool", bool);
        if (!bool) {
          return bool;
        }
        // 如果是文秘盖章节点 需要校验 因为有默认值
        console.log("this.formData.copyUnit", this.formData.copyUnit);
        if (bool && this.sgdwxs && this.formData.copyUnit) {
          let receiverPersonOk = this.$refs.copyUnit.receiverPerson();
          console.log("receiverPersonOk", receiverPersonOk);
          bool = receiverPersonOk;
        }
      }
      // 施工标段流程  第一个节点内部审核人
      if (bool && this.$refs.dataFormRef5) {
        bool = this.beforeSubmit("dataFormRef5");
      }
      // 审查意见
      console.log("this.$refs.dataFormRef6", this.$refs.dataFormRef6);
      if (bool && this.$refs.dataFormRef6) {
        bool = this.beforeSubmit("dataFormRef6");
      }

      return bool;
    },
    async beforeSend() {
      let extData = {};
      // 内部审批人
      extData["approver"] = {
        type: "user",
        value: this.formData.approver,
      };
      // 施工单位内部审核人
      extData["sgzyr"] = {
        type: "user",
        value: this.formData.constructionUnitApprover,
      };
      console.log("接收人信息", extData);
      this.sendFlowJson = extData;
    },

    async beforeSubmitButton() {
      let extData = {};
      // 管理局文秘
      extData["managerialSecretary"] = {
        type: "user",
        value: this.formData.receivingDepartment2,
      };
      // 是否需要分发
      extData["sfxyff"] = {
        type: "boolean",
        value: this.isSfxyff(),
      };
      // 监理文秘接收人
      extData["jlwmjsr"] = {
        type: "user",
        value: this.formData.supervisorySecretary,
      };
      // 标段施工单位内部审核人
      extData["nbshr"] = {
        type: "user",
        value: this.formData.constructionUnitApprover,
      };
      extData["sgdwwm"] = {
        type: "user",
        value: this.formData.createUser,
      };
      console.log("接收人信息", extData);
      // 部门主任会签
      extData["hqry"] = {
        type: "user",
        value: this.formData.departmentHead,
      };
      this.sendFlowJson = extData;
    },
    isSfxyff() {
      // this.formData.needDistribution == "1" ? true : false;
      if (this.formData.needDistribution == "1") {
        // 虽然选择了需要分发 但是如果的当前没有选择监理单位  就直接结束流程也就相当于不分发
        if (this.formData.supervisoryUnit == "") {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    // 发起变更
    changeApproval() {
      // this.$router.push({path:'/#/designChanges/changeApply?permCode=design-change&name=设计变更',meta:{formData:this.formData}})
      window.open(
        "/#/designChanges/changeApply?permCode=design-change&name=设计变更&baseId=" +
          this.formData.id +
          "&drawingCode=" +
          this.formData.code +
          "&drawingName=" +
          this.formData.name
      );
    },
    // 切换监理单位
    changeSupervisoryUnit(e) {
      this.formData.supervisorySecretary = "";
    },
    // 切换部门从新获取的人员
    changeDepartName(e) {
      this.formData.receivingDepartment2 = "";
    },
    //获取管理局部门部门主任
    async getDepartmentHead(corpId, departId) {
      if (!departId) {
        this.$message.error("没有获取到部门");
        return;
      }
      let params = {
        corpId: corpId,
        roleName: "管理局-部门主任",
      };
      let { data, success } = await getSecretary(params);
      console.log("获取部门主任", data);
      let depart = data?.find((x) => x.departId == departId);
      if (depart) {
        return depart;
      } else {
        this.$message.error("没有获取到部门主任");
        return;
      }
    },
    //获取监理单位
    async getSupervisoryUnitOption() {
      // 区分水电标段还是营地标段
      console.log("this.getSupervisoryUnitOption();", this.formData);
      if (this.formData.pageType == "1") {
        let { data, success } = await unitList();
        // 找出监理单位
        let list = data.filter((x) => x.corpType == "jldw");
        // 获取单位下的文秘
        let request = [];
        list.forEach((item) => {
          let params = {
            corpId: item.corpId,
            roleName: "文秘",
          };
          request.push(getSecretary(params));
        });
        let promiseList = await Promise.all(request);
        list.forEach((item, index) => {
          item.SecretaryList = promiseList[index].data;
        });
        this.supervisoryUnitOption = list;
      } else {
        // 营地标就默认是西南分公司 、、和文秘
        // ydb-jldw-wm
        // 营地标段-监理文秘
        this.getDictItemList(this.ydWmCode);
        // this.supervisoryUnitOption = [
        //   {
        //     corpName: "四川西南项管雄安营地监理部",
        //     corpId: "1214261225936912384",
        //     SecretaryList: [
        //       {
        //         realName: "四川西南咨询监理部收发文",
        //         userId: "1214262334856364032",
        //       },
        //     ],
        //   },
        // ];
      }
    },
    //获取管理局部门
    async getReceivingDepartment() {
      let { data, success } = await unitList();
      // 找出业主单位  从当前数据中过滤出业主单位
      let manergeUnit = data.find((x) => x.corpType == "yzdw");
      let res = await getDepartmentsByUnit(manergeUnit.corpId);
      // 过滤掉配置文件的单位
      console.log("this.$store.state", this.$store.state);
      let filterUnit = this.$store.state.customizedFilterunits;
      console.log("过滤掉配置文件的单位", filterUnit);
      let ownDepart = [];
      res.data.forEach((item) => {
        let a = filterUnit.find((x) => x.cordId == item.departId);
        if (!a) {
          ownDepart.push(item);
        }
      });
      let params = {
        corpId: manergeUnit.corpId,
        roleName: "文秘",
      };
      let resSecretary = await getSecretary(params);
      const SecretaryList = resSecretary.data;
      ownDepart.forEach((item) => {
        // 判断  部门不可能重复 直接赋值为[]
        // 从文秘数据中找出当前部门下的文秘
        let Secretarys = SecretaryList.filter(
          (x) => x.departId === item.departId
        );
        item.SecretaryList = Secretarys;
      });
      this.receivingDepartment = ownDepart;
    },
    async sure() {
      let currentRow = this.$refs.components.currentRow;
      console.log("关闭选择", currentRow);
      if (currentRow) {
        // 2023-08 xxxxx图纸
        if (this.component == "MonthlyPlan") {
          console.log("月度计划");
          this.planName = `${currentRow.month} ${currentRow.taskName}`;
          this.formData.planId =
            currentRow.pid +
            "&&&" +
            currentRow.id +
            "&&&" +
            currentRow.taskName +
            "&&&" +
            currentRow.month;
          this.formData.designSupply.pbsCode =
            currentRow.pbsCode || currentRow.projectPbs;
        } else if (this.component == "originalDrawing") {
          console.log("关联图纸多选");
          let ids = currentRow.map((x) => x.id);
          let names = currentRow.map((x) => x.name);
          // this.formData.associatedDrawingsName = names.join(",");
          // this.formData.associatedDrawings = currentRow.code;
          // this.formData.baseId = currentRow.id;
        } else if (this.component == "engineeringChange") {
          console.log("工程变更");
          this.$set(
            this.formData.designSupply,
            "projectChangeCode",
            currentRow.projectChangeCode
          );
          this.$set(this.formData.designSupply, "code", currentRow.code);
          this.$set(this.formData.designSupply, "name", currentRow.drawingName);
          this.$set(
            this.formData.designSupply,
            "profession",
            currentRow.profession
          );
          this.projectChangeName = currentRow.projectChangeCode;

          if (currentRow?.pbsCode) {
            this.formData.designSupply.pbsCode = currentRow.pbsCode;
          } else {
            this.formData.designSupply.pbsCode = "";
          }
          this.formData.baseId = currentRow.id;
        }
      }
      this.$nextTick(() => {
        this.dialogPlanVisible = false;
      });
    },
    // 切换组件  MonthlyPlan是关联计划组件  originalDrawing原图纸组件
    chooseComponent(com, title) {
      // this.$message.warning("等待开发");
      // return;
      console.log("组件", title, com);
      if (this.readonly) return;
      if (this.isEdit && com != "MonthlyPlan") {
        this.$message.warning("只读属性，无法修改");
        return;
      }
      this.dialogTitle = title;

      this.dialogPlanVisible = true;
      this.component = com;
      this.$nextTick(() => {
        if (com == "MonthlyPlan") {
          this.$refs.components.toDay();
        } else if (com == "engineeringChange") {
          this.$refs.components.reset();
        } else if (com == "associatedDrawings") {
          // 水电标段
          this.$refs.components.fromPage = "hydroStandardForm";
        } else {
          this.$message.error("组件使用错误");
          this.dialogPlanVisible = false;
          return;
        }
      });
    },
    async save(origin, callback, event) {
      console.log("savesavesavesave", this.postMessageData?.btnKey, origin);
      let fields = { ...origin };
      console.log("fieldsfieldsfieldsfieldsfields", fields);
      const isMaintenance = event.data.btnKey === "maintenance";

      // pageType='1' 为水电标
      // 由于使用的是同一个的施工单位模板  所以 施工标段这边的pageType 已经存在 就不能再继续更改了 parentId只有在施工标段才会有
      console.log("fields?.parentId", this.$route);
      if (!fields?.parentId) {
        fields.pageType = this.$route.meta?.pageType || 1;
      }
      // 做处理当前是todo并且的分发有值 就设置编辑状态为1 写入数据库 后续就可以设置为禁用了
      if (fields.needDistribution) {
        fields.isDditDistribution = "1";
      }
      // 当选择分发   但是没有选监理单位 也要让 监理文秘置灰  即 isDditSupervisoryunit字段设置为1
      if (fields.supervisoryUnit || fields.needDistribution) {
        fields.isDditSupervisoryunit = "1";
      }

      if (fields.constructionUnit) {
        fields.isDditConstructionUnit = "1";
      }
      if (fields.copyUnit) {
        fields.isEditCopyunit = "1";
      }
      // 如果当前的节点  xnzxwm   返回未true 代表是西南文秘 就需要把当前登录人单位的id 保存下来 ----只针对营地标段
      // if (fields.pageType == "2" && this.flowAuths?.xnzxwm?.read) {
      //   fields.supervisoryUnit = this.$getStorage("userInfo").corpId;
      //   fields.supervisorySecretary = this.$getStorage("userInfo").userId;
      // }
      // 如果退回 就要能否编辑置空 因为可能存在再后面选单位 是否分发  然后退回，
      if (!fields.parentId && this.postMessageData?.btnKey == "return") {
        fields.isDditDistribution = "";
        fields.isDditSupervisoryunit = "";
        fields.isDditConstructionUnit = "";
        fields.isEditCopyunit = "";
        // 分发也要设置为空
        fields.needDistribution = "";
        // 监理单位置空
        fields.supervisoryUnit = "";
        fields.supervisorySecretary = "";
        // 施工单位  抄送单位置空
        fields.constructionUnit = "";
        fields.copyUnit = "";
        fields.attachmentRecipient = "";
      }
      // createPersonUnit 创建人的单位
      if (!fields.createPersonUnit) {
        fields.createPersonUnit = this.$getStorage("userInfo").corpId;
      }
      // 确定部门主任
      if (
        fields.flowStatus == 0 ||
        !fields.flowStatus ||
        this.postMessageData.page == "mine"
      ) {
        // 固定使用管理局单位
        const { userId } = await this.getDepartmentHead(
          "1151191129069191168",
          fields.receivingDepartment1
        );
        console.log("huserIdead", userId);
        fields.departmentHead = userId;
        if (!userId) {
          this.$message.error("该部门没有部门主任");
          return;
        }
      }
      console.log("this.postMessageData?.btnKey", this.postMessageData?.btnKey);
      if (
        this.postMessageData?.btnKey == "return" ||
        (!this.sgdwxs && this.showNtko)
      ) {
        // 附件取消掉签章
        if (fields.designSupplyFileList.length > 0) {
          fields.designSupplyFileList.forEach((item) => {
            item.signed = "2";
          });
        }
      }
      // 如果退回  将所有的文件id 都换成源文件
      if (this.postMessageData?.btnKey === "return" && fields.pageType == 2) {
        let a = [];
        if (Array.isArray(fields.reviewCommentsFileList)) {
          let arr = [...fields.reviewCommentsFileList];
          arr.forEach((item, index) => {
            console.log("item", item);
            let url = item.url;
            let modifiedStr = url.replace(
              /\/temp\/temp\/.*?\./,
              `/temp/temp/${item.oldfileid}.`
            );
            item.url = modifiedStr;
            item.fileId = item.oldfileid;
            item.signed = 2;
          });
          a = arr;
        } else {
          this.$message.error("源文件错误！");
          return;
        }
        fields.reviewCommentsFileList = JSON.stringify(a);
      } else {
        let a = [];
        if (
          fields.reviewCommentsFileList &&
          Array.isArray(fields.reviewCommentsFileList)
        ) {
          let arr = [...fields.reviewCommentsFileList];
          // 审查意见取消掉签章
          arr.forEach((item) => {
            item.signed = "2";
          });
          a = arr;
        }
        // 将数组转换为字符串
        fields.reviewCommentsFileList = JSON.stringify(a);
      }
      if (fields.sectionId && Array.isArray(fields.sectionId)) {
        fields.sectionId = fields.sectionId.join(",");
      }
      // 处理 附件类型
      if (fields.enclosureFile && Array.isArray(fields.enclosureFile)) {
        fields.enclosureFile = JSON.stringify(fields.enclosureFile);
      }
      // 在创建的时候 添加 避免重复请求
      if (this.postMessageData?.btnKey === "send") {
        let corpId = "1151192679288143872";
        let params = {
          corpIds: corpId,
          roleCode: "sjczlyjbgscwm",
        };
        let { data, success } = await getSecretarysByCode(params);
        if (data[corpId]) {
          let arr = data[corpId];
          let ids = arr.map((x) => x.userId);
          if (ids.length > 0) {
            fields.attachmentRecipient += "," + ids.toString();
          }
        }

        // 添加  四川西南咨询监理部收发文
        // 添加  四川西南咨询监理部收发文
        // "1214261034911531008",//测试环境 四川西南咨询公司雄安营地全过程咨询服务项目部
        // "1230892583157235712",//预生产环境 四川西南咨询公司雄安营地全过程咨询服务项目部
        // "1212698079044567040",//生产环境 四川西南咨询公司雄安营地全过程咨询服务项目部
        if (fields.pageType == 2) {
          let xncorpId =
            "1214261034911531008,1230892583157235712,1212698079044567040";
          let params = {
            corpIds: xncorpId,
            // roleName: "西南-文秘",
            roleCode: "xinanwenmi,xnwm", // 角色编码  由于线上跟测试环境 预生产环境编码 定义的不一样所有 把几个都写进去后台会循环匹配
          };
          let res = await getSecretarysByCode(params);
          let xnData = res.data;
          console.log("xnData", xnData);
          // 循环对象  xnData
          for (let key in xnData) {
            if (xnData.hasOwnProperty(key)) {
              console.log(`Key: ${key}, Value: ${xnData[key]}`);
              if (xnData[key]) {
                let arr = xnData[key];
                let ids = arr.map((x) => x.userId);
                console.log("ss", ids);
                if (ids.length > 0) {
                  fields.attachmentRecipient += "," + ids.toString();
                }
              }
            }
          }
        }
      }
      // fflczq  修改 曾经办理的人员 如果当前的人员在分发之前是可以办理  或者查看就说明这个人肯定可以一直查看的
      if (this.fflczq) {
        // 向 fields.attachmentRecipient添加当前登陆人的id
        // 匹配当前是不是有 this.$getStorage("userInfo").userId  如果没有就追加  如果有  就不管了
        if (
          !fields?.attachmentRecipient?.includes(
            this.$getStorage("userInfo").userId
          )
        ) {
          fields.attachmentRecipient +=
            "," + this.$getStorage("userInfo").userId;
        }
        // 解决查看问题  在未办理但是可以查看的问题 需要将下一步的代办人id 放进去
        // 将内部审批人  内部审批人  的id 放进去
        if (!fields?.attachmentRecipient?.includes(fields.approver)) {
          fields.attachmentRecipient += "," + fields.approver;
        }
        // 将 雄安项目部-文秘  的id 都放进去
        // 将管理局文秘  的id 放进去
        if (
          !fields?.attachmentRecipient?.includes(fields.receivingDepartment2)
        ) {
          fields.attachmentRecipient += "," + fields.receivingDepartment2;
        }
      }
      console.log("保存", fields);
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
      save(fields)
        .then((res) => {
          const { success, message, data } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
            // this.$message.success("新增成功");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },

    //只能选中本单位得人员 考虑多单位
    async getMyUnitId() {
      let unitId = [];
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId,
      };
      let res = await BelongTo(params);
      const { data, success } = res;
      if (!success) {
        return unitId;
      }
      if (data && Array.isArray(data) && data.length > 0) {
        unitId = data.map((item) => item.corpId);
      }
      this.myUnitId = unitId;
    },
    handlerApprover(value) {
      console.log("freeFlowUsers", value);
      if (value) {
        this.$refs.dataFormRef.clearValidate("freeFlowUsers");
      }
    },
    handlerconstructionUnitApprover(value) {
      console.log("freeFlowUsers", value);
      if (value) {
        this.$refs.dataFormRef.clearValidate("freeFlowUsers");
      }
    },
    // 选中关联收文回调
    relatedConfirm(row) {
      console.log("选中回调", row);
      this.formData.relatedReceiving = row.ids;
      this.formData.relatedReceivingName = row.titles;
    },
    // confirm 关联图纸回调
    confirm(row) {
      let data = { ...row };
      console.log("关联图纸回调", data);
      this.$nextTick(() => {
        this.$set(this.formData, "associatedDrawings", data.id);
        this.$set(this.formData, "associatedDrawingsName", data.name);
        this.$forceUpdate();
      });
    },
    // 关联变更流程回调
    changeProcessConfirm(row) {
      let data = { ...row };
      console.log("关联图纸回调", data);
      this.$nextTick(() => {
        this.$set(this.formData, "changeProcess", data.id);
        this.$set(this.formData, "changeProcessName", data.name);
        this.$forceUpdate();
      });
    },

    /**获取施工标段 */

    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        console.log("获取标段", res);
        if (res.success) {
          this.sectionOptions = res.data;
        }
      });
    },
    async getSectionList_back() {
      this.sectionOptions = [];
      let sectionRes = await sectionList({});
      if (sectionRes.success) {
        this.sectionOptions = sectionRes.data;
        console.log("获取标段", sectionRes);
      }

      let units = [];
      let unitRes = await unitList();
      if (unitRes.success) {
        units = unitRes.data;
      }

      //获取字典
      let excludeOptionNames = [];
      const gldwmc = await getDictItemList("gldwmc");
      for (let i = 0; i < gldwmc.data.length; i++) {
        excludeOptionNames.push(gldwmc.data[i].dictName);
      }
      units = units.filter(
        (item) => !excludeOptionNames.includes(item.corpName)
      );
      console.log(units);
      // console.log(units.findIndex(item1=>item1.corpDesc=='sgdw'&&item1.corpId==item1.secondUnit))
      // 、secondUnit corpDesc
      this.sectionOptions = this.sectionOptions.filter(
        (item) =>
          units.findIndex(
            (item1) =>
              item1.corpDesc == "sgdw" && item1.corpId == item.secondUnit
          ) > -1
      );
      console.log("this.sectionOptions ", this.sectionOptions);
    },
    //翻译列表所属标段 id=>name
    sectionIdFormatter(row, column) {
      var value = "";
      for (var i = 0; i < this.sectionOptions.length; i++) {
        var item = this.sectionOptions[i];
        if (row.sectionId == item.id) {
          value = item.name;
          break;
        }
      }
      return value;
    },

    getDictItemList(code, callback) {
      if (code === this.ydWmCode) {
        if (!this.ydWmOption || this.ydWmOption.length == 0) {
          getDictItemList(code).then((res) => {
            const { success, data } = res;
            if (success) {
              if (data[0].dictRemark) {
                let json = JSON.parse(data[0].dictRemark);
                console.log("获取营地标", success, json);
                console.log("json", json);
                if (json && Array.isArray(json)) {
                  this.supervisoryUnitOption = json;
                }
              }
            }
          });
        }
      }
      if (code === this.DefaultCopyUnitCode) {
        if (!this.DefaultCopyUnitList || this.DefaultCopyUnitList.length == 0) {
          // 何时返回 DefaultCopyUnitList  if()
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.DefaultCopyUnitList =
                res.data.map((item) => {
                  return {
                    corpName: item.dictName,
                    corpId: item.dictRemark,
                  };
                }) || [];
              console.log("默认第三方", this.DefaultCopyUnitList);
            }
          });
        } else {
        }
      }
      if (code === this.sjcgCode) {
        if (!this.sjcgOptions || this.sjcgOptions.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              // 剔除 ditctCode=='sjcglx'
              console.log("字典", res);
              this.sjcgOptions = res.data.filter(
                (item) => item.dictCode != "sbcglx" && item.dictCode != "sjcglx"
              );
            }
          });
        } else {
        }
      }
      if (code === this.professionCode) {
        if (!this.professionOptions || this.professionOptions.length == 0) {
          getDictItemList(code).then((res) => {
            // console.log("res", res);
            if (res.success) {
              // 剔除0
              this.professionOptions = res.data;
            }
          });
        } else {
        }
      }
    },
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        console.warn("表单数据", row);
        // this.isDisApprover = true;
        if (row) {
          if (row.pageType == 2) {
            this.sjcgCode = "cglx-ydbd";
          } else {
            this.sjcgCode = "design_sjcglx";
          }
          // 处理文件类型 如果是字符串就转成数组
          console.log("row.reviewCommentsFileList", row.reviewCommentsFileList);
          if (row.reviewCommentsFileList) {
            // 检测类型是不是的 素组
            if (!Array.isArray(row.reviewCommentsFileList)) {
              row.reviewCommentsFileList = JSON.parse(
                row.reviewCommentsFileList
              );
            }
          } else {
            row.reviewCommentsFileList = [];
          }
          this.getDictItemList(this.sjcgCode);
          if (row.actualDate) {
            row.actualDate = this.$dateFormat(row.actualDate, "yyyy-MM-DD");
          }
          if (row.parentId) {
            let flow_page_type = this.$getStorage("flow_page_type");
            console.log("szgc__flow_page_type", flow_page_type);
            if (row.flowStatus == 0) {
              if (flow_page_type == "fine") {
                this.isDisApprover = true;
              } else {
                this.isDisApprover = false;
              }
            } else {
              this.isDisApprover = true;
            }
          }

          if (row.constructionUnit || row.parentId) {
            this[`constructionUnitLoading`] = true;
          }
          if (row.copyUnit || row.parentId) {
            this[`copyUnitLoading`] = true;
          }
          if (row.sectionId) {
            row.sectionId = row.sectionId.split(",");
          }
          // 处理附件类型
          if (row.enclosureFile) {
            // 检测类型是不是的 素组
            if (!Array.isArray(row.enclosureFile)) {
              row.enclosureFile = JSON.parse(row.enclosureFile);
            }
          } else {
            row.enclosureFile = [];
          }
          this.formData = JSON.parse(JSON.stringify(row));
          console.log("存在表单数据", this.formData);
          // 关联计划任务项回显
          if (this.formData.planId) {
            let arr = this.formData.planId.split("&&&");
            if (arr.length >= 4) {
              let taskName = arr[2];
              let month = arr[3];
              this.planName = `${month} ${taskName}`;
            }
          }
          this.getSupervisoryUnitOption();
        } else {
          console.log("this.$route.meta,", this.$route);
          if (this.$route.meta?.pageType == 2) {
            this.sjcgCode = "cglx-ydbd";
          } else {
            this.sjcgCode = "design_sjcglx";
          }
          this.getDictItemList(this.sjcgCode);
          // 获取成果类型
          let resultsType = this.$getStorage("resultsType");
          if (resultsType) {
            this.formData.resultsType = resultsType;
          }
        }
      } catch (error) {
        console.error("获取表单数据出错:", error);
      }
    },
  },
};
</script>
<style scoped lang="scss">
// ::v-deep .customStyle .el-input-group__append {
//   border: 1px solid #dcdfe6;
//   color: #808080;
//   cursor: default;
// }

::v-deep .customStyle .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}
::v-deep .el-form-item.is-required > .el-form-item__label::before {
  content: "*";
  left: -8px !important;
  color: red;
  position: absolute;
  margin-right: 0 !important;
  margin-top: 1px;
}
::v-deep .is-disabled {
  .el-input__inner,
  .el-textarea__inner {
    color: #333;
  }
}

::v-deep .sectionSelect {
  width: 100%;
}
.custum-input {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
  border: 1px solid #dcdfe6;
  padding: 5px;
  .sectionName {
    background-color: #f4f4f5;
    border: 1px solid #e9e9eb;
    color: #909399;
    line-height: 20px;
  }
}

.tagmul-class {
  /deep/ .el-tag.el-tag--info .el-tag__close {
    display: none;
  }
}
.approver {
  ::v-deep .el-form-item__label {
    letter-spacing: 2px;
  }
}
</style>
