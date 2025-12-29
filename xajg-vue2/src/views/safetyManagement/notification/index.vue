<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      title="防汛日报"
      :page="pageParams"
      @query="handleQuery"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="通告名称:">
            <el-input v-model="pageParams.entity.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="发起日期:">
            <el-date-picker
              v-model="pageParams.entity.releaseDate"
              style="width: 100%"
              type="date"
            />
          </el-form-item>
        </el-form>
      </template>
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine')"
        >
          新增
        </el-button>
        <el-button v-if="showExportBtn" @click="handleExport">
          <svg-icon icon-class="export" class="icon" />
          导出
        </el-button>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @header-dragend="handleHeaderDragEnd"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="54"
            :selectable="isRowSelectable"
            align="center"
          />
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            fixed="left"
            width="54"
            align="center"
          />
          <el-table-column
            label="通告名称"
            prop="name"
            :min-width="$calculateWidth(180)"
            fixed="left"
          >
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                @click="
                  handelShowDialog(
                    row,
                    'fine',
                    row.procMatterTaskDone ||
                      row.matterTaskTodo ||
                      row.procMatterRun,
                    'view'
                  )
                "
              >
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="通知类型"
            prop="type"
            align="center"
            :width="$calculateWidth(120)"
          /> -->
          <el-table-column
            label="发起人"
            prop="createUsername"
            align="center"
            :width="$calculateWidth(120)"
          />
          <el-table-column
            label="发起日期"
            prop="releaseDate"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ row.releaseDate.slice(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            align="center"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="scope">
              <flow-status
                :row="scope.row"
                :flow-name="scope.row.flowName"
              />
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template #default="{ row }">
              <flow-button
                :row="row"
                :flow-name="row.flowName"
                @click="handelShowDialog"
                @delete="deleteHandle"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <flow-dialog
      :visible="flowShow"
      :flow-info="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    />
  </div>
</template>
<script>
import { page, remove, exportDoc } from './api'
import { FlowListMixin } from '@/mixins/FlowListMixin'
import TableLayout from '@/components/ContentLayout/Table'
import enums from '@/config/enums'
import { dateFormat } from '@/utils'
import moment from 'moment'
import htmlDocx from 'html-docx-js/dist/html-docx'
import saveAs from 'file-saver'
import JSZip from 'jszip'
export default {
  name: 'Notification',
  components: { TableLayout },
  mixins: [FlowListMixin],
  data() {
    return {
      pageParams: {
        orderProperties: [
          {
            property: 'createDate',
            asc: false
          }
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
        },
      },
      selectionRows: [],
      fileName: '',
      showExportBtn: false
    }
  },
  computed: {},
  created() {},
  methods: {
    dateFormat,
    moment,

    isRowSelectable(row) {
      if (row.flowStatus == 2) {
        return Boolean(true)
      } else {
        return Boolean(false)
      }
    },
    handleExport() {
      if (this.selectionRows.length == 1) {
        let page = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${this.selectionRows[0].content}        
          </body></html>`
        saveAs(
          htmlDocx.asBlob(page, {
            orientation: 'landscape' //跨域设置
          }),
          //文件名
          `${this.selectionRows[0].name}.docx`
        )
      } else {
        const htmlContents = this.selectionRows.map((item) => item.content)
        const filenames = this.selectionRows.map((item) => item.name)
        this.convertAndZipHtmls(htmlContents, filenames)
      }
    },
    htmlToDocxBlob(htmlContent) {
      // html-docx-js 需要一个完整的HTML文档结构
      const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `

      // 转换为DOCX
      const docx = htmlDocx.asBlob(fullHtml)

      return docx
    },
    async convertAndZipHtmls(htmlContents, filenames = []) {
      if (!htmlContents || !htmlContents.length) {
        console.error('No HTML content provided')
        return
      }

      // 确保文件名数组与内容数组长度一致
      const actualFilenames = htmlContents.map(
        (_, index) => `${filenames[index]}.docx`
      )

      const zip = new JSZip()

      // 为每个HTML内容创建DOCX并添加到ZIP
      for (let i = 0; i < htmlContents.length; i++) {
        const html = htmlContents[i]
        const filename = actualFilenames[i]

        try {
          const docxBlob = this.htmlToDocxBlob(html)

          // 将Blob转换为ArrayBuffer以便JSZip处理
          const arrayBuffer = await new Response(docxBlob).arrayBuffer()

          // 添加到ZIP
          zip.file(filename, arrayBuffer)
        } catch (error) {
          console.error(`Error processing document ${i + 1}:`, error)
        }
      }

      // 生成ZIP文件
      const zipContent = await zip.generateAsync({ type: 'blob' })

      // 保存ZIP文件
      saveAs(zipContent, 'documents.zip')
    },
    handleSelectionChange(val) {
      this.selectionRows = val
      if (this.selectionRows.length > 0) {
        this.showExportBtn = true
      } else {
        this.showExportBtn = false
      }
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout()
      })
    },
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage
    },
    reset() {
      this.pageParams = {
        orderProperties: [
          {
            property: 'createDate',
            asc: false
          }
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
        }
      }
      this.startTimeAndEndTime = []
      this.getTableData()
    },
    getTableData(pageInfo) {
      const pageParams = Object.assign(this.pageParams, pageInfo);
      if (pageParams.entity.releaseDate) {
        pageParams.entity.releaseDate = dateFormat(pageParams.entity.releaseDate, "YYYY-MM-DD")
        // delete pageParams.entity.date;
      }
      page(pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records
          console.log('pageParams', this.pageParams, res)
          this.pageParams.total = res.data.total
        }
      })
    },
    /**获取流程状态字典 */
    getFlowStatus() {
      let data = []
      let options = enums.FLOW_STATUS_ENUM
      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name
        })
      }
      this.flowStatusOptions = data
    },
    deleteHandle(row) {
      remove({ id: row.id }).then((res) => {
        if (res.success) {
          this.$message.success('删除成功')
          this.getTableData()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
