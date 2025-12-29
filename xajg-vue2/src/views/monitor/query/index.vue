<template>
  <div style="height: 100%; width: 100%">
    <content-layout
      :showPage="false"
      :defaultPercent="20"
      :minPercent="20"
      :useSplitpane="false"
    >
      <template slot="headerrow">
        <!--        <div class="headerrow-title">-->
        <!--          <span>监测点列表</span>-->
        <!--        </div>-->
        <div>
          <el-tabs v-model="pointType" @tab-click="tabsHandleClick">
            <el-tab-pane label="检测点全览" name="jcdql"></el-tab-pane>
            <el-tab-pane label="雨量监测" name="yljc"></el-tab-pane>
            <el-tab-pane label="气象监测" name="qxjc"></el-tab-pane>
            <el-tab-pane label="泥位监测" name="nwjc"></el-tab-pane>
            <!--            <el-tab-pane label="风速监测" name="fsjc"></el-tab-pane>-->
          </el-tabs>
        </div>
      </template>
      <template slot="tree" v-if="pointType === 'jcdql'">
        <div class="tree-content">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <el-tooltip
                class="item"
                effect="dark"
                :content="node.label"
                placement="top-start"
              >
                <span class="el-tree-node__label">
                  {{ node.label }}
                </span>
              </el-tooltip>
            </span>
          </el-tree>
        </div>
      </template>
      <template slot="table">
        <div
          class="position-relative w-100pre h-100pre"
          style="height: calc(100%) !important"
          v-show="pointType === 'jcdql'"
        >
          <div class="legend index-99">
            <div class="header">
              <div class="icon"></div>
              <div class="text">图例</div>
            </div>
            <div class="footer">
              <div v-for="item in treeData" :key="item.id" class="item">
                <div class="legend-name">{{ item.name }}</div>
                <img :src="item.legend" class="legend-icon" />
              </div>
            </div>
          </div>
          <div class="detail-container" v-if="detailObj.detailShow">
            <div class="top-dom">
              <div class="top-header">
                <div class="title" :title="detailObj.name">
                  {{ detailObj.name }}
                </div>
                <div class="close">
                  <i
                    class="el-icon-error"
                    @click.stop="detailObj.detailShow = !detailObj.detailShow"
                  ></i>
                </div>
              </div>
              <div class="top-content">
                <div class="content" v-if="detailObj.pointType != 'qxjc'">
                  <div
                    class="row"
                    v-for="(data, i) in detailObj.datalist"
                    :key="i"
                  >
                    <div class="label">{{ data.key }}：</div>
                    <div class="value">{{ data.value }}</div>
                  </div>
                </div>
                <div class="content" v-else>
                  <div
                    class="row"
                    v-for="(data, i) in detailObj.datalist"
                    :key="i"
                  >
                    <div :class="{ item: data.key2, row: !data.key2 }">
                      <div class="label">{{ data.key }}：</div>
                      <div class="value">{{ data.value }}</div>
                    </div>
                    <div class="item" v-if="data.key2">
                      <div class="label2">{{ data.key2 }}：</div>
                      <div class="value2">{{ data.value2 }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom-dom">
              <div class="bottom-header">
                <div class="title">历史数据</div>
                <div class="page">
                  <span>
                    <i
                      @click="getDetailList(detailObj, -1)"
                      class="el-icon-arrow-left"
                    >
                    </i>
                  </span>
                  <span class="pageNum">{{ detailObj.page.pageNum }}</span>
                  <span>/</span>
                  <span class="pages">{{ detailObj.page.pages }}</span>
                  <span>
                    <i
                      @click="getDetailList(detailObj, 1)"
                      class="el-icon-arrow-right"
                    >
                    </i
                  ></span>
                </div>
              </div>
              <div class="bottom-content">
                <div
                  class="data-item"
                  v-for="item in detailObj.detaillistdata || []"
                  :key="item.id"
                >
                  <template v-if="item.pointType != 'qxjc'">
                    <div class="row">
                      <div class="label">{{ item.name }}：</div>
                      <div class="value">
                        {{ toFix(item.monitorValue) }}{{ item.monitorUnit }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="row qxjc">
                      <div>
                        <div class="label">雨量：</div>
                        <div class="value">
                          {{ toFix(item.monitorValue) }}{{ item.monitorUnit }}
                        </div>
                      </div>
                      <div>
                        <div class="label2">风向数值（°）</div>
                        <div class="value2">
                          {{ Number(toFix(item.windDirection)).toFixed(0) }}
                        </div>
                      </div>
                    </div>
                    <div class="row qxjc">
                      <div>
                        <div class="label">风力：</div>
                        <div class="value">
                          {{ toFix(item.windScale, 0) }}级
                        </div>
                      </div>
                      <div>
                        <div class="label2">风速：</div>
                        <div class="value2">{{ toFix(item.windSpeed) }}m/s</div>
                      </div>
                    </div>
                  </template>
                  <div class="row">
                    <div class="label">监测时间：</div>
                    <div class="value">{{ item.monitorTime }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="mapbox">
            <div
              class="bg-map"
              :style="{ width: `${bgWidth}px` }"
              id="right-content"
            >
              <div
                class="point-place"
                v-for="item in listData"
                :key="item.id"
                :style="{
                  backgroundImage:
                    ' url(' + (item.active ? item.activeIcon : item.icon) + ')',
                  top: `calc(${item.pointPositionTop}% - 62px)`,
                  left: `calc(${item.pointPositionLeft}% - 18px)`,
                  'z-index': '1',
                }"
                @click.stop="pointClick(item)"
              >
                <div
                  v-show="item.show"
                  :class="{
                    show: item.show,
                    top: item.top,
                    left: item.left,
                    bottom: item.bottom,
                    right: item.right,
                  }"
                  class="point-content"
                  :ref="'point-content-' + item.id"
                >
                  <div class="title">
                    <div class="name">
                      {{ item.name }}
                    </div>
                    <div class="detail" @click.stop="gotoDetail(item)">
                      详情
                    </div>
                  </div>
                  <div class="content" v-if="item.data.pointType != 'qxjc'">
                    <div
                      class="row"
                      v-for="(data, i) in item.datalist"
                      :key="i"
                    >
                      <div class="label">{{ data.key }}：</div>
                      <div class="value">{{ data.value }}</div>
                    </div>
                  </div>
                  <div class="content" v-else>
                    <div
                      class="row"
                      v-for="(data, i) in item.datalist"
                      :key="i"
                    >
                      <div :class="{ item: data.key2, row: !data.key2 }">
                        <div class="label">{{ data.key }}：</div>
                        <div class="value">{{ data.value }}</div>
                      </div>
                      <div class="item" v-if="data.key2">
                        <div class="label2">{{ data.key2 }}：</div>
                        <div class="value2">{{ data.value2 }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="notjcdgl" v-if="pointType !== 'jcdql'">
          <table-layout
            :page="pageParams"
            @pageSizeChange="handleSizeChange"
            @pageCurrentChange="handleCurrentChange"
            @query="handleQuery"
            @reset="reset"
            :showSearchBtn="false"
            title="监测记录台账"
          >
            <template slot="form"></template>
            <template slot="opratebtns"></template>
            <template
              v-slot:table="{ getIndex }"
              style="height: calc(100% - 80px)"
            >
              <el-table
                ref="multipleTable"
                :data="tableData"
                height="100%"
                border
              >
                <el-table-column
                  label="序号"
                  type="index"
                  :index="getIndex"
                  width="80"
                  align="center"
                />
                <el-table-column
                  label="监测点"
                  prop="pointName"
                  align="center"
                />
                <el-table-column
                  :label="monitorNameMap[pointType]"
                  prop="monitorValue"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    {{
                      monitorNameMap[pointType] === "雨量(mm)"
                        ? Number(row.monitorValue).toFixed(2)
                        : row.monitorValue
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="pointType === 'qxjc'"
                  label="风向数值（°）"
                  prop="windDirection"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    {{ row.windDirection ? parseInt(row.windDirection) : "" }}
                  </template> </el-table-column
                >
                <el-table-column
                  v-if="pointType === 'qxjc'"
                  label="风力（级）"
                  prop="windScale"
                  align="center"
                >
                <template slot-scope="{ row }">
                  {{ row.windScale ? Number(row.windScale).toFixed(2) : "" }}
                </template> </el-table-column
                >
                <el-table-column
                  v-if="pointType === 'qxjc'"
                  label="风速（m/s）"
                  prop="windSpeed"
                  align="center"
                />
                <el-table-column
                  label="监测时间"
                  prop="monitorTime"
                  align="center"
                  width="180"
                >
                  <template slot-scope="{ row }">
                    {{
                      row.monitorTime
                        ? timeFormat(row.monitorTime, "YYYY-MM-DD HH:mm:ss")
                        : ""
                    }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </table-layout>
        </div>
      </template>
    </content-layout>
  </div>
</template>

<script>
import { page, page as getDataPage } from "../data/api";
import { list as getPointList, list as getDeviceLsit } from "../device/api";
import { dateFormat } from "@/utils";
import { BaseMixin } from "@/mixins/BaseMixin";
import ContentLayout from "@/components/ContentLayout/TreeTable";
import TableLayout from "@/components/ContentLayout/Table/index.vue";
import { ListMixin } from "@/mixins/ListMixin";

export default {
  name: "monitor-query-index",
  mixins: [BaseMixin, ListMixin],
  components: {
    TableLayout,
    ContentLayout,
  },
  data() {
    return {
      url: "",
      /**树结构默认属性 */
      defaultProps: {
        children: "children",
        label: "name",
        // isLeaf: "leaf",
      },
      treeData: [],
      //监测点列表
      listData: [],
      /**请求参数 */
      queryParams: { type: "1" },
      treeDataInited: false,
      /**展示详情 */
      detailObj: {
        detailShow: false,
        page: {
          pages: 1,
          pageNum: 1,
          pageSize: 6,
        },
      },
      detailObjPosion: {
        top: "0",
        left: "0",
      },
      queryDataParams: {
        size: 7,
        pageSize: 7,
        current: 1,
        entity: {
          params: {},
        },
        orderProperties: [{ property: "monitorTime", asc: false }],
      },
      // {
      //   show: true,
      // },
      pointType: "jcdql",
      monitorNameMap: {
        yljc: "雨量(mm)",
        qxjc: "雨量(mm)",
        nwjc: "泥水位涨幅(m)",
        fsjc: "风速(m/s)",
      },
      query: {
        params: {},
        pointCode: "",
      },

      bgWidth: 0,
    };
  },
  computed: {},
  created() {
    // this.tabsHandleClick();
  },
  mounted() {
    this.setWidth();
  },
  methods: {
    setWidth() {
      let img = new Image();
      img.src = "/static/monitor/queryMap.png";
      // 获取的 .point-dialog 下 .el-dialog__body的高度
      img.onload = () => {
        console.log("width:" + img.width + ",height:" + img.height);
        console.log("img.onload");
        let dialogHeight = document.getElementById("mapbox");
        console.log("dialogHeight:", dialogHeight.clientHeight);
        // 获取 .bg-map的高度
        this.bgWidth =
          (img.width * (dialogHeight.clientHeight - 15)) / img.height;
        console.log("bgWidth:" + this.bgWidth);
        this.initTree();
      };
    },
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    tabsHandleClick() {
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      if (this.pointType === "jcdql") {
        return;
      }
      this.query.pointCode = "";
      let data = {};
      if (this.pointType === "") {
        data = {};
      } else {
        data = { pointType: this.pointType };
      }
      getPointList(data).then((res) => {
        if (res.success) {
          this.pointTypeList = res.data.sort((a, b) => {
            return b.createDate - a.createDate;
          });
          const codes = this.pointTypeList.map((obj) => obj.code).join(",");
          let pointCode = codes + "";
          console.log(pointCode);
          this.pageParams.entity = this.query;
          this.pageParams.orderProperties = [
            {
              property: "monitorTime",
              asc: false,
            },
          ];
          const params = JSON.parse(JSON.stringify(this.pageParams));
          if (typeof pointCode === "string") {
            params.entity.pointCode = pointCode;
          }
          params.entity.queryType = "group";
          page(params).then((data) => {
            this.tableData = data.data.records;
            this.pageParams.total = data.data.total;
          });
        }
      });
    },
    toFix(value) {
      // if (!num && num != 0) {
      //   num = 2;
      // }
      // return parseFloat(value).toFixed(num);
      let len = value.toString().split(".").length;
      if (len > 0) {
        return parseFloat(value).toFixed(2);
      } else {
        return parseFloat(value);
      }
    },
    /**详情 */
    gotoDetail(item) {
      console.log("详情", item);
      // 设置详情位置
      this.detailObjPosion.top = item.pointPositionTop;
      this.detailObjPosion.left = item.pointPositionLeft;
      this.resetDetailDataList();
      if (this.detailObj.datalist && this.detailObj.datalist.length > 0) {
        this.detailObj.detailShow = true;
        this.$set(this.detailObj, "detailShow", true);
      } else {
        this.$message({
          message: "没有查询到数据...",
          type: "warning",
        });
        return;
      }
    },
    /**获取详情数据 */
    getDetailList(item, idx) {
      let pageNum = this.detailObj.page.pageNum + idx;
      if (pageNum < 1) {
        pageNum = 1;
      }
      let queryParams = Object.assign(this.queryDataParams, {
        entity: {
          pointCode: item.code,
        },
        current: pageNum,
      });

      //查询历史数据
      getDataPage(queryParams).then((res) => {
        if (res.success) {
          this.getDetailListData(item, res);
        }
      });
    },
    /**时间格式化 */
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    /**绑定事件 */
    bindClickHande() {
      this.$nextTick(() => {
        let dom = document.querySelector("#right-content");
        dom.addEventListener("click", (e) => {
          let contDom = document.querySelector(".point-content.show");
          if (contDom && !contDom.contains(e.target)) {
            let detailDom = document.querySelector(".detail-container");
            if (!detailDom || (detailDom && !detailDom.contains(e.target))) {
              this.listData.forEach((item) => {
                item.show = false;
              });
            }
          }
        });
      });
    },
    handleNodeClick(node) {
      this.treeData.forEach((dictnode) => {
        if (node.children && node.children.length > 0) {
          if (node.id === dictnode.id) {
            node.children.forEach((item) => {
              item.active = true;
            });
          } else {
            dictnode.children.forEach((item) => {
              item.active = false;
            });
          }
        } else {
          this.listData.forEach((x) => {
            if (x.id === node.id) {
              x.active = true;
            } else {
              x.active = false;
            }
          });
        }
      });
      // console.log("treeData", this.treeData);
    },
    resetDetailDataList() {
      this.detailObj.detailShow = false;
      this.detailObj.page.current = 1;
      this.queryDataParams.current = 1;
      this.detailObj.page.pageNum = 1;
    },
    /** 图标点击时候 */
    pointClick(node) {
      let $event = event;
      let doms = document.getElementsByClassName("point-place");

      this.resetDetailDataList();
      //获取最新一条数据
      // getDataList({ pointCode: node.code }).then((res) => {
      let queryParams = Object.assign(this.queryDataParams, {
        entity: {
          pointCode: node.code,
        },
      });

      //查询历史数据
      getDataPage(queryParams).then((res) => {
        if (res.success) {
          console.log(res);
          let datas = res.data.records;

          this.listData.forEach((item) => {
            if (item === node) {
              if (datas.length > 0) {
                node.show = !node.show;
                node.datalist = this.initDataContent(node, datas[0]);
              } else {
                node.datalist = this.initDataContent(node, null);
                node.show = !node.show;
              }
              node.active = true;
            } else {
              item.show = false;
              item.active = false;
            }
          });

          this.getDetailListData(node, res);

          // 防止弹窗框被图标遮盖
          this.$nextTick(() => {
            for (let i = 0; i < doms.length; i++) {
              doms[i].style.zIndex = 1;
            }
            $event.target.style.zIndex = 2;
          });
        }
      });
    },
    getMonitorTime(row) {
      if (!row) return "";
      return row.monitorTime
        ? this.timeFormat(row.monitorTime, "YYYY-MM-DD HH:mm:ss")
        : "";
    },
    /**
     * 格式化详情数据
     */
    getDetailListData(node, res) {
      let pointType = node.pointType || node.data.pointType;
      let code = node.code || node.data.code;
      this.detailObj.name = node.name;
      this.detailObj.code = code;
      this.detailObj.pointType = pointType;
      this.detailObj.datalist = node.datalist;
      this.detailObj.page.pageNum = res.data.pageNum;
      this.detailObj.page.pages = res.data.pages;
      this.detailObj.detaillistdata = res.data.records.map((x) => {
        switch (pointType) {
          case "fsjc":
            x.name = "风速";
            break;
          case "nwjc":
            x.name = "泥水位涨幅";
            break;
          case "qxjc":
            x.name = "气象监测";
            break;
          case "yljc":
            x.name = "雨量";
            break;
        }
        x.pointType = pointType;
        x.monitorTime = this.getMonitorTime(x);
        return x;
      });
      // console.log("getDetailListData", this.detailObj.detaillistdata);
    },
    /**初始化数据数组 */
    initDataContent(node, data) {
      let datas = [];
      switch (node.data.pointType) {
        case "fsjc":
          datas = [
            {
              key: "风速",
              value: data
                ? data.monitorValue + (data.monitorUnit || "m/s")
                : "",
            },
            {
              key: "监测时间",
              value: this.getMonitorTime(data),
            },
            {
              key: "安装单位",
              value: node.data.installUnit,
            },
          ];
          break;
        case "nwjc":
          datas = [
            {
              key: "泥水位涨幅",
              value: data ? data.monitorValue + data.monitorUnit : "",
            },
            {
              key: "监测时间",
              value: this.getMonitorTime(data),
            },
            {
              key: "安装单位",
              value: node.data.installUnit,
            },
          ];
          break;
        case "qxjc":
          datas = [
            {
              key: "雨量",
              value: data
                ? Number(data.monitorValue).toFixed(2) + data.monitorUnit
                : "",
              key2: "风向",
              value2: data ? data.windDirection : "",
            },
            {
              key: "风力",
              value:
                data && data.windScale ? this.toFix(data.windScale) + "级" : "",
              key2: "风速",
              value2:
                data && data.windSpeed
                  ? this.toFix(data.windSpeed) + "m/s"
                  : "",
            },
            {
              key: "监测时间",
              value: this.getMonitorTime(data),
            },
            {
              key: "安装单位",
              value: node.data.installUnit,
            },
          ];
          break;
        case "yljc":
          datas = [
            {
              key: "雨量",
              value: data
                ? Number(data.monitorValue).toFixed(2) + data.monitorUnit
                : "",
            },
            {
              key: "监测时间",
              value: this.getMonitorTime(data),
            },
            {
              key: "安装单位",
              value: node.data.installUnit,
            },
          ];
          break;

        default:
          break;
      }
      // console.log("initDataContent", datas);
      return datas;
    },
    /**初始化 */
    initTree() {
      this.treeData = [];
      this.loadNode();
    },
    /**获取列表数据 */
    loadNode(node, resolve) {
      getDeviceLsit(this.queryParams).then((res) => {
        console.log(res);
        if (res.success) {
          let datas = res.data;
          let treeData = [];
          let listData = [];
          this.$store.dispatch("dict/get", "zxjclx").then((items) => {
            let dictItems = items.filter(x=>x.dictUpCode==='-').map((x) => {
              let curPoints = datas
                .filter((d) => d.pointType === x.dictCode)
                .map((d) => {
                  let p = {
                    data: d,
                    id: d.id,
                    code: d.code,
                    name: d.name,
                    icon: `/static/monitor/imgs/${d.pointType}2.png`,
                    legend: `/static/monitor/imgs/${d.pointType}.png`,
                    show: false,
                    active: false,
                    activeIcon: `/static/monitor/imgs/${d.pointType}2-active.png`,
                  };

                  if (d.pointPlace && d.pointPlace.indexOf(",") != -1) {
                    p.pointPositionLeft = d.pointPlace.split(",")[0];
                    p.pointPositionTop = d.pointPlace.split(",")[1];
                    let img = document.getElementById("right-content");
                    // console.log(
                    //   img.offsetWidth -
                    //     img.offsetWidth * Number(p.pointPositionLeft)/100 +
                    //     27
                    // );
                    // console.log(
                    //   img.offsetHeight * Number(p.pointPositionTop)/100 - 69
                    // );
                    p.left =
                      img.offsetWidth -
                        (img.offsetWidth * Number(p.pointPositionLeft)) / 100 +
                        27 >
                      311;
                    p.right = !p.left;
                    p.bottom =
                      (img.offsetHeight * Number(p.pointPositionTop)) / 100 -
                        69 >
                      172;
                    p.top = !p.bottom;
                    listData.push(p);
                  }

                  return p;
                });

              let item = {
                data: x,
                id: x.dictId,
                code: x.dictCode,
                name: x.dictName,
                children: curPoints,
                icon: `/static/monitor/imgs/${x.dictCode}2.png`,
                legend: `/static/monitor/imgs/${x.dictCode}.png`,
              };
              return item;
            });
            treeData.push(...dictItems);
          });
          this.treeData = treeData;
          this.listData = listData;
          this.treeDataInited = true;
          this.bindClickHande();
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
#mapbox {
  overflow-x: scroll; /* 横向滚动 */
  overflow-y: hidden; /* 禁止纵向滚动 */
  position: relative; /* 相对定位 */
  height: 100%;
  width: 100%;
}

.bg-map {
  // background-image: url("/public/static/monitor/queryMap.png");
  background-size: auto 100%; /* 高度撑满容器 */
  background-repeat: no-repeat;
  height: 100%; /* 让背景高度撑满容器 */
  position: relative;
}

::v-deep .custom-tree-node {
  width: calc(100% - 20px);
}

.headerrow-title {
  font-size: 16px;
  font-weight: 500;
  color: #1298fa;
  line-height: 20px;
  text-indent: 5px;
  border-bottom: 1px solid #e5e6eb;

  span {
    border-bottom: 2px solid #1298fa;
    height: 33px;
    display: table-cell;
  }
}

.point-place {
  width: 55px;
  height: 82px;
  position: absolute;
  background-position: left;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
}

.legend {
  background: rgba(0, 0, 0, 0.31);
  border-radius: 4px 4px 4px 4px;
  position: absolute;
  right: 15px;
  bottom: 36px;
  width: 260px;
  height: 105px;

  .header {
    height: 30px;
    display: flex;
    align-items: center;
    margin-left: 11px;
    margin-top: 8px;

    .icon {
      background: #fff;
      width: 2px;
      height: 8px;
    }

    .text {
      height: 22px;
      font-size: 16px;
      font-weight: normal;
      color: #ffffff;
      line-height: 19px;
      text-indent: 10px;
    }
  }

  .footer {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    padding-top: 8px;

    .item {
      width: 33.33%;

      font-size: 13px;
      font-weight: normal;
      color: #ffffff;
      line-height: 15px;
      text-align: center;

      .legend-icon {
        width: 22px;
        height: 33px;
        margin-top: 3px;
      }
    }
  }
}

.map {
  width: 100%; /* 确保图片填满容器 */
  height: 100%; /* 确保图片填满容器 */
}

.point {
  position: absolute;
  cursor: pointer;
  width: 54px;
  height: 83px;
  background-position: center;
  background-size: 100%;
}

.top {
  top: 82px;
}

.bottom {
  bottom: 82px;
}

.left {
  left: 27px;
}

.right {
  right: 27px;
}

.point-content {
  width: 311px;
  min-height: 146px;
  position: absolute;
  z-index: 3;
  padding: 16px 14px;
  font-size: 16px;
  font-weight: normal;
  color: #ffffff;
  line-height: 19px;
  font-family: "Microsoft YaHei";
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  background: linear-gradient(
    180deg,
    rgba(136, 159, 180, 0.2) 0%,
    rgba(58, 107, 163, 0.8) 100%
  );
  border-radius: 4px 4px 4px 4px;
  border: 1px solid;
  border-image: linear-gradient(
      180deg,
      rgba(18, 152, 250, 0.13),
      rgba(18, 152, 250, 1)
    )
    1 1;

  .title {
    font-weight: 500;
    display: flex;
    justify-content: space-between;

    .name {
      width: calc(100% - 30px);
    }

    .detail {
      cursor: pointer;
      font-size: 14px;
      font-weight: normal;
      color: #ff7d00;
      line-height: 16px;
      width: 30px;
      text-align: right;
    }
  }

  .content {
    font-weight: 400;
    margin-top: 16px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 26px;
    color: #ffffff;
    width: 100%;

    .item {
      width: 50%;
      display: flex;
      justify-content: space-between;
      padding-right: 15px;

      .label {
        text-wrap: nowrap;
      }
    }

    .label {
      text-wrap: nowrap;
    }
  }
}

.detail-container {
  position: absolute;
  z-index: 100;
  right: 0;
  top: 0;
  width: 320px;
  height: calc(100% - 32px);
  background: #f7f8fa;
  border-radius: 4px 4px 4px 4px;
  overflow: auto;
  .top-dom {
    .top-header {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
      padding: 10px 12px;
      width: 100%;
      height: 42px;

      .title {
        width: calc(100% - 20px);
        font-size: 16px;
        font-weight: normal;
        color: #1d2129;
        line-height: 19px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        //display: flex;
        //align-items: center;
        //justify-content: left;

        &::before {
          content: "";
          width: 4px;
          height: 8px;
          background: #1298fa;
          border-radius: 0px 0px 0px 0px;
          margin-right: 8px;
        }
      }

      .close {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
    }

    .title {
      font-weight: 500;
      display: flex;
      justify-content: space-between;

      .name {
        width: calc(100% - 30px);
      }

      .detail {
        cursor: pointer;
        font-size: 14px;
        font-weight: normal;
        color: #ff7d00;
        line-height: 16px;
        width: 30px;
        text-align: right;
      }
    }

    .content {
      font-weight: 400;
      padding: 12px;
      margin: 8px;
      background: #fff;
      border-radius: 4px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: normal;
      color: #86909c;
      line-height: 30px;

      .item {
        width: 50%;
        display: flex;
        justify-content: space-between;
        padding-right: 15px;

        .label {
          text-wrap: nowrap;
        }
      }

      .label {
        text-wrap: nowrap;
      }
    }
  }

  .bottom-dom {
    .bottom-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      margin: 14px;
    }

    .page {
      .pageNum {
        color: #1298fa;
      }

      span {
        padding: 0px 3px;
      }

      i {
        margin: 0px 5px;
        cursor: pointer;
      }
    }

    .data-item {
      font-size: 14px;
      font-weight: normal;
      color: #86909c;
      line-height: 30px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      margin: 8px 10px;
      padding: 8px 12px;

      .row {
        display: flex;
        justify-content: space-between;

        & > div {
          flex: 1;
          display: flex;
          text-wrap: nowrap;
          text-overflow: ellipsis;
        }

        .item {
          width: 50%;
          display: flex;
          justify-content: space-between;
          padding-right: 15px;

          .label,
          .value {
            text-wrap: nowrap;
          }
        }
      }
    }
  }
}

/deep/ .notjcdgl {
  height: calc(100% - 50px) !important;
}
</style>
