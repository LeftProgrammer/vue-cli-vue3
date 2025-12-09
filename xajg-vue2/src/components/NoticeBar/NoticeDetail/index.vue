<template>
  <div class="notice-detail">
    <div class="title">{{ pageData.noticeTitle }}</div>
    <div class="main-box">
      <div class="header">
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="item">通知类型 : {{ pageData.noticeTypeStr }}</div>
          </el-col>
          <el-col :span="6">
            <div class="item">发布人员 : {{ pageData.sendUserRealName }}</div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              发布时间 :
              {{ pageData.noticeDate ? dateFormat(pageData.noticeDate) : "--" }}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">阅读次数 : {{ pageData.readCount }}</div>
          </el-col>
          <el-col :span="24">
            <div class="item">
              通知来源 :
              {{ pageData.noticeSource ? pageData.noticeSource : "--" }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="content-box">
        <div class="split-line" />
        <div class="content-main">
          <div v-html="pageData.noticeContent" />
        </div>
      </div>
      <div class="footer">
        <el-button @click="handelGoBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormat } from '@/utils'
export default {
  name: 'NoticeDetail',
  props: {
    dataAll: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      pageData: null
    }
  },
  watch: {
    dataAll: {
      handler(val) {
        if (val) {
          this.pageData = JSON.parse(JSON.stringify(val))
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    /* 时间转换*/
    dateFormat(date) {
      return dateFormat(date, 'YYYY-MM-DD HH:mm:ss')
    },
    handelGoBack() {
      this.$emit('goBack')
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-detail {
  width: 100%;
  text-align: center;
  padding-top: 10px;

  > .title {
    font-weight: bold;
    font-size: 22px;
    line-height: 30px;
    text-align: center;
  }

  > .main-box {
    width: 900px;
    display: inline-block;

    > .header {
      width: 100%;
      margin: 20px 0 0;
      text-align: initial;

      .item {
        margin-bottom: 10px;
        color: #606266;
      }
    }

    > .content-box {
      width: 100%;

      > .split-line {
        width: 100%;
        border-top: 1px dashed #8b8b8d;
        margin-bottom: 10px;
      }

      > .content-main {
        text-align: initial;
        width: 100%;
      }
    }
  }
  .footer {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
}
</style>
