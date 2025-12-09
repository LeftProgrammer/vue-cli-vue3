<template>
  <div
    :id="eleid"
    class="table-content"
    :class="{
      'no-form': !$slots.form,
      'no-header': !$slots.opratebtns,
      'no-page': !showPage,
      'search-open': !searchOpen,
      'design-app': pageType === 'DesignApplication'
    }"
  >
    <el-row class="w-100pre h-100pre">
      <div
        class="search-form"
        ref="searchFormRef"
        :class="{ 'design-app-form': pageType === 'DesignApplication' }"
        v-if="$slots.form"
      >
        <div class="search-inputform">
          <slot name="form"></slot>
        </div>
        <div
          class="search-btns"
          v-if="showSearchBtns"
          :class="{ 'search-open-btn': showSearchOpenBtn }"
        >
          <el-button
            v-if="showSearchBtn"
            @click="query"
            type="primary"
            size="small"
            icon="el-icon-search"
          >
            查询
          </el-button>
          <div style="width: 90px" v-if="!showSearchBtn"></div>
          <el-button @click="reset" icon="el-icon-refresh-left" size="small"
            >重置
          </el-button>
          <slot name="searchBtnsAppend"></slot>
          <template v-if="showSearchOpenBtn">
            <el-button
              v-if="searchOpen"
              icon="el-icon-arrow-down"
              class="search-btn"
              @click="searchOpenHandle()"
            ></el-button>
            <el-button
              v-else
              icon="el-icon-arrow-up"
              class="search-btn"
              @click="searchOpenHandle()"
            ></el-button
          ></template>
        </div>
      </div>
      <div
        class="divider"
        v-if="$slots.form && pageType !== 'DesignApplication'"
      ></div>
      <div class="table position-relative" ref="tableRef">
        <div
          v-if="$slots.tree"
          class="position-absolute top-0 left-0 index-10 pointer"
          style="top: 50%"
          @click.stop="openDrawer"
        >
          <img
            v-show="!drawer"
            src="@/assets/img/system/slider_open.png"
            alt=""
          />
        </div>
        <span v-if="$slots.tree">
          <div
            v-if="drawer"
            class="w-100pre position-absolute h-100pre top-0 left-0 index-99"
            style="background: rgba(0, 0, 0, 0.5)"
            @click.stop="closeAnimation"
          ></div>

          <div
            class="h-100pre position-absolute animated-element bg-fff index-500"
            id="animated-element"
          >
            <div class="position-absolute top-0 index-600" style="right: -34px">
              <img
                v-show="drawer"
                @click.stop="closeAnimation"
                class="w-34 h-38"
                src="@/assets/img/system/slider_close.png"
                alt=""
              />
            </div>
            <slot name="tree"></slot>
          </div>
        </span>

        <!-- <template slot="paneR">
            <div class="" style="background: rgba(0, 0, 0, 0.5)">2222</div>
          </template> -->

        <!-- <vue-splitpane
            split="vertical"
            :min-percent="minPercent"
            :default-percent="defaultPercent"
          >
          </vue-splitpane> -->

        <div class="table-header" v-if="$slots.opratebtns">
          <!-- <div class="table-title">
            <svg-icon icon-class="table-icon" class="icon" />
            <div class="title">{{ title }}</div>
          </div> -->
          <div class="add-btns">
            <slot name="opratebtns" v-if="!isMdgAdmin"></slot>

            <el-button v-if="showExportBtn" @click="handleExport">
              <svg-icon icon-class="export" class="icon" />
              导出列表
            </el-button>
          </div>
        </div>
        <div class="table-cnotent">
          <slot name="table" :getIndex="indexMethod"></slot>
          <slot name="card"></slot>
        </div>
        <div class="pagination-container" v-if="showPage">
          <!-- <slot name="pagination"></slot> -->
          <el-pagination
            :current-page="pageParams.current"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ContentLayout-Table',
  data() {
    return {
      pageParams: {
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0
      },

      drawer: false,

      /**搜索栏展开按钮是否展示 */
      showSearchOpenBtn: false,
      /**搜索栏展开 */
      searchOpen: false,

      tableContentDom: null,
      tableDom: null,
      searchFormDom: null,

      eleid: 'table_' + new Date().getTime(),

      componentContainer: null
    }
  },
  props: {
    userSlot: {
      default: false,
      type: Boolean
    },
    minPercent: {
      type: Number,
      default: 5
    },
    /**
     * 页面类型
     */
    pageType: {
      type: String,
      default: ''
    },
    /**
     * 是否展示form内容区
     */
    showForm: {
      type: Boolean,
      default: true
    },
    /**
     * 是否展示搜索区按钮
     */
    showSearchBtns: {
      type: Boolean,
      default: true
    },
    /**
     * 是否展示查询按钮
     */
    showSearchBtn: {
      type: Boolean,
      default: true
    },
    /**
     * 是否展示导出按钮
     */
    showExportBtn: {
      type: Boolean,
      default: false
    },
    // 是否默认展开搜索区
    defaultOpenSearch: {
      type: Boolean,
      default: true
    },
    /**
     * 是否展示分页
     */
    showPage: {
      type: Boolean,
      default: true
    },
    /**
     * 分页器参数
     */
    page: {
      type: Object,
      default: () => {
        return {
          pageSize: 20,
          size: 20,
          current: 1,
          total: 0
        }
      }
    },
    /**
     * 列表名称
     */
    title: {
      type: String,
      default: '列表'
    },
    tableContentClassName: {
      type: String,
      default: 'table-content'
    }
  },
  methods: {
    openDrawer(event) {
      if (!this.componentContainer) {
        console.error('this.componentContainer is null')
        return
      }
      this.drawer = true
      let element = this.componentContainer.querySelector('#animated-element')
      element.style.visibility = 'visible'
      element.style.width = '300px' // 将宽度设置为500px，触发过渡效果
    },

    closeAnimation() {
      if (!this.componentContainer) {
        console.error('this.componentContainer is null')
        return
      }
      let element = this.componentContainer.querySelector('#animated-element')
      element.style.width = '0' // 将宽度设置为0，触发过渡效果
      setTimeout(() => {
        this.drawer = false
        element.style.visibility = 'hidden'
      }, 300)
    },
    /**
     * 导出列表
     * */
    handleExport() {
      let columns = []
      if (Array.isArray(this.$slots.table) && this.$slots.table.length > 0) {
        columns = this.$slots.table[0].componentOptions.children
          .filter((x) => x.componentOptions?.propsData?.prop)
          .map((x) => {
            return { ...x.componentOptions.propsData, ...x.data.attrs }
          })
      }
      //数据过滤
      let excelColumns = []
      let propsSet = new Set() // 用于存储已经出现过的prop字段
      let flag = false
      if (columns) {
        columns.forEach((col) => {
          if (propsSet.has(col.prop)) {
            console.log(`重复的prop字段: ${col.prop}`)
            // 在这里可以处理重复字段的逻辑，例如抛出异常或者给出提示信息
            this.$message.warning(`重复的字段: ${col.prop}`)
            flag = true
          } else {
            propsSet.add(col.prop)
            let tempObj = {
              label: col.label,
              prop: col.prop
            }
            // 继续处理tempObj对象
            // 将以 excel. 开头的属性转换为普通属性
            Object.keys(col).forEach((key) => {
              if (key.startsWith('excel.')) {
                const newKey = key.substring(6)
                tempObj[newKey] = col[key]
              }
            })
            excelColumns.push(tempObj)
          }
        })
        if (flag) {
          // 异常情况中断请求
          return
        }
      }
      let exportParams = {
        url: '',
        params: {},
        filename: '列表',
        columns: excelColumns
      }
      this.$emit('initExportParams', exportParams)
      console.log('handleExport', exportParams)

      this.$handleExport(
        exportParams.url,
        exportParams.params,
        exportParams.filename
      )
    },
    //表格序号
    indexMethod(index) {
      let curpage = this.pageParams.current //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage
    },
    /**搜索条件收起 */
    searchOpenHandle(defaultOpenSearch) {
      this.searchOpen = !this.searchOpen
      if (typeof defaultOpenSearch === 'boolean') {
        this.searchOpen = !defaultOpenSearch
      }
      // console.log("this.searchOpen", this.searchOpen, this.$slots.opratebtns);
      // if(this.$slots.opratebtns[0].elm.remove())

      this.$nextTick(() => {
        this.initTableStyle()
      })
    },
    /**查询 */
    query() {
      this.pageParams.current = 1
      this.$emit('query', this.pageParams)
    },
    /**重置 */
    reset() {
      this.$emit('reset', this.pageParams)
    },
    /**
     * 分页器:每页页大小切换
     */
    handleSizeChange(val) {
      this.pageParams.pageSize = val
      this.pageParams.size = val
      this.$emit('pageSizeChange', this.pageParams)
    },
    /**
     * 分页器:页码切换
     */
    handleCurrentChange(val) {
      this.pageParams.current = val
      this.$emit('pageCurrentChange', this.pageParams)
    },
    /**监听search form的高度，初始化table高度 */
    initTableStyle() {
      // const resizeObserver = new ResizeObserver((entries) => {
      //   for (let entry of entries) {
      //     console.log(entry.target.style.width);
      //   }
      // });
      // resizeObserver.observe(this.searchFormDom);
      let tableContentDom = document.querySelector(
        `.${this.tableContentClassName}`
      )
      if (tableContentDom) {
        this.tableContentDom = tableContentDom

        let tableDom = this.$refs.tableRef
        let searchFormDom = this.$refs.searchFormRef
        if (tableDom && searchFormDom) {
          this.tableDom = tableDom
          this.searchFormDom = searchFormDom
        }
      }
      if (this.searchOpen) {
        if (this.tableDom) {
          // this.tableDom.style.height = `unset`;
          this.tableDom.style.height = ``
        }
      } else {
        //table的页面处理
        // console.log("this.tableDom", this.tableDom);
        // console.log("this.tableDom", this.tableDom);
        if (this.searchFormDom) {
          let height = window
            .getComputedStyle(this.searchFormDom)
            .getPropertyValue('height')
          if (this.tableDom) {
            this.tableDom.style.height = `calc(100% - ${height} - 17px)`
          }
        }
      }
    }
  },
  watch: {
    page: {
      handler(val, oldValue) {
        console.log('Page changed:', val, oldValue)
        if (!!val.size || !!val.pageSize) {
          const size = val?.size ? val.size : val.pageSize
          this.pageParams.size = size
          this.pageParams.pageSize = size
          this.pageParams.current = val.current
        }
        if (val.total != undefined) {
          this.pageParams.total = val.total
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // let tableContentDom = document.querySelector(".table-content");
    let tableContentDom = document.querySelector(
      `.${this.tableContentClassName}`
    )
    if (tableContentDom) {
      this.tableContentDom = tableContentDom

      let tableDom = this.$refs.tableRef
      let searchFormDom = this.$refs.searchFormRef
      if (tableDom && searchFormDom) {
        this.tableDom = tableDom
        this.searchFormDom = searchFormDom

        let searchInputFormDom =
          searchFormDom.querySelector('.search-inputform')
        if (searchInputFormDom) {
          let height = window
            .getComputedStyle(searchInputFormDom)
            .getPropertyValue('height')
          if (height && parseFloat(height) > 60) {
            this.showSearchOpenBtn = true
          }
        }
      }
      this.initTableStyle()
    }
    window.onresize = this.initTableStyle
    this.$nextTick(() => {
      this.searchOpenHandle(this.defaultOpenSearch)
    })

    this.componentContainer = document.querySelector('#' + this.eleid)
  },
  computed: {
    userInfo() {
      return this.$getStorage('userInfo')
    },
    /**
     * 超级管理账号，只有查看权限；无其他权限
     */
    isMdgAdmin() {
      return this.userInfo?.username === 'mdgglj'
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 80px;
$height: 32px;

.table-content {
  height: 100%;
  background: #fff;

  & > .el-row {
    height: 100%;

    .search-form {
      height: auto;
      display: flex;
      // justify-content: space-between;
      // flex-wrap: wrap;
      .search-inputform {
        height: $height + 16;
        overflow: hidden;

        // flex: 1;
        ::v-deep .el-form-item {
          height: $height;
          margin-bottom: 20px;
          min-width: 20%;
          white-space: nowrap;

          // border: #1298fa 1px solid;
          .el-form-item__label {
            height: 100%;
            // width: 120px;
            white-space: nowrap;
            width: 80px;
            line-height: $height;
          }

          .el-form-item__content {
            height: 100%;
            min-width: 200px;
            width: calc(100% - 80px);
            line-height: $height;
            .el-select {
              height: 100%;
              width: 240px;
            }
            .el-input {
              height: 100%;
              width: 240px;
              .el-input__inner {
                height: 100%;
              }
            }
            .el-cascader {
              height: 100%;
              line-height: $height;
            }
            .el-date-editor {
              height: 100%;
              // width: 100% !important;
              width: 240px !important;

              .el-range-separator {
                line-height: 24px;
              }
            }
          }
        }
      }
      .search-btns {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 16px;
        width: $width * 2 + 20;
        height: $height;

        &.search-open-btn {
          width: $width * 2 + 40 + 20;
        }

        button {
          // width: $width;
          // height: 100%;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px 14px;

          i {
            font-size: 14px;
          }

          &.search-btn {
            width: 40px;
          }
        }

        .reset-btn {
          border: 1px solid #014acb;
          background: #fff;
          color: #014acb;
        }
      }
    }

    .divider {
      border-top: 1px #bbbbbb dashed;
      border-left: none;
      border-bottom: none;
      border-right: none;
      margin: 0px auto 16px auto;
    }
  }

  .table {
    height: calc(100% - 40px - #{$height});

    .table-header {
      height: $height;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .add-btns {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        // width: $width * 2 + 20;
        height: $height;
        ::v-deep button {
          padding: 8px 14px;
          svg {
            width: 14px;
            height: 14px;
          }
        }
      }
      .table-title {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .title {
        margin-left: 10px;
        font-size: 18px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #333333;
        line-height: 21px;
      }

      .table-btns {
        ::v-deep button {
          // width: $width;
          height: $height;
          font-size: 14px;

          i {
            font-size: 14px;
          }
          svg {
            width: 14px;
            height: 14px;
          }
        }
      }
    }

    .table-cnotent {
      height: calc(100% - #{$height} - #{$height} - 30px);

      ::v-deep.el-table::before {
        height: 0;
      }
      ::v-deep .el-tag {
        border-radius: 14px;
        padding: 0 15px;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        &.el-tag--primary {
          background: #fff;
          color: #014acb;
          border-color: #014acb;
        }
        &.el-tag--warning {
          background: #fff;
          color: #ff7d00;
          border-color: #ff7d00;
        }
        &.el-tag--success {
          background: #ffffff;
          color: #00b42a;
          border-color: #00b42a;
        }
        &.el-tag--info {
          background: #f2f3f5;
          color: #86909c;
          border-color: #c9cdd4;
        }
        &.el-tag--danger {
          background: #ffe3e3;
          color: #f53f3f;
          border-color: #f53f3f;
        }
      }
      ::v-deep .el-link:hover {
        &:after {
          border: none;
        }
      }
      ::v-deep .el-table--border::after,
      .el-table--group::after,
      .el-table::before {
        background: transparent !important;
        z-index: -10;
      }

      ::v-deep .el-table {
        // border: 0;
        height: 100%;

        .el-table__cell {
          // border-right: 1px solid transparent;
        }
        .el-table__header {
          background-color: #ebeff5;
          overflow: hidden;

          .el-table__cell {
            // border-right: 1px solid transparent;
            // text-align: center;
            background-color: #ebeff5;
            border-color: #e7e7e7;
            text-align: center;
            height: 48px;
            .cell {
              color: #1d2129;
              // text-align: center;
            }
          }
        }
        .el-table__body-wrapper {
          height: calc(100% - 56px) !important;
          overflow-y: auto;
          border-right: 1px solid #ebeef5;

          .el-table__body {
            .el-table__row {
              .el-table__cell {
                // text-align: center;
                height: 48px;
              }
            }

            tr:hover {
              td {
                background: #edf3fe;
              }
            }
          }
        }
        .el-table__fixed-body-wrapper {
          border-right: 1px solid #ebeef5;
          .el-table__row {
            .el-table__cell {
              height: 48px;
            }
          }
        }
      }
      overflow: hidden;
      overflow-y: auto;
    }
  }

  .pagination-container {
    height: $height;
    text-align: right;

    ::v-deep .el-pagination {
      padding-top: 1px;
      padding-bottom: 1px;
      .el-pager {
        li.active {
          background-color: #014acb;
        }
      }
    }
  }

  &.no-header {
    .table {
      height: calc(100% - 61px);

      .table-cnotent {
        height: calc(100% - #{$height});
      }
    }
  }

  &.no-form {
    .table {
      height: calc(100%);

      .table-cnotent {
        height: calc(100% - #{$height} - #{$height} - 20px);
      }
    }
  }

  &.no-page {
    .table {
      height: calc(100%);

      .table-cnotent {
        height: calc(100% - #{$height} - #{$height});
      }
    }
  }

  &.no-form.no-header {
    height: calc(100% - 0px);

    .table {
      height: calc(100%);

      .table-cnotent {
        height: calc(100% - #{$height});
      }
    }
  }

  &.no-page.no-header {
    .table {
      height: calc(100% - #{$height} - 40px);

      .table-cnotent {
        height: calc(100%);
      }
    }
  }

  &.no-form.no-header.no-page {
    height: calc(100%);

    .table {
      height: calc(100%);

      .table-cnotent {
        height: calc(100%);
      }
    }
  }

  /*设计应用页面样式*/
  &.design-app {
    height: calc(100% - 52px);
  }

  &.search-open {
    & > .el-row .search-form .search-inputform {
      height: auto;
      overflow: visible;
    }
  }
}

.design-app-form {
  margin-bottom: -8px;
}

.table {
  /deep/ .el-drawer__wrapper {
    position: absolute;
  }
  /deep/.v-modal {
    position: absolute;
  }
}
/deep/ .el-tree {
  height: 100% !important;
  overflow: auto;
}
#animated-element {
  width: 0;
  transition: width 0.5s ease; /* 定义过渡效果 */
  // opacity: 0;
  visibility: hidden;
}
</style>
