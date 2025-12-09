<template>
  <div class="projectInfo">
    <div class="card-header">
      <img class="header-icon" src="@/assets/screen/h-icon.png" alt="">
      项目简介
    </div>
    <div class="desc">
      <p>{{ desc }}</p>
      <p>{{ dec2 }}</p>
    </div>
    <ul class="info-box">
      <li><span class="title">隧洞: </span><span class="value">共计25座，总干渠隧洞12座，西干渠隧洞7座，回龙水库充水渠6座</span></li>
      <li><span class="title">渡槽: </span><span class="value">共计7座，总干渠渡槽5座，西干渠渡槽2座</span></li>
      <!-- <li><span class="title">单机容量: </span><span class="value">0.32万千瓦</span></li>
      <li><span class="title">预估年发电量: </span><span class="value">500MW</span></li>
      <li><span class="title">LCOE: </span><span class="value">0.18元/kW.h </span></li> -->
    </ul>
    <div class="card-header">
      <img class="header-icon" src="@/assets/screen/h-icon.png" alt="">
      基本信息
    </div>
    <ul class="info-box">
      <li> <span class="title">项目名称: </span>雄安水电站前期工程现场数字化指挥平台</li>
      <li><span class="title">业主单位: </span>xxx建设开发有限公司</li>
      <li><span class="title">项目经理: </span>***</li>
      <li><span class="title">建设阶段: </span>建设中</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProjectInfo',
  data() {
    return {
      // eslint-disable-next-line vue/no-parsing-error
      desc: '',
      dec2: ''
    }
  }
}
</script>

<style scoped lang="scss">
  .projectInfo{
    // color: #B4B4B4;
    color: #fff;
    // text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
    font-weight: 500;
    .desc{
      font-size: 14px;
      line-height: 18px;
      padding-left: 40px;
      text-indent: 2em;
    }
    .info-box{
      line-height: 18px;
      padding-left: 40px;
      margin-top: 5px;
      font-size: 14px;
      color: #00FCEF;
      .title{
        // color: #B4B4B4;
        color: #fff;
      }
    }
  }
</style>
