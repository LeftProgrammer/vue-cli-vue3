<template>
  <div @contextmenu.prevent="">
    <a-drawer
      :title="param.type == 0 ? '整体链接' : '局部链接'"
      :width="300"
      placement="left"
      :maskClosable="false"
      :destroyOnClose="true"
      :mask="false"
      :visible="param.visible"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
      @close="onClose"
      :bodyStyle="{ padding: '10px' }"
    >
      <div style="display: flex; justify-content: flex-end">
        <a-button
          v-show="folderPermission.hasEdit"
          type="primary"
          @click="addFile(param.type)"
          style="margin-bottom: 10px"
          >新增</a-button
        >
      </div>
      <div class="box">
        <vue-scroll>
          <a-table
            id="table1"
            :columns="columns"
            :rowKey="(record) => record.id"
            :data-source="tableData"
            :pagination="false"
            @change="handleTableChange"
            :showHeader="false"
            :bordered="false"
            size="middle"
            :locale="{ emptyText: '暂无数据' }"
          >
            <div slot="renderFileName" slot-scope="text, record" :title="text">
              <a v-if="previewFiles.indexOf(record.suffix) >= 0" @click="openView(record)">
                {{ text }}
              </a>
              <span v-else>{{ text }}</span>
            </div>
            <div slot="renderSize" slot-scope="text">{{ (text / 1024).toFixed(1) }}KB</div>
            <div slot="renderAction" slot-scope="text">
              <a-popconfirm
                title="确定删除吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirm"
                :disabled="!folderPermission.hasEdit"
              >
                <a-button
                  type="link"
                  @click="DeleteFile(text)"
                  :disabled="!folderPermission.hasEdit"
                  size="small"
                  title="删除"
                >
                  <a-icon type="delete" />
                </a-button>
              </a-popconfirm>
            </div>
          </a-table>
        </vue-scroll>
      </div>
    </a-drawer>
    <a-modal
      :visible="openData.visible"
      :footer="null"
      :mask="false"
      :maskClosable="false"
      :destroyOnClose="true"
      @cancel="openData.visible = false"
      :width="openData.width"
      :height="openData.height"
      :forceRender="true"
      :dialog-style="{ top: '0', left: '0', width: 'calc(100% - 240px)', height: 'calc(100% - 65px)' }"
      id="viewDoc"
    >
      <share-audio
        v-if="['.mp3', '.mpga', '.mpe'].includes(openData.Document.suffix)"
        :fileName="openData.Document.blobName + openData.Document.suffix"
        :share="false"
      />
      <share-img
        v-else-if="['.jpe', '.jpeg', '.jpg', '.gif', '.png'].includes(openData.Document.suffix)"
        :fileName="openData.Document.blobName + openData.Document.suffix"
        :share="false"
      />
      <share-video
        v-else-if="['.mp4', '.mpe'].includes(openData.Document.suffix)"
        :fileName="openData.Document.blobName + openData.Document.suffix"
        :share="false"
      />
      <share-pdf
        v-else-if="['.pdf'].includes(openData.Document.suffix)"
        :fileName="openData.Document.blobName + openData.Document.suffix"
        :share="false"
      />
      <share-excel
        v-else-if="['.xlsx', '.xls'].includes(openData.Document.suffix)"
        :fileName="openData.Document.blobName + openData.Document.suffix"
        :share="false"
      />
      <share-word
        v-else-if="['.docx'].includes(openData.Document.suffix)"
        :fileName="openData.Document.blobName + openData.Document.suffix"
        :share="false"
      />
      <share-text
        v-else-if="['.txt'].includes(openData.Document.suffix)"
        :fileName="openData.Document.blobName + openData.Document.suffix"
        :share="false"
      />
      <alert v-else :share="false"></alert>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '标题',
    dataIndex: 'fileName',
    key: 'fileName',
    scopedSlots: { customRender: 'renderFileName' },
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'renderAction' },
    width: '50px',
    align: 'center',
  },
]
import FileAdd from './FileAdd.vue'
import ShareAudio from './../../business/preview/Audio.vue'
import ShareExcel from './../../business/preview/Excel.vue'
import ShareImg from './../../business/preview/Img.vue'
import SharePdf from './../../business/preview/Pdf.vue'
import ShareVideo from './../../business/preview/Video.vue'
import ShareWord from './../../business/preview/Word.vue'
import ShareText from './../../business/preview/Text.vue'
import Alert from './../../business/preview/Alert.vue'
import { getListAttach, deleteAttach } from '@/components/BimEngine/api/documentAttach'

export default {
  name: 'FileList',
  components: {
    FileAdd,
    ShareAudio,
    ShareExcel,
    ShareImg,
    SharePdf,
    ShareVideo,
    ShareWord,
    ShareText,
    Alert
  },
  data() {
    return {
      tableData: [], //整体文件链接
      pagination: { current: 1, pageSize: 1000 },
      columns,
      deleteFileId: '', //待删除的文件
      folderPermission: { hasRead: false, hasEdit: false },
      openData: {
        visible: false,
        width: 0,
        height: 0,
        Document: {
          suffix: '',
        },
      },
      previewFiles: [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.pdf',
        '.docx',
        '.xls',
        '.xlsx',
        '.mp3',
        '.mpeg',
        '.mp4',
        '.avi',
        '.txt',
      ],
    }
  },
  props: {
    param: {
      type: Object,
      default: undefined,
    },
    projectMessage: {
      type: Object,
      default: undefined,
    },
  },
  mounted() { 
    this.folderPermission.hasEdit=this.projectMessage.hasEdit
    if (this.folderPermission.hasEdit == false) {
      this.columns = [
        {
          title: '标题',
          dataIndex: 'fileName',
          key: 'fileName',
          scopedSlots: { customRender: 'renderFileName' },
          ellipsis: true,
        },
      ]
    }
    this.fetch()
    this.onResize()
    window.onresize = () => {
      this.onResize()
    }
  },
  methods: {
    //#region 整体链接
    fetch() {
      const that = this
      getListAttach({
        MaxResultCount: this.pagination.pageSize,
        SkipCount: (this.pagination.current - 1) * this.pagination.pageSize,
        category: that.param.type,
        modelId: that.projectMessage.id,
      }).then((res) => {
        const pagination = { ...this.pagination }
        pagination.total = res.totalCount
        this.tableData = res.items
        this.pagination = pagination
        if (that.param.type == 1) {
          that.CreateLabel(that.tableData)
        }
      })
    },

    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch()
    },

    resetCurrenPage() {
      const totalPage = Math.ceil((this.pagination.total - 1) / this.pagination.pageSize) // 总页数
      this.pagination.current = this.pagination.current > totalPage ? totalPage : this.pagination.current
      this.pagination.current = this.pagination.current < 1 ? 1 : this.pagination.current
    },

    DeleteFile(id) {
      this.deleteFileId = id
    },
    confirm(e) {
      const that = this
      deleteAttach(this.deleteFileId).then((res) => {
        that.$message.success('删除成功')
        that.resetCurrenPage()
        that.fetch()
      })
    },
    //#endregion

    CreateLabel(list) {
      const that = this       
      this.$api.Lable.DeleteAllCustomLabel() //删除所有标签
      const array = []
      list.forEach(function (item) {         
        var copy = { id: item.id, position: item.position,blobName:item.blobName,suffix:item.suffix,modelId:item.modelId }
        if (item.fileName.length > 12) {
          copy.fileName = item.fileName.substring(0, 12)
        } else {
          copy.fileName = item.fileName
        }
        array.push(copy)
      })

      array.forEach(function (item) {
        setTimeout(() => {
          var html = `<div style="position: relative;width:100px;height: 50px;margin-left: 0px;margin-top: 0px; padding: 0px;">
                      <div style="position: absolute;left: 80px;top: -14px;border: 1px solid #FFFFFF; line-height: 22px;border-radius: 6px;padding: 2px 6px;background-color: rgba(0,0,1,0.1);color: #FFFFFF;">                         
                        <div style="width:86px;word-wrap: break-word; word-break: normal;">${item.fileName}</div>                        
                      </div>
                      <div style="width:50px;height:50px;position: absolute;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px"><line x1="100%" y1="0" x2="0" y2="100%" stroke="#FFFFFF" stroke-width="1"></line></svg>
                      </div>
                      <div style="width: 30px;height: 30px;position: absolute;left: 50px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px"><line x1="100%" y1="0" x2="0" y2="0" stroke="#FFFFFF" stroke-width="2"></line></svg>
                      </div>
                    </div>`
          that.$api.Lable.AddCustomLabel({
            id: item.id,
            axisType: 1,  
            position: JSON.parse(item.position),  
            html: html,  
            onClick:function(options,target){
              that.openView(item)
              //console.log(JSON.stringify(item))
            }
          })
        }, 100)
      })
    },
    onClose() {
      this.visible = false
      this.$emit('changeDrawer')
    },

    addFile(val) {
      const that = this
      that.$notification.open({
        key: 'EngineKey',
        message: `${val == 0 ? '整体' : '局部'}文件链接`,
        description: <file-add ref="refFile" type={val} projectMessage={that.projectMessage} fetch={that.fetch} />,
        class: 'engine-notification',
        duration: null,
        onClose: () => {
          that.$refs.refFile.ClearLabel()
        },
      })
    },
    //浏览
    openView(info) {
      this.onResize()
      this.openData.visible = true
      this.openData.Document = info
    },
    onResize() {
      this.openData.width = window.innerWidth - 222
      this.openData.heigth = window.innerHeight - 176
    },
  },
}
</script>
<style lang="scss" scoped> 
/deep/.ant-drawer-content,.ant-drawer-header{
  background:#001529cc;
  .ant-drawer-header{
    background:#001529cc;
    border-bottom:1px solid #5a738b
  }  
  .ant-drawer-title{
    color: #00ffc5;
  }
  .ant-drawer-close{
    color: #fff;
  }
}
/deep/.ant-tabs-nav-scroll{
  width: 100%;
  text-align: center;
}
/deep/.ant-tabs-nav-wrap{
  color: #fff;
}
 /deep/.ant-table{
   color:#fff;    
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: #285681;
  } 
  .ant-table-tbody > tr > td{
    border-width: 0px;    
  }  
 }
#table1,#table2{   
/deep/.ant-table-middle > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td{
    padding: 6px 4px;
  }
}

.box{
  height: calc(100vh - 269px);    ;
}
/deep/.ant-table-placeholder{
  background: none;
  border-bottom-width: 0;
  color: #fff;
}

 #viewDoc{
   /deep/.ant-modal-close-x{
    width:25px;
    height:25px;
    line-height: 25px;
    border-radius: 12px;
    background-color: #e5e5e5;
    margin-top:10px;
    margin-right:10px;
  }
  /deep/.ant-modal-content{
    background-color: #f0f2f5;
  }   
 }
   /deep/.ant-modal-wrap{
   left: 220px;
   top: 65px;
 }

 /deep/a{
   color: #fff;   
 }
</style>