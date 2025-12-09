<template>
  <div class="page-list">
    <el-form :model="query" :inline="true" style="padding: 15px 0 0 15px">
      <el-form-item label="计划类型:">
        <el-select @visible-change="$visibleChange($event, 'el-popper')" ref="planRef" v-model="query.planType" placeholder="请选择">
          <el-option
            v-for="item in planTypeList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="计划名称:">
        <el-select @visible-change="$visibleChange($event, 'el-popper')"
          ref="planRef"
          v-model="query.planId"
          placeholder="请选择"
          @change="planChangeHandle"
          clearable
        >
          <el-option
            v-for="item in planList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <table-layout title="进度模拟" :showPage="false" class="layout">
      <template slot="table">
        <bim-engine
          :cid="bimconfig.id"
          ref="bimEngine"
          @datainited="bimDataInited"
          @inited="bimInited"
        ></bim-engine>
        <div class="oprate-container" v-if="mockObj.show">
          <div class="icon" @click="processStartClick">
            <i
              :class="
                mockObj.isPlay ? 'el-icon-video-pause' : 'el-icon-video-play'
              "
            ></i>
          </div>
          <div class="sliderline">
            <el-slider
              v-model="mockObj.sliderValue"
              :min="mockObj.sliderValueMin"
              :max="mockObj.sliderValueMax"
              :marks="mockObj.sliderMarks"
            ></el-slider>
          </div>
        </div>
      </template>
    </table-layout>

    <div class="pbstree-container" :class="{ hidden: !treeObj.show }">
      <div class="pbs-title">
        <span class="text">工程部位</span>
        <i
          class="icon"
          :class="{ 'icon-open': treeObj.show }"
          @click="treeObj.show = !treeObj.show"
        ></i>
      </div>
      <el-tree
        class="pbs-tree"
        :data="treeObj.data"
        :props="defaultProps"
        :load="loadNode"
        highlight-current
        lazy
        @node-click="handleTreeNodeClick"
      ></el-tree>
    </div>

    <div class="right-container" :class="{ hidden: !planInfo.show }">
      <div class="pbs-title">
        <i
          class="icon"
          :class="{ 'icon-open': planInfo.show }"
          @click="planInfo.show = !planInfo.show"
        ></i>
        <span class="text">计划信息</span>
      </div>
      <div class="content">
        <el-row style="margin-bottom: 10px">
          <el-col :span="13">工程部位：{{ planInfo.projectName }}</el-col>
          <el-col :span="11" style="text-align: right"
            >计划作业数量：{{ planInfo.planWorkList.length }}</el-col
          >
        </el-row>
        <el-table :data="planInfo.planWorkList" border style="width: 320px">
          <el-table-column prop="name" label="作业名称" width="130">
            <template slot-scope="{ row }">
              <el-link
                style="color: rgb(64, 158, 255)"
                @click="handleOpenDetail(row)"
                >{{ row.name }}</el-link
              >
            </template>
          </el-table-column>
          <el-table-column prop="date" label="计划施工时段"> </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      v-draggable
      :title="'作业详情'"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="25%"
    >
      <el-row>
        <el-form ref="dataFormRef" label-width="84px" :disabled="true">
          <el-row>
            <el-col :span="20">
              <el-form-item label="名称" prop="monitorPoint">
                <el-input
                  v-model="oprateRow.name"
                  placeholder="请输入"
                  width="100%"
                  maxlength="50"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="类型" prop="monitorDate">
                <el-input
                  v-model="oprateRow.type"
                  placeholder="请输入"
                  width="100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="工程部位" prop="pbsName">
                <el-input
                  v-model="oprateRow.pbsName"
                  placeholder="请输入"
                  width="100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="计划开始日期" prop="planStartDate">
                <el-input
                  v-model="oprateRow.planStartDate"
                  placeholder="请输入"
                  width="100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="计划结束日期" prop="planEndDate">
                <el-input
                  v-model="oprateRow.planEndDate"
                  placeholder="请输入"
                  width="100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="计划工期" prop="planDays">
                <el-input
                  v-model="oprateRow.planDays"
                  placeholder="请输入"
                  width="100%"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import BimEngine from "@/components/BimEngine/index";
import { bimconfig } from "@/config/bimconfig";
import {
  list,
  planAnalyze,
  managementDetail
} from "./api";
import { list as pbslist } from "@/views/project/pbs/api";
import { dateFormat, computeTimeDuration } from "@/utils";
import { getDictItemList } from "@/api/dict";

export default {
  name: "progress-mock",
  components: {
    TableLayout,
    BimEngine
  },
  data() {
    return {
      type: "",
      dialogShow: false,
      oprateRow: {},
      /**模拟相关数据 */
      mockObj: {
        show: false,
        //是否开始模拟
        isPlay: false,
        //滑条值
        sliderValue: 0,
        //滑条最小值
        sliderValueMin: 0,
        //滑条最大值
        sliderValueMax: 12,
        //标记属性
        sliderMarks: {},

        //模拟的定时器
        timer: "",
        //进度开始
        GoOn: false,
        //模型相关数据
        guidsAry: [],
        hideval: null
      },

      colorObj: {
        //普通无色
        normal: {
          red: 255,
          green: 255,
          blue: 255,
          alpha: 1
        },
        //计划颜色为黄色
        yellow: {
          red: 255,
          green: 255,
          blue: 0,
          alpha: 1
        },
        //实际颜色为绿色
        blue: {
          red: 0,
          green: 128,
          blue: 0,
          alpha: 1
        }
      },
      /**模拟相关数据 --- 结束 */

      /**右侧关联数据 --- 开始 */
      /** 计划信息 */
      planInfo: {
        show: true,
        projectName: "",
        planWorkList: []
      },

      /**右侧关联数据 --- 结束 */

      /**树结构数据 */
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeObj: {
        data: [],
        show: true
      },

      /**计划类型列表 */
      planTypeList: [
        {
          value: 0,
          name: "年度计划"
        },
        {
          value: 1,
          name: "月度计划"
        }
      ],
      /**计划列表 */
      planList: [],
      /**任务列表 */
      allTaskList: [],
      /**查询条件 */
      query: {
        planId: "",
        planType: 0
      },
      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {},
      types: []
    };
  },
  created() {
    this.getPlanList();
    this.getTypeDit();
    // console.log("this.store.state", this.$store.state);
  },
  methods: {
    /**模拟开始 */
    //滑块处理
    sliderChangeHandle(newValue, oldValue) {
      console.log(newValue, oldValue);
      //模型虚化
      if (this.$refs.bimEngine) {
        this.$refs.bimEngine.initModelAlpha();
      }
      // 3a0da9d7-8784-3cb5-f870-b037277276b4^2189262871312

      let min = this.mockObj.sliderValueMin;
      let guidsAry = this.mockObj.guidsAry;
      let arr1 = [];
      console.log(guidsAry);
      for (var i = min; i < newValue; i++) {
        if (guidsAry.length > i) {
          arr1.push(...guidsAry[i].split(","));
        }
      }
      if (arr1.length > 0) {
        console.log("arr1", arr1);
        //通过code进行渲染，计划设置为黄色 rgb(255 255 0)
        this.$refs.bimEngine.setBimcodeColor(arr1, this.colorObj.normal);
      }

      if (this.mockObj.sliderValueMax <= newValue) {
        // 自动播完后暂停
        this.mockObj.isPlay = false;
        this.ProgressPauseon();
      }
    },
    /** 点击开始 */
    processStartClick() {
      if (!this.mockObj.isPlay) {
        //当前是正在模拟
        this.mockObj.isPlay = true;
        this.start();
      } else {
        this.mockObj.isPlay = false;
        this.ProgressPauseon();
      }
    },
    /**获取分类字典 */
    async getTypeDit() {
      let res1 = await getDictItemList("WBSjd");
      let res2 = await getDictItemList("WBSzy");
      let types = [...res1.data, ...res2.data];
      this.types = types;
      console.log("获取分类字典", types);
    },

    //初始化变量
    reset() {
      this.mockObj.isPlay = false;
      // this.mockObj.GoOn = false;
      this.mockObj.timer = "";
      this.mockObj.sliderValue = this.mockObj.sliderValueMin;
      if (this.mockObj.timer) {
        clearInterval(this.mockObj.timer);
      }
    },
    start() {
      let that = this;
      // 播完之后再次点击从头播放
      if (that.mockObj.sliderValue >= that.mockObj.sliderValueMax) {
        that.mockObj.sliderValue = that.mockObj.sliderValueMin;
      }
      that.mockObj.timer = setInterval(() => {
        if (
          that.mockObj.sliderValue >= that.mockObj.guidsAry.length ||
          that.mockObj.sliderValue >= that.mockObj.sliderValueMax
        ) {
          clearInterval(that.mockObj.timer);
          that.mockObj.isPlay = false;
        }
        // 每秒播放5格
        that.mockObj.sliderValue = that.mockObj.sliderValue + 5;
      }, 1000);
    },
    //暂停
    ProgressPauseon() {
      if (this.mockObj.timer) {
        clearInterval(this.mockObj.timer);
      }
    },

    /**模拟结束 */
    /**获取列表数据 */
    loadNode(node, resolve) {
      if (!resolve) {
        this.treeObj.data = [];
      }
      let queryParams = {};
      if (node && node.data) {
        queryParams.pid = node.data.id;
      } else {
        queryParams.pid = 0;
      }
      pbslist(queryParams).then((res) => {
        if (res.success) {
          if (resolve) {
            resolve(res.data);
          }
        }
      });
    },
    /**
     * 树节点点击
     * 传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
     */
    handleTreeNodeClick(data, node, ve) {
      //展示进度数据
      if (this.query.planId) {
        planAnalyze({ id: this.query.planId, pbsCode: data.code }).then(
          (res) => {
            console.log(JSON.parse(JSON.stringify(res)));
            if (res.success) {
              this.planInfo.projectName =
                res.data.scheduleManagementDetails[0]?.pbsName;
              this.planInfo.planWorkList = res.data.scheduleManagementDetails;
              this.planInfo.planWorkList.forEach((item) => {
                item.date =
                  dateFormat(item.planStartDate, "YYYY-MM-DD") +
                  " ~ " +
                  dateFormat(item.planEndDate, "YYYY-MM-DD");
              });
            } else {
              this.initPlanInfo();
            }
          }
        );
      }
      //模型处理
      let bimCode = data.bimCode;
      if (bimCode) {
        // //通过code进行渲染
        this.$refs.bimEngine.render(bimCode);
      } else {
        // //设置bim高亮显示
        // this.$refs.bimEngine.setColor([]);
      }
    },
    /**重置数据*/
    initPlanInfo() {
      this.planInfo = {
        show: true,
        projectName: "",
        planWorkList: []
      };
    },
    /**计划选中切换时 */
    planChangeHandle(val) {
      this.mockObj.show = false;
      this.initPlanInfo();
      let item = this.planList.find((x) => x.id === val);
      console.log("planChangeHandle", item);
      if (item) {
        managementDetail({ id: this.query.planId }).then((res) => {
          console.log(JSON.parse(JSON.stringify(res)));
          if (res.success && res.data && res.data.length > 0) {
            let { marks, bimcodes, slidernum } = this.getSliderArr(res.data);
            console.log(marks, bimcodes, slidernum);
            this.mockObj.sliderMarks = marks;
            this.mockObj.sliderValueMax = slidernum;
            this.mockObj.guidsAry = bimcodes;
            //将名称转成
            this.mockObj.hideval = this.mockObj.guidsAry.length;

            this.mockObj.show = true;
          }
        });
      }
    },
    /** 打开计划详情 */
    handleOpenDetail(row) {
      console.log(row);
      this.dialogShow = true;
      // row.type = this.$DictionaryParsing(this.types, row.type) ;
      row.type = this.$DictionaryParsing(this.types, row.type);
      row.planDays = this.getAllDay(row);
      row.planStartDate = dateFormat(row.planStartDate);
      row.planEndDate = dateFormat(row.planEndDate);
      this.oprateRow = row;
    },
    //模型加载后
    bimInited() {
      console.log("bimInited");

      //模型虚化
      if (this.$refs.bimEngine) {
        this.$refs.bimEngine.initModelAlpha();
      }
    },
    bimDataInited() {
      console.log("mock bimDataInited");
      this.reset();
    },
    /**获取计划列表 */
    getPlanList() {
      this.planList = [];
      list({ id: "" }).then((res) => {
        if (res.success) {
          // 流程已完成的
          this.planList = res.data.filter((item) => item.flowStatus === 2);
        }
      });
    },
    getAllDay(row) {
      // 计算两个时间戳 相差多少天
      let start = row.planStartDate;
      let end = row.planEndDate;
      let days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return days;
    },

    //获取进度数据
    getSliderArr(datas) {
      if (!datas) datas = [];
      // 起止时间
      let start = Math.min(...datas.map((x) => x.planStartDate));
      let end = Math.max(...datas.map((x) => x.planEndDate));

      let diff = computeTimeDuration(start, end);
      let days = 0;
      if (diff) {
        days = diff.days;
      }
      // 进度条分段个数，目前设置一天一格
      let sliderNum = days;
      if (days > 0) {
        let num = Math.ceil(days / sliderNum);
        let datelist = new Array(sliderNum);
        let planBimCodes = new Array(sliderNum);
        let mockMarks = {};

        for (let i = 0; i < sliderNum; i++) {
          if (i === 0) {
            datelist[0] = new Date(start);
            planBimCodes[0] = "";
          } else {
            let predate = datelist[i - 1];
            let curdate = new Date(predate.getTime());
            datelist[i] = new Date(curdate.setDate(predate.getDate() + num));

            let codes = [];
            // 时间分段内的计划
            let items = datas.filter(
              (x) => x.planStartDate < curdate && x.planStartDate >= predate
            );
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.bimCode) {
                codes.push(...item.bimCode.split(","));
              }
            }
            planBimCodes[i] = codes.join(",");
          }
          // 每月1号作为进度条标记点
          if (datelist[i].getDate() === 1) {
            mockMarks[i] = dateFormat(datelist[i], "YYYY年MM月");
          }
        }

        // console.log(datelist, mockMarks, planBimCodes);
        return {
          marks: mockMarks,
          bimcodes: planBimCodes,
          slidernum: sliderNum
        };
      }
    }
  },
  computed: {
    //通过计划获取所有子级的任务
    // taskList() {
    //   let list = this.allTaskList;
    //   let taskList = [];
    //   if (list && list.length > 0) {
    //     taskList = list.filter((x) => x.workType === "WORK");
    //   }
    //   return taskList;
    // },
    // //时间跨度范围
    // dateRange() {
    //   let list = this.taskList;
    //   let start = new Date();
    //   let end = new Date();
    //   let days = 0;
    //   if (list && list.length > 0) {
    //     start = list.min((x) => x.planStartDate);
    //     end = list.max((x) => x.planEndDate);
    //     diff = computeTimeDuration(start, end);
    //     if (diff) {
    //       days = diff.days;
    //     }
    //   }
    //   if (days > 0) {
    //     let num = Math.floor(days / this.mockObj.sliderValueMax);
    //     // for (let i = 0; i < num; i++) {
    //     //   const element = array[i];
    //
    //     // }
    //     //每个节点时间段
    //     for (
    //       let startDate = start;
    //       startDate < end;
    //       startDate = startDate.setDate(startDate.getDate() + 1)
    //     ) {
    //       console.log(dateFormat(startDate, "yyyy-MM-dd"));
    //     }
    //
    //     //给guidsAry设置值,每个时间刻度显示与隐藏。将所有codes1和codes2进行分成30份。
    //     let pbsCodes = list.map((x) => x.pbsCode);
    //     if (pbsCodes.length > 0) {
    //       getPbsListByCode(pbsCodes.join(",")).then((res) => {
    //         if (res.success) {
    //           console.log("getPbsListByCode", res.data);
    //
    //           let codes = res.data
    //             .filter((x) => x.bimCode)
    //             .map((x) => x.bimCode);
    //           let bimcodes = [];
    //           for (let i = 0; i < codes.length; i++) {
    //             const code = codes[i];
    //             bimcodes.push(...code.split(","));
    //           }
    //
    //           let guidsAry = [];
    //           for (let i = 0; i < this.mockObj.sliderValueMax; i++) {
    //             // guidsAry[i] = codes.slice(i * num, (i + 1) * num);
    //             guidsAry[i] = codes
    //               .filter((x, index) => {
    //                 if (index >= i * num && index < (i + 1) * num) {
    //                   return true;
    //                 } else {
    //                   return false;
    //                 }
    //               })
    //               .join(",");
    //           }
    //         }
    //       });
    //     }
    //
    //     this.mockObj.guidsAry = guidsAry;
    //   }
    //   let res = {
    //     start: start,
    //     end: end,
    //     days: days,
    //   };
    //   console.log("dateRange", res);
    //   return res;
    // },
  },
  watch: {
    "mockObj.sliderValue": {
      handler(newValue, oldValue) {
        this.sliderChangeHandle(newValue, oldValue);
      },
      immediate: true
    }
  },
  destroyed() {
    if (this.mockObj.timer) {
      clearInterval(this.mockObj.timer);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-content.layout.no-form.no-header.no-page.search-open {
  height: calc(100% - 80px);
}
.page-list {
  position: relative;
  height: 100%;
  width: 100%;

  // el-tree 选中项背景颜色
  ::v-deep
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    // 设置颜色
    background-color: #e6f9ff; // 背景色
    font-weight: bold; // 字体加粗
    .el-tree-node__label {
      color: #1298fa; // 节点的字体颜色
    }
  }

  // el-tree 悬浮样式
  ::v-deep .el-tree-node__content:hover {
    .el-tree-node__label {
      color: #5bacf8;
    }
    background-color: #e8f9ff;
  }

  // el-tree 鼠标聚焦样式
  ::v-deep .el-tree-node:focus > .el-tree-node__content {
    background-color: #ffffff;
  }
}

.layout {
  height: calc(100% - 50px);
}

.pbstree-container {
  height: 70%;
  position: absolute;
  top: 75px;
  min-width: 260px;
  background: #fff;
  padding: 15px;

  .pbs-title {
    height: 40px;
    line-height: 40px;
    background: #fff;
    font-size: 1.2rem;

    .icon {
      position: absolute;
      right: 10px;
      top: 28px;
      cursor: pointer;
    }
  }

  .icon {
    cursor: pointer;
    filter: invert(0.5);
    content: url("../../../../public/iconPic/levelOne.png");
  }

  .icon-open {
    transform: rotateZ(180deg);
  }

  .pbs-tree {
    height: calc(100% - 40px);
    overflow-y: auto;
  }

  &.hidden {
    min-width: 40px;

    .text {
      display: none;
    }

    .pbs-tree {
      display: none;
    }
  }
}

.oprate-container {
  width: 90%;
  position: absolute;
  left: 5%;
  bottom: 23px;
  vertical-align: middle;
  line-height: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon {
    color: #409eff;
    height: 40px;
    width: 40px;
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .sliderline {
    width: calc(100% - 40px);
    padding-left: 15px;
  }

  ::v-deep .el-slider__runway {
    height: 10px;
    background-color: rgb(0, 192, 255);
  }

  ::v-deep .el-slider__bar {
    height: 10px;
  }

  ::v-deep .el-slider__stop {
    width: 10px;
    height: 10px;
  }

  ::v-deep .el-slider__button {
    width: 20px;
    height: 20px;
    margin-top: 3px;
  }
  ::v-deep .el-slider__marks-text {
    color: #fbfcff;
    margin-top: 10px;
    white-space: nowrap;
  }
}

// 1080p以下自适应样式
@media screen and (max-width: 1440px) {
  .oprate-container {
    bottom: 35px;
    ::v-deep .el-slider__marks-text {
      margin-top: 25px;
      line-height: 15px;
      width: 50px;
      white-space: normal;
    }
  }
}
// 1080p自适应样式
@media screen and (min-width: 1441px) and (max-width: 1920px) {
  .oprate-container {
    bottom: 35px;
    ::v-deep .el-slider__marks-text {
      margin-top: 25px;
      line-height: 15px;
      width: 50px;
      white-space: normal;
    }
  }
}

.legend-container {
  position: absolute;
  bottom: 60px;
  right: 10px;
  height: 100px;
  width: 100px;
  background: #fff;
  border-radius: 5px;

  .title,
  .span {
    height: 30px;
    display: flex;
    display: flex;
    align-items: center;
    justify-content: center;

    .text {
      margin-left: 10px;
    }
  }

  .title {
    text-align: left;
  }

  .color-span {
    width: 20px;
    height: 20px;
  }
}

/deep/ .model-list {
  display: none !important;
}

$sideBarWidth: 340px;
.right-container {
  max-height: 60%;
  position: absolute;
  top: 200px;
  right: 0;
  width: $sideBarWidth;
  background: #fff;
  padding: 15px;

  .icon {
    position: absolute;
    top: 18px;
    cursor: pointer;
    filter: invert(0.5);
    transform: rotateZ(-180deg);
    content: url("../../../../public/iconPic/levelOne.png");
  }

  .icon-open {
    transform: rotateZ(0deg);
  }

  .content {
    margin-top: 10px;
  }

  .text {
    font-size: 1.2rem;
    margin-left: 15px;
  }

  &.hidden {
    width: 40px;
    height: 50px;

    .text {
      display: none;
    }

    .content {
      display: none;
    }
  }
}
</style>
