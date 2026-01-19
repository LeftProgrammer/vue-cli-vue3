<template>
  <div style="padding: 10px">
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
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
                @change="contractIdChangeHandle"
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
          <el-col :span="12">
            <el-form-item label="结算类型" prop="settleType">
              <el-select
                v-model="formData.settleType"
                style="width: 100%"
                placeholder="请选择"
                :disabled="readonly"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in settleTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
                  {{ computedMoney(['工程预付款', '材料预付款'], 'lastPrice') }}
                </td>
                <td>
                  {{ computedMoney(['工程预付款', '材料预付款'], 'thisPrice') }}
                </td>
                <td>
                  {{ computedMoney(['工程预付款', '材料预付款'], 'endPrice') }}
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
                  <span v-if="!readonly" @click="addDetailBtn(1)">添加明细</span>
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
                  <span v-if="!readonly" @click="addDetailBtn(2)">添加明细</span>
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
                    computedMoney(
                      [
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'lastPrice'
                    )
                  }}
                </td>
                <td>
                  {{
                    computedMoney(
                      [
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'thisPrice'
                    )
                  }}
                </td>
                <td>
                  {{
                    computedMoney(
                      [
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'endPrice'
                    )
                  }}
                </td>
                <td />
                <td />
              </tr>
              <tr>
                <td>应结算合计（三）</td>
                <td>
                  {{
                    computedMoney(
                      [
                        '工程预付款',
                        '材料预付款',
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'lastPrice'
                    )
                  }}
                </td>
                <td>
                  {{
                    computedMoney(
                      [
                        '工程预付款',
                        '材料预付款',
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'thisPrice'
                    )
                  }}
                </td>
                <td>
                  {{
                    computedMoney(
                      [
                        '工程预付款',
                        '材料预付款',
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'endPrice'
                    )
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
                <td>-{{ computedMoney(['进度款', '其他1'], 'lastPrice') }}</td>
                <td>-{{ computedMoney(['进度款', '其他1'], 'thisPrice') }}</td>
                <td>-{{ computedMoney(['进度款', '其他1'], 'endPrice') }}</td>
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
                    computedMoney(['工程预付款1', '材料预付款1'], 'lastPrice')
                  }}
                </td>
                <td>
                  -{{
                    computedMoney(['工程预付款1', '材料预付款1'], 'thisPrice')
                  }}
                </td>
                <td>
                  -{{
                    computedMoney(['工程预付款1', '材料预付款1'], 'endPrice')
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
                <td />
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
                <td />
              </tr>
              <tr>
                <td>小计（六）</td>
                <td>
                  -{{
                    computedMoney(['违约赔偿扣款', '质量安全扣款'], 'lastPrice')
                  }}
                </td>
                <td>
                  -{{
                    computedMoney(['违约赔偿扣款', '质量安全扣款'], 'thisPrice')
                  }}
                </td>
                <td>
                  -{{
                    computedMoney(['违约赔偿扣款', '质量安全扣款'], 'endPrice')
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
                    computedMoney(
                      [
                        '工程预付款1',
                        '材料预付款1',
                        '违约赔偿扣款',
                        '其他2',
                        '质量安全扣款'
                      ],
                      'lastPrice'
                    )
                  }}
                </td>
                <td>
                  -{{
                    computedMoney(
                      [
                        '工程预付款1',
                        '材料预付款1',
                        '违约赔偿扣款',
                        '其他2',
                        '质量安全扣款'
                      ],
                      'thisPrice'
                    )
                  }}
                </td>
                <td>
                  -{{
                    computedMoney(
                      [
                        '工程预付款1',
                        '材料预付款1',
                        '违约赔偿扣款',
                        '其他2',
                        '质量安全扣款'
                      ],
                      'endPrice'
                    )
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
                    computedMoney(
                      [
                        '工程预付款',
                        '材料预付款',
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'lastPrice'
                    ) -
                      computedMoney(
                        [
                          '进度款',
                          '其他1',
                          '工程预付款1',
                          '材料预付款1',
                          '违约赔偿扣款',
                          '其他2',
                          '质量安全扣款'
                        ],
                        'lastPrice'
                      )
                  }}
                </td>
                <td>
                  {{
                    computedMoney(
                      [
                        '工程预付款',
                        '材料预付款',
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'thisPrice'
                    ) -
                      computedMoney(
                        [
                          '进度款',
                          '其他1',
                          '工程预付款1',
                          '材料预付款1',
                          '违约赔偿扣款',
                          '其他2',
                          '质量安全扣款'
                        ],
                        'thisPrice'
                      )
                  }}
                </td>
                <td>
                  {{
                    computedMoney(
                      [
                        '工程预付款',
                        '材料预付款',
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'endPrice'
                    ) -
                      computedMoney(
                        [
                          '进度款',
                          '其他1',
                          '工程预付款1',
                          '材料预付款1',
                          '违约赔偿扣款',
                          '其他2',
                          '质量安全扣款'
                        ],
                        'endPrice'
                      )
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
                <td />
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
                <td />
              </tr>
              <tr>
                <td colspan="2">本期实际支付金额</td>
                <td colspan="2">
                  小写:{{
                    computedMoney(
                      [
                        '工程预付款',
                        '材料预付款',
                        '工程量清单项目',
                        '变更项目',
                        '计日工项目',
                        '索赔项目',
                        '价格调整',
                        '其他'
                      ],
                      'thisPrice'
                    ) -
                      computedMoney(
                        [
                          '进度款',
                          '其他1',
                          '工程预付款1',
                          '材料预付款1',
                          '违约赔偿扣款',
                          '其他2',
                          '质量安全扣款'
                        ],
                        'thisPrice'
                      )
                  }}
                </td>
                <td colspan="3">
                  大写:{{
                    digitUppercase(
                      computedMoney(
                        [
                          '工程预付款',
                          '材料预付款',
                          '工程量清单项目',
                          '变更项目',
                          '计日工项目',
                          '索赔项目',
                          '价格调整',
                          '其他'
                        ],
                        'thisPrice'
                      ) -
                        computedMoney(
                          [
                            '进度款',
                            '其他1',
                            '工程预付款1',
                            '材料预付款1',
                            '违约赔偿扣款',
                            '其他2',
                            '质量安全扣款'
                          ],
                          'thisPrice'
                        )
                    )
                  }}
                </td>
              </tr>
            </table>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item
              label="结算金额(小写)"
              prop="thisSettlementSmallMoney"
            >
              <el-input v-model="formData.thisSettlementSmallMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结算金额(大写)"
              prop="thisSettlementLargeMoney"
            >
              <el-input v-model="formData.thisSettlementLargeMoney" disabled />
            </el-form-item>
          </el-col> -->
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
            <el-form-item label="相关处室负责人" prop="relevantDepartments">
              <user
                v-model="formData.relevantDepartments"
                :readonly="flowDisabled('relevantDepartments')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('contractDepartment')" :span="12">
            <el-form-item label="合同处经办人" prop="contractDepartment">
              <user
                v-model="formData.contractDepartment"
                :readonly="flowDisabled('contractDepartment')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('contractDepartmentManage')" :span="12">
            <el-form-item label="合同处负责人" prop="contractDepartmentManage">
              <user
                v-model="formData.contractDepartmentManage"
                :readonly="flowDisabled('contractDepartmentManage')"
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
              <!-- <el-input v-model="formData.initiateDate" readonly /> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <detailTable
      v-if="oprateRow.dialogShow"
      :oprate-row="oprateRow"
      :type="oprateRow.type"
      :title="oprateRow.title"
      :visible="oprateRow.dialogShow"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
      @ok="detailTableOk"
    />
  </div>
</template>

<script>
import { save, getCount } from './api'
import { FlowFormMixin } from '@/mixins/FlowFormMixin'
import { fromApp } from '@/utils/index'
import { page as contractPage } from '../contractSign/api'
import detailTable from './detailTable.vue'
import moment from 'moment'
import { getDictItemList } from '@/api/dict'
export default {
  name: 'DataForm',
  components: { detailTable },
  mixins: [FlowFormMixin],
  data() {
    return {
      settleTypeOptions: [],
      isFormApp: false,
      showHiddenDangerRectifier: false,
      formData: {},
      formDataRules: {
        code: {
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        settleDate: {
          required: true,
          message: '请选择',
          trigger: 'change'
        },
        thisPayNum: {
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        contractName: {
          required: true,
          message: '请选择',
          trigger: 'blur'
        },
        supervisionDirector: {
          required: true,
          message: '请选择',
          trigger: 'blur'
        },
        engineeringDepartment: {
          required: true,
          message: '请选择',
          trigger: 'blur'
        },
        contractDepartment: {
          required: true,
          message: '请选择',
          trigger: 'blur'
        },
        contractDepartmentManage: {
          required: true,
          message: '请选择',
          trigger: 'blur'
        },
        contractCode: {
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        contractMoney: {
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        remark: {
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        settleType: {
          required: true,
          message: '请选择',
          trigger: 'change'
        }
      },
      //正在加载
      loading: false,
      url: {
        list: '/api/contract/investGeneralPay/page'
      },
      htxxOptions: [], //合同列表
      contractList: [], //合同清单
      oprateRow: { dialogShow: false },
      tableData: {}
    }
  },
  computed: {
    // 审批字段的禁用
    flowDisabled() {
      return (field) => {
        if (this.flowInfo?.page == 'fine') return true
        let disabled = false
        switch (field) {
          case 'relevantDepartments':
            disabled = this.formData.id
            break
          case 'contractDepartment':
            disabled =
              this.formData.matterTaskTodo?.procTaskName != '相关处室负责人'
            break
          case 'contractDepartmentManage':
            disabled =
              this.formData.matterTaskTodo?.procTaskName != '合同处经办人'
            break
        }
        return Boolean(disabled)
      }
    },
    // 审批字段的显示
    flowShow() {
      return (field) => {
        if (this.formData.flowStatus == 2) return true
        let show = false
        switch (field) {
          case 'relevantDepartments':
            show = true
            break
          case 'contractDepartment':
            show =
              this.formData.matterTaskTodo?.procTaskName == '合同处经办人' ||
              this.formData.matterTaskTodo?.procTaskName == '合同处负责人' ||
              this.formData.matterTaskTodo?.procTaskName == '相关处室负责人'
            break
          case 'contractDepartmentManage':
            show =
              this.formData.matterTaskTodo?.procTaskName == '合同处经办人' ||
              this.formData.matterTaskTodo?.procTaskName == '合同处负责人'
            break
        }
        return Boolean(show)
      }
    },
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage('userInfo')
    },
    computedMoney() {
      return (name, field) => {
        return name.reduce((a, b) => a + (this.tableData[b][field] || 0), 0)
      }
    }
  },
  created() {
    this.isFormApp = fromApp()
    this.initTableData()
    this.fetchSettleTypeOptions()
    //接收控件页面的值，点击 保存到服务器 执行
  },
  mounted() {
    this.getContractPage()
  },
  methods: {
    moment,
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
    async fetchSettleTypeOptions() {
      try {
        const { data, success } = await getDictItemList('SETTLE_TYPE')
        if (success) {
          this.settleTypeOptions = (data || []).map((item) => ({
            label: item.dictName,
            value: item.dictCode
          }))
        }
      } catch (error) {
        console.error('获取结算类型失败', error)
      }
    },
    /**
     * @description 合同切换
     * @param val
     */
    contractIdChangeHandle(val) {
      this.detailData = []
      if (val) {
        let contract = this.htxxOptions.find((x) => x.code === val)
        this.contractList = (contract.detailVos || []).map((x) => {
          delete x.id
          return x
        })
        this.$set(this.formData, 'contractName', contract.name)
        this.$set(this.formData, 'contractCode', contract.code)
        this.$set(this.formData, 'contractId', contract.id)
        this.$set(this.formData, 'contractMoney', contract.amount)
        getCount({ contractCode: contract.code }).then((res) => {
          this.$set(this.formData, 'thisPayNum', res.data++)
        })
      }
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
    initTableData() {
      this.tableData = {
        工程预付款: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        材料预付款: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        工程量清单项目: {
          lastPrice: 0,
          thisPrice: 0,
          endPrice: 0,
          remark: '',
          subList: []
        },

        变更项目: {
          lastPrice: 0,
          thisPrice: 0,
          endPrice: 0,
          remark: '',
          subList: []
        },
        计日工项目: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        索赔项目: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        价格调整: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        其他: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        进度款: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        其他1: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        工程预付款1: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        材料预付款1: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        违约赔偿扣款: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        质量安全扣款: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        其他2: { lastPrice: 0, thisPrice: 0, endPrice: 0, remark: '' },
        其中农民工工资: {
          lastPrice: 0,
          thisPrice: 0,
          endPrice: 0,
          remark: ''
        },
        其中安全生产经费: {
          lastPrice: 0,
          thisPrice: 0,
          endPrice: 0,
          remark: ''
        }
      }
    },
    /**
     * @description 添加明细
     */
    addDetailBtn(type) {
      this.oprateRow.type = 'add'
      this.oprateRow.title = type == 1 ? '工程量清单项目汇总表' : '变更清单明细'
      this.oprateRow.tableType = type == 1 ? 'inventory' : 'change'
      const subList =
        type == 1
          ? this.tableData['工程量清单项目'].subList
          : this.tableData['变更项目'].subList
      this.oprateRow.data = subList || []
      this.oprateRow.contractId = this.formData.contractId
      this.oprateRow.dialogShow = true
    },
    view(type) {
      this.oprateRow.type = 'view'
      this.oprateRow.isView = true
      this.oprateRow.title = type == 1 ? '工程量清单项目汇总表' : '变更清单明细'
      this.oprateRow.tableType = type == 1 ? 'inventory' : 'change'
      const subList =
        type == 1
          ? this.tableData['工程量清单项目'].subList
          : this.tableData['变更项目'].subList
      this.oprateRow.data = subList || []
      this.oprateRow.dialogShow = true
    },
    closedDialog() {
      this.oprateRow.dialogShow = false
    },
    detailTableOk(data, tableType) {
      if (tableType == 'inventory') {
        this.tableData['工程量清单项目'].subList = data
        this.tableData['工程量清单项目'].thisPrice = this.tableData[
          '工程量清单项目'
        ].subList.reduce((pre, cur) => {
          return pre + Number(cur.thisPrice || 0)
        }, 0)
      } else {
        this.tableData['变更项目'].subList = data
        this.tableData['变更项目'].thisPrice = this.tableData[
          '变更项目'
        ].subList.reduce((pre, cur) => {
          return pre + Number(cur.totalPrice || 0)
        }, 0)
      }
    },
    /**
     * @description 选中用户 回显部门
     * @param filed
     * @param value
     * @param record
     */
    handlerUserChange(filed, value, record) {
      this.$set(this.formData, filed, record.departName)
    },
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey
      if (btnKey === 'submit') return
      let extData = {}
      extData['xgcsfzr'] = {
        type: 'user',
        value: this.formData.relevantDepartments
      }
      this.sendFlowJson = extData
      console.log('this.sendFlowJson', this.sendFlowJson)
    },
    async beforeSubmitButton() {
      let extData = {}
      extData['htcjbr'] = {
        type: 'user',
        value: this.formData.contractDepartment
      }
      extData['htcfzr'] = {
        type: 'user',
        value: this.formData.contractDepartmentManage
      }
      this.sendFlowJson = extData
    },
    save(fields, callback, event) {
      this.formData.thisSettlementSmallMoney =
        this.computedMoney(
          [
            '工程预付款',
            '材料预付款',
            '工程量清单项目',
            '变更项目',
            '计日工项目',
            '索赔项目',
            '价格调整',
            '其他'
          ],
          'thisPrice'
        ) -
        this.computedMoney(
          [
            '进度款',
            '其他1',
            '工程预付款1',
            '材料预付款1',
            '违约赔偿扣款',
            '其他2',
            '质量安全扣款'
          ],
          'thisPrice'
        )
      this.formData.thisSettlementLargeMoney = this.digitUppercase(
        this.formData.thisSettlementSmallMoney
      )
      this.formData.cumulativeSettlement = this.computedMoney(
        [
          '工程预付款',
          '材料预付款',
          '工程量清单项目',
          '变更项目',
          '计日工项目',
          '索赔项目',
          '价格调整',
          '其他'
        ],
        'thisPrice'
      ) //累计应结算
      this.formData.cumulativeDetention = this.computedMoney(
        ['进度款', '其他1'],
        'thisPrice'
      ) //累计扣留金额
      this.formData.cumulativeDivision = this.computedMoney(
        ['工程预付款1', '材料预付款1', '违约赔偿扣款', '其他2', '质量安全扣款'],
        'thisPrice'
      ) //累计扣除金额
      this.formData.cumulativeActualPayment =
        this.computedMoney(
          [
            '工程预付款',
            '材料预付款',
            '工程量清单项目',
            '变更项目',
            '计日工项目',
            '索赔项目',
            '价格调整',
            '其他'
          ],
          'thisPrice'
        ) -
        this.computedMoney(
          [
            '进度款',
            '其他1',
            '工程预付款1',
            '材料预付款1',
            '违约赔偿扣款',
            '其他2',
            '质量安全扣款'
          ],
          'thisPrice'
        ) //累计实际支付金额
      this.formData.cumulativePaymentOfFarmers =
        this.tableData['其中农民工工资'].thisPrice //累计实际支付农民工工资
      this.formData.cumulativeSafetyProductionExpense =
        this.tableData['其中安全生产经费'].thisPrice //累计安全生产经费
      const data = Object.keys(this.tableData).map((x) => {
        return {
          name: x,
          endPrice: this.tableData[x].endPrice,
          lastPrice: this.tableData[x].lastPrice,
          thisPrice: this.tableData[x].thisPrice,
          remark: this.tableData[x].remark,
          subList: this.tableData[x].subList
        }
      })
      this.formData.detailList = data
      const isMaintenance = event.data.btnKey === 'maintenance'
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: 'maintenance'
          },
          event.origin
        )
        return
      }
      console.log(fields, 'fields')
      fields.type = 2
      save(fields)
        .then((res) => {
          const { success, message } = res
          if (!success) {
            return this.$message.error('新增失败：' + message)
          } else {
            callback && callback()
          }
        })
        .catch((err) => {
          console.error(err)
          this.$message.error('新增失败')
        })
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow()
      console.log(row, 'row')
      this.initTableData()
      if (row) {
        // Object.assign(this.formData, row);
        row.detailList.forEach((x) => {
          this.tableData[x.name] = {
            ...x,
            endPrice: Number(x.endPrice),
            lastPrice: Number(x.lastPrice),
            thisPrice: Number(x.thisPrice),
            remark: x.remark
          }
        })
        console.log(this.tableData, 'this.tableData')
        this.formData = row
      } else {
        this.$set(this.formData, 'createUsername', this.userInfo.realName)
        this.$set(this.formData, 'unit', this.userInfo.corpName)
        this.$set(this.formData, 'initiateDate', new Date())
        // this.$set(
        //   this.formData,
        //   'initiateDate',
        //   moment().format('YYYY-MM-DD HH:mm:ss')
        // )
      }
    }
  }
}
</script>

<style scoped lang="scss">
// 单独处理  上传样式

/deep/.custom-disabled {
  .upload-demo {
    display: none;
  }
}
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
