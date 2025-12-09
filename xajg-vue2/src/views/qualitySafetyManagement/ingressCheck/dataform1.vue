<template>
  <div>
    <el-dialog
      v-draggable
      :title="title"
      :visible.sync="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      :fullscreen="true"
      @closed="closedHandle"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文件类型" prop="type">
              <el-select
                v-model="formData.type"
                disabled
                placeholder="请选择文件类型"
                style="width: 100%"
              >
                <el-option label="原材料/中间产品进场报验单" value="material" />
                <el-option label="施工设备进场报验单" value="equipment" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年度" prop="year">
              <el-date-picker
                v-model="formData.year"
                disabled
                type="year"
                style="width: 100%"
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标段" prop="sectionId">
              <el-select
                v-model="formData.sectionId"
                class="w-100pre"
                disabled
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in sectionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报验结果" prop="testResults">
              <el-select
                v-model="formData.testResults"
                disabled
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option label="不合格" value="bhg"></el-option>
                <el-option label="合格" value="hg"></el-option>
                <el-option label="优良" value="yl"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程名称" prop="name">
              <el-input v-model="formData.name" disabled placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程编号" prop="code">
              <el-input v-model="formData.code" disabled placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="正文附件:" prop="mainAttachment">
              <uploadFile
                v-model="formData.mainAttachment"
                :limit="1"
                :disabled="data.isView"
                :multiline="false"
              >
              </uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他附件:" prop="otherAttachment">
              <uploadFile
                v-model="formData.otherAttachment"
                :limit="1"
                :disabled="data.isView"
                :multiline="false"
              >
              </uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进场时间" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                disabled
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.type == 'equipment'">
            <el-form-item label="设备用途" prop="equipmentPurpose">
              拟用于<el-input
                v-model="formData.equipmentPurpose"
                disabled
                placeholder="请输入设备用途"
                show-word-limit
                maxlength="50"
              />的施工
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.type == 'material'">
            <el-form-item label="拟用部位" prop="intendedSite">
              <el-cascader
                style="width: 100%"
                v-model="formData.intendedSite1"
                :options="intendedSiteOptions"
                disabled
                :props="intendedSiteProps"
                :show-all-levels="false"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写人" prop="initiator ">
              <user v-model="formData.initiator" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="formData.phone" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写部门" prop="unitName">
              <el-input v-model="formData.unitName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起日期" prop="initiationDate">
              <el-date-picker
                v-model="formData.initiationDate"
                disabled
                type="date"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="质量监理工程师"
              prop="qualitySupervisionEngineer"
            >
              <user v-model="formData.qualitySupervisionEngineer" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <!--    原材料/中间产品进场报验单-->
        <el-row
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="width: 50%; color: #000">
            {{
              formData.type == 'equipment'
                ? '施工设备进场报验单'
                : '原材料/中间产品进场报验单'
            }}
          </div>
          <div style="width: 50%; text-align: right">
            <el-button
              type="primary"
              icon="el-icon-plus"
              :disabled="data.isView"
              @click="addDetailBtn()"
            >
              添加
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="data.isView"
              @click="deleteDetailBtn()"
            >
              删除
            </el-button>
          </div>
        </el-row>
        <el-divider></el-divider>

        <el-row class="table" v-if="formData.type == 'material'">
          <el-table
            ref="multipleTable1"
            border
            :data="tableData"
            style="max-height: 50vh; overflow: auto"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="序号"
              type="selection"
              width="80"
              align="center"
            />
            <el-table-column
              label="原材料单号"
              prop="materialCode"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.materialCode" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="原材料/中间产品名称"
              prop="materialName"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.materialName" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="原材料/中间产品来源"
              prop="materialSource"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.materialSource" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="原材料/中间产品规格"
              prop="materialSpec"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.materialSpec" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="用途"
              prop="purpose"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.purpose" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="本批原材料/中间产品数量"
              prop="materialQuantity"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input
                    v-model="row.materialQuantity"
                    placeholder="请输入"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="单位"
              prop="unit"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.unit" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="试样来源"
              prop="sampleSource"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.sampleSource" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="取样地点"
              prop="sampleLocation"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.sampleLocation" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="取样日期"
              prop="sampleDate"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-date-picker
                  v-model="row.sampleDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              label="试验日期"
              prop="testDate"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-date-picker
                  v-model="row.testDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              label="试验结果"
              prop="testResult"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.testResult" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="质检负责人"
              prop="inspectorName"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.inspectorName" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="table" v-if="formData.type == 'equipment'">
          <el-table
            ref="multipleTable2"
            border
            :data="tableEquipmentData"
            style="max-height: 50vh; overflow: auto"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="序号"
              type="selection"
              width="80"
              align="center"
            />
            <el-table-column
              label="设备名称"
              prop="equipmentName"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.equipmentName" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="规格型号"
              prop="equipmentSpec"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.equipmentSpec" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              prop="equipmentQuantity"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input
                    v-model="row.equipmentQuantity"
                    placeholder="请输入"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="进场时间"
              prop="startDate"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-date-picker
                  v-model="row.startDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              label="完好状况"
              prop="conditions"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.conditions" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="设备权属"
              prop="ownership"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.ownership" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="生产能力"
              prop="capacity"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.capacity" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              prop="remark"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.remark" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closedHandle"> 取消 </el-button>
        <el-button type="primary" @click="sure" v-if="!readonly">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save, getSection, getArchiveFileCatalogueManagerTree } from './api'
import { getDictItemTree } from '@/api/dict'
import TreeSelect from '@/components/TreeSelect/index.vue'
import { FormMixin } from '@/mixins/FormMixin'
export default {
  name: 'dataform',
  mixins: [FormMixin],
  components: {
    TreeSelect
  },
  data() {
    return {
      dialogShow: false,
      intendedSiteOptions: [],
      intendedSiteProps: {
        value: 'code',
        label: 'nodeName',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
        multiple: true
      },
      formData: {},
      formDataRules: {
        testResults: [{ required: true, message: '请选择', trigger: 'change' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        year: [{ required: true, message: '请选择', trigger: 'change' }],
        name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入流程编号', trigger: 'blur' }],
        startDate: [
          { required: true, message: '请选择进场时间', trigger: 'change' }
        ],
        equipmentPurpose: [
          { required: true, message: '请输入设备用途', trigger: 'blur' }
        ],
        intendedSite: [
          { validator: this.validateIntendedSite, required: true }
        ],
        qualitySupervisionEngineer: [
          {
            required: true,
            message: '请选择质量监理工程师',
            trigger: 'change'
          }
        ],
        sectionId: [
          { required: true, message: '请选择标段', trigger: 'change' }
        ]
      },
      belongUnit: [],
      attachmentList: [],
      tableData: [],
      tableEquipmentData: [],
      multipleSelection: [],
      sectionList: []
    }
  },
  computed: {
    userInfo() {
      return this.$getStorage('userInfo')
    }
  },
  created() {
    this.getDictItemList()
    this.getSectionList()
  },
  mounted() {},
  props: {
    view: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    initSection() {
      if (this.formData.sectionId) {
        this.changeSection(this.formData.sectionId)
      }
    },
    changeSection(sectionId) {
      this.initIntendedSiteOptions(sectionId)
    },
    async initIntendedSiteOptions(sectionId) {
      let params = {}
      params.sectionIds = sectionId
      await this.getArchiveFileCatalogueManagerTree(params)
    },

    async getArchiveFileCatalogueManagerTree(params) {
      try {
        const { data, success, message } =
          await getArchiveFileCatalogueManagerTree(params)
        if (!success) {
          this.$message.error('获取目录树失败：' + message)
          return false
        }
        this.intendedSiteOptions = data[0].children
        return data
      } catch (err) {
        console.error(err)
        this.$message.error('获取目录树失败')
        return false
      }
    },
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSection({
          corpId: corporateId
        })

        if (!success) {
          this.$message.error('查询标段失败：' + message)
          return false
        }
        this.sectionList = data
        return data
      } catch (err) {
        console.error(err)
        this.$message.error('查询标段失败')
        return false
      }
    },
    /**获取字典 */
    async getDictItemList() {
      const attachments = await getDictItemTree('ATTACHMENT_TYPE')
      this.attachmentList = attachments.data
    },

    addDetailBtn() {
      if (this.formData.type == 'material') {
        this.tableData.push({})
      } else if (this.formData.type == 'equipment') {
        this.tableEquipmentData.push({})
      }
    },
    async deleteDetailBtn() {
      await this.$confirm(`确认删除数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
      // 删除选中的数据
      this.multipleSelection.forEach((selectedItem) => {
        if (this.formData.type == 'material') {
          const index = this.tableData.indexOf(selectedItem)
          if (index > -1) {
            this.tableData.splice(index, 1)
          }
        } else if (this.formData.type == 'equipment') {
          const index = this.tableEquipmentData.indexOf(selectedItem)
          if (index > -1) {
            this.tableEquipmentData.splice(index, 1)
          }
        }
      })
      // 清空选中的数据
      this.multipleSelection = []
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    validateIntendedSite(rule, value, callback) {
      if (!this.formData.intendedSite1) {
        callback(new Error('请输入拟用部位'))
      } else {
        callback()
      }
    },
    sure() {
      this.$refs['dataFormRef'].validate((valid) => {
        if (valid) {
          const fields = Object.assign({}, this.formData)
          if (this.formData.fileList && this.formData.fileList.length > 0) {
            fields.fileList = JSON.stringify(this.formData.fileList)
          }
          if (
            this.formData.intendedSite1 &&
            this.formData.intendedSite1.length > 0
          ) {
            fields.intendedSite1 = JSON.stringify(this.formData.intendedSite1)
          }
          if (this.tableData && this.tableData.length > 0) {
            fields.detailVos = this.tableData
          }
          if (this.tableEquipmentData && this.tableEquipmentData.length > 0) {
            fields.equipmentVos = this.tableEquipmentData
          }
          save(fields).then((res) => {
            if (res.success) {
              this.$message.success('修改成功')
              this.closedHandle()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    closedHandle() {
      this.$emit('sureson')
      this.dialogShow = false
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        this.dialogShow = newValue
        if (newValue) {
          this.$nextTick(() => {
            this.formData = this.data.data
            this.formData.intendedSite1 = JSON.parse(
              this.formData.intendedSite1
            )
            if (this.formData.detailVos) {
              this.tableData = this.formData.detailVos
            }
            this.initSection()
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
// 单独处理  上传样式

/deep/ .custom-disabled {
  .upload-demo {
    display: none;
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
