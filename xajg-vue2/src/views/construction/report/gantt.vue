<template>
  <div id="gantt_report"></div>
</template>
<script>
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { dateFormat } from "@/utils";

export default {
  data() {
    return {
      index: 1,
      taskId: "",
      pageConfig: {
        current: 1,
        pageSize: 20,
      },
    };
  },
  created() {
    window.clickGridButton = this.clickGridButton;
    window.inputChoose = this.inputChoose;
  },

  mounted() {
    this.setGanttConfig();
  },
  beforeDestroy() {
    // 销毁gantt
    gantt.clearAll();
    // gantt.destructor();
  },
  methods: {
    clickGridButton(id, type) {
      this.$emit("ganttHandleClick", id, type);
    },
    changeScale(value) {
      gantt.ext.zoom.setLevel(value);
    },
    //所有配置选项都在 gantt.config 对象中声明。
    // 要设置所需的选项，只需按照本文档中的说明编写即可。
    // 请注意，配置选项应该在带有 dhtmlxGantt 初始化的代码行之前。
    restGanttConfig(data) {
      console.log("🚀 ~ restGanttConfig ~ data:", data);
      gantt.init("gantt_report");
      gantt.clearAll();
      // gantt.config.show_grid = false; //隐藏表格
      gantt.config.open_split_tasks = true;

      gantt.parse({
        // data里面的部分属性的key是不能更改的，比如id，parent，start_date、end_date、progress、open
        data: data,
        // 这个是配置的
        // links里面的全部属性的key是不能更改的id source target type
        links: [
          // { id: 1, source: 2, target: 1, type: "0" },
          // { id: 2, source: 2, target: 3, type: "0" }
        ],
      });
      gantt.render();
    },
    setGanttConfig() {
      // gantt.config["scales"] = [
      //   {
      //     unit: "month",
      //     step: 1,
      //     format: "%Y年%M"
      //   },
      //   { unit: "day", step: 1, format: "%d日 周%D" }
      // ];
      // gantt.config.xml_date = "%Y-%m-%d"; // 模板可用于更改日期和标签的显示。
      gantt.i18n.setLocale("cn"); //设置日期中文显示
      gantt.templates.task_text = function (start, end, task) {
        // return 换行需要加()
        return `<b class='task_text mx-20'>${task.name}</b>`;
      };
      gantt.config.autofit = true; //列表宽度自适应
      gantt.config.autoscroll = false; //把任务或者连线拖拽到浏览器屏幕外时，自动触发滚动效果，相当于拖动滚动条
      // gantt.config.autoscroll_speed = 50;
      gantt.config.drag_move = true; //拖动移动
      gantt.config.start_on_monday = true; // 第一天将变为周日
      gantt.config.details_on_dblclick = false; //双击task时，弹出lightbox弹出框
      gantt.config.grid_width = 400; //设置左侧表格的宽度  默认是350
      gantt.config.task_height = 15; //时间轴图表中，任务条形图的高度
      gantt.config.open_tree_initially = true; //默认展开所以节点
      // gantt.config.min_column_width = 10;
      gantt.config.preserve_scroll = true; //图表刷新后，滚动条的位置跟原来保持一致
      gantt.config.scale_height = 50; //设置时间轴的高度
      // gantt.config.link_wrapper_width = 10;
      // gantt.config.prevent_default_scroll = false;//阻止鼠标滚动事件冒泡
      // gantt.config.show_links = false;// 是否显示依赖连线
      // gantt.config.show_menu = false;// 是否显示右键菜单
      gantt.config.drag_lightbox = false; //允许鼠标通过按住的lightbox头部拖拽的方式，调整lightbox的位置
      gantt.config.drag_links = false; //允许通过拖拽的方式新增任务依赖的线条
      gantt.config.drag_move = false; //允许用户拖动条形图来改变位置
      gantt.config.drag_progress = false; //允许用户推拽条形图上用来调整进度百分比的小按钮
      gantt.config.show_grid = true; //隐藏表格
      gantt.config.duration_unit = "day"; //工期计算的基本单位“minute”, “hour”, “day”, “week”, “month”, “year”
      gantt.config.open_split_tasks = true;

      //月天
      let dayScale = [
        {
          unit: "day",
          step: 1,
          format: function (date) {
            let zhouNum = gantt.date.date_to_str("%l")(date);
            let dayNum = gantt.date.date_to_str("%j")(date);
            zhouNum = zhouNum.replace("星期", "周");
            return `${dayNum} ${zhouNum}`;
          },
        },
        { unit: "month", step: 1, format: "%Y年%M" },
      ];
      //月周
      let weekscale = [
        {
          unit: "month",
          step: 1,
          format: function (date) {
            var yearNum = gantt.date.date_to_str("%Y")(date);
            var monthNum = gantt.date.date_to_str("%M")(date);
            return `${yearNum}年${monthNum}`;
          },
        },
        {
          unit: "week",
          step: 1,
          format: function (date) {
            var weekNum = gantt.date.date_to_str("%w")(date);
            return `第${weekNum}周`;
          },
        },
      ];
      //年月
      let monthScale = [
        { unit: "month", format: "%M" },
        { unit: "year", step: 1, format: "%Y年" },
      ];
      //年季
      let quarterScale = [
        { unit: "year", step: 1, format: "%Y年" },
        {
          unit: "quarter",
          step: 1,
          format: function (date) {
            var dateToStr = gantt.date.date_to_str("%M");
            var endDate = gantt.date.add(
              gantt.date.add(date, 3, "month"),
              -1,
              "day"
            );
            return dateToStr(date) + " - " + dateToStr(endDate);
          },
        },
      ];
      // 年
      let yearScale = [{ unit: "year", step: 1, format: "%Y年" }];

      var zoomConfig = {
        levels: [
          {
            name: "day",
            scale_height: 50,
            min_column_width: 50,
            scales: dayScale,
          },
          {
            name: "week",
            scale_height: 50,
            min_column_width: 60,
            scales: weekscale,
          },
          {
            name: "month",
            scale_height: 50,
            min_column_width: 90,
            scales: monthScale,
          },
          {
            name: "quarter",
            height: 50,
            min_column_width: 90,
            scales: quarterScale,
          },
          {
            name: "year",
            scale_height: 50,
            min_column_width: 30,
            scales: yearScale,
          },
        ],
      };
      gantt.ext.zoom.init(zoomConfig);
      gantt.ext.zoom.setLevel("day");
      // 初始化甘特图
      // 布局
      // 布局是通过gantt.config.layout配置选项设置的。布局的默认配置如下：
      gantt.config.layout = {
        css: "gantt_container",
        cols: [
          {
            width: 1100,
            rows: [
              {
                group: "gantt",
                cols: [
                  {
                    rows: [
                      {
                        view: "grid",
                        scrollX: "gridScrollX",
                        scrollY: "scrollVer",
                        scrollable: true,
                        class: "left-list",
                      },
                      { view: "scrollbar", id: "gridScrollX" },
                    ],
                  },
                ],
              },
            ],
          },
          { resizer: true, width: 1 },
          {
            rows: [
              {
                group: "gantt",
                cols: [
                  {
                    rows: [
                      {
                        view: "timeline",
                        scrollX: "scrollHor",
                        scrollY: "scrollVer",
                        class: "right-list",
                      },
                      { view: "scrollbar", id: "scrollHor" },
                    ],
                  },
                  { view: "scrollbar", id: "scrollVer" },
                ],
              },
            ],
          },
        ],
      };
      // 自定义网格元素
      var colContent = function (task) {
        return `<span  class='pointer text-041ACB'  onclick="clickGridButton('${
          task.id + ""
        }','report')">填报</span>
          `;
      };
      var nameContent = function (task) {
        return `
        <span  class='pointer text-041ACB ml-8'  onclick="clickGridButton('${
          task.id + ""
        }','view')">${task.name}</span>
          `;
      };
      gantt.config.columns = [
        {
          name: "code",
          label: "编码",
          tree: true,
          min_width: 120,
          max_width: 120,
          align: "left",
        },
        {
          name: "name",
          label: "名称",
          min_width: 200,
          align: "left",
          template: nameContent,
        },
        {
          name: "planDay",
          label: "原定工期",
          min_width: 100,
          max_width: 100,
          align: "center",
        },
        {
          name: "startDate",
          label: "计划开始",
          min_width: 120,
          max_width: 120,
          align: "center",
          template: (task) => {
            return dateFormat(task.startDate, "YYYY-MM-DD");
          },
        },

        {
          name: "endDate",
          label: "计划结束",
          min_width: 120,
          max_width: 120,
          align: "center",
          template: (task) => {
            return dateFormat(task.endDate, "YYYY-MM-DD");
          },
        },

        {
          name: "actualStartDate",
          label: "实际开始",
          min_width: 120,
          max_width: 120,
          align: "center",
          template: (task) => {
            if (!task.actualStartDate) return "";

            let color = "#000"; // 默认颜色
            if (task.startDate && task.actualStartDate) {
              // 比较日期，判断是早于还是晚于计划开始日期
              const planDate = new Date(task.startDate);
              const actualDate = new Date(task.actualStartDate);
              color =
                actualDate < planDate
                  ? "#00A870"
                  : actualDate > planDate
                  ? "#F53F3F"
                  : "#000";
            }
            return `<span style="color: ${color}">${dateFormat(
              task.actualStartDate,
              "YYYY-MM-DD"
            )}</span>`;
          },
        },
        {
          name: "actualEndDate",
          label: "实际结束",
          min_width: 120,
          max_width: 120,
          align: "center",
          template: (task) => {
            if (!task.actualEndDate) return "";

            let color = "#000"; // 默认颜色
            if (task.endDate && task.actualEndDate) {
              // 比较日期，判断是早于还是晚于计划结束日期
              const planDate = new Date(task.endDate);
              const actualDate = new Date(task.actualEndDate);
              color =
                actualDate < planDate
                  ? "#00A870"
                  : actualDate > planDate
                  ? "#F53F3F"
                  : "#000";
            }
            return `<span style="color: ${color}">${dateFormat(
              task.actualEndDate,
              "YYYY-MM-DD"
            )}</span>`;
          },
        },
        {
          name: "buttons",
          label: "操作",
          align: "center",
          max_width: 180,
          min_width: 180,
          template: colContent,
          resize: true,
        },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .gantt_task_content {
  text-align: left !important;
}
/deep/.gantt_layout_content {
  .gantt_grid_scale {
    background: #ebeff5;
    > div {
      font-size: 14px;
      color: #1d2129;
    }
  }
}
/deep/.gantt_task_scale {
  > div {
    background: #ebeff5;
  }
}
/deep/.gantt_grid_data .gantt_row.gantt_selected,
/deep/.gantt_grid_data .gantt_row.odd.gantt_selected,
/deep/.gantt_task_row.gantt_selected {
  background-color: #edf3fe !important;
}
/deep/.gantt_grid_data .gantt_row.odd:hover,
/deep/.gantt_grid_data .gantt_row:hover {
  background-color: #edf3fe !important;
}
/deep/.gantt_grid .gantt_grid_scale .gantt_grid_head_cell {
  border-right: 1px solid #e7e7e7 !important;
}
/deep/ .gantt_task_line {
  border-radius: 40px;
  background-color: #014acb !important;
  border: 0 !important;
  // top: 7px !important;
  // height: 20px !important;
  // line-height: 20px !important;
}
/deep/.gantt_grid .gantt_grid_data .gantt_cell {
  border-right: 1px solid #e7e7e7 !important;
}
/deep/.gantt_bar_task {
  height: 20px !important;
  line-height: 20px !important;
  // top: 7px !important;
  margin-top: 5px;
}
/deep/ .gantt_task .gantt_task_scale .gantt_scale_cell {
  color: #000 !important;
  font-weight: 550 !important;
}
</style>

<!-- 1、data里面的部分属性的key是不能更改的，比如id，parent，start_date、end_date、progress、open
  links里面的全部属性的key是不能更改的id source target type
  2、data如果type是project，那么这条数据的开始时间会取其里面所有数据的最早开始时间，结束时间会取里面所有数据的最晚开始时间，如果这条数据里面的所有数据都是空数据，那么start_date会甘特图渲染的最早时间，end_date是start_date的后一天，这样数据就会不准确？
  解决方案： data里加个unscheduled属性来控制是否渲染这条数据，需要注意的是在所有涉及到日期的地方都要加，如tooltips_text 、columns、 拖拽等等
  3、 dhtmlx-gantt都是下划线分割，而且api中都是这样,但在layout中min_width、max_width不生效，要用minWidth、maxWidth替换才生效。
  4、排序后的数据默认从页面获取的row元素可能是不准确的，需要从dataStroe中获取。
  5、甘特图在不占全屏的情况下， order_branch = true，拖拽会有限制？
  作者：ygunoil
  链接：https://juejin.cn/post/6930900493602390024
  来源：稀土掘金
  著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。 -->
