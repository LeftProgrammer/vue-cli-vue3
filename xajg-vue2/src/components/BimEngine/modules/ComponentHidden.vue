<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card size="small" :bordered="false" :body-style="{ padding: 0 }">
      <!-- 构件隐藏显示 -->
      <div class="box">
        <vue-scroll>
          <a-table
            :columns="columns"
            :row-key="(record) => record.id"
            :pagination="false"
            :data-source="componentList"
            :show-header="false"
            :bordered="false"
            size="middle"
            :locale="{ emptyText: '暂无数据' }"
          >
            <template slot="renderHidden" slot-scope="text, record">
              <a-switch size="small" v-model="record.isHidden" @change="onChangeHidden($event, record.id)" />
            </template>
            <template slot="renderId" slot-scope="text">
              {{ text.substring(text.lastIndexOf('^') + 1, text.left) }}
            </template>
            <template slot="renderAction" slot-scope="text, record">
              <a-button type="link" size="small" @click="onDelete(record.id)" icon="delete"></a-button>
            </template>
          </a-table>
        </vue-scroll>
      </div>
    </a-card>
  </div>
</template>
<script>
const columns = [
  {
    title: '隐藏',
    dataIndex: 'isHidden',
    scopedSlots: { customRender: 'renderHidden' },
    width: '40px',
    align: 'left',
  },
  {
    title: '构件Id',
    dataIndex: 'id',
    scopedSlots: { customRender: 'renderId' },
    ellipsis: true,
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'renderAction' },
    align: 'right',
    width: '30px',
  },
]
export default {
  name: 'ComponentHidden',
  data() {
    return {
      columns,
      componentList: [], //构件列表
    }
  },
  props: {
    store: {
      type: Object,
      default: null,
    },
    projectMessage: {
      type: Object,
      default: undefined,
    },
  },
  async mounted() {
    await this.GetComponents()
  },
  methods: {
    GetComponents() {
      const that = this
      that.$message.open({ content: '请点击拾取构件', top: `50%`, duration: 2, maxCount: 1 })
      that.store.dispatch('setLeftClickType', {
        click_type: 10,
        callback: (position) => {
          that.$api.Feature.GetFeatureByEvent(position, function (json) {
            if (json) {
              //判断是否存在componentList中
              var clickComponent = that.componentList.find((e) => {
                return e.id === json.id
              })
              if (clickComponent) {
                clickComponent.isHidden=false
              } else {
                that.componentList.push({
                  id: json.id,
                  isHidden: false,
                  modelId: that.projectMessage.modelId,
                })
              }
              that.$api.Feature.SetActorVisible(json.id, false, that.projectMessage.modelId)
            }
          })
        },
      })
    },
    onChangeHidden(checked, id) {
      const that = this
      that.$api.Feature.SetActorVisible(id, checked, that.projectMessage.modelId)
    },
    onDelete(id) {
      const that = this
      that.componentList.forEach((item, i) => {
        if (id == item.id) {
          that.componentList.splice(i, 1)
          //显示
          that.$api.Feature.SetActorVisible(id, true, that.projectMessage.modelId)
        }
      })
    },
  },
  destroyed() {
    const that = this
    that.componentList.forEach((item, i) => {
      //显示
      that.$api.Feature.SetActorVisible(item.id, true, that.projectMessage.modelId)
    })
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  },
}
</script>
<style lang="scss" scoped>   
 /deep/.ant-table{
   color:#fff;    
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: #285681;
  } 
  .ant-table-tbody > tr > td{
    border-width: 0px;    
  }  
 }
 
/deep/.ant-table-middle > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td{
    padding: 6px 4px;
  }
 /deep/.ant-table-placeholder{
   background-color:transparent ;
   border-width: 0;
   color: #fff;
 }

 .box{    
   height: calc(100vh - 290px);
 }
</style>