<template>
  <div>
    <div class="offect-item">
      <span>模型：</span>
      <a-select style="width: 120px" class="offect-set" v-model="modelSelect" placeholder="选择要偏移的模型">
        <a-select-option v-for="value,index in modelList" :key="index" :value="value.id">
          {{ value.docName }}
        </a-select-option>
      </a-select>
    </div>
    <div class="offect-item">  
      <span>X轴：</span>
      <a-row class="offect-set">
        <a-col :span="14">
          <a-slider :min="-10" :max="10" :step="0.01" :included="false" :default-value="0" v-model="offectX" @change="onChangeX" />
        </a-col>
        <a-col :span="4">
          <a-input-number v-model="offectX" :min="-10" :max="10" style="marginLeft: 16px" @change="onChangeX"/>
        </a-col>
      </a-row>
    </div>
    <div class="offect-item">
      <span>Y轴：</span>
      <a-row class="offect-set">
        <a-col :span="14">
          <a-slider :min="-10" :max="10" :step="0.01" :included="false" :default-value="0" v-model="offectY" @change="onChangeY"/>
        </a-col>
        <a-col :span="4">
          <a-input-number v-model="offectY" :min="-10" :max="10" style="marginLeft: 16px" @change="onChangeY"/>
        </a-col>
      </a-row>
        
    </div>
    <div class="offect-item">
      <span>Z轴：</span>
      <a-row class="offect-set">
        <a-col :span="14">
          <a-slider :min="-10" :max="10" :step="0.01" :included="false" :default-value="0" v-model="offectZ" @change="onChangeZ"/>
        </a-col>
        <a-col :span="4">
          <a-input-number v-model="offectZ" :min="-10" :max="10" style="marginLeft: 16px" @change="onChangeZ"/>
        </a-col>
      </a-row>
        
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelOffect',
  props: {
    projectMessage: {
      type: Object
    },
    modelList: {
      type: Array
    }
  },
  data(){
    return{
        modelSelect: [],
        offectX: 0,
        offectY: 0,
        offectZ: 0
    }
  },
  methods:{
      onChangeX(value){
        if(!this.modelSelect){
          this.$message.warning('请先选择模型！')
          this.offectX = 0
          return
        }
        this.$api.Model.OffsetModel(value,0,0,  this.modelSelect)
        this.offectX = 0
      },
      onChangeY(value){
        if(!this.modelSelect){
          this.$message.warning('请先选择模型！')
          this.offectY = 0
          return
        }
        this.$api.Model.OffsetModel(0,value,0,  this.modelSelect)
        this.offectY = 0
      },
      onChangeZ(value){
        if(!this.modelSelect){
          this.$message.warning('请先选择模型！')
          this.offectZ = 0
          return
        }
        this.$api.Model.OffsetModel(0,0,value, this.modelSelect)
        this.offectZ = 0
      }
  }
}
</script>

<style lang="scss" scoped>
  .offect-item{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
    span{
      width: 20%;
      text-align: right;
    }
    .offect-set{
      flex: 1;
      /deep/.ant-select-selection{
        background-color: transparent;
        color: #ffffff;
        
      }
      /deep/.ant-select-arrow{
        color: #ffffff;
      }
    }
  }
</style>