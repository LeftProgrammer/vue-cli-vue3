<template>
  <div class="DesignManage">
    <div class="card-header">
      <img class="header-icon" src="@/assets/screen/h-icon.png" alt="">
      进度与施工
    </div>
    <div class="content">
      <div class="item">
        <img src="@/assets/screen/screen_11.png" alt="">
        <div class="status">正在施工</div>
        <div class="num">#1234</div>
      </div>
      <div class="item">
        <img src="@/assets/screen/screen_21.png" alt="">
        <div class="status">正在安装</div>
        <div class="num">#1234</div>
      </div>
      <div class="item">
        <img src="@/assets/screen/screen_20.png" alt="">
        <div class="status">里程碑1</div>
        <div class="num" style="color: #F7B500">进行中</div>
      </div>
      <div class="item">
        <img src="@/assets/screen/screen_19.png" alt="">
        <div class="status">里程碑2</div>
        <div class="num" style="color: #00D47B">已完成</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesignManage',
  data() {
    return {
      list: []
    }
  }
}
</script>

<style scoped lang="scss">
  .DesignManage{
    // color: #B4B4B4;
    color: #fff;
    font-weight: 500;
    .desc{
      font-size: 14px;
      line-height: 18px;
      padding-left: 10px;
    }
    img{
      width: 427px;
      height: 176px;
    }
    .content{
      width: 100%;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item{
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
          width: 52px;
          height: 52px;
        }
        .status{
          margin-top: 10px;
          font-size: 14px;
          // color: #B4B4B4;
          color: #fff;
          line-height: 21px;
        }
        .num{
          font-size: 18px;
          font-weight: 800;
          color: #00FCEF;
          line-height: 27px;
        }
      }
    }
  }
</style>
