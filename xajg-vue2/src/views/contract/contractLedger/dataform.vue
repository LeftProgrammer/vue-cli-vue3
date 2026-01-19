<template>
  <el-dialog
    v-draggable
    :oprate-row="oprateRow"
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :fullscreen="true"
    append-to-body
    @closed="closedHandle"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="baseInfo">
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          label-width="160px"
        >
          <div class="base-info-toolbar">
            <div class="base-info-toolbar__title">合同基础信息</div>
            <div>
              <el-button type="primary" @click="downloadBaseTemplate">
                模板下载
              </el-button>
              <el-button :disabled="readonly" @click="triggerBaseFileInput">
                导入
              </el-button>
            </div>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同名称:" prop="name">
                <el-input
                  v-model="formData.name"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="255"
                  show-word-limit
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号:" prop="code">
                <el-input
                  v-model="formData.code"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同金额:" prop="amount">
                <el-input
                  v-model="formData.amount"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="18"
                  show-word-limit
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税率:" prop="taxationRate">
                <el-input
                  v-model="formData.taxationRate"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签约单位:" prop="contractedUnit">
                <el-input
                  v-model="formData.contractedUnit"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="255"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签约日期:" prop="contractedDate">
                <el-date-picker
                  v-model="formData.contractedDate"
                  type="date"
                  :disabled="readonly"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同类型:" prop="type">
                <el-select
                  v-model="formData.type"
                  class="w-100pre"
                  :disabled="readonly"
                  placeholder="请选择"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in contractTypeList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计价方式:" prop="pricingMethod">
                <el-select
                  v-model="formData.pricingMethod"
                  class="w-100pre"
                  :disabled="readonly"
                  placeholder="请选择"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in pricingMethodList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同期限:" prop="deadline">
                <el-input
                  v-model="formData.deadline"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购方式:" prop="procurementMode">
                <el-select
                  v-model="formData.procurementMode"
                  class="w-100pre"
                  :disabled="readonly"
                  placeholder="请选择"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in procurementMethodList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="支付方式:" prop="paymentMethod">
                <el-input
                  v-model="formData.paymentMethod"
                  type="textarea"
                  placeholder="请输入"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  :disabled="readonly"
                  maxlength="500"
                  show-word-limit
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="甲方签约人:" prop="parties">
                <el-input
                  v-model="formData.parties"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="乙方签约人:" prop="secondParties">
                <el-input
                  v-model="formData.secondParties"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他签约人:" prop="otherParties">
                <el-input
                  v-model="formData.otherParties"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="投标时项目负责人:" prop="projectManagement">
                <el-input
                  v-model="formData.projectManagement"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否有变更:" prop="isChange">
                <el-switch
                  v-model="formData.isChange"
                  :disabled="readonly"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formData.isChange" :span="12">
              <el-form-item label="变更内容:" prop="changeDetail">
                <el-input
                  v-model="formData.changeDetail"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="乙方单位:" prop="partyB">
                <el-input
                  v-model="formData.partyB"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="乙方账户名称:" prop="partyBName">
                <el-input
                  v-model="formData.partyBName"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="乙方税号:" prop="partyBTaxationNumber">
                <el-input
                  v-model="formData.partyBTaxationNumber"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="乙方开户行:" prop="partyBOpeningBank">
                <el-input
                  v-model="formData.partyBOpeningBank"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="乙方银行账号:" prop="partyBCardNumber">
                <el-input
                  v-model="formData.partyBCardNumber"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="乙方银行联行号:"
                prop="partyBCardAssociatesNumber"
              >
                <el-input
                  v-model="formData.partyBCardAssociatesNumber"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="丙方单位 （如有）:" prop="partyC">
                <el-input
                  v-model="formData.partyC"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="丙方账户名称:" prop="partyCName">
                <el-input
                  v-model="formData.partyCName"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="丙方税号:" prop="partyCTaxationNumber">
                <el-input
                  v-model="formData.partyCTaxationNumber"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="丙方开户行:" prop="partyCOpeningBank">
                <el-input
                  v-model="formData.partyCOpeningBank"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="丙方银行账号:" prop="partyCCardNumber">
                <el-input
                  v-model="formData.partyCCardNumber"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="丙方银行联行号:"
                prop="partyCCardAssociatesNumber"
              >
                <el-input
                  v-model="formData.partyCCardAssociatesNumber"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="履约责任处室:" prop="responsibleParty">
                <el-select
                  v-model="formData.responsibleParty"
                  class="w-100pre"
                  :disabled="readonly"
                  placeholder="请选择"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in departList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="履约负责人:" prop="contractManager">
                <user
                  v-model="formData.contractManager"
                  :readonly="readonly"
                  @change="contractManagerChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同状态:" prop="status">
                <el-select
                  v-model="formData.status"
                  disabled
                  class="w-100pre"
                  placeholder="请选择"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in contractStatusList"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同计划开工日期:" prop="startDate">
                <el-date-picker
                  v-model="formData.startDate"
                  :disabled="readonly"
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同计划完工日期:" prop="endDate">
                <el-date-picker
                  v-model="formData.endDate"
                  type="date"
                  :disabled="readonly"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同实际开工日期:" prop="actualStartDate">
                <el-date-picker
                  v-model="formData.actualStartDate"
                  :disabled="readonly"
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同实际完工日期:" prop="actualEndDate">
                <el-date-picker
                  v-model="formData.actualEndDate"
                  type="date"
                  :disabled="readonly"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="排序:" prop="sort">
                <el-input-number
                  v-model="formData.sort"
                  :disabled="readonly"
                  :step="1"
                  style="width: 100%"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="合同附件:" prop="attachment">
                <uploadFile
                  v-model="formData.attachment"
                  :readonly="readonly"
                  :limit="1"
                  :multiline="false"
                  :max-size="500"
                  @change="handleFileChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计应结算金额">
                <el-input
                  :value="settlementMoney('cumulativeSettlement')"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计扣留金额">
                <el-input
                  :value="settlementMoney('cumulativeDetention')"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计扣除金额" prop="cumulativeDivision">
                <el-input
                  :value="settlementMoney('cumulativeDivision')"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="累计实际支付金额"
                prop="cumulativeActualPayment"
              >
                <el-input
                  :value="settlementMoney('cumulativeActualPayment')"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计实际支付农民工工资">
                <el-input
                  :value="settlementMoney('cumulativePaymentOfFarmers')"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计实际支付安全生产经费">
                <el-input
                  :value="settlementMoney('cumulativeSafetyProductionExpense')"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="本合同结算台账"
                prop="cumulativeSafetyProductionExpense"
              >
                <el-button type="text" @click="viewTable">查看</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:" prop="remark">
                <el-input
                  v-model="formData.remark"
                  type="textarea"
                  placeholder="请输入"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  :disabled="readonly"
                  maxlength="500"
                  show-word-limit
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="录入处室" prop="unitName">
                <el-input v-model="formData.unitName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="录入人" prop="createUsername">
                <el-input v-model="formData.createUsername" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="录入日期" prop="initiationDate">
                <el-date-picker
                  v-model="formData.initiationDate"
                  disabled
                  type="date"
                  style="width: 100%"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="合同清单明细" name="contractDetail">
        <div class="base-info-toolbar">
          <div style="width: 50%; color: #000">合同清单明细</div>
          <div style="width: 50%; text-align: right; height: 100%">
            <el-button
              type="primary"
              :disabled="readonly"
              @click="downloadTemplate()"
            >
              模板下载
            </el-button>
            <el-button :disabled="readonly" @click="triggerFileInput()">
              导入清单
            </el-button>
            <el-button :disabled="readonly" @click="addDetailBtn()">
              添加
            </el-button>
          </div>
        </div>

        <div style="height: calc(100% - 64px - 30px)">
          <el-table
            ref="multipleTable"
            border
            :data="tableData"
            style="width: 100%; height: 100%; overflow: auto"
          >
            <el-table-column
              label="序号"
              type="index"
              width="80"
              align="center"
            />
            <el-table-column
              label="清单编号"
              prop="orderNo"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.orderNo"
                  :disabled="readonly"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="名称"
              prop="name"
              align="center"
              min-width="150"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.name"
                  :disabled="readonly"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="单位"
              prop="unit"
              align="center"
              min-width="150"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.unit"
                  placeholder="请输入"
                  :disabled="readonly"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              prop="quantity"
              align="center"
              width="150"
            >
              <template slot-scope="{ row, $index }">
                <el-input-number
                  v-model="row.quantity"
                  :controls="false"
                  style="width: 100%"
                  :disabled="readonly"
                  :min="0"
                  @change="handleChange($index)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="单价（元）"
              prop="price"
              align="center"
              width="150"
            >
              <template slot-scope="{ row, $index }">
                <el-input-number
                  v-model="row.price"
                  style="width: 100%"
                  :controls="false"
                  :disabled="readonly"
                  :min="0"
                  @change="handleChange($index)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="合价（元）"
              prop="totalPrice"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-input v-model="row.totalPrice" disabled />
              </template>
            </el-table-column>
            <el-table-column
              label="概算编码"
              prop="estimateCode"
              align="center"
              min-width="150"
            >
              <template slot-scope="{ row }">
                <el-input
                  v-model="row.estimateCode"
                  :disabled="readonly"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  :disabled="readonly"
                  @click.native.prevent="
                    deleteDetailBtn(scope.$index, tableData)
                  "
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          style="
            text-align: right;
            height: 32px;
            line-height: 32px;
            margin-top: 15px;
            padding-right: 20%;
          "
        >
          总计：{{ tableTotalMoney }}元
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">
        {{ oprateRow.isView ? "关闭" : "取消" }}
      </el-button>
      <el-button
        v-if="!oprateRow.isView"
        type="primary"
        @click="childEvtHandle"
      >
        确定
      </el-button>
    </div>
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      @change="handleFileUpload"
    >
    <input
      ref="baseFileInput"
      type="file"
      style="display: none"
      @change="handleBaseFileUpload"
    >
    <el-dialog
      title="结算台账清单"
      :visible.sync="dialogShowTable"
      :destroy-on-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :fullscreen="true"
      append-to-body
      @closed="dialogShowTable = false"
    >
      <table>
        <tr>
          <th style="width: 100px" />
          <th style="width: 100px" />
          <th colspan="11">应结算项目</th>
          <th colspan="3">扣留项目</th>
          <th colspan="8">扣除项目</th>
          <th colspan="3">实际支付金额</th>
        </tr>
        <tr>
          <td>结算次数</td>
          <td>时间</td>
          <td>工程预付款</td>
          <td>材料预付款</td>
          <td>小计(一)</td>
          <td>工程量清单项目</td>
          <td>变更项目</td>
          <td>计日工项目</td>
          <td>索赔项目</td>
          <td>价格调整</td>
          <td>其他</td>
          <td>小计（二）</td>
          <td>应结算合计（三）</td>
          <td>进度款</td>
          <td>其他</td>
          <td>扣留项目合计（四）</td>
          <td>工程预付款</td>
          <td>材料预付款</td>
          <td>小计（五）</td>
          <td>违约赔偿扣款</td>
          <td>质量安全扣款</td>
          <td>小计（六）</td>
          <td>其他</td>
          <td>扣除项目合计（七）</td>
          <td>实际支付金额合计（三-四-七）</td>
          <td>其中：农民工工资</td>
          <td>其中：安全生产经费</td>

          <td />
        </tr>
        <tr v-for="(item, index) in settlementList" :key="item.id">
          <td>第{{ index + 1 }}次结算</td>
          <td>{{ moment(item.updateDate).format("YYYY-MM-DD") }}</td>
          <td>{{ settlementItemMoney("工程预付款", item) }}</td>
          <td>{{ settlementItemMoney("材料预付款", item) }}</td>
          <td>
            {{ settlementItemMoney(["工程预付款", "材料预付款"], item) }}
          </td>
          <td>{{ settlementItemMoney("工程量清单项目", item) }}</td>
          <td>{{ settlementItemMoney("变更项目", item) }}</td>
          <td>{{ settlementItemMoney("计日工项目", item) }}</td>
          <td>{{ settlementItemMoney("索赔项目", item) }}</td>
          <td>{{ settlementItemMoney("价格调整", item) }}</td>
          <td>{{ settlementItemMoney("其他", item) }}</td>
          <td>
            {{
              settlementItemMoney(
                [
                  "工程量清单项目",
                  "变更项目",
                  "计日工项目",
                  "索赔项目",
                  "价格调整",
                  "其他",
                ],
                item
              )
            }}
          </td>
          <td>
            {{
              settlementItemMoney(
                [
                  "工程预付款",
                  "材料预付款",
                  "工程量清单项目",
                  "变更项目",
                  "计日工项目",
                  "索赔项目",
                  "价格调整",
                  "其他",
                ],
                item
              )
            }}
          </td>
          <td>{{ settlementItemMoney("进度款", item) }}</td>
          <td>{{ settlementItemMoney("其他1", item) }}</td>
          <td>{{ settlementItemMoney(["进度款", "其他1"], item) }}</td>
          <td>{{ settlementItemMoney("工程预付款1", item) }}</td>
          <td>{{ settlementItemMoney("材料预付款1", item) }}</td>
          <td>
            {{ settlementItemMoney(["工程预付款1", "材料预付款1"], item) }}
          </td>
          <td>{{ settlementItemMoney("违约赔偿扣款", item) }}</td>
          <td>{{ settlementItemMoney("质量安全扣款", item) }}</td>
          <td>
            {{ settlementItemMoney(["违约赔偿扣款", "质量安全扣款"], item) }}
          </td>
          <td>{{ settlementItemMoney("其他2", item) }}</td>
          <td>
            {{
              settlementItemMoney(
                [
                  "工程预付款1",
                  "材料预付款1",
                  "违约赔偿扣款",
                  "其他2",
                  "质量安全扣款",
                ],
                item
              )
            }}
          </td>
          <td>
            {{
              settlementItemMoney(
                [
                  "工程预付款",
                  "材料预付款",
                  "工程量清单项目",
                  "变更项目",
                  "计日工项目",
                  "索赔项目",
                  "价格调整",
                  "其他",
                ],
                item
              ) -
                settlementItemMoney(
                  [
                    "进度款",
                    "其他1",
                    "工程预付款1",
                    "材料预付款1",
                    "违约赔偿扣款",
                    "其他2",
                    "质量安全扣款",
                  ],
                  item
                )
            }}
          </td>
          <td>{{ settlementItemMoney("其中农民工工资", item) }}</td>
          <td>{{ settlementItemMoney("其中安全生产经费", item) }}</td>
        </tr>
        <tr>
          <td>合计</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td>累计应结算合计:{{ settlementItemMoney("累计应结算合计") }}</td>
          <td />
          <td />
          <td>
            累计扣留项目合计:{{ settlementItemMoney("累计扣留项目合计") }}
          </td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td>
            累计扣除项目合计:{{ settlementItemMoney("累计扣除项目合计") }}
          </td>
          <td>
            累计实际支付金额合计:{{
              settlementItemMoney("累计实际支付金额合计")
            }}
          </td>
          <td>
            累计实际支付农民工工资:{{
              settlementItemMoney("累计实际支付农民工工资")
            }}
          </td>
          <td>
            累计实际支付安全生产经费:{{
              settlementItemMoney("累计实际支付安全生产经费")
            }}
          </td>
        </tr>
      </table>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { save, update } from "./api";
import { dateFormat } from "@/utils";
import { FormMixin } from "@/mixins/FormMixin";
import { getDictItemList } from "@/api/dict";
import { page as investGeneralPayPage } from "../investGeneralPay/api";
import store from "@/store";
import moment from "moment";
import * as XLSX from "xlsx";

const BASE_INFO_FIELD_MAP = {
  name: "*合同名称",
  code: "*合同编号",
  amount: "*合同金额",
  taxationRate: "*税率",
  contractedUnit: "*签约单位",
  contractedDate: "*签约日期",
  type: "*合同类型",
  pricingMethod: "*计价方式",
  deadline: "*合同期限",
  procurementMode: "*采购方式",
  paymentMethod: "*支付方式",
  parties: "*甲方签约人",
  secondParties: "*乙方签约人",
  otherParties: "其他签约人",
  projectManagement: "投标时项目负责",
  partyB: "乙方单位",
  partyBName: "乙方账户名称",
  partyBTaxationNumber: "乙方税号",
  partyBOpeningBank: "乙方开户行",
  partyBCardNumber: "乙方银行账号",
  partyBCardAssociatesNumber: "乙方银行联行号",
  partyC: "丙方单位 （如有）",
  partyCName: "丙方账户名称",
  partyCTaxationNumber: "丙方税号",
  partyCOpeningBank: "丙方开户行",
  partyCCardNumber: "丙方银行账号",
  partyCCardAssociatesNumber: "丙方银行联行号",
  startDate: "合同计划开工日期",
  endDate: "合同计划完工日期",
  actualStartDate: "合同实际开工日期",
  actualEndDate: "合同实际完工日期",
  sort: "排序",
  remark: "备注",
};
export default {
  name: "Dataform",
  mixins: [FormMixin],
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
    oprateRow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },
      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
      },
      formDataRules: {
        name: [{ required: true, message: "请输入合同名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入合同编号", trigger: "blur" }],
        contractedDate: [
          { required: true, message: "请选择签约日期", trigger: "change" },
        ],
        taxationRate: [
          { required: true, message: "请输入税率", trigger: "change" },
        ],
        deadline: [
          { required: true, message: "请输入合同期限", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择合同类型", trigger: "change" },
        ],
        pricingMethod: [{ required: true, message: "请选择", trigger: "blur" }],
        paymentMethod: [
          { required: true, message: "请输入", trigger: "change" },
        ],
        parties: [
          { required: true, message: "请选择采购方式", trigger: "change" },
        ],
        isChange: [{ required: true, message: "请选择", trigger: "change" }],
        changeDetail: [
          { required: true, message: "请输入", trigger: "change" },
        ],
        secondParties: [
          { required: true, message: "请选择采购方式", trigger: "change" },
        ],
        procurementMode: [
          { required: true, message: "请选择采购方式", trigger: "change" },
        ],
        amount: [
          { required: true, message: "请输入合同金额", trigger: "blur" },
        ],

        contractedUnit: [
          { required: true, message: "请输入签约单位", trigger: "blur" },
        ],
        attachment: [
          {
            required: true,
            message: "请上传合同附件",
            trigger: "change",
          },
        ],
      },
      tableData: [],
      statusList: [],
      uploadFileList: [],
      multipleSelection: [],
      contractTypeList: [],
      pricingMethodList: [],
      procurementMethodList: [],
      contractStatusList: [],
      baseTemplatePath: "/static/template/合同台账导入模板.xlsx",
      downloadPath: "/static/template/合同清单导入模板.xlsx",
      activeTab: "baseInfo",
      corpId: store.getters.loginInfo.corpId,
      departList: [],
      tableTotalMoney: 0,
      // 结算台账清单
      dialogShowTable: false,
      settlementList: [],
    };
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
    settlementMoney() {
      return (field) => {
        return this.settlementList.reduce(
          (a, b) => a + Number(b[field] || 0),
          0
        );
      };
    },
    settlementItemMoney() {
      return (field, item) => {
        if (field == "累计应结算合计") {
          return this.settlementList.reduce(
            (a, b) =>
              a +
              this.settlementItemMoney(
                [
                  "工程预付款",
                  "材料预付款",
                  "工程量清单项目",
                  "变更项目",
                  "计日工项目",
                  "索赔项目",
                  "价格调整",
                  "其他",
                ],
                b
              ),
            0
          );
        } else if (field == "累计扣留项目合计") {
          return this.settlementList.reduce(
            (a, b) => a + this.settlementItemMoney(["进度款", "其他1"], b),
            0
          );
        } else if (field == "累计扣除项目合计") {
          return this.settlementList.reduce(
            (a, b) =>
              a +
              this.settlementItemMoney(
                [
                  "工程预付款1",
                  "材料预付款1",
                  "违约赔偿扣款",
                  "其他2",
                  "质量安全扣款",
                ],
                b
              ),
            0
          );
        } else if (field == "累计实际支付金额合计") {
          return this.settlementList.reduce(
            (a, b) =>
              a +
              (this.settlementItemMoney(
                [
                  "工程预付款",
                  "材料预付款",
                  "工程量清单项目",
                  "变更项目",
                  "计日工项目",
                  "索赔项目",
                  "价格调整",
                  "其他",
                ],
                b
              ) -
                this.settlementItemMoney(
                  [
                    "进度款",
                    "其他1",
                    "工程预付款1",
                    "材料预付款1",
                    "违约赔偿扣款",
                    "其他2",
                    "质量安全扣款",
                  ],
                  b
                )),
            0
          );
        } else if (field == "累计实际支付农民工工资") {
          return this.settlementList.reduce(
            (a, b) =>
              a +
              Number(
                b.detailList.find((x) => x.name == "其中农民工工资")
                  .thisPrice || 0
              ),
            0
          );
        } else if (field == "累计实际支付安全生产经费") {
          return this.settlementList.reduce(
            (a, b) =>
              a +
              Number(
                b.detailList.find((x) => x.name == "其中安全生产经费")
                  .thisPrice || 0
              ),
            0
          );
        } else if (typeof field == "string") {
          return Number(item.detailList.find((x) => x.name == field).thisPrice);
        } else {
          return field.reduce((a, b) => {
            const data = item.detailList.find((x) => x.name == b);
            return a + Number(data.thisPrice);
          }, 0);
        }
      };
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          const newData = { ...this.oprateRow.data };
          this.formData = newData;
          this.$set(this.formData, "isChange", this.formData.isChange == 1);
          if (this.type === "add" && !this.formData.status) {
            this.$set(this.formData, "status", "zxz");
          }
          // 检查并赋值
          if (!this.formData.createUsername) {
            this.$set(this.formData, "createUsername", this.userInfo.realName);
          }
          if (!this.formData.editUser) {
            this.$set(this.formData, "editUser", this.userInfo.userId);
          }
          if (!this.formData.unitName) {
            this.$set(this.formData, "unitName", this.userInfo.departName);
          }
          if (!this.formData.initiationDate) {
            this.$set(this.formData, "initiationDate", new Date());
          }
          if (newData.detailVos) {
            this.tableData = newData.detailVos;
            this.tableTotalMoney = this.tableData.reduce(
              (sum, item) => sum + Number(item.totalPrice || 0),
              0
            );
          }
          if (this.formData.id) {
            investGeneralPayPage({
              current: 1,
              entity: { contractId: this.formData.id, flowStatus: "2" },
              pageSize: 10,
            }).then((res) => {
              console.log("🚀 ~ handler ~ res:", res.data.records);
              this.settlementList = res.data.records || [];
            });
          }
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getDictItemList();
    // this.getDepartList()
  },
  mounted() {},
  methods: {
    moment,
    /**
     * @description 修改单价金额
     */
    handleChange(index) {
      this.$set(
        this.tableData[index],
        "totalPrice",
        (this.tableData[index].price || 0) *
          (this.tableData[index].quantity || 0)
      );
      this.tableTotalMoney = this.tableData.reduce(
        (sum, item) => sum + Number(item.totalPrice || 0),
        0
      );
      // this.$set(
      //   this.formData,
      //   'amount',
      //   this.tableData.reduce(
      //     (accumulator, currentValue) => accumulator + currentValue.totalPrice,
      //     0
      //   )
      // )
    },
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    childEvtHandle() {
      // 做业务数据的保存,修改。
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          // view   false  return
          if (this.type === "view") {
            this.dialogShow = false;
            return;
          }
          this.formData.detailVos = this.tableData;
          const fields = {
            ...this.formData,
          };
          if (
            this.tableData.length > 0 &&
            this.tableTotalMoney != this.formData.amount
          ) {
            this.$message.info(
              `基本信息合同金额为:${this.formData.amount},清单明细总价为:${this.tableTotalMoney}；数据不一致，请检查！`
            );
            return;
          }
          if (this.isLevelOrdered() !== "ok") {
            this.$message.info(this.isLevelOrdered());
            return;
          }
          fields.isChange = fields.isChange ? 1 : 0;
          if (this.type === "add") {
            save(fields)
              .then((res) => {
                const { success, message } = res;
                if (!success) {
                  return this.$message.error("保存数据失败：" + message);
                } else {
                  this.$message.success("保存数据成功");
                  this.$emit("ok");
                }
                this.closedHandle();
              })
              .catch((err) => {
                console.error(err);
                this.$message.error(err.message);
              });
          } else {
            update(fields)
              .then((res) => {
                const { success, message } = res;
                if (!success) {
                  return this.$message.error("更新数据失败：" + message);
                } else {
                  this.$message.success("更新数据成功");
                  this.$emit("ok");
                }
                this.closedHandle();
              })
              .catch((err) => {
                console.error(err);
                this.$message.error(err.message);
              });
          }
        } else {
          this.$message.info("请填写完整基本信息");
          return false;
        }
      });
    },
    // 判断清单编号方法-------------------------
    isLevelOrdered() {
      const list = this.tableData;
      const seen = new Set(); // 已出现的 level
      const nextNo = new Map(); // Map<parent, expectedChildNo>

      for (let i = 0; i < list.length; i++) {
        const lv = String(list[i].orderNo);
        const parts = lv.split(".").map(Number);

        /* 1. 整体顺序检查 */
        if (i && compare(lv, list[i - 1].orderNo) <= 0) {
          return "清单编号整体顺序错误";
        }

        /* 2. 父级必须已出现（根节点除外） */
        const parent = parts.slice(0, -1).join(".");
        if (parts.length > 1 && !seen.has(parent)) {
          return "清单编号父级节点缺失";
        }

        /* 3. 子序号必须连续 */
        const key = parent || "root"; // 根节点用 'root' 统一
        const exp = nextNo.get(key) || 1; // 期望序号
        const cur = parts.at(-1);
        if (cur !== exp) return "清单编号子节点序号必须连续";

        /* 4. 更新状态 */
        seen.add(lv);
        nextNo.set(key, exp + 1);
      }
      return "ok";
      /* 自然比较：点分数字 */
      function compare(a, b) {
        const pa = a.split(".").map(Number);
        const pb = b.split(".").map(Number);
        const len = Math.max(pa.length, pb.length);
        for (let i = 0; i < len; i++) {
          const na = pa[i] ?? 0;
          const nb = pb[i] ?? 0;
          if (na !== nb) return na - nb;
        }
        return 0;
      }
    },

    // ---------------------------------

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    /**获取字典 */
    async getDictItemList() {
      const contractType = await getDictItemList("CONTRACT_TYPE");
      const procurementMethod = await getDictItemList("procurement_method");
      const contractStatus = await getDictItemList("contract_status");
      const pricingMethod = await getDictItemList("jjfs");
      const depart = await getDictItemList("yzdwzzjg");
      this.departList = depart.data;
      this.contractTypeList = contractType.data;
      this.pricingMethodList = pricingMethod.data;
      this.procurementMethodList = procurementMethod.data;
      this.contractStatusList = contractStatus.data;
    },
    contractManagerChange(id, data) {
      this.$set(this.formData, "contractManagerName", data.realName || "");
    },

    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate("attachment");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addDetailBtn() {
      this.tableData.push({});
    },
    async deleteDetailBtn(index, row) {
      await this.$confirm(`确认删除数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      });
      // 删除选中的数据
      this.tableData.splice(index, 1);
    },
    downloadTemplate() {
      console.log("下载模板");
      let fileName = "合同清单导入模板.xlsx";
      var link = document.createElement("a");
      link.href = this.downloadPath;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    downloadBaseTemplate() {
      const link = document.createElement("a");
      link.href = this.baseTemplatePath;
      link.download = "合同台账导入模板.xlsx";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    triggerFileInput() {
      this.$nextTick(() => {
        this.$refs.fileInput.click();
      });
    },
    triggerBaseFileInput() {
      this.$nextTick(() => {
        this.$refs.baseFileInput && this.$refs.baseFileInput.click();
      });
    },
    handleFileUpload(event) {
      console.log("开始读取文件");
      const files = event.target.files;
      console.log(files.length);
      if (files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();
      const fieldMap = {
        code: "系统编码",
        orderNo: "清单编号",
        name: "名称",
        unit: "单位",
        quantity: "工程量",
        price: "单价(元)",
        totalPrice: "合价(元)",
      };

      reader.onload = (e) => {
        let that = this;
        const data = new Uint8Array(e.target.result);
        console.log(XLSX);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet); //加上{header:1}会把第一行作为表头
        console.log("表格原始数据", jsonData);
        let newArr = [];
        jsonData &&
          jsonData.length &&
          jsonData.forEach((item) => {
            newArr.push({
              code: item[fieldMap.code],
              orderNo: item[fieldMap.orderNo],
              name: item[fieldMap.name],
              unit: item[fieldMap.unit],
              quantity: item[fieldMap.quantity],
              price: item[fieldMap.price],
              totalPrice: item[fieldMap.totalPrice],
            });
          });
        console.log("表格处理后的数据", newArr);
        let dataToAdd = [];
        for (let index = 0; index < newArr.length; index++) {
          const element = newArr[index];
          let targetIndex = this.tableData.findIndex(
            (i) => i.code === element.code
          );
          if (targetIndex > -1) {
            // 更新
            Object.assign(this.tableData[targetIndex], element);
          } else {
            // 增加
            dataToAdd.push(element);
          }
        }
        if (dataToAdd.length > 0) {
          that.tableData = that.tableData.concat(dataToAdd);
        }
        console.log("表格数据", that.tableData);
        that.calcTotal();
        console.log("合同总价", that.formData.amount);
        that.$refs.fileInput.value = ""; // 清空input方便下次继续上传
      };
      reader.readAsArrayBuffer(file);
    },
    handleBaseFileUpload(event) {
      const files = event.target.files;
      if (!files || !files.length) return;
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        if (!jsonData || !jsonData.length) {
          this.$message.warning("未读取到有效数据");
          this.resetBaseFileInput();
          return;
        }
        const row = jsonData[0];
        this.fillBaseInfoFromRow(row);
        this.$message.success("合同基础信息导入成功");
        this.resetBaseFileInput();
      };
      reader.readAsArrayBuffer(file);
    },
    fillBaseInfoFromRow(row) {
      const selectFieldMap = {
        type: this.contractTypeList,
        pricingMethod: this.pricingMethodList,
        procurementMode: this.procurementMethodList,
      };
      Object.keys(BASE_INFO_FIELD_MAP).forEach((field) => {
        const header = BASE_INFO_FIELD_MAP[field];
        if (!Object.prototype.hasOwnProperty.call(row, header)) return;
        let value = row[header];
        if (value === undefined || value === null || value === "") return;
        if (selectFieldMap[field]) {
          value = this.matchDictValue(selectFieldMap[field], value);
        }
        if (
          [
            "contractedDate",
            "startDate",
            "endDate",
            "actualStartDate",
            "actualEndDate",
          ].includes(field)
        ) {
          value = this.parseExcelDate(value);
        }
        this.$set(this.formData, field, value);
      });
    },
    /**
     * 根据字典列表匹配code
     * @param dictList
     * @param text
     */
    matchDictValue(dictList, text) {
      if (!text) return "";
      const target = dictList.find(
        (item) => item.dictName === text || item.dictCode === text
      );
      return target ? target.dictCode : text;
    },
    parseExcelDate(value) {
      if (!value) return "";
      if (value instanceof Date) {
        return dateFormat(value, "YYYY-MM-DD");
      }
      if (typeof value === "number") {
        const parsed = XLSX.SSF.parse_date_code(value);
        if (parsed) {
          const date = new Date(parsed.y, parsed.m - 1, parsed.d);
          return dateFormat(date, "YYYY-MM-DD");
        }
      }
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return dateFormat(date, "YYYY-MM-DD");
      }
      return value;
    },
    resetBaseFileInput() {
      if (this.$refs.baseFileInput) {
        this.$refs.baseFileInput.value = "";
      }
    },
    calcTotal() {
      //统计末端节点的金额
      let total = 0;
      for (let index = 0; index < this.tableData.length; index++) {
        const item1 = this.tableData[index];
        if (!item1.code) {
          total += item1.totalPrice;
          continue;
        }
        let ok = true; //检查item1 是否是某个节点的父级
        for (let index1 = 0; index1 < this.tableData.length; index1++) {
          const item2 = this.tableData[index1];
          if (!item2.code) continue;
          if (
            item2.code.toString().indexOf(item1.code.toString() + ".") === 0
          ) {
            ok = false;
            break;
          }
        }
        if (ok) {
          //ok 表示item1是叶子结点
          total += item1.totalPrice;
        }
      }
      if (isNaN(total)) {
        this.$message.warn("合同总价内容必须是数字且不能为空");
      }
      total = total.toFixed(2);
      this.$set(this.formData, "amount", total);
      this.tableTotalMoney = this.tableData.reduce(
        (sum, item) => sum + Number(item.totalPrice || 0),
        0
      );
    },
    viewTable() {
      this.dialogShowTable = true;
    },
  },
};
</script>

<style scoped lang="scss">
.base-info-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
:deep(.el-tabs) {
  height: 100%;
  .el-tabs__content {
    height: calc(100% - 55px);

    .el-tab-pane {
      height: 100%;
      overflow: auto;
      .el-table {
        .el-table__body-wrapper {
          height: calc(100% - 48px);
          overflow-y: auto;
        }
      }
    }
  }
}
.table-tab-content {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.page-leave {
  width: 100%;
  height: 100%;
  // padding: 15px;

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
</style>
<style scoped lang="scss">
.el-form {
  .el-row {
    margin-bottom: 8px;
  }
}

::v-deep .el-table__row {
  .el-form-item__content {
    margin-left: 0px !important;
  }
}

/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
}

/deep/ .el-table__body-wrapper {
  overflow-y: auto;
}

.el-form {
  height: 100%;
}
.el-form .el-form-item {
  margin-bottom: 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  text-align: center; /* 设置表格文字居中 */
  line-height: 26px; /* 设置表格行高 */
  margin-bottom: 16px;
  td,
  th {
    border: 1px solid #ccc;
    :deep(textarea),
    :deep(input) {
      border: none;
    }
  }
  .vertical-rl {
    writing-mode: vertical-rl;
    letter-spacing: 2px;
  }
}
</style>
