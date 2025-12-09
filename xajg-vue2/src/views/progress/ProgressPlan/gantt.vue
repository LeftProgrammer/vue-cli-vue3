<template>
  <div class="gantt">
    <div class="flex-1">
      <div id="gantt_here" class="w-100pre h-100pre"></div>
    </div>
  </div>
</template>
<script>
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

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
  destroyed() {
    // 销毁gantt
    // gantt.destructor();
  },
  methods: {
    clickGridButton(id, type) {
      console.log("操作按钮", id, type);
      this.$nextTick(() => {
        let task = gantt.getTask(id);
        console.log("task", task);
      });
    },

    //所有配置选项都在 gantt.config 对象中声明。
    // 要设置所需的选项，只需按照本文档中的说明编写即可。
    // 请注意，配置选项应该在带有 dhtmlxGantt 初始化的代码行之前。
    restGanttConfig(data) {
      // gantt.destructor()
      gantt.clearAll();
      // gantt.config.show_grid = false; //隐藏表格
      gantt.config.open_split_tasks = true;
      gantt.init("gantt_here");

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
    },
    setGanttConfig() {
      gantt.config["scales"] = [
        {
          unit: "month",
          step: 1,
          format: "%Y年%M",
        },
        { unit: "day", step: 1, format: "%d日 周%D" },
      ];
      gantt.config.xml_date = "%Y-%m-%d"; // 模板可用于更改日期和标签的显示。
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
      // gantt.config.min_column_width = 10;
      // gantt.config.preserve_scroll = false;//图表刷新后，滚动条的位置跟原来保持一致
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
      // 初始化甘特图
      // 布局
      // 布局是通过gantt.config.layout配置选项设置的。布局的默认配置如下：
      gantt.config.layout = {
        css: "gantt_container",
        rows: [
          {
            cols: [
              {
                // the default grid view
                view: "grid",
                scrollX: "scrollHor",
                scrollY: "scrollVer",
              },
              { resizer: true, width: 1 },
              {
                // the default timeline view
                view: "timeline",
                scrollX: "scrollHor",
                scrollY: "scrollVer",
              },
              {
                view: "scrollbar",
                id: "scrollVer",
              },
            ],
          },
          {
            view: "scrollbar",
            id: "scrollHor",
          },
        ],
      };
      // 自定义网格元素
      var colContent = function (task) {
        return `<span  class='pointer text-0096'  onclick="clickGridButton(${
          task.id + ""
        },'view')">查看</span>
          <span class='pointer text-0096 mx-20'  onclick="clickGridButton(${task},'edit')">编辑</span>
          <span class='pointer text-red'   onclick="clickGridButton(${task},'delete')">删除</span>
          `;
      };
      gantt.config.columns = [
        {
          name: "name",
          label: "编码",
          min_width: 200,
          align: "left",
        },
        {
          name: "name",
          tree: true,
          label: "名称",
          min_width: 200,
          align: "left",
        },
        { name: "type", label: "类型", min_width: 100, align: "center" },
        {
          name: "year",
          label: "年份",
          min_width: 100,
          align: "center",
        },

        {
          name: "sectionId",
          label: "施工标段",
          min_width: 100,
          align: "center",
        },

        {
          name: "flowStatus",
          label: "流程状态",
          align: "center",
        },
        {
          name: "buttons",
          label: "操作",
          min_width: 150,
          template: colContent,
          resize: true,
        },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
// /deep/ .gantt_grid_head_cell {
//   font-size: 14px;
//   color: aqua !important;
//   width: 200px !important;
// }
.line {
  background-color: #fff;
}
/deep/ .gantt_task_content {
  text-align: left !important;
}
/deep/ .gantt_task_line {
  border-radius: 40px;
  background-color: #1890ff !important;
  border: 0 !important;
  // top: 7px !important;
  // height: 20px !important;
  // line-height: 20px !important;
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
