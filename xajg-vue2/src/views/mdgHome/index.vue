<template>
  <!--  :style="imageStyle"-->
  <div
    class="app-wrapper all"
    :class="
      showBase && !showParticle ? 'background-image' : 'background-image-child'
    "
  >
    <div id="content">
      <el-container>
        <el-header height="100%">
          <!--        <div class="grid-content  head"></div>-->
          <el-row :gutter="0" style="text-align: center">
            <img style="width: 82.852%" src="@/assets/img/mdgHome/head.png" />
          </el-row>
          <el-row :gutter="0">
            <el-col :span="2" style="text-align: center">
              <img
                :src="
                  !showBase ? require('@/assets/img/mdgHome/goBack.png') : ''
                "
                @click="goBack"
                style="width: 30%; cursor: pointer"
              />
            </el-col>
            <el-col :span="20">
              <ul class="ul-box">
                <li v-for="item in items" :key="item.id">
                  <img
                    v-show="item.isCheck"
                    :src="require('@/assets/img/mdgHome/' + item.choose)"
                    :id="item.id"
                    ref="itemImg"
                    style="transform: scale(1.2) !important"
                    @mouseenter="handleMouseEnter($event)"
                    @mouseleave="handleMouseLeave($event)"
                    @click="handleOnClick($event)"
                  />
                  <img
                    v-show="!item.isCheck"
                    :src="require('@/assets/img/mdgHome/' + item.unchoose)"
                    :id="item.id"
                    ref="itemImg"
                    @mouseenter="handleMouseEnter($event)"
                    @mouseleave="handleMouseLeave($event)"
                    @click="handleOnClick($event)"
                  />
                  <img
                    class="checkBg"
                    :src="
                      item.isCheck
                        ? require('@/assets/img/mdgHome/checkBg.png')
                        : ''
                    "
                  />
                </li>
              </ul>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>
        </el-header>
        <el-main style="margin-top: 2%">
          <!--          <el-row :gutter="0" >-->
          <!--            <el-col :span="6">-->
          <!--              <img v-show="showBase" style="width: 80%" src="@/assets/img/mdgHome/left.gif" >-->
          <!--            </el-col>-->
          <!--            <el-col :span="12">-->
          <!--              <div>&nbsp;</div>-->
          <!--            </el-col>-->
          <!--            <el-col :span="6">-->
          <!--              <img v-show="showBase" style="width: 80%;float: right;" src="@/assets/img/mdgHome/right.gif">-->
          <!--            </el-col>-->
          <!--          </el-row>-->
        </el-main>
        <el-footer
          style="position: absolute; width: 100%; bottom: 0; height: 0"
        >
          <el-row :gutter="0">
            <el-col :span="6">
              <img
                class="left-button"
                src="@/assets/img/mdgHome/leftButton.png"
                @click="toBusinessSystem"
              />
            </el-col>
            <el-col :span="12">
              <div></div>
            </el-col>
            <el-col :span="6">
              <img
                class="right-button"
                src="@/assets/img/mdgHome/rightButton.png"
                @click="toDigitalTwins"
              />
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </div>
    <div class="left-right-div">
      <img v-show="showBase" style="" src="@/assets/img/mdgHome/left.gif" />
      <img
        v-show="showBase"
        style="float: right"
        src="@/assets/img/mdgHome/right.gif"
      />
    </div>
    <div class="centDiv">
      <div v-if="showParticle" v-show="showBase">
        <img style="z-index: 9" src="@/assets/img/mdgHome/ball01.gif" />
        <img
          class="fish"
          style="z-index: 8"
          src="@/assets/img/mdgHome/fish.gif"
        />
        <img style="z-index: 7" src="@/assets/img/mdgHome/foot01.gif" />
        <img
          class="threeImg"
          style="z-index: 7"
          src="@/assets/img/mdgHome/3.0.png"
        />
      </div>
      <con v-if="!showBase" :content-name="contentName"></con>
    </div>
    <change-password></change-password>
  </div>
</template>

<script>
import con from "@/views/mdgHome/contentView";
import ChangePassword from "@/components/ChangePassword/index";

export default {
  props: {},
  components: {
    con,
    ChangePassword,
  },
  computed: {
    // imgStyle() {
    //   return {
    //     transform:  this.isCover? 'scale(1.5)':'scale(1)',
    //     transition: 'transform 0.3s ease-in-out',
    //   };
    // }
  },
  data() {
    return {
      showParticle: this.$store.state.systemConfig?.showParticle,
      items: [
        {
          id: 1,
          nextId: 2,
          unchoose: "selectItem-zhbg.gif",
          choose: "selectItem-zhbg-c.gif",
          isCheck: false,
          contentName: "zhbgContent",
        },
        {
          id: 2,
          nextId: 3,
          unchoose: "selectItem-sjgl.gif",
          choose: "selectItem-sjgl-c.gif",
          isCheck: false,
          contentName: "sjglContent",
        },
        {
          id: 3,
          nextId: 4,
          unchoose: "selectItem-jdgl.gif",
          choose: "selectItem-jdgl-c.gif",
          isCheck: false,
          contentName: "jdglContent",
        },
        {
          id: 4,
          nextId: 5,
          unchoose: "selectItem-zlgl.gif",
          choose: "selectItem-zlgl-c.gif",
          isCheck: false,
          contentName: "zlglContent",
        },
        {
          id: 5,
          nextId: 6,
          unchoose: "selectItem-aqgl.gif",
          choose: "selectItem-aqgl-c.gif",
          isCheck: false,
          contentName: "aqglContent",
        },
        {
          id: 6,
          nextId: 7,
          unchoose: "selectItem-hsbgl.gif",
          choose: "selectItem-hsbgl-c.gif",
          isCheck: false,
          contentName: "hsbglContent",
        },
        {
          id: 7,
          nextId: 1,
          unchoose: "selectItem-sygl.gif",
          choose: "selectItem-sygl-c.gif",
          isCheck: false,
          contentName: "syglContent",
        },
      ],
      showBase: true,
      contentName: "",
    };
  },

  methods: {
    handleOnClick(e) {
      this.items.forEach((e) => (e.isCheck = false));
      for (const i in this.items) {
        if (e.target.id == this.items[i].id) {
          this.items[i].isCheck = true;
          //显示对应内容
          this.showBase = false;
          this.contentName = this.items[i].contentName;

          //按钮置中
          // let newItems = [];
          // newItems[3]=this.items[i];
          // for (let j = 4; j < 7; j++) {
          //   newItems[j] = this.items.find(s=>s.id===newItems[j-1].nextId)
          // }
          // newItems[0] = this.items.find(s=>s.id===newItems[6].nextId)
          // for (let j = 1; j < 3; j++) {
          //   newItems[j] = this.items.find(s=>s.id===newItems[j-1].nextId)
          // }
          // this.items = newItems;
          // let chooseItem = this.items[i];
          // this.items.splice(this.items.indexOf(chooseItem), 1);
          // let temp = this.items[3];
          // this.items[3]=chooseItem;
          // this.items.push(temp);

          break;
        }
      }
      //全部缩小
      // for (const item in this.$refs.itemImg) {
      //   this.$refs.itemImg[item].style.transform= 'scale(1)';
      //   this.$refs.itemImg[item].style.transition= 'transform 0.5s ease-in-out';
      // }
      // //中间放大
      // console.log(e)
      // e.target.style.transform= 'scale(1.2)';
      // e.target.style.transition= 'transform 0.5s ease-in-out';
    },

    handleMouseEnter(e) {
      //高亮
      e.target.style.filter = "brightness(1.2)";
      // e.target.style.transition= 'filter 0.3s ease-in-out'；// 添加transition效果
    },
    handleMouseLeave(e) {
      //取消高亮
      e.target.style.filter = "brightness(1)";
      // e.target.style.opacity= 'filter 0.3s ease-in-out';
    },
    goBack() {
      this.showBase = true;
      this.contentName = "";
      this.items.forEach((e) => (e.isCheck = false));
    },
    // 跳转业务系统
    toBusinessSystem() {
      console.log("路由", this.$route);
      this.$store.dispatch("tagsView/updateVisitedView", this.$route);
      this.$router.push("/homeIndex/index");
    },
    // 跳转数字孪生
    toDigitalTwins() {
      window.open(this.$store.state.webUrlConfig.digitalTwinsUrl);
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

li {
  list-style: none;
}

.all {
  height: 100%;
  background-size: 100% 100%;
}

.background-image {
  background-image: url("@/assets/img/mdgHome/background2.png");
}

.background-image-child {
  background-image: url("@/assets/img/mdgHome/background1.png");
}

.head {
  background-image: url("@/assets/img/mdgHome/head.png");
  background-size: 80% 100%;
  background-position: center top;
  background-repeat: no-repeat;
}

.left {
  /*background-image: url("@/assets/img/mdgHome/left.jpg");*/
  /*background-repeat: no-repeat;*/
  /*background-position: center -30%;*/
  /*overflow: visible;*/
}

.left-img {
  margin-top: -50px;
}

.left-button {
  cursor: pointer;
  width: 22%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
}

.right-button {
  cursor: pointer;
  width: 22%;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.right {
  /*background-image: url("@/assets/img/mdgHome/right.jpg");*/
  /*background-repeat: no-repeat;*/
  /*background-position: center top;*/
}

.right-img {
  margin-top: -50px;
}

.grid-content {
  min-height: 70px;
}

.grid-content1 {
  border-radius: 4px;
  min-height: 210px;
}

.com-content {
}

.ul-box {
  display: flex;
  justify-content: space-between;
  width: 82.852%;
  margin: 0 auto;
  background-image: url("@/assets/img/mdgHome/curve.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.ul-box li {
  position: relative;
  width: 100%;
}

.ul-box li img {
  z-index: 999;
  cursor: pointer;
  width: 100%;
  margin: auto;
}

.ul-box li:nth-child(2) img {
  position: relative;
  top: 15%;
}

.ul-box li:nth-child(3) img {
  position: relative;
  top: 30%;
}

.ul-box li:nth-child(4) img {
  position: relative;
  top: 45%;
}

.ul-box li:nth-child(5) img {
  position: relative;
  top: 30%;
}

.ul-box li:nth-child(6) img {
  position: relative;
  top: 15%;
}

.cent {
  height: 80%;
  background-image: url("@/assets/img/mdgHome/ball01.gif"),
    url("@/assets/img/mdgHome/foot01.gif"), url("@/assets/img/mdgHome/fish.gif");
  background-position: 50% 80%;
  background-size: 180%;
}

.fish {
  width: 80% !important;
  height: 80% !important;
  transform: translate(13%, 13%);
}

.centDiv img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  pointer-events: none;
}

.left-right-div {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translate(0, -50%);
}

.left-right-div img {
  z-index: 999;
  position: relative;
  width: 20%;
}

.checkBg {
  position: absolute !important;
  left: 0;
  pointer-events: none;
}

.threeImg {
  position: absolute !important;
  width: 5% !important;
  height: 5% !important;
  top: 50% !important;
  transform: translate(-50%, 100%) !important;
  left: 50% !important;
}
</style>
