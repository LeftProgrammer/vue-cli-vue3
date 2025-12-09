<template>
  <a-drawer
    title="动态"
    :width="300"
    placement="left"
    :maskClosable="false"
    :destroyOnClose="true"
    :mask="false"
    :visible="visible"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
    @close="onClose"
    :bodyStyle="{ padding: '20px 15px' }"
  >
    <a-timeline>
      <a-timeline-item v-for="(item, index) in dataList" :key="index">
        {{ item.creationTime }}<span style="padding-left:10px">{{ item.creatorName }}</span> 
        <div class="box">{{ item.remark }}</div>
      </a-timeline-item>       
    </a-timeline>
  </a-drawer>
</template>
<script>
import { getDocLog } from '@/components/BimEngine/api/document'
export default {
  name: 'TrendsList',
  data() {
    return {
      visible: this.show,
      dataList: [],
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    projectMessage: {
      type: Object,
      default: undefined,
    },
  },
  mounted() {
    this.GetTrendsList()
  },
  methods: {
    GetTrendsList() {
      const that = this      
      getDocLog(that.projectMessage.id).then((res) => {        
        that.dataList = res
      })
    },
    onClose() {
      this.visible = false
      this.$emit('changeDrawer')
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
/deep/.ant-timeline{
  color:#fff;
}
/deep/.ant-timeline-item-head{
  background-color:transparent;
}
/deep/.ant-timeline-item-tail{
      border-left: 1px solid #dfdfdf;
}
/deep/.ant-timeline-item-content{
  .box{
    margin-top: 6px;
    color: #dfdfdf;
  }
}
</style>


 