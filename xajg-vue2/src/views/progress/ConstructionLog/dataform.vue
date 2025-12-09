<template>
  <div class="page-leave">
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
        label-width="160px"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="日期" size="mini" prop="logsDate">
              <el-date-picker
                v-model="formData.logsDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择开始日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="班次" prop="workTime" align="center">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.workTime"
                placeholder="请选择班次"
                clearable
                :disabled="readonly"
              >
                <el-option
                  v-for="item in classs"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="天气情况" prop="weather" align="center">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.weather"
                placeholder="请选择"
                clearable
                :disabled="readonly"
              >
                <el-option
                  v-for="item in weathers"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="项目部领导" prop="projectLeader">
              <el-input
                v-model="formData.projectLeader"
                placeholder="请输入项目部领导"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="生产（办公）区领导" prop="productionLeader">
              <el-input
                v-model="formData.productionLeader"
                placeholder="请输入生产（办公）区领导"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="记录人员:"
              >{{ formData.RecordingPersonnel }}
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="施工标段" prop="section" align="center">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.section"
                placeholder="请选择"
                clearable
                :disabled="readonly"
              >
                <el-option
                  v-for="item in sectionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="施工部门:" prop="constructionUnit">
              {{ formData.constructionUnit }}
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="freeFlowInputShow">
            <el-form-item label="审批人" prop="freeFlowUsers">
              <!--              <el-input-->
              <!--                disabled-->
              <!--                placeholder="请选择"-->
              <!--                v-model="formData.freeFlowUsers"-->
              <!--              >-->
              <!--                <template slot="append">-->
              <!--                  <div @click="freeFlowDialogShow = true">选择</div>-->
              <!--                </template>-->
              <!--              </el-input>-->
              <user
                v-model="formData.freeFlowUsers"
                :readonly="readonly"
                :needSection="true"
                :sectionId="formData.section"
              ></user>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="备注" prop="remark" align="center">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
                v-model="formData.remark"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>

    <el-row :gutter="20" class="table">
      <el-col :span="24">
        <div class="">
          <div class="flex align-center justify-between">
            <div class="font-w-600">本班工作情况</div>
            <el-button v-if="!readonly" type="primary" @click="addWork('')"
              >新增</el-button
            >
          </div>
          <div class="bottom-line"></div>
        </div>
        <el-form ref="dataFormtable">
          <el-table ref="multipleTable" border :data="formData.workList">
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            >
            </el-table-column>
            <el-table-column label="工程部位" prop="pbsName" align="center">
            </el-table-column>
            <el-table-column
              label="施工内容（工序）"
              prop="constructionContent"
              align="center"
            >
              <template slot-scope="{ row }">
                <span>{{
                  $DictionaryParsing(
                    constructionContentOptions,
                    row.constructionContent
                  )
                    ? $DictionaryParsing(
                        constructionContentOptions,
                        row.constructionContent
                      )
                    : row.constructionContent
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="本次起止桩号"
              prop="startStakeMark"
              align="center"
            >
              <template slot-scope="{ row }">
                <span>{{
                  row.startStakeMark && row.endStakeMark
                    ? row.startStakeMark + " ~ " + row.endStakeMark
                    : ""
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="工程量" prop="quantity" align="center">
            </el-table-column>
            <el-table-column
              label="机械设备投入数量"
              prop="equipmentList.length"
              align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ getTotalNum(row.equipmentList) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="人员投入数量"
              prop="personList.length"
              align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ getTotalNum(row.personList) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              prop="name"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="
                    addWork(scope.$index, tableData);
                    workFormReadonly = true;
                  "
                  type="text"
                  size="small"
                >
                  查看
                </el-button>
                <el-button
                  @click.native.prevent="addWork(scope.$index, tableData)"
                  type="text"
                  size="small"
                  :disabled="readonly"
                >
                  编辑
                </el-button>
                <el-button
                  @click.native.prevent="delWork(scope.$index, tableData)"
                  type="text"
                  size="small"
                  :style="readonly ? '' : 'color: red'"
                  :disabled="readonly"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="table">
      <el-col :span="24">
        <div class="">
          <div class="flex align-center justify-between">
            <div class="font-w-600">设备使用情况</div>
            <el-button v-if="!readonly" type="primary" @click="addDevice('')"
              >新增</el-button
            >
          </div>
          <div class="bottom-line"></div>
        </div>
        <el-form ref="dataFormtable">
          <el-table ref="multipleTable" border :data="formData.deviceList">
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            >
            </el-table-column>
            <el-table-column label="设备类型" prop="type" align="center">
              <template slot-scope="{ row }">
                <span>{{ $DictionaryParsing(Equipments, row.type) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="设备型号" prop="model" align="center">
            </el-table-column>
            <el-table-column label="设备名称" prop="name" align="center">
            </el-table-column>
            <el-table-column
              label="工作时间（h）"
              prop="workHours"
              align="center"
            >
            </el-table-column>
            <el-table-column label="工程部位" prop="pbsName" align="center">
            </el-table-column>
            <el-table-column
              label="故障/检修时间（h）"
              prop="downHours"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="保养时间（h）"
              prop="upkeepHours"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="闲置时间（h）"
              prop="idleHours"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              prop="name"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="
                    addDevice(scope.$index, tableData);
                    deviceFormReadonly = true;
                  "
                  type="text"
                  size="small"
                >
                  查看
                </el-button>
                <el-button
                  @click.native.prevent="addDevice(scope.$index, tableData)"
                  type="text"
                  size="small"
                  :disabled="readonly"
                >
                  编辑
                </el-button>
                <el-button
                  @click.native.prevent="delDevice(scope.$index, tableData)"
                  type="text"
                  size="small"
                  :style="readonly ? '' : 'color: red'"
                  :disabled="readonly"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-col>
    </el-row>

    <!-- 新增本班工作情况 -->
    <el-dialog
      v-draggable
      width="80%"
      :visible.sync="workDialogVisible"
      title="新增本班工作情况"
    >
      <el-row>
        <el-form
          ref="workForm"
          :model="workFormData"
          :rules="workFormDataRules"
          label-width="160px"
          :disabled="workFormReadonly"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="工程部位" prop="pbsCode" align="center">
                <pbs-select
                  v-model="workFormData.pbsCode"
                  :readonly="workFormReadonly"
                  @change="choosePbs"
                ></pbs-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="总起止桩号:" prop="">
                <template>
                  <div class="flex font-w-550">
                    <div>
                      <span></span>
                      <span>{{ allStartStakeMark }}</span>
                    </div>
                  </div>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="最近施工起止桩号:" prop="">
                <template>
                  <div class="flex font-w-550">
                    <div>
                      <span></span>
                      <span>{{ recentlyStakeMark }}</span>
                    </div>
                  </div>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="施工方向:" prop="">
                <template>
                  <div class="flex font-w-550">
                    <div>
                      <span></span>
                      <span>{{
                        $DictionaryParsing(
                          constructionOptions,
                          workFormData.constructionDirection
                        )
                      }}</span>
                    </div>
                  </div>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="本次进尺(m)" prop="drillingFootage">
                <el-input
                  v-model="workFormData.drillingFootage"
                  placeholder="请输入"
                  width="100%"
                  type="number"
                  @input="
                    workFormData.drillingFootage =
                      workFormData.drillingFootage.replace(
                        /^(\-)*(\d+)\.(\d{3}).*$/,
                        '$1$2.$3'
                      )
                  "
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="起桩号" prop="startStakeMark">
                <div class="flex">
                  <el-input
                    type="number"
                    v-model="workFormData.startStakeMark"
                    placeholder="请输入"
                    width="100%"
                    @input="
                      workFormData.startStakeMark =
                        workFormData.startStakeMark.replace(
                          /^(\-)*(\d+)\.(\d{3}).*$/,
                          '$1$2.$3'
                        )
                    "
                  >
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="止桩号:" prop="endStakeMark">
                <div>
                  <!-- <span> {{ endStakeMark1 }}</span>
                  <span class="mx-10">+</span> -->
                  <span> {{ endStakeMark2 }}</span>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="施工内容（工序）" prop="constructionContent">
                <el-select @visible-change="$visibleChange($event, 'el-popper')"
                  style="width: 100%"
                  v-model="workFormData.constructionContent"
                  allow-create
                  filterable
                  default-first-option
                >
                  <el-option
                    v-for="item in constructionContentOptions"
                    :key="item.dictCode"
                    :value="item.dictCode"
                    :label="item.dictName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="工程量" prop="quantity">
                <el-input
                  type="number"
                  v-model="workFormData.quantity"
                  placeholder="请输入"
                  width="100%"
                  @input="
                    workFormData.quantity = workFormData.quantity.replace(
                      /([0-9]+\.[0-9]{2})[0-9]*/,
                      '$1'
                    )
                  "
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>

      <el-row :gutter="20" class="table">
        <el-col :span="12">
          <div class="">
            <div class="flex align-center justify-between">
              <div class="font-w-600">人员投入</div>
              <el-button
                v-if="!workFormReadonly"
                type="primary"
                @click="addPerson"
                >新增</el-button
              >
            </div>
            <div class="bottom-line"></div>
          </div>
          <el-form ref="dataFormtable">
            <el-table
              ref="multipleTable"
              border
              :data="workFormData.personList"
            >
              <el-table-column
                label="工种"
                prop="type"
                align="center"
                class-name="taskname"
              >
                <template slot-scope="{ row }">
                  <span v-if="workFormReadonly">{{
                    $DictionaryParsing(WorkTypes, row.type)
                  }}</span>

                  <el-form-item v-else :error="row.typeError">
                    <el-select @visible-change="$visibleChange($event, 'el-popper')"
                      v-model="row.type"
                      @change="tableParValueChange(row, 'type', 'typeError')"
                    >
                      <el-option
                        v-for="item in WorkTypes"
                        :key="item.dictCode"
                        :value="item.dictCode"
                        :label="item.dictName"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="人数"
                prop="quantity"
                align="center"
                class-name="taskname"
              >
                <template slot-scope="{ row }">
                  <span v-if="workFormReadonly">{{ row.quantity }}</span>

                  <el-form-item v-else :error="row.quantityError">
                    <el-input
                      placeholder="请输入"
                      @blur="
                        tableParValueChange(row, 'quantity', 'quantityError')
                      "
                      type="number"
                      v-model="row.quantity"
                      @input="
                        () => {
                          row.quantity = formatValue(row.quantity);
                        }
                      "
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="备注" prop="remark" align="center">
                <template slot-scope="{ row }">
                  <span v-if="workFormReadonly">{{ row.remark }}</span>
                  <el-input
                    v-else
                    type="textarea"
                    :rows="1"
                    placeholder="请输入备注"
                    v-model="row.remark"
                    :disabled="workFormReadonly"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                prop="name"
                width="200"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="delPerson(scope.$index, tableData)"
                    type="text"
                    size="small"
                    :style="workFormReadonly ? '' : 'color: red'"
                    :disabled="workFormReadonly"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-col>

        <el-col :span="12">
          <div class="">
            <div class="flex align-center justify-between">
              <div class="font-w-600">设备投入</div>
              <el-button
                v-if="!workFormReadonly"
                type="primary"
                @click="addEquipment"
                >新增</el-button
              >
            </div>
            <div class="bottom-line"></div>
          </div>
          <el-form ref="dataFormtable">
            <el-table
              ref="multipleTable"
              border
              :data="workFormData.equipmentList"
            >
              <el-table-column
                label="设备"
                prop="type"
                align="center"
                class-name="taskname"
              >
                <template slot-scope="{ row }">
                  <span v-if="workFormReadonly">{{
                    $DictionaryParsing(Equipments, row.type)
                  }}</span>
                  <el-form-item v-else :error="row.typeError">
                    <el-select @visible-change="$visibleChange($event, 'el-popper')"
                      v-model="row.type"
                      @change="tableParValueChange(row, 'type', 'typeError')"
                    >
                      <el-option
                        v-for="item in Equipments"
                        :key="item.dictCode"
                        :value="item.dictCode"
                        :label="item.dictName"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="数量"
                prop="quantity"
                align="center"
                class-name="taskname"
              >
                <template slot-scope="{ row }">
                  <span v-if="workFormReadonly">{{ row.quantity }}</span>
                  <el-form-item v-else :error="row.quantityError">
                    <el-input
                      type="number"
                      v-model="row.quantity"
                      @blur="
                        tableParValueChange(row, 'quantity', 'quantityError')
                      "
                      @input="
                        () => {
                          row.quantity = formatValue(row.quantity);
                        }
                      "
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column label="备注" prop="remark" align="center">
                <template slot-scope="{ row }">
                  <span v-if="workFormReadonly">{{ row.remark }}</span>
                  <el-input
                    v-else
                    type="textarea"
                    :rows="1"
                    placeholder="请输入备注"
                    v-model="row.remark"
                    :disabled="workFormReadonly"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                prop="name"
                width="200"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="
                      delEquipment(scope.$index, tableData)
                    "
                    type="text"
                    size="small"
                    :disabled="workFormReadonly"
                    :style="workFormReadonly ? '' : 'color: red'"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="!workFormReadonly" @click="workDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" v-if="!workFormReadonly" @click="saveWork"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增设备使用情况 -->
    <el-dialog
      v-draggable
      width="80%"
      :visible.sync="deviceDialogVisible"
      title="新增设备使用情况"
    >
      <el-row>
        <el-form
          ref="deviceForm"
          :model="deviceFormData"
          :rules="deviceFormDataRules"
          label-width="160px"
          :disabled="deviceFormReadonly"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备类型" prop="type">
                <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="deviceFormData.type">
                  <el-option
                    v-for="item in Equipments"
                    :key="item.dictCode"
                    :value="item.dictCode"
                    :label="item.dictName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备型号" prop="model">
                <el-input v-model="deviceFormData.model"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="deviceFormData.name"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="工作时间（h）" prop="workHours">
                <el-input
                  type="number"
                  v-model="deviceFormData.workHours"
                  @input="
                    deviceFormData.workHours = deviceFormData.workHours.replace(
                      /([0-9]+\.[0-9]{2})[0-9]*/,
                      '$1'
                    )
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="工程部位" prop="pbsCode">
                <pbs-select
                  v-model="deviceFormData.pbsCode"
                  :readonly="deviceFormReadonly"
                  @change="choosePbsForDevice"
                ></pbs-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="故障/检修时间（h）" prop="downHours">
                <el-input
                  type="number"
                  v-model="deviceFormData.downHours"
                  @input="
                    deviceFormData.downHours = deviceFormData.downHours.replace(
                      /([0-9]+\.[0-9]{2})[0-9]*/,
                      '$1'
                    )
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="故障原因" prop="downReason">
                <el-input
                  v-model="deviceFormData.downReason"
                  maxlength="150"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="闲置时间（h）" prop="idleHours">
                <el-input
                  type="number"
                  v-model="deviceFormData.idleHours"
                  @input="
                    deviceFormData.idleHours = deviceFormData.idleHours.replace(
                      /([0-9]+\.[0-9]{2})[0-9]*/,
                      '$1'
                    )
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="闲置原因" prop="idleReason">
                <el-input
                  v-model="deviceFormData.idleReason"
                  maxlength="150"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="保养时间（h）" prop="upkeepHours">
                <el-input
                  type="number"
                  v-model="deviceFormData.upkeepHours"
                  @input="
                    deviceFormData.upkeepHours =
                      deviceFormData.upkeepHours.replace(
                        /([0-9]+\.[0-9]{2})[0-9]*/,
                        '$1'
                      )
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="保养原因" prop="upkeepReason">
                <el-input
                  v-model="deviceFormData.upkeepReason"
                  maxlength="150"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="16">
              <el-form-item label="备注" prop="remark" align="center">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入内容"
                  v-model="deviceFormData.remark"
                  maxlength="500"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="日志图片" prop="uploadFile">
                <uploadFile
                  v-if="!isFromApp"
                  ref="uploadFileRef"
                  :readonly="deviceFormReadonly"
                  v-model="deviceFormData.uploadFile"
                  :accept="'.jpg,.png,.gif'"
                  listType="picture-card"
                  :limit="3"
                  :maxSize="20"
                  :before-upload="beforeFileUpload"
                >
                </uploadFile>
                <uploadFile
                  v-else
                  ref="uploadFileRef"
                  :readonly="deviceFormReadonly"
                  v-model="deviceFormData.uploadFile"
                  listType="picture-card"
                  :limit="3"
                  :maxSize="20"
                  :before-upload="beforeFileUpload"
                >
                </uploadFile>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="!deviceFormReadonly"
          @click="deviceDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" v-if="!deviceFormReadonly" @click="saveDevice"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--    <user-select-->
    <!--      :show.sync="freeFlowDialogShow"-->
    <!--      @user-checked="getFreeFlowUsers"-->
    <!--      :multiEnable="true"-->
    <!--    />-->
  </div>
</template>

<script>
import { save, sectionList, selectByPbs } from "./api-v2";
import { dateFormat, fromApp } from "@/utils";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { getDictItemList } from "@/api/dict";

export default {
  name: "dataform",

  mixins: [FlowFormMixin],
  data() {
    return {
      /** 施工添加本班和设备情况 */
      workDialogVisible: false,
      workFormReadonly: false,
      workListIndex: -1,
      deviceDialogVisible: false,
      deviceFormReadonly: false,
      deviceListIndex: -1,
      workFormData: {
        personList: [], //人员列表
        equipmentList: [] //设备列表
      }, //本班工作情况列表
      deviceFormData: {}, //设备使用情况列表
      workFormDataRules: {
        // drillingFootage: [
        //   {required: true, message: "请输入进尺", trigger: "blur"},
        // ],
        section: [{ required: true, message: "请选择", trigger: "blur" }],
        pbsCode: [{ required: true, message: "请选择", trigger: "blur" }],
        // startStakeMark: [
        //   {required: true, message: "请输入", trigger: "blur"},
        // ],
        constructionContent: [
          { required: true, message: "请输入", trigger: "blur" }
        ]
      },
      deviceFormDataRules: {
        type: [
          { required: true, message: "请选择设备类型", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        workHours: [
          { required: true, message: "请输入工作时间", trigger: "blur" }
        ],
        uploadFile: [{ required: true, message: "请上传", trigger: "change" }],
        pbsCode: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      /** 施工添加本班和设备情况end */

      freeFlowInputShow: false,
      freeFlowUsers: "",
      freeFlowDialogShow: false,
      startStakeMarkvalue1: "",
      startStakeMarkvalue2: "",
      endStakeMark1: "",
      endStakeMark2: "",
      recentlyStakeMark: "",
      allStartStakeMark: "", //总起止桩号
      WorkTypes: [], //工种字典
      Equipments: [], //设备列表
      classs: [], //班次
      weathers: [], //天气

      uploadFileList: [],
      options: [],
      //月度计划列表
      tableData: [],
      formData: {
        id: null,
        /** 施工添加本班和设备情况 */
        workList: [], //本班工作情况列表
        deviceList: [] //设备使用情况列表
        /** 施工添加本班和设备情况end */
      },
      formDataRules: {
        logsDate: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        workTime: [
          { required: true, message: "请选择班次", trigger: "change" }
        ],
        freeFlowUsers: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        section: [
          { required: true, message: "请选择施工标段", trigger: "change" }
        ]
      },

      /**表单是否只读 */
      readonly: false,

      /**人员选择 */
      personDialog: {
        selection: [],
        show: false
      },
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },

      //当前选择行
      curRow: null,

      /**组织机构选择 */
      deptShow: false,
      /**岗位 */
      dutyOptions: [],
      /**请假类型 */
      leaveCategoryOptions: [],
      /**分类类型 */
      designClassifyOptions: [],
      /**设计分类类型字典code */
      designClassifyCode: "DESIGN_CLASSIFY",
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      /**施工标段 */
      sectionOptions: [],
      /** 施工内容（工序）code */
      constructionContentCode: "CONSTRUCTION_CONTENT",
      /**施工内容（工序） */
      constructionContentOptions: [],
      //
      constructionOptions: [],
      businessId: "",
      pacId: "",

      /**接口地址：对应list接口 */
      url: {
        list: "/api/schedule/construction/log/information/v2/page"
      },
      isFromApp: false
    };
  },
  computed: {},

  created() {
    this.getConstructionOptions();
    this.getWorkType();
    this.getEquipment();
    this.getClass();
    this.getWeather();
    this.getSectionList();
    this.getConstructionContent();
    // console.log("this.$route", this.$route);
  },
  mounted() {
    // this.formData.logsDate = dateFormat();
    let constructionLogsDate = localStorage.getItem("ConstructionLogsDate");
    if (constructionLogsDate) {
      this.$set(this.formData, "logsDate", dateFormat(constructionLogsDate));
    } else {
      this.$set(this.formData, "logsDate", dateFormat());
    }
    this.isFromApp = fromApp();
  },
  methods: {
    /** 施工添加本班和设备情况 */
    /* 打开本班情况弹窗 */
    addWork(index) {
      this.workDialogVisible = true;
      this.workFormReadonly = false;
      console.log(index);
      if (index !== "") {
        // 查看/编辑
        this.workFormData = JSON.parse(
          JSON.stringify(this.formData.workList[index])
        );
        this.workListIndex = index;
      } else {
        // 新增
        this.workFormData = {
          personList: [], //人员列表
          equipmentList: [] //设备列表
        };
        this.$refs.workForm.resetFields();
        this.workListIndex = -1;
      }
    },
    /* 打开设备情况弹窗 */
    addDevice(index) {
      this.deviceDialogVisible = true;
      this.deviceFormReadonly = false;
      if (index !== "") {
        // 查看/编辑
        this.deviceFormData = JSON.parse(
          JSON.stringify(this.formData.deviceList[index])
        );
        this.deviceListIndex = index;
      } else {
        // 新增
        this.deviceFormData = {};
        this.deviceListIndex = -1;
        this.$refs.deviceForm.resetFields();
      }
    },
    /* 保存工作情况 */
    saveWork() {
      console.log(this.workFormData);
      this.$refs.workForm.validate((valid) => {
        if (valid) {
          if (this.workFormData.personList.length === 0) {
            this.$message.error("人员投入至少需要填写1条信息!");
            return;
          }
          if (this.workFormData.equipmentList.length === 0) {
            this.$message.error("设备投入至少需要填写1条信息!");
            return;
          }
          let isok = true;
          this.workFormData.personList.forEach((item, index) => {
            if (!item.type) {
              isok = false;
              this.$set(item, "typeError", "必填");
            }
            if (!item.quantity) {
              isok = false;
              this.$set(item, "quantityError", "必填");
            }
          });
          this.workFormData.equipmentList.forEach((item, index) => {
            if (!item.type) {
              isok = false;
              this.$set(item, "typeError", "必填");
            }
            if (!item.quantity) {
              isok = false;
              this.$set(item, "quantityError", "必填");
            }
          });
          if (!isok) return;
          this.workFormData.endStakeMark = this.endStakeMark2;
          // 校验完成，加入列表
          if (this.workListIndex >= 0) {
            // 编辑
            this.$set(
              this.formData.workList,
              this.workListIndex,
              JSON.parse(JSON.stringify(this.workFormData))
            );
          } else {
            // 新增
            this.formData.workList.push(
              JSON.parse(JSON.stringify(this.workFormData))
            );
          }
          this.workListIndex = -1;
          this.workDialogVisible = false;
          console.log(this.formData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 保存设备情况 */
    saveDevice() {
      console.log(this.deviceFormData);
      this.$refs.deviceForm.validate((valid) => {
        if (valid) {
          // 校验完成，加入列表
          if (this.deviceListIndex >= 0) {
            // 编辑
            this.$set(
              this.formData.deviceList,
              this.deviceListIndex,
              JSON.parse(JSON.stringify(this.deviceFormData))
            );
          } else {
            // 新增
            this.formData.deviceList.push(
              JSON.parse(JSON.stringify(this.deviceFormData))
            );
          }
          this.deviceListIndex = -1;
          this.deviceDialogVisible = false;
          console.log(this.formData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 删除工作情况 */
    async delWork(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      });
      this.formData.workList.splice(index, 1);
    },
    /* 删除设备情况 */
    async delDevice(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      });
      this.formData.deviceList.splice(index, 1);
    },
    beforeFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      return isLt2M;
    },
    // 获取数量总计
    getTotalNum(list) {
      let total = 0;
      list.forEach((item) => {
        total += Number(item.quantity);
      });
      return total;
    },
    /** 施工添加本班和设备情况end  */
    getFreeFlowUsers(data) {
      this.freeFlowUsers = data.valueText;
      this.$set(this.formData, "freeFlowUsers", data.text);
    },
    doSomething() {
      console.log("查看时候点击");
    },
    //table 校验
    tableParValueChange(row, field, errTips) {
      if (row[field] && row[field] !== "") {
        this.$set(row, errTips, "");
      } else {
        this.$set(row, errTips, "必填");
      }
    },
    formatValue(value) {
      value = value.replace(/[^0-9]/g, "");
      value = value.replace(/^(\-)*(\d+)\.(\d{1}).*$/, "$1$2.$3");
      return value;
    },
    chengeUploadList(val) {
      console.log("chengeUploadList", val);
      this.formData.uploadFile = val;
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          console.log("sectionList", res.data);
          this.sectionOptions = res.data;
        }
      });
    },
    //

    /**获取班次字典 */
    async getConstructionOptions() {
      const { data } = await getDictItemList("sgfx");
      this.constructionOptions = data;
      console.log("constructionOptions", data);
    },

    /**获取班次字典 */
    async getWeather() {
      const { data } = await getDictItemList("WEATHER");
      this.weathers = data;
      console.log("weathers", data);
    },

    /**获取班次字典 */
    async getClass() {
      const { data } = await getDictItemList("CLASS");
      this.classs = data;
      console.log("classs", data);
    },
    /**获取工种字典 */
    async getWorkType() {
      const { data } = await getDictItemList("TYPE_OF_WORKk");
      this.WorkTypes = data;
      console.log("WorkTypes", data);
    },

    /**获取设备字典 */
    async getEquipment() {
      const { data } = await getDictItemList("EQUIPMENT");
      this.Equipments = data;
      console.log("Equipments", data);
    },

    /**获取设备字典 */
    async getConstructionContent() {
      const { data } = await getDictItemList(this.constructionContentCode);
      this.constructionContentOptions = data;
    },

    // table 添加人员
    addPerson() {
      this.workFormData.personList.push({
        type: "",
        quantity: "",
        remark: ""
      });
      console.log("this.personList", this.formData);
    },
    async delPerson(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      });
      this.workFormData.personList.splice(index, 1);
    },
    // table 添加设备
    addEquipment() {
      this.workFormData.equipmentList.push({
        type: "",
        quantity: "",
        remark: ""
      });
      console.log("this.equipmentList", this.workFormData);
    },
    async delEquipment(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      });
      this.workFormData.equipmentList.splice(index, 1);
      console.log("this.equipmentList", this.formData);
    },

    /** 人员选择回调*/
    getUsers(data) {
      console.log("this.curRow", this.curRow, data);
      if (this.curRow) {
        this.curRow.charge = data.valueText || "";
        this.curRow.chargeName = data.text || "";
      }
      this.$set(this.tableData, this.curRow.$index, { ...this.curRow });
    },
    /** 选择人员点击*/
    showPerson(row) {
      this.personDialog.selection = row.charge ? [row.charge] : [];
      this.curRow = row;
      this.personDialog.show = true;
    },
    /** 选择人员清空时*/
    clearEvt(row, type) {
      if (type === "person") {
        row.charge = "";
        row.chargeName = "";
      }
      if (type === "pbs") {
        row.projectPbs = "";
        row.projectPbsName = "";
      }
      console.log("clearEvt", row, type);
    },
    // 选择pbs后得回调
    choosePbs(pbsCode, pbsInfo) {
      console.log("pbsCode, pbsInfo", pbsCode, pbsInfo);
      // 后端 没有存下 allStartStakeMark 字段
      this.allStartStakeMark =
        pbsInfo.startStakeMark + "~" + pbsInfo.endStakeMark;
      this.workFormData.endStakeMark = pbsInfo.endStakeMark;
      this.workFormData.constructionDirection = pbsInfo.constructionDirection;
      this.workFormData.pbsName = pbsInfo.name;
      // 获取最近施工起止桩号
      this.getSelectByPbs(this.workFormData.pbsCode);
    },
    choosePbsForDevice(pbsCode, pbsInfo) {
      this.deviceFormData.pbsName = pbsInfo.name;
    },

    /**
     * 获取表单数据
     */
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        if (!row) {
          const loginInfo = this.$getStorage("userInfo");
          this.formData.RecordingPersonnel = loginInfo.realName;
          this.formData.constructionUnit = loginInfo.departName;
          console.log("新增加", loginInfo);
          this.$nextTick(() => {
            this.freeFlowInputShow = true;
          });
          return;
        }
        console.log("表单数据", row);
        // Set RecordingPersonnel based on createUsername or user loginInfo
        row.RecordingPersonnel =
          row.createUsername || this.$store.state.user.loginInfo.realName;

        // Format logsDate
        row.logsDate = dateFormat(row.logsDate, "yyyy-MM-DD");

        if (row.pbsCode) {
          // 获取总起止桩号 总起止桩号 就是现在
          const data = await this.$getPbsInfoByCode(row.pbsCode);
          this.choosePbs(row.pbsCode, data);
          // this.allStartStakeMark = await this.$getPbsInfoByCode(row.pbsCode);
          this.getSelectByPbs(row.pbsCode);
        }

        // Define a function to process uploadFile
        const processUploadFile = () => {
          if (row.uploadFile) {
            this.$nextTick(() => {
              if (
                this.$refs.uploadFileRef &&
                typeof this.$refs.uploadFileRef.setImg === "function"
              ) {
                this.$refs.uploadFileRef.setImg(row.uploadFile);
              } else {
                // If the component or method is not available, retry up to 10 times
                if (processUploadFile.retryCount < 10) {
                  processUploadFile.retryCount++;
                  setTimeout(processUploadFile, 500);
                } else {
                  // If it exceeds 10 retries, log an error
                  console.error(
                    "UploadFile component is not available after 10 retries."
                  );
                }
              }
            });
          }
        };
        processUploadFile.retryCount = 0;

        // Start the process
        processUploadFile();

        this.formData = row;
        this.$nextTick(() => {
          // 自由流程第一人
          let b = row.createUser == this.$getStorage("userInfo").userId;
          console.log("是否显示自由流程第一人", b, this.readonly);
          this.freeFlowInputShow = b && !this.readonly;
        });
      } catch (error) {
        // Handle any errors that occur during the getFlowRow() operation.
        console.error("Error while fetching data:", error);
      }
    },

    //计算children
    computeChildren(pid, detailList) {
      let children = detailList.filter((x) => x.pid === pid);
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        child.isClassify = false;
        child.children = this.computeChildren(child.id, detailList);
      }
      return children;
    },
    async beforeSend() {
      this.sendFlowJson = {
        spr: {
          type: "user",
          value: this.formData.freeFlowUsers
        }
      };
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      console.log("save fields", fields);
      localStorage.setItem("ConstructionLogsDate", this.formData.logsDate);
      //做业务数据的保存,修改。
      save(fields)
        .then((res) => {
          const { success, message } = res;
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
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designClassifyCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designClassifyOptions = items;
            callback && callback();
          });
        } else {
          callback && callback();
        }
      }

      if (code === this.designProfessionCode) {
        if (
          !this.designProfessionOptions ||
          this.designProfessionOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designProfessionOptions = items;
          });
        }
      }

      if (code === this.constructionContentCode) {
        if (
          !this.constructionContentOptions ||
          this.constructionContentOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.constructionContentOptions = items;
          });
        } else {
        }
      }
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    getSelectByPbs(code) {
      let param = {
        pbsCode: code
      };
      selectByPbs(param).then((res) => {
        console.log("获取最近桩号", res);
        if (res.success && res.data?.startStakeMark) {
          this.recentlyStakeMark = res.data.startStakeMark;
          if (!this.startStakeMark) {
            this.startStakeMark = res.data.endStakeMark;
          }
        }
      });
    }
  },
  watch: {
    tableData: {
      handler() {
        if (this.tableData && this.tableData.length) {
          this.formData.designPlanDetailList = this.tableData.filter(
            (x) => x.isClassify === false
          );
        }
      },
      immediate: true
    },
    startStakeMarkvalue1: {
      handler(newvalue) {
        if (newvalue && this.startStakeMarkvalue2) {
          this.$set(
            this.formData,
            "startStakeMark",
            newvalue + this.startStakeMarkvalue2
          );
        } else {
          this.$set(this.formData, "startStakeMark", "");
        }
        // 这里也要做一个判断 以防万一  这个人先输入后面的在输入前面的
        // 整数部分
        let parInt = parseInt(
          (Number(this.formData.drillingFootage) +
            Number(this.startStakeMarkvalue2)) /
            1000
        );
        // 余数部分
        let flot = "";
        if (
          Number(this.formData.drillingFootage) +
            Number(this.startStakeMarkvalue2) >=
          1000
        ) {
          flot =
            (Number(this.formData.drillingFootage) +
              Number(this.startStakeMarkvalue2)) %
            1000;
        } else {
          flot =
            Number(this.formData.drillingFootage) +
            Number(this.startStakeMarkvalue2);
        }
        if (parInt > 0) {
          this.endStakeMark1 = Number(newvalue) + parInt;
        } else {
          this.endStakeMark1 = Number(newvalue);
        }
        this.endStakeMark2 = Number(flot).toFixed(3);
      },
      immediate: true,
      deep: true
    },
    startStakeMarkvalue2: {
      handler(newvalue) {
        console.log("startStakeMarkvalue2", newvalue);
        if (this.startStakeMarkvalue1 && newvalue) {
          this.formData.startStakeMark = this.$set(
            this.formData,
            "startStakeMark",
            this.startStakeMarkvalue1 + Number(newvalue)
          );
        } else {
          this.$set(this.formData, "startStakeMark", "");
        }
        // 如果当前 startStakeMarkvalue2   +this.formData.drillingFootage 大于等于1000 就  endStakeMark1＋1
        // 整数部分
        let parInt = parseInt(
          (Number(newvalue) + Number(this.formData.drillingFootage)) / 1000
        );
        console.log("parInt", parInt);
        // 余数部分
        let flot = "";
        if (Number(newvalue) + Number(this.formData.drillingFootage) >= 1000) {
          flot =
            (Number(newvalue) + Number(this.formData.drillingFootage)) % 1000;
        } else {
          flot = Number(newvalue) + Number(this.formData.drillingFootage);
        }
        console.log("flot", flot);
        if (parInt > 0) {
          this.endStakeMark1 = Number(this.startStakeMarkvalue1) + parInt;
        } else {
          this.endStakeMark1 = Number(this.startStakeMarkvalue1);
        }
        this.endStakeMark2 = Number(flot).toFixed(3);
      },
      immediate: true,
      deep: true
    },
    //

    "workFormData.startStakeMark": {
      handler(newvalue) {
        // 如果当前 startStakeMarkvalue2   +this.formData.drillingFootage 大于等于1000 就  endStakeMark1＋1
        // 整数部分
        // let parInt = parseInt(
        //   (Number(newvalue) + Number(this.startStakeMarkvalue2)) / 1000
        // );
        // // 余数部分
        // let flot = "";
        // if (Number(newvalue) + Number(this.startStakeMarkvalue2) >= 1000) {
        //   flot = (Number(newvalue) + Number(this.startStakeMarkvalue2)) % 1000;
        // } else {
        //   flot = Number(newvalue) + Number(this.startStakeMarkvalue2);
        // }
        // if (parInt > 0) {
        //   this.endStakeMark1 = Number(this.startStakeMarkvalue1) + parInt;
        // } else {
        //   this.endStakeMark1 = this.startStakeMarkvalue1;
        // }
        let mark = (
          Number(
            this.workFormData.drillingFootage
              ? this.workFormData.drillingFootage
              : 0
          ) + Number(newvalue)
        ).toFixed(3);
        this.endStakeMark2 = mark !== "NaN" ? mark : "";
      },
      immediate: true,
      deep: true
    },
    "workFormData.drillingFootage": {
      handler(newvalue) {
        // 如果当前 startStakeMarkvalue2   +this.formData.drillingFootage 大于等于1000 就  endStakeMark1＋1

        let mark = (
          Number(
            this.workFormData.drillingFootage
              ? this.workFormData.drillingFootage
              : 0
          ) + Number(newvalue)
        ).toFixed(3);
        this.endStakeMark2 = mark !== "NaN" ? mark : "";
      },
      immediate: true,
      deep: true
    },
    "workFormData.uploadFile": {
      handler(newvalue) {
        console.log("数据变化", newvalue);
      },
      deep: true
    }
  }
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

.bottom-line {
  margin: 10px 0;
  height: 1px;
  background-color: #e5e5ee;
}

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

/deep/ .taskname {
  .el-form-item__content {
    top: 8px !important;
  }
}

/deep/ .taskname .cell {
  // overflow: auto;
  overflow: visible;
}
</style>
