<template>
  <div class="">
    <el-dialog title="信息" :visible.sync="dialogFormVisible" @closed="closeHandle">
      <div style="height: 540px;    overflow-y: auto;">
        <el-form v-for="(form,index) in dataList" :key="form.id" :model="form">
          <el-form-item label="文件标题：" :label-width="formLabelWidth">
            <el-input v-model="form.noticeTitle" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="退回消息：" :label-width="formLabelWidth">
            <el-input v-model="form.noticeInfo" autocomplete="off" type="textarea"
                      :rows="3" readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="退回时间：" :label-width="formLabelWidth" style="margin-bottom: 20px">
            <el-date-picker
              v-model="form.noticeDate"
              type="datetime"
              placeholder="" readonly
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">

          </el-form-item>
          <el-divider v-if="index != dataList.length-1"></el-divider>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { noticeList, noticeRead } from "./api.js";

export default {
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      dataList: [],
      dialogFormVisible: false,
      formLabelWidth: '120px'
    };
  },
  computed: {},
  created() {
    this.dialogFormVisible = false;
    this.getList();
  },
  methods: {
    closeHandle() {
      for (let i = 0; i < this.dataList.length; i++) {
        let item = this.dataList[i];
        noticeRead(item).then(res => {
          if (res.success()) {
          }
        })
      }
    },
    getList() {
      console.log("getList");
      let params = {};
      noticeList(params)
        .then((result) => {
          const { data, success } = result;
          if (success && data.length > 0) {
            this.dataList = data;
            this.dialogFormVisible = true;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.inner-div {
  margin-top: 30%;
}

.warning-item {
  display: flex;
  align-items: center;
  width: 365px;
  height: 35px;
  background: linear-gradient(90deg, #9CC7FF 0%, #E6F2FE 100%);
  border-radius: 0px 0px 0px 0px;
  margin-bottom: 10px;

  .icon {
    width: 12px;
    height: 12px;
    margin: 0 12px;
  }

  .title {
    width: 80%;
    color: #000000;
  }

  .number {
    color: #FF2E2E;
  }

  .unit {
    color: #1E1E1E;
    font-size: 14px;
    margin: 0 30px 0 5px;
  }

  .title, .number {
    font-weight: bold;
    font-size: 16px;
  }
}

.goto {
  position: absolute;
  bottom: 20px;
  text-align: center;
  width: 90%;
  font-size: 16px;
  color: #F53F3F;
}
</style>
