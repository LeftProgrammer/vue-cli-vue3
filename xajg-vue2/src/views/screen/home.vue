<template>
  <div class="home-page">
    <div class="header">
      <nav-header hidden-system />
    </div>
    <div class="content">

      <div class="bottom-box">
        <div class="info-box-wrapper">
          <div class="info-box">
            <p class="title" style="margin-bottom: 10px;"><b>项目基础信息</b></p>
            <template v-for="(item,index) in projectBasis">
              <el-link
                v-if="item.label"
                :key="item.path+index"
                class="text1"
                :underline="false"
                style="margin-bottom: 10px;"
                @click="handleProjectClick(item)"
              >{{ item.label }}</el-link>
            </template>
          </div>
          <div class="info-box">
            <p class="title">
              <b>
                <a
                  v-for="i in data"
                  :key="i.value"
                  style="position:relative;margin-right:10px;"
                  :class="{'isSelect': statusInfo === i.name}"
                  @click="handleSelectTabs(i)"
                >
                  {{ i.name }}
                  <b
                    v-if="i.name == '新闻'"
                    style="font-size:16px;position:absolute;bottom:-5px;left: 54px;color:#fff"
                  >|</b>
                </a>
              </b>
              <span @click="goBack">更多...</span>
            </p>
            <template v-for="(item,index) in newsList">
              <el-link
                v-if="item.M_BT && index < 5"
                :key="index"
                class="text"
                :underline="false"
                @click="handleNewsItemClick(item)"
              >{{ item.M_BT }}</el-link>
            </template>

          </div>
          <!-- <div class="info-box">
            <p class="title">通知</p>
            <el-link
              v-for=" i in 5"
              :key="i"
              class="text"
              :underline="false"
            >由初角砾岩、角砾岩、碎粒岩、碎粉岩</el-link>
          </div> -->
          <div v-show="false" class="info-box">
            <p class="title"><b>待办</b><span @click="$router.push({name: 'dashboard'})">更多...</span></p>
            <template v-for="(item,index) in todoList">
              <el-link
                v-if="item.title && index < 5"
                :key="index+Math.floor(Math.random()*100+1)"
                class="text"
                :underline="false"
                @click="$router.push({name: 'dashboard-index'})"
              >{{ item.title }}</el-link>
            </template>
          </div>
        </div>
        <div class="info-box-wrapper info-box-wrapper--right">
          <div class="info-box">
            <p class="title"><b>任务清单</b><span @click="$router.push({name: 'projectManagement-inventory-my',query: { permCode: 'my' }})">更多...</span></p>
            <ol>
              <li
                v-for="item in taskList"
                :key="item.id"
              >
                <div>
                  <el-link
                    class="text"
                    :underline="false"
                    @click="$router.push({name: 'projectManagement-inventory-my',query: { permCode: 'my' }})"
                  ><span class="item-title">{{ item.name }}</span>-{{ item.createUserName }}-{{ $format(item.completionDeadline) }}</el-link>
                  <el-button
                    v-if="item.status === 1"
                    type="text"
                    @click="receiveTask(item.id)"
                  >接收</el-button>
                </div>
              </li>
            </ol>
          </div>
        </div>
        <!-- <div v-for="i in asyncRoutes" :key="i.name" class="bottom-box-item">
          <div class="title">{{ i.meta.title }}</div>
          <li v-for="page in i.children" :key="page.name" @click="$router.push(i.path + '/' + page.path)">{{ page.meta.title }}</li>
          <i class="iconfont" :class="i.meta.icon" />
        </div> -->
        <div class="bottom-box-item-wrapper">
          <div
            v-for="item in menuRoutes"
            :key="item.permPid+Math.floor(Math.random()*100+1)"
            class="bottom-box-item"
            @click="handleClick(item)"
          >
            <div class="title">{{ item.permName }}<span v-if="item.permName === '个人工作台'">待办: {{ todoTaskNum }}</span></div>
            <i
              class="iconfont"
              :class="item.icon"
            />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { asyncRoutes } from '@/router'
// import { getNewReleaseList, getTaskTodo } from '@/api/notice'
import { mapGetters } from 'vuex'
// import { getTreesWithStruct } from '@/api/prediction'
// import { getTaskListByExecute, receiveTask } from '@/api/task'
export default {
  name: 'Index',
  components: {
    navHeader: () => import('./components/header')
  },
  data() {
    return {
      newsList: [],
      todoList: [],
      taskList: [],
      todoTaskNum: 0,
      data: [
        {
          name: '新闻',
          value: 'new'
        },
        {
          name: '公告',
          value: 'notice'
        }
      ],
      statusInfo: '新闻',
      projectBasis: [
        {
          label: '一、工程概况',
          value: '1',
          path: 'synth-basisInfo-projectOverview-index',
          permCode: 'synth-basisInfo-projectOverview-index'
        },
        {
          label: '二、工程建设动态信息',
          value: '2',
          path: 'synth-basisInfo-buildTrend-design',
          permCode: 'synth-basisInfo-buildTrend-design'
        },
        {
          label: '三、项目大事记',
          value: '3',
          path: 'synth-basisInfo-memorabilia-index',
          permCode: 'synth-basisInfo-memorabilia-memorabilia'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['menuRoutes']),
    routeList() {
      return asyncRoutes.filter((item) => !item.hidden)
    }
  },
  mounted() {
    this.getLimitCount('fblm:xw')
    this.getTaskTodo()
    this.$store.dispatch('user/getInfo')
    // getTreesWithStruct()
    this.getTaskListWorkPage()
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'synth-notice-list',
        query: { permCode: 'synth-notice-list' }
      })
    },
    async handleClick(route) {
      if (route.OuterChain) {
        const url = await this.getToken()
        window.open(url)
        return
      }
      if (route.children && route.children.length) {
        return this.handleClick(route.children[0])
      }
      let path = ''
      if (route.permType === 0) {
        path = `${route.dataViewConfId}?permCode=${route.permCode}`
      } else if (route.permType === 4) {
        path = `/customTable?viewId=${route.dataViewConfId}&permCode=${route.permCode}&name=${route.name}`
      }
      this.$router.push(path)
    },
    async getToken() {
      const { data } = await this.$api.getToken('')
      return data
    },
    async getLimitCount(type) {
      // try {
      //   const { success, data, message } = await getNewReleaseList({
      //     pageSize: 5,
      //     fblm: type
      //   })
      //   if (!success) {
      //     this.$message.error(message)
      //     return false
      //   }
      //   // this.newsList = (data || []).map(item => {
      //   //   return item.fieldDataVos.reduce((prev, item) => {
      //   //     prev[item.propertyName] = item.viewValue
      //   //     prev.businessId = item.businessId
      //   //     return prev
      //   //   }, {})
      //   // })
      //   this.newsList = data.records
      //   return data
      // } catch (error) {
      //   console.error(error)
      // }
    },
    async getTaskTodo() {
      // try {
      //   const { success, data, message } = await getTaskTodo({
      //     businessName: '',
      //     clientType: 'web',
      //     clientTypeOnly: true,
      //     current: 1,
      //     pageSize: 5
      //   })
      //   if (!success) {
      //     this.$message.error(message)
      //     return false
      //   }
      //   this.todoList = data.records || []
      //   this.todoTaskNum = data.total
      //   return data
      // } catch (error) {
      //   console.error(error)
      // }
    },
    async getTaskListWorkPage() {
      // try {
      //   const { data, success, message } = await getTaskListByExecute(12)

      //   if (!success) {
      //     this.$message.error('查询任务单失败：' + message)
      //     return false
      //   }
      //   this.taskList = data || []
      // } catch (error) {
      //   console.log(error)
      //   // this.$message.error('查询任务单失败')
      // }
    },
    async receiveTask(itemId) {
      // try {
      //   const { success, message } = await receiveTask(itemId)
      //   if (!success) {
      //     this.$message.error('接收任务单失败：' + message)
      //     return false
      //   }
      //   this.$message.success('接收任务单成功')
      //   // this.getTaskListWorkPage()
      // } catch (error) {
      //   console.log(error)
      //   this.$message.error('接收任务单失败')
      // }
    },
    handleNewsItemClick(item) {
      this.$router.push({
        name: 'synth-notice-detail',
        query: {
          businessId: item.M_BUSINESSID
        }
      })
    },
    handleSelectTabs(i) {
      this.statusInfo = i.name
      let str = 'fblm:xw'
      if (i.name === '公告') {
        str = 'fblm:gg'
      }
      this.getLimitCount(str)
    },
    handleProjectClick(item) {
      this.$router.push({
        name: item.path,
        query: {
          permCode: item.permCode
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100%;
  // background: linear-gradient(to bottom, #01031a 0%, #091E6D 100%);
  background-image: url("~@/assets/screen/news.jpg");
  background-position: 0 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  font-family: SourceHanSansCN;
  .header {
    height: 60px;
  }
  .content {
    width: 100%;
    height: calc(100% - 60px);
    position: relative;
    padding: 50px 60px;
    .info-box-wrapper {
      position: absolute;
      top: -24px;
      left: 0%;
      transform: translateY(-100%);
      &.info-box-wrapper--right {
        right: 0;
        left: unset;
        .info-box {
          width: 520px;
          height: 348px;
          ol {
            li {
              color: #fff;
              & > div {
                width: 100%;
                display: flex;
                align-items: center;
                .text {
                  flex: 1;
                  display: inline;
                  .item-title {
                    max-width: 50%;
                    display: inline-block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: clip;
                    vertical-align: middle;
                  }
                }
                .el-button {
                  color: #fff;
                  &:hover {
                    color: #000;
                  }
                }
              }
            }
          }
        }
      }
    }
    .info-box {
      width: 320px;
      height: 174px;
      background: #1ca38f;
      border-radius: 32px;
      opacity: 0.63;
      padding: 18px 40px;
      margin-bottom: 15px;
      .title {
        font-size: 24px;
        font-weight: 500;
        color: #f9f9f9;
        line-height: 36px;
        display: flex;
        justify-content: space-between;
        b {
          font-weight: normal;
        }
        span {
          font-size: 16px;
          cursor: pointer;
        }
        .isSelect {
          color: #034646;
        }
      }
      .text {
        font-size: 13px;
        font-weight: 500;
        color: #f9f9f9;
        line-height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        list-style: auto;
        display: list-item;
        list-style-position: inside;
        &:hover {
          color: #000000;
        }
        &:active {
          color: #034646;
        }
      }
      .text1 {
        font-size: 20px;
        font-weight: 500;
        color: #f9f9f9;
        line-height: 25px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        &:hover {
          color: #000000;
        }
        &:active {
          color: #034646;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .bottom-box {
      width: calc(100% - 120px);
      // height: 348px;

      position: absolute;
      bottom: 50px;

      // overflow: hidden;
      .bottom-box-item-wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        opacity: 0.9;
        border-radius: 20px;
        .title {
          span {
            font-size: 16px;
            cursor: pointer;
            margin-left: 20px;
            color: #f00;
          }
        }
      }
      .bottom-box-item {
        width: 20%;
        // height: 100%;
        // aspect-ratio: 360/348;
        aspect-ratio: 1/0.75;
        background: rgba(255, 255, 255, 0.7);
        padding: 24px;
        font-size: 24px;
        font-weight: 500;
        color: #034646;
        line-height: 36px;
        cursor: pointer;
        position: relative;
        li {
          font-size: 18px;
          line-height: 30px;
        }
        .iconfont {
          font-size: 48px;
          color: #60606c;
          position: absolute;
          right: 40px;
          bottom: 24px;
          font-weight: 500;
        }
      }
      .bottom-box-item:nth-child(2n) {
        background: rgba(118, 228, 222, 0.7);
        color: white;
        .iconfont {
          font-size: 48px;
          color: white;
          position: absolute;
          right: 40px;
          bottom: 24px;
        }
      }
    }
  }
}
</style>
