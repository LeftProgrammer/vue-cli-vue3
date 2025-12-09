<template>
  <div class="w-100pre">
    <el-dialog
      title="计划台账详情"
      :visible.sync="dialogShow"
      width="60%"
      top="8vh"
      :close-on-click-modal="false"
    >
      <div class="page-leave">
        <el-row>
          <el-col :span="24">
            <div>基本信息</div>
            <el-divider />
          </el-col>
        </el-row>
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          label-width="auto"
          :disabled="readonly"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="编码" size="mini" prop="code">
                <el-input
                  v-model="formData.code"
                  class="w-100pre"
                  show-word-limit
                  maxlength="50"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="名称" size="mini" prop="name">
                <el-input
                  v-model="formData.name"
                  class="w-100pre"
                  show-word-limit
                  maxlength="50"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                v-if="planType === 1 || planType === 2"
                :label="label"
                size="mini"
                prop="year"
              >
                <el-date-picker
                  v-model="formData.year"
                  style="width: 100%"
                  :type="dateType"
                  :value-format="valueFormat"
                  placeholder="请选择"
                />
              </el-form-item>
              <el-form-item
                v-if="planType === 3"
                label="版本"
                size="mini"
                prop="version"
              >
                <el-input
                  v-model="formData.version"
                  class="w-100pre"
                  readonly
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item v-if="!readonly" label="标段" size="mini" prop="sectionId">
                <el-select
                  v-model="formData.sectionId"
                  class="w-100pre"
                  placeholder="请选择"
                  clearable
                  @visible-change="$visibleChange($event, 'el-popper')"
                  @change="getVersion"
                >
                  <el-option
                    v-for="item in sectionOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-else label="标段" size="mini" prop="sectionId">
                <el-select
                  v-model="formData.sectionId"
                  class="w-100pre"
                  placeholder="请选择"
                  clearable
                  @visible-change="$visibleChange($event, 'el-popper')"
                  @change="getVersion"
                >
                  <el-option
                    v-for="item in sectionAllList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="计划产值" size="mini" prop="productions">
                <el-input
                  v-model="formData.productions"
                  type="number"
                  class="w-100pre"
                  show-word-limit
                  maxlength="50"
                  placeholder="请输入"
                  @input="
                    formData.productions = formData.productions.replace(
                      /^(\-)*(\d+)\.(\d{3}).*$/,
                      '$1$2.$3'
                    )
                  "
                />
              </el-form-item>
            </el-col>
            <el-col :span="1" style="line-height: 28px; font-size: 15px">
              万元
            </el-col>
            <el-col v-if="freeFlowInputShow" :span="24">
              <el-form-item label="审批人" prop="freeFlowUsers">
                <!--            <el-input-->
                <!--              disabled-->
                <!--              placeholder="请选择"-->
                <!--              v-model="formData.freeFlowUsers"-->
                <!--            >-->
                <!--              <template slot="append">-->
                <!--                <div @click="freeFlowDialogShow = true">选择</div>-->
                <!--              </template>-->
                <!--            </el-input>-->
                <user
                  v-model="formData.freeFlowUsers"
                  :readonly="readonly"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="formData.remark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注"
                  show-word-limit
                  maxlength="500"
                  :disabled="readonly"
                  class-name="taskname"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div>
                <div class="flex align-center justify-between">
                  <div class="font-w-600">计划明细</div>
                  <div>
                    <el-button
                      :disabled="selectDisabled.node || readonly"
                      type="primary"
                      icon="el-icon-plus"
                      @click="addNode('WBS节点', 'WBSjd', 'NODE')"
                    >节点</el-button>
                    <el-button
                      :disabled="selectDisabled.node || readonly"
                      type="primary"
                      icon="el-icon-plus"
                      @click="addNode('WBS作业', 'WBSzy', 'WORK')"
                    >作业</el-button>
                  </div>
                </div>
                <div class="line h-1 mt-5" />
              </div>
              <div>
                <el-table
                  v-if="showDialogTable"
                  ref="singleTable"
                  highlight-current-row
                  :data="tableData"
                  style="width: 100%"
                  row-key="id"
                  border
                  default-expand-all
                  :tree-props="{
                    children: 'children',
                    hasChildren: 'hasChildren'
                  }"
                  @row-click="(row) => changeHighlight(row)"
                >
                  <el-table-column
                    prop="name"
                    header-align="center"
                    label="名称"
                  />
                  <el-table-column
                    prop="type"
                    label="类型"
                    width="180"
                    align="center"
                  >
                    <template slot-scope="scoped">
                      <span>{{
                        $DictionaryParsing(types, scoped.row.type)
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="工程部位"
                    prop="pbsName"
                    align="center"
                  />
                  <el-table-column
                    prop="planStartDate"
                    width="150"
                    label="计划开始日期"
                    align="center"
                  >
                    <template slot-scope="scoped">
                      <span>{{
                        scoped.row.planStartDate
                          ? $dateFormat(scoped.row.planStartDate)
                          : ""
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="planEndDate"
                    width="150"
                    label="计划结束日期"
                    align="center"
                  >
                    <template slot-scope="scoped">
                      <span>{{
                        scoped.row.planEndDate
                          ? $dateFormat(scoped.row.planEndDate)
                          : ""
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="150" label="计划工期" align="center">
                    <template slot-scope="scoped">
                      {{ getAllDay(scoped.row) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="操作"
                    width="200"
                    align="center"
                  >
                    <template slot-scope="scoped">
                      <el-button
                        type="text"
                        :disabled="false"
                        class="mx-10 text-0096 pointer"
                        @click.stop="viewNode(scoped.row)"
                      >
                        查看
                      </el-button>
                      <el-button
                        :disabled="readonly"
                        type="text"
                        class="mx-10 text-0096 pointer"
                        @click.stop="editNode(scoped.row)"
                      >
                        编辑
                      </el-button>
                      <el-button
                        :disabled="readonly"
                        type="text"
                        :style="!readonly ? 'color: red' : ''"
                        @click.stop="handlerDel(scoped.row)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>

            <el-col :span="24">
              <div class="">
                <div class="flex align-center justify-between child-table-head">
                  <div class="font-w-600">工程量计划</div>
                  <el-button
                    :disabled="readonly"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addProject"
                  >新增</el-button>
                </div>
                <div class="bottom-line" />
              </div>
              <el-form ref="dataFormtable">
                <el-table
                  ref="multipleTable"
                  border
                  :data="formData.projectList"
                >
                  <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                  />
                  <el-table-column
                    label="项目（工序）名称"
                    prop="name"
                    align="center"
                    class-name="taskname"
                  >
                    <template slot-scope="{ row }">
                      <span v-if="readonly">
                        {{
                          $DictionaryParsing(
                            constructionContentOptions,
                            row.name
                          )
                            ? $DictionaryParsing(
                              constructionContentOptions,
                              row.name
                            )
                            : row.name
                        }}
                      </span>

                      <el-form-item v-else :error="row.nameError">
                        <el-select
                          v-model="row.name"
                          allow-create
                          filterable
                          default-first-option
                          @visible-change="$visibleChange($event, 'el-popper')"
                          @change="
                            tableParValueChange(row, 'name', 'nameError')
                          "
                        >
                          <el-option
                            v-for="item in constructionContentOptions"
                            :key="item.dictCode"
                            :value="item.dictCode"
                            :label="item.dictName"
                          />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="工程量"
                    prop="quantity"
                    align="center"
                    class-name="taskname"
                  >
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{ row.quantity }}</span>

                      <el-form-item v-else :error="row.quantityError">
                        <el-input
                          v-model="row.quantity"
                          placeholder="请输入"
                          type="number"
                          @blur="
                            tableParValueChange(
                              row,
                              'quantity',
                              'quantityError'
                            )
                          "
                          @input="
                            row.quantity = row.quantity.replace(
                              /^(\-)*(\d+)\.(\d{3}).*$/,
                              '$1$2.$3'
                            )
                          "
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column label="备注" prop="remark" align="center">
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{ row.remark }}</span>
                      <el-input
                        v-else
                        v-model="row.remark"
                        type="textarea"
                        :rows="1"
                        placeholder="请输入备注"
                        :disabled="readonly"
                        show-word-limit
                        maxlength="100"
                      />
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
                        type="text"
                        size="small"
                        :style="readonly ? '' : 'color: red'"
                        :disabled="readonly"
                        @click.native.prevent="
                          delProject(scope.$index, tableData)
                        "
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-col>

            <el-col :span="24">
              <div class="">
                <div class="flex align-center justify-between child-table-head">
                  <div class="font-w-600">劳动力投入计划</div>
                  <el-button
                    :disabled="readonly"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addPerson"
                  >新增</el-button>
                </div>
                <div class="bottom-line" />
              </div>
              <el-form ref="dataFormtable">
                <el-table
                  ref="multipleTable"
                  border
                  :data="formData.personList"
                >
                  <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                  />
                  <el-table-column
                    label="工种"
                    prop="type"
                    align="center"
                    class-name="taskname"
                  >
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{
                        $DictionaryParsing(WorkTypes, row.type)
                      }}</span>

                      <el-form-item v-else :error="row.typeError">
                        <el-select
                          v-model="row.type"
                          @visible-change="$visibleChange($event, 'el-popper')"
                          @change="
                            tableParValueChange(row, 'type', 'typeError')
                          "
                        >
                          <el-option
                            v-for="item in WorkTypes"
                            :key="item.dictCode"
                            :value="item.dictCode"
                            :label="item.dictName"
                          />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="投入人员（人）"
                    prop="quantity"
                    align="center"
                    class-name="taskname"
                  >
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{ row.quantity }}</span>

                      <el-form-item v-else :error="row.quantityError">
                        <el-input
                          v-model="row.quantity"
                          placeholder="请输入"
                          type="number"
                          @blur="
                            tableParValueChange(
                              row,
                              'quantity',
                              'quantityError'
                            )
                          "
                          @input="
                            () => {
                              row.quantity = formatValue(row.quantity);
                            }
                          "
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column label="备注" prop="remark" align="center">
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{ row.remark }}</span>
                      <el-input
                        v-else
                        v-model="row.remark"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="100"
                        placeholder="请输入备注"
                        :disabled="readonly"
                      />
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
                        type="text"
                        size="small"
                        :style="readonly ? '' : 'color: red'"
                        :disabled="readonly"
                        @click.native.prevent="
                          delPerson(scope.$index, tableData)
                        "
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-col>

            <el-col :span="24">
              <div class="">
                <div class="flex align-center justify-between child-table-head">
                  <div class="font-w-600">机械设备投入计划</div>
                  <el-button
                    :disabled="readonly"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addEquipment"
                  >新增</el-button>
                </div>
                <div class="bottom-line" />
              </div>
              <el-form ref="dataFormtable">
                <el-table
                  ref="multipleTable"
                  border
                  :data="formData.deviceList"
                >
                  <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                  />
                  <el-table-column
                    label="设备类型"
                    prop="type"
                    align="center"
                    class-name="taskname"
                  >
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{
                        $DictionaryParsing(Equipments, row.type)
                      }}</span>
                      <el-form-item v-else :error="row.typeError">
                        <el-select
                          v-model="row.type"
                          @visible-change="$visibleChange($event, 'el-popper')"
                          @change="
                            tableParValueChange(row, 'type', 'typeError')
                          "
                        >
                          <el-option
                            v-for="item in Equipments"
                            :key="item.dictCode"
                            :value="item.dictCode"
                            :label="item.dictName"
                          />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="设备型号"
                    prop="remark"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{ row.model }}</span>
                      <el-input
                        v-else
                        v-model="row.model"
                        :rows="1"
                        placeholder="请输入设备型号"
                        maxlength="50"
                        :disabled="readonly"
                        class-name="taskname"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="设备名称"
                    prop="remark"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{ row.name }}</span>
                      <el-input
                        v-else
                        v-model="row.name"
                        :rows="1"
                        placeholder="请输入设备名称"
                        maxlength="100"
                        :disabled="readonly"
                        class-name="taskname"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="数量"
                    prop="quantity"
                    align="center"
                    placeholder="请输入数量"
                    class-name="taskname"
                  >
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{ row.quantity }}</span>
                      <el-form-item v-else :error="row.quantityError">
                        <el-input
                          v-model="row.quantity"
                          type="number"
                          placeholder="请输入"
                          @blur="
                            tableParValueChange(
                              row,
                              'quantity',
                              'quantityError'
                            )
                          "
                          @input="
                            () => {
                              row.quantity = formatValue(row.quantity);
                            }
                          "
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column label="备注" prop="remark" align="center">
                    <template slot-scope="{ row }">
                      <span v-if="readonly">{{ row.remark }}</span>
                      <el-input
                        v-else
                        v-model="row.remark"
                        type="textarea"
                        :rows="1"
                        placeholder="请输入备注"
                        show-word-limit
                        maxlength="100"
                        :disabled="readonly"
                        class-name="taskname"
                      />
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
                        type="text"
                        size="small"
                        :disabled="readonly"
                        :style="readonly ? '' : 'color: red'"
                        @click.native.prevent="
                          delEquipment(scope.$index, tableData)
                        "
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-col>
          </el-row>
        </el-form>

        <nodeForm
          ref="nodeForm"
          :table-data="toNodeData"
          :title="nodoeTitle"
          @upload="updateSub"
        />

        <!--    <user-select-->
        <!--      :show.sync="freeFlowDialogShow"-->
        <!--      @user-checked="getFreeFlowUsers"-->
        <!--      :multiEnable="true"-->
        <!--    />-->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { sectionList, update, save, getVersion } from "./api";
import { dateFormat } from "@/utils";
import nodeForm from "./nodeForm.vue";
import { getDictItemList } from "@/api/dict";
import { sectionAllList } from '@/views/bimPlus/api';
export default {
  // mixins: [FlowFormMixin],
  components: { nodeForm },
  data() {
    return {
      dialogShow: false,
      planType: "", //1年度2月度3总计划
      title: "",
      label: "",
      dateType: "",
      valueFormat: "",
      WorkTypes: [], //工种字典
      Equipments: [], //设备列表
      constructionContentOptions: [], //施工内容（工序）
      freeFlowInputShow: false,
      freeFlowUsers: "",
      freeFlowDialogShow: false,
      Node_TYPE: "",
      types: [],
      nodoeTitle: "",

      /**表单是否只读 */
      readonly: true,
      formData: {
        year: "",
        type: "",
        projectList: [], //工程量列表
        personList: [], //劳动力投入列表
        deviceList: [] //设备列表
      },
      // 控制节点/作业   几点下可以添加任何  作业下不能添加任何
      selectDisabled: {
        node: false,
        work: false
      },
      formDataRules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blur"
          }
        ],
        year: [
          {
            required: true,
            message: "请输入年份",
            trigger: "change"
          }
        ],
        version: [
          {
            required: true,
            message: "请输入版本",
            trigger: "change"
          }
        ],
        sectionId: [
          {
            required: true,
            message: "请选择标段",
            trigger: "change"
          }
        ],
        productions: [
          {
            required: true,
            message: "请输入计划产值",
            trigger: "blur"
          }
        ],
        freeFlowUsers: [
          { required: true, message: "请选择", trigger: "change" }
        ]
      },
      /**施工标段 */
      sectionOptions: [],
      sectionAllList: [],
      tableData: [],
      toNodeData: [],
      currentRow: null, //选中行
      isAdd: true, //是否新增 给发送请求使用 这里监听的是年份切换 过滤到了数据代表这个不是新增 是修改
      showDialogTable: true,
      nodeAddOredit: "", //用于判断的节点是编辑还是新增 ,true 新增   false  编辑
      /**接口地址：对应list接口 */
      url: {
        list: "/api/schedule/management/page"
      }
    };
  },
  watch: {
    currentRow(value) {
      // 如果当前选中行是作业 就都不能添加
      console.log("currentRow", value);
      if (value?.workType == "WORK") {
        this.selectDisabled.node = true;
        this.selectDisabled.work = true;
      } else {
        // 包括 value ==null|| NODE
        this.selectDisabled.node = false;
        this.selectDisabled.work = false;
      }
    }
  },
  created() {
    this.getSectionList();
    this.getSectionAllList();
    this.getTypeDit();
    this.getWorkType();
    this.getEquipment();
    this.getConstructionContent();
  },
  destroyed() {
    this.$clearStorage("ProgressPlanItem");
  },
  methods: {
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
    /**获取工种字典 */
    async getWorkType() {
      const { data } = await getDictItemList("TYPE_OF_WORKk");
      this.WorkTypes = data;
    },
    /**获取设备字典 */
    async getEquipment() {
      const { data } = await getDictItemList("EQUIPMENT");
      this.Equipments = data;
    },
    /**获取施工内容字典 */
    async getConstructionContent() {
      const { data } = await getDictItemList("CONSTRUCTION_CONTENT");
      this.constructionContentOptions = data;
    },
    /** 新增工程 */
    addProject() {
      this.formData.projectList.push({
        name: "",
        quantity: "",
        remark: ""
      });
    },
    async delProject(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      });
      if (this.formData.projectList) {
        this.formData.projectList.splice(index, 1);
      }
    },
    /** 新增人力 */
    addPerson() {
      this.formData.personList.push({
        type: "",
        quantity: "",
        remark: ""
      });
    },
    async delPerson(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      });
      this.formData.personList.splice(index, 1);
    },
    // table 添加设备
    addEquipment() {
      this.formData.deviceList.push({
        type: "",
        quantity: "",
        model: "",
        name: "",
        remark: ""
      });
      console.log("this.deviceList", this.formData);
    },
    async delEquipment(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      });
      this.formData.deviceList.splice(index, 1);
      console.log("this.deviceList", this.formData);
    },
    getFreeFlowUsers(data) {
      this.freeFlowUsers = data.valueText;
      this.$set(this.formData, "freeFlowUsers", data.text);
    },
    /**获取分类字典 */
    async getTypeDit() {
      let types = this.$getStorage("ProgressPlan_types");
      console.log("获取分类字典", types);
      if (types) {
        this.types = types;
      } else {
        let res1 = await this.$store.dispatch("dict/get", "WBSjd");
        let res2 = await this.$store.dispatch("dict/get", "WBSjd");
        this.types = [...res1, ...res2];
      }
    },

    /**
     * 获取表单数据
     */
    getFormData(row) {
      console.log("获取表单数据1", row);

      if (row) {
        this.formData = { ...row };
        this.$nextTick(() => {
          // 审批人
          let b = row.createUser == this.$getStorage("userInfo").userId;
          console.log("是否显示审批人", b, this.readonly);
          this.freeFlowInputShow = b && !this.readonly;
        });
      } else {
        this.$nextTick(() => {
          this.freeFlowInputShow = true;
          0;
        });
      }
      if (row && row.subDetail) {
        this.tableData = row.subDetail;
      }
    },
    changeHighlight(row) {
      if (this.currentRow?.id && row.id == this.currentRow.id) {
        this.$refs.singleTable.setCurrentRow(null);
        this.currentRow = null;
      } else {
        this.currentRow = row;
      }
    },

    // 当编辑或则添加完成 回调 需要知道的是
    // 新增  是节点新增  还是根目录新增
    // 编辑 不需要知道直接编辑当前节点
    updateSub(value) {
      value.workType = this.Node_TYPE;
      console.log("需要添加的子表数据", value);
      console.log("回调新增还是编辑", this.nodeAddOredit, value);
      // 更新回调 nodeAddOredit  true 新增 false 编辑
      if (this.nodeAddOredit) {
        // 没有选 就是新增根目录
        if (!this.currentRow) {
          value.id = this.generateUniqueId(16);
          this.tableData.push(value);
        } else {
          // 有选得情况下 就需要往对应的下面放数据了
          // 递归找出数据这个数据的位置 然后晒数据
          // 使用递归函数
          this.showDialogTable = false;
          // 新增 为了能呈现在表格上必须有唯一的id
          value.id = this.generateUniqueId(16);
          this.searchNodeAdd(this.tableData, value); //找出当前的
          console.log("更改后的数据", this.tableData);
          this.tableData = [...this.tableData];
          this.showDialogTable = true;
          this.$forceUpdate();
        }
      } else {
        // 编辑
        this.showDialogTable = false;
        // 新增 为了能呈现在表格上必须有唯一的id
        // value.id = this.generateUniqueId(16);
        this.searchNodeEdit(this.tableData, value); //找出当前的
        console.log("更改后的数据", this.tableData);
        this.tableData = [...this.tableData];
        this.showDialogTable = true;
        this.$forceUpdate();
      }

      this.currentRow = null;
    },
    // 产生一个16位的随机数字id
    generateUniqueId(n) {
      let num = "";
      for (let i = 0; i < n; i++) {
        num = num + Math.floor(Math.random() * 10);
      }
      return num;
    },
    // 递归出当前的节点位置 新增
    searchNodeAdd(tableData, node) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id == node.pid) {
          if (Object.prototype.hasOwnProperty.call(tableData[i], "children")) {
            let index = tableData[i].children?.length;
            this.$set(tableData[i].children, index, node);
          } else {
            tableData[i].children = [node];
          }
          return;
        }
        if (tableData[i].children) {
          this.searchNodeAdd(tableData[i].children, node);
        }
      }
    },
    // 递归出当前的节点位置 编辑
    searchNodeEdit(tableData, node) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id == node.id) {
          tableData[i] = node;
          return;
        }
        if (tableData[i].children) {
          this.searchNodeEdit(tableData[i].children, node);
        }
      }
    },
    // 新增 节点 但是新增 节点也分为新增子节点 还是新增跟节点
    addNode(type, code, nodeOrwork) {
      console.log("addNode", this.currentRow);
      this.nodoeTitle = type;
      this.$nextTick(() => {
        this.nodeAddOredit = true;
        // 传递分类字典 cede
        let selectItem = this.currentRow || null;
        this.$refs.nodeForm.add(code, selectItem, null);
        this.$refs.nodeForm.dialogType = nodeOrwork;
        this.Node_TYPE = nodeOrwork;
      });
    },
    // 查看节点
    viewNode(node) {
      this.nodeAddOredit = false;
      console.log("viewNode", node);
      let code = node.workType == "WORK" ? "WBSzy" : "WBSjd";
      this.nodoeTitle = "查看";
      this.$nextTick(() => {
        // 传递分类字典 cede
        this.$refs.nodeForm.view(node, code);
      });
    },
    // 修改节点
    editNode(node) {
      this.nodeAddOredit = false;
      console.log("editNode", node);
      let code = node.workType == "WORK" ? "WBSzy" : "WBSjd";
      this.nodoeTitle = "编辑";
      this.$nextTick(() => {
        // 传递分类字典 cede
        this.$refs.nodeForm.edit(node, code);
      });
    },
    // 递归出当前的节点位置 删除节点
    handlerDel(row) {
      console.log("需要删除的数据", row);
      if (row?.children?.length > 0) {
        this.$message.warning("禁止删除有子集的节点");
        return;
      }
      this.searchNodeDel(this.tableData, row); //找出当前的
      console.log("更改后的数据", this.tableData);
      this.tableData = [...this.tableData];
      this.showDialogTable = true;
      if (this.currentRow?.id && row.id == this.currentRow.id) {
        this.$refs.singleTable.setCurrentRow(null);
        this.currentRow = null;
      }
      this.$forceUpdate();
    },

    // 递归出当前的节点位置 编辑
    searchNodeDel(tableData, node) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id == node.id) {
          tableData.splice(i, 1);
          return;
        }
        if (tableData[i].children) {
          this.searchNodeDel(tableData[i].children, node);
        }
      }
    },

    getAllDay(row) {
      // 计算两个时间戳 相差多少天
      let start = row.planStartDate;
      let end = row.planEndDate;
      let days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return days;
    },

    getYear() {
      this.formData.year = dateFormat(new Date(), "yyyy");
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
    getSectionAllList() {
      sectionAllList({}).then((res) => {
        console.log(res);
        if (res.success) {
          this.sectionAllList = res.data;
        }
      });
    },
    /**获取版本 */
    getVersion(e) {
      // 总计划才获取版本
      if (this.planType === 3) {
        getVersion({ sectionId: e }).then((res) => {
          this.$set(this.formData, "version", res);
        });
      }
    },
    // 递归成一维数组
    getTreeData(data, arr = []) {
      // 数据展开成为一维度   递归
      data.forEach((item) => {
        arr.push(item);
        if (item?.children?.length > 0) {
          let children = item?.children;
          this.getTreeData(children, arr);
        }
      });
      return arr;
    },
    // 递归成一维数组 并且加入baseID
    getArr(data, arr = [], baseId) {
      // 数据展开成为一维度   递归
      data.forEach((item) => {
        item.baseId = baseId;
        arr.push(item);
        if (item?.children?.length > 0) {
          this.getArr(item.children, arr, baseId);
        }
      });
      return arr;
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
      // 校验子表
      let isok = true;
      this.formData.projectList.forEach((item, index) => {
        if (!item.name) {
          isok = false;
          this.$set(item, "nameError", "必填");
        }
        if (!item.quantity) {
          isok = false;
          this.$set(item, "quantityError", "必填");
        }
      });
      this.formData.personList.forEach((item, index) => {
        if (!item.type) {
          isok = false;
          this.$set(item, "typeError", "必填");
        }
        if (!item.quantity) {
          isok = false;
          this.$set(item, "quantityError", "必填");
        }
      });
      this.formData.deviceList.forEach((item, index) => {
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
      console.log("save fields", this.formData, this.isAdd, fields);
      // 这里递归成一维数组 并且添加base_id等于 fields.id
      let subDetailOrign = [...this.tableData];
      let subDetail = this.getArr(subDetailOrign, [], fields.id);
      console.log("subDetailsubDetail", subDetail);

      let params = {
        ...fields
      };
      params.subDetail = subDetail;

      console.log("params", params);
      //做业务数据的保存,修改。
      let requert = this.isAdd ? save : update;
      requert(params)
        .then((res) => {
          this.currentRow = null;
          const { success, message } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
            this.$message.success("新增成功");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  // .table {
  //   /deep/ .el-table__row .cell button {
  //     padding: 0 !important;
  //   }
  // }
}

.line {
  background-color: #dcdfe6;
}

/deep/ .taskname {
  .el-form-item__content {
    top: 11px !important;
  }
}

/deep/ .taskname .cell {
  // overflow: auto;
  overflow: visible;
}

.child-table-head {
  margin: 20px 0 5px 0;
}

::v-deep {
  .el-col .el-input {
    width: 100%;
  }

  .el-select.el-select--medium {
    width: 100%;
  }
}
</style>
