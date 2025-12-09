<template>
  <div class="page-content">
    <el-card class="home-card" header="工程面貌">
      <div class="home-card-body">内容开发中...</div>
    </el-card>
    <el-card class="home-card" header="设计管理">
      <div class="home-card-body">内容开发中...</div>
    </el-card>
    <el-card class="home-card" header="进度展示">
      <div class="home-card-body">内容开发中...</div>
    </el-card>
    <el-card class="home-card" header="待办事项">
      <div class="home-card-body">内容开发中...</div>
    </el-card>
    <el-card class="home-card" header="质量管理">
      <div class="home-card-body">内容开发中...</div>
    </el-card>
    <el-card class="home-card" header="安全管理">
      <div class="home-card-body">内容开发中...</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "HomeIndexPage",
};
</script>

<style scoped lang="scss">
.page-content {
  background-color: #f0f4f8 !important;
  padding: 0 !important;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  height: 100%;
}

.home-card {
  overflow: hidden;
}

.home-card-body {
  height: 100%;
}
</style>
