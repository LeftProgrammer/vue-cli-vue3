<template>
  <div class="workbench">
    <SzgcWbench :tab="1" :top-show="false" hide-tabs="mine" />
  </div>
</template>

<style lang="scss">
$main: #1a74f0;
.workbench {
  height: 100%;
  background: white;
  padding: 20px;
  th {
    background-color: $main !important;
    border-color: $main !important;
  }
  .el-button--primary {
    background-color: $main !important;
    border-color: $main !important;
  }
  .table-text-pointer,
  .wbench-table-btn,
  .wbench-table-btn > i {
    color: $main;
  }
  .wbench-el-table.el-table--border td,
  .wbench-el-table.el-table--border th {
    border-right-color: #f6f6f6;
  }
  .szgc-wbench
    .szgc-wbench-main
    .szgc-wbench-header
    .header-btn-box
    .item.active {
    background-color: $main !important;
  }
  .szgc-wbench .szgc-wbench-main .szgc-wbench-header .header-btn-box .item {
    color: $main;
    border-color: $main !important;
  }
  .wbench-el-table.el-table--border {
    border-color: #f6f6f6;
  }
}
</style>
