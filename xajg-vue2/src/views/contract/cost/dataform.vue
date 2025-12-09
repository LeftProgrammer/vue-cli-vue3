<template>
  <el-dialog
    v-draggable
    :oprateRow="oprateRow"
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :fullscreen="true"
    append-to-body
    @closed="closedHandle"
  >
    <el-row>
      <el-form ref="dataFormRef" :model="formData" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="结算编号" prop="code">
              <el-input v-model="formData.code" :disabled="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-select
                v-model="formData.contractName"
                clearable
                filterable
                placeholder="请选择"
                style="width: 100%"
                :disabled="readonly"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in htxxOptions"
                  :key="item.code"
                  :label="item.name + '（' + item.code + '）'"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input v-model="formData.contractCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同金额" prop="contractMoney">
              <el-input v-model="formData.contractMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="本次款项申请次数" prop="thisPayNum">
              <el-input v-model="formData.thisPayNum" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算周期" prop="settleDate">
              <el-date-picker
                v-model="formData.settleDate"
                :disabled="readonly"
                type="date"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <table :class="{ disabledTable: readonly }">
              <tr>
                <th />
                <th>工程或费用名称</th>
                <th>上期末累计完成金额(元)</th>
                <th>本期完成金额(元)</th>
                <th>本期末累计完成金额(元)</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
              <!-- 应结算项目 -->
              <tr>
                <td rowspan="11" class="vertical-rl">应结算项目</td>
                <td>工程预付款</td>
                <td>
                  <el-input-number
                    v-model="tableData['工程预付款'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['工程预付款'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['工程预付款'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['工程预付款'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>材料预付款</td>
                <td>
                  <el-input-number
                    v-model="tableData['材料预付款'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['材料预付款'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['材料预付款'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['材料预付款'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>小计(一)</td>
                <td>
                  {{
                    tableData['工程预付款'].lastPrice +
                    tableData['材料预付款'].lastPrice
                  }}
                </td>
                <td>
                  {{
                    tableData['工程预付款'].thisPrice +
                    tableData['材料预付款'].thisPrice
                  }}
                </td>
                <td>
                  {{
                    tableData['工程预付款'].endPrice +
                    tableData['材料预付款'].endPrice
                  }}
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <td>工程量清单项目</td>
                <td>
                  <el-input-number
                    v-model="tableData['工程量清单项目'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  {{ tableData['工程量清单项目'].thisPrice }}
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['工程量清单项目'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['工程量清单项目'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td>
                  <span @click="view(1)">查看</span>
                </td>
              </tr>
              <tr>
                <td>变更项目</td>
                <td>
                  <el-input-number
                    v-model="tableData['变更项目'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  {{ tableData['变更项目'].thisPrice }}
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['变更项目'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['变更项目'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td>
                  <span @click="view(2)">查看</span>
                </td>
              </tr>
              <tr>
                <td>计日工项目</td>
                <td>
                  <el-input-number
                    v-model="tableData['计日工项目'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['计日工项目'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['计日工项目'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['计日工项目'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>索赔项目</td>
                <td>
                  <el-input-number
                    v-model="tableData['索赔项目'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['索赔项目'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['索赔项目'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['索赔项目'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>价格调整</td>
                <td>
                  <el-input-number
                    v-model="tableData['价格调整'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['价格调整'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['价格调整'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['价格调整'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>其他</td>
                <td>
                  <el-input-number
                    v-model="tableData['其他'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其他'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其他'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['其他'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>小计（二）</td>
                <td>
                  {{
                    tableData['工程量清单项目'].lastPrice +
                    tableData['变更项目'].lastPrice +
                    tableData['计日工项目'].lastPrice +
                    tableData['索赔项目'].lastPrice +
                    tableData['价格调整'].lastPrice +
                    tableData['其他'].lastPrice
                  }}
                </td>
                <td>
                  {{
                    tableData['工程量清单项目'].thisPrice +
                    tableData['变更项目'].thisPrice +
                    tableData['计日工项目'].thisPrice +
                    tableData['索赔项目'].thisPrice +
                    tableData['价格调整'].thisPrice +
                    tableData['其他'].thisPrice
                  }}
                </td>
                <td>
                  {{
                    tableData['工程量清单项目'].endPrice +
                    tableData['变更项目'].endPrice +
                    tableData['计日工项目'].endPrice +
                    tableData['索赔项目'].endPrice +
                    tableData['价格调整'].endPrice +
                    tableData['其他'].endPrice
                  }}
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <td>应结算合计（三）</td>
                <td>
                  {{
                    tableData['工程预付款'].lastPrice +
                    tableData['材料预付款'].lastPrice +
                    tableData['工程量清单项目'].lastPrice +
                    tableData['变更项目'].lastPrice +
                    tableData['计日工项目'].lastPrice +
                    tableData['索赔项目'].lastPrice +
                    tableData['价格调整'].lastPrice +
                    tableData['其他'].lastPrice
                  }}
                </td>
                <td>
                  {{
                    tableData['工程预付款'].thisPrice +
                    tableData['材料预付款'].thisPrice +
                    tableData['工程量清单项目'].thisPrice +
                    tableData['变更项目'].thisPrice +
                    tableData['计日工项目'].thisPrice +
                    tableData['索赔项目'].thisPrice +
                    tableData['价格调整'].thisPrice +
                    tableData['其他'].thisPrice
                  }}
                </td>
                <td>
                  {{
                    tableData['工程预付款'].endPrice +
                    tableData['材料预付款'].endPrice +
                    tableData['工程量清单项目'].endPrice +
                    tableData['变更项目'].endPrice +
                    tableData['计日工项目'].endPrice +
                    tableData['索赔项目'].endPrice +
                    tableData['价格调整'].endPrice +
                    tableData['其他'].endPrice
                  }}
                </td>
                <td />
                <td />
              </tr>
              <!-- 结算项目 -->
              <tr>
                <td rowspan="3">扣留项目</td>
                <td>进度款</td>
                <td>
                  <el-input-number
                    v-model="tableData['进度款'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['进度款'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['进度款'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['进度款'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>其他</td>
                <td>
                  <el-input-number
                    v-model="tableData['其他1'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其他1'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其他1'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['其他1'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>扣留项目合计（四）</td>
                <td>
                  -{{
                    tableData['进度款'].lastPrice + tableData['其他1'].lastPrice
                  }}
                </td>
                <td>
                  -{{
                    tableData['进度款'].thisPrice + tableData['其他1'].thisPrice
                  }}
                </td>
                <td>
                  -{{
                    tableData['进度款'].endPrice + tableData['其他1'].endPrice
                  }}
                </td>
                <td />
                <td />
              </tr>
              <!-- 扣除项目 -->
              <tr>
                <td rowspan="8" class="vertical-rl">扣除项目</td>
                <td>工程预付款</td>
                <td>
                  <el-input-number
                    v-model="tableData['工程预付款1'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['工程预付款1'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['工程预付款1'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['工程预付款1'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>材料预付款</td>
                <td>
                  <el-input-number
                    v-model="tableData['材料预付款1'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['材料预付款1'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['材料预付款1'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['材料预付款1'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>小计（五）</td>
                <td>
                  -{{
                    tableData['工程预付款1'].lastPrice +
                    tableData['材料预付款1'].lastPrice
                  }}
                </td>
                <td>
                  -{{
                    tableData['工程预付款1'].thisPrice +
                    tableData['材料预付款1'].thisPrice
                  }}
                </td>
                <td>
                  -{{
                    tableData['工程预付款1'].endPrice +
                    tableData['材料预付款1'].endPrice
                  }}
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <td>违约赔偿扣款</td>
                <td>
                  <el-input-number
                    v-model="tableData['违约赔偿扣款'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['违约赔偿扣款'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['违约赔偿扣款'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['违约赔偿扣款'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>质量安全扣款</td>
                <td>
                  <el-input-number
                    v-model="tableData['质量安全扣款'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['质量安全扣款'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['质量安全扣款'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['质量安全扣款'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>小计（六）</td>
                <td>
                  -{{
                    tableData['违约赔偿扣款'].lastPrice +
                    tableData['质量安全扣款'].lastPrice
                  }}
                </td>
                <td>
                  -{{
                    tableData['违约赔偿扣款'].thisPrice +
                    tableData['质量安全扣款'].thisPrice
                  }}
                </td>
                <td>
                  -{{
                    tableData['违约赔偿扣款'].endPrice +
                    tableData['质量安全扣款'].endPrice
                  }}
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <td>其他</td>
                <td>
                  <el-input-number
                    v-model="tableData['其他2'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其他2'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其他2'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['其他2'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td />
              </tr>
              <tr>
                <td>扣除项目合计（七）</td>
                <td>
                  -{{
                    tableData['工程预付款1'].lastPrice +
                    tableData['材料预付款1'].lastPrice +
                    tableData['违约赔偿扣款'].lastPrice +
                    tableData['其他2'].lastPrice +
                    tableData['质量安全扣款'].lastPrice
                  }}
                </td>
                <td>
                  -{{
                    tableData['工程预付款1'].thisPrice +
                    tableData['材料预付款1'].thisPrice +
                    tableData['违约赔偿扣款'].thisPrice +
                    tableData['其他2'].thisPrice +
                    tableData['质量安全扣款'].thisPrice
                  }}
                </td>
                <td>
                  -{{
                    tableData['工程预付款1'].endPrice +
                    tableData['材料预付款1'].endPrice +
                    tableData['违约赔偿扣款'].endPrice +
                    tableData['其他2'].endPrice +
                    tableData['质量安全扣款'].endPrice
                  }}
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <td rowspan="3">实际支付金额</td>
                <td>实际支付金额合计（三-四-七）</td>
                <td>
                  {{
                    tableData['工程预付款'].lastPrice +
                    tableData['材料预付款'].lastPrice +
                    tableData['工程量清单项目'].lastPrice +
                    tableData['变更项目'].lastPrice +
                    tableData['计日工项目'].lastPrice +
                    tableData['索赔项目'].lastPrice +
                    tableData['价格调整'].lastPrice +
                    tableData['其他'].lastPrice -
                    tableData['进度款'].lastPrice -
                    tableData['其他1'].lastPrice -
                    tableData['工程预付款1'].lastPrice -
                    tableData['材料预付款1'].lastPrice -
                    tableData['违约赔偿扣款'].lastPrice -
                    tableData['其他2'].lastPrice -
                    tableData['质量安全扣款'].lastPrice
                  }}
                </td>
                <td>
                  {{
                    tableData['工程预付款'].thisPrice +
                    tableData['材料预付款'].thisPrice +
                    tableData['工程量清单项目'].thisPrice +
                    tableData['变更项目'].thisPrice +
                    tableData['计日工项目'].thisPrice +
                    tableData['索赔项目'].thisPrice +
                    tableData['价格调整'].thisPrice +
                    tableData['其他'].thisPrice -
                    tableData['进度款'].thisPrice -
                    tableData['其他1'].thisPrice -
                    tableData['工程预付款1'].thisPrice -
                    tableData['材料预付款1'].thisPrice -
                    tableData['违约赔偿扣款'].thisPrice -
                    tableData['其他2'].thisPrice -
                    tableData['质量安全扣款'].thisPrice
                  }}
                </td>
                <td>
                  {{
                    tableData['工程预付款'].endPrice +
                    tableData['材料预付款'].endPrice +
                    tableData['工程量清单项目'].endPrice +
                    tableData['变更项目'].endPrice +
                    tableData['计日工项目'].endPrice +
                    tableData['索赔项目'].endPrice +
                    tableData['价格调整'].endPrice +
                    tableData['其他'].endPrice -
                    tableData['进度款'].endPrice -
                    tableData['其他1'].endPrice -
                    tableData['工程预付款1'].endPrice -
                    tableData['材料预付款1'].endPrice -
                    tableData['违约赔偿扣款'].endPrice -
                    tableData['其他2'].endPrice -
                    tableData['质量安全扣款'].endPrice
                  }}
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <td>其中：农民工工资</td>
                <td>
                  <el-input-number
                    v-model="tableData['其中农民工工资'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其中农民工工资'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其中农民工工资'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['其中农民工工资'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>其中：安全生产经费</td>
                <td>
                  <el-input-number
                    v-model="tableData['其中安全生产经费'].lastPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其中安全生产经费'].thisPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input-number
                    v-model="tableData['其中安全生产经费'].endPrice"
                    :controls="false"
                    :min="0"
                    :step="0.01"
                    :step-strictly="true"
                  />
                </td>
                <td>
                  <el-input
                    v-model="tableData['其中安全生产经费'].remark"
                    type="textarea"
                    :rows="1"
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="2">本期实际支付金额</td>
                <td colspan="2">
                  小写:{{
                    tableData['工程预付款'].thisPrice +
                    tableData['材料预付款'].thisPrice +
                    tableData['工程量清单项目'].thisPrice +
                    tableData['变更项目'].thisPrice +
                    tableData['计日工项目'].thisPrice +
                    tableData['索赔项目'].thisPrice +
                    tableData['价格调整'].thisPrice +
                    tableData['其他'].thisPrice -
                    tableData['进度款'].thisPrice -
                    tableData['其他1'].thisPrice -
                    tableData['工程预付款1'].thisPrice -
                    tableData['材料预付款1'].thisPrice -
                    tableData['违约赔偿扣款'].thisPrice -
                    tableData['其他2'].thisPrice -
                    tableData['质量安全扣款'].thisPrice
                  }}
                </td>
                <td colspan="3">
                  大写:{{
                    digitUppercase(
                      tableData['工程预付款'].thisPrice +
                        tableData['材料预付款'].thisPrice +
                        tableData['工程量清单项目'].thisPrice +
                        tableData['变更项目'].thisPrice +
                        tableData['计日工项目'].thisPrice +
                        tableData['索赔项目'].thisPrice +
                        tableData['价格调整'].thisPrice +
                        tableData['其他'].thisPrice -
                        tableData['进度款'].thisPrice -
                        tableData['其他1'].thisPrice -
                        tableData['工程预付款1'].thisPrice -
                        tableData['材料预付款1'].thisPrice -
                        tableData['违约赔偿扣款'].thisPrice -
                        tableData['其他2'].thisPrice -
                        tableData['质量安全扣款'].thisPrice
                    )
                  }}
                </td>
              </tr>
            </table>
          </el-col>
          <el-col :span="24">
            <el-form-item label="付款说明" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="2"
                :disabled="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="attachment">
              <uploadFile v-model="formData.attachment" :readonly="readonly" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="监理总监" prop="supervisionDirector">
              <user v-model="formData.supervisionDirector" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程处进度专职" prop="engineeringDepartment">
              <user v-model="formData.engineeringDepartment" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同处经办人" prop="contractDepartment">
              <user v-model="formData.contractDepartment" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同处负责人" prop="contractDepartmentManage">
              <user
                v-model="formData.contractDepartmentManage"
                :readonly="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起单位" prop="unit">
              <el-input v-model="formData.unit" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起人" prop="createUsername">
              <el-input v-model="formData.createUsername" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起日期" prop="initiateDate">
              <el-date-picker
                v-model="formData.initiateDate"
                disabled
                type="date"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <detailTable
      v-if="oprateRow1.dialogShow"
      :oprateRow="oprateRow1"
      :type="oprateRow1.type"
      :title="oprateRow1.title"
      :visible="oprateRow1.dialogShow"
      :readonly="oprateRow1.isView"
      @closed="closedDialog"
      @ok="detailTableOk"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="oprateRow1.dialogShow = false">
        {{ oprateRow.isView ? '关闭' : '取消' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dateFormat } from '@/utils'
import { FormMixin } from '@/mixins/FormMixin'
import detailTable from './detailTable.vue'
import { page as contractPage } from '../contractSign/api'
export default {
  name: 'dataform',
  components: { detailTable },
  mixins: [FormMixin],
  data() {
    return {
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },
      pbsName: '',
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null
      },
      tableTotalMoney: 0,
      htxxOptions: [], //合同列表
      contractList: [], //合同清单
      oprateRow1: { dialogShow: false },
      tableData: {}
    }
  },
  created() {
    this.getContractPage()
  },
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    oprateRow: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * @description 获取所有的合同
     */
    async getContractPage() {
      const { data, success } = await contractPage({
        current: 1,
        entity: {},
        pageSize: 20,
        size: 999,
        total: 3
      })
      if (!success) {
        this.$message.error('获取合同失败')
        return
      }
      this.htxxOptions = data.records
    },
    /**
     * 金额小写转中文大写
     * @param {number|string} n  金额数字
     * @returns {string}         中文大写金额
     */
    digitUppercase(n) {
      if (isNaN(n) || n === '') return ''
      let head = n < 0 ? '负' : ''
      n = Math.abs(n) // 去掉负号
      const fraction = ['角', '分']
      const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      const unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ]
      let s = ''
      for (let i = 0; i < fraction.length; i++) {
        s += (
          digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
        ).replace(/零./, '')
      }
      s = s || '整'
      n = Math.floor(n)
      for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = ''
        for (let j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p
          n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, '元')
          .replace(/(零.)+/g, '零')
          .replace(/^整$/, '零元整')
      )
    },
    view(type) {
      this.oprateRow1.type = 'view'
      this.oprateRow1.isView = true
      this.oprateRow1.title =
        type == 1 ? '工程量清单项目汇总表' : '变更清单明细'
      this.oprateRow1.tableType = type == 1 ? 'inventory' : 'change'
      const subList =
        type == 1
          ? this.tableData['工程量清单项目'].subList
          : this.tableData['变更项目'].subList
      this.oprateRow1.data = subList.length > 0 ? subList : this.contractList
      this.oprateRow1.dialogShow = true
    },
    closedDialog() {
      this.oprateRow1.dialogShow = false
    },
    closedHandle() {
      this.dialogShow = false
      this.$emit('closed')
    },

    timeFormat(time, type) {
      return dateFormat(time, type || 'YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted() {},
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          const newData = { ...this.oprateRow.data }
          this.formData = newData
          newData.detailList.forEach((x) => {
            this.tableData[x.name] = {
              ...x,
              endPrice: Number(x.endPrice),
              lastPrice: Number(x.lastPrice),
              thisPrice: Number(x.thisPrice),
              remark: x.remark
            }
          })
        }
        this.dialogShow = newValue
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  text-align: center; /* 设置表格文字居中 */
  line-height: 40px; /* 设置表格行高 */
  margin-bottom: 16px;
  &.disabledTable {
    :deep(textarea),
    :deep(input) {
      pointer-events: none;
    }
  }
  tr {
    th {
      &:first-child {
        width: 150px;
      }
      &:nth-child(2) {
        width: 250px;
      }
      &:nth-child(3) {
        width: 200px;
      }
      &:nth-child(4) {
        width: 200px;
      }
      &:nth-child(5) {
        width: 200px;
      }
      &:nth-child(6) {
        // width: 250px;
      }
      &:last-child {
        width: 180px;
      }
    }
    td:last-child {
      span {
        margin: 0 8px;
        cursor: pointer;
        color: #014acb;
      }
    }
  }
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
/deep/ .taskname {
  .el-form-item__content {
    top: 8px !important;

    .el-input__count {
      height: 25px;
      line-height: 25px;
      bottom: 3px;
      // background: transparent;
      // bottom: -3px;
    }
  }
}

/deep/ .taskname .cell {
  // overflow: auto;
  overflow: visible;
  display: flex;
  justify-content: center;
}

/deep/ .el-table {
  th.required.taskname {
    .cell::before {
      content: '*';
      width: 5px;
      height: 0px;
      margin-top: 2px;
      color: #ff4d51;
    }
  }
}

/deep/ .file-list {
  margin-top: 3px !important;

  .icon {
    background-color: transparent !important;
    margin-right: 5px;
  }
}

::v-deep .el-divider--horizontal {
  margin: 18px 0;
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
</style>
