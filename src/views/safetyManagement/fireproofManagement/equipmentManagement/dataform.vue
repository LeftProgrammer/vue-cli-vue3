<template>
  <div>
    <el-dialog
      v-draggable
      :title="title"
      v-model="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="50%"
      @closed="closedHandle"
    >
      <el-row>
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          label-width="120px"
          :disabled="type === 'view'"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="视频类型" prop="videoType">
                <el-radio v-model="formData.videoType" label="M3U8">M3U8</el-radio>
                <el-radio v-model="formData.videoType" label="RTSP">RTSP</el-radio>
                <el-radio v-model="formData.videoType" label="YSXY">萤石协议</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标段" prop="sectionId">
                <el-select
                  v-model="formData.sectionId"
                  :disabled="readonly"
                  class="w-100pre"
                  placeholder="请选择"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in sectionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="code">
              <el-input
                v-model="formData.code"
                placeholder="请输入"
                show-word-limit
                maxlength="50"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入"
                show-word-limit
                maxlength="50"
              />
            </el-form-item>
          </el-col>

          <el-col
            v-if="formData.videoType == 'RTSP' || formData.videoType == 'YSXY'"
            :span="12"
          >
            <el-form-item label="channelId" prop="channelId">
              <el-input
                v-model="formData.channelId"
                placeholder="请输入"
                show-word-limit
                maxlength="255"
              />
            </el-form-item>
          </el-col>
          <el-col v-else :span="12">
            <el-form-item label="视频流" prop="discernNumber">
              <el-input
                v-model="formData.discernNumber"
                placeholder="请输入"
                show-word-limit
                maxlength="256"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select
                v-model="formData.deviceType"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
                @change="rangesChange"
              >
                <el-option
                  v-for="item in jksblxList"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监控范围" prop="ranges">
              <el-select
                v-model="formData.ranges"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
                @change="rangesChange"
              >
                <el-option
                  v-for="item in DitSpeciality"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装日期" prop="installDate">
              <el-date-picker
                v-model="formData.installDate"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联位置">
              <bimPoint
                v-model="formData.point"
                :readonly="type === 'view'"
                type="point"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.ranges == '森林防火监控'" :span="12">
            <el-form-item label="监控类型" prop="regionType">
              <el-select
                v-model="formData.regionType"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
                @change="regionTypeChange"
              >
                <el-option
                  v-for="item in jklxList"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closedHandle">{{
            type != "view" ? "取消" : "关闭"
          }}</el-button>
          <el-button v-if="type != 'view'" type="primary" @click="childEvtHandle">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { save, update, getSection } from "./api";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import ContentLayout from "@/components/ContentLayout/Table";
import { FormMixin } from "@/mixins/FormMixin";
import BimEngine from "@/components/BimEngine/index";
import { bimconfig } from "@/config/bimconfig";
import { getDictItemList } from "@/api/dict";
import RelatePlace from "@/components/RelatePlace/index.vue";
import bimPoint from "@/components/Bim/Point/index";

export default {
  name: "Dataform",
  components: {
    ContentLayout,
    BimEngine,
    RelatePlace,
    bimPoint,
  },
  mixins: [FormMixin],
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      monitorFlag: 1,
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
        regionType: "",
        videoType: "M3U8",
      },
      formDataRules: {
        code: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        discernNumber: [
          { required: true, message: "请输入识别号", trigger: "blur" },
        ],
        ranges: [{ required: true, message: "请选择", trigger: "change" }],
        regionType: [{ required: true, message: "请选择", trigger: "change" }],
        videoType: [{ required: true, message: "请选择", trigger: "change" }],
        channelId: [{ required: true, message: "请输入", trigger: "change" }],
      },
      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {},
      DitSpeciality: [],
      ssqyList: [],
      jklxList: [],
      jksblxList: [],
      sectionList: [],
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("🚀 ~ handler ~ newValue:", newValue);
        if (newValue) {
          let newData = { ...this.data };

          if (typeof newData.type == "string") {
            newData.type = JSON.parse(newData.type);
          }
          this.formData = newData;
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
    },
  },
  async created() {
    this.jcxmDictItem();
    this.jcxmDictItem2();
    this.jcxmDictItem3();
    this.getSelection();
  },
  methods: {
    selectDeviceInfo() {
      console.log(this.formData.code);
    },
    regionTypeChange(e) {
      console.log(this.formData.regionType);
    },
    rangesChange(e) {
      console.log(e, "执行");
    },
    bimclose() {},
    limitInput(value, name) {
      this.formData[name] = ("" + value).replace(/\D/g, "");
    },
    limitInput1(value, name) {
      let arr = ("" + value).split(",");
      let arr1 = [];
      let str = "";
      console.log(arr);
      arr.forEach((item, index) => {
        if (index < 2) {
          console.log(index);
          arr1.push(item.match(/^\d+(?:\.\d{0,5})?/)[0]);
        }
      });
      if (arr1.length == 1) {
        str = arr1[0];
        console.log(str, "1");
      } else {
        str = arr1.join(",");
        console.log(str, "2");
      }
      this.formData[name] = str;
      console.log(this.formData[name]);
    },

    //获取监测项目字典
    async jcxmDictItem() {
      const { data } = await getDictItemList("jkfw");
      this.DitSpeciality = data;
    },
    //获取监测项目字典
    async jcxmDictItem2() {
      const { data } = await getDictItemList("jklx");
      this.jklxList = data;
    },
    async jcxmDictItem3() {
      const { data } = await getDictItemList("jksblx");
      this.jksblxList = data;
    },
    async getSelection() {
      const { data } = await getSection({});
      this.sectionList = data;
    },
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      if (this.type == "view") {
        this.dialogShow = false;
        return;
      }
      let fields = { ...this.formData };
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          if (this.type == "add") {
            save(fields)
              .then((res) => {
                const { success, message, data } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$emit("ok");
                }
                this.closedHandle();
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("新增失败");
              });
          } else {
            update(fields)
              .then((res) => {
                const { success, message, data } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$emit("ok");
                }
                this.closedHandle();
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("更新失败");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    getpos(e) {
      console.log(e, "父组件获取");
      this.point = e.join(",");
      this.pointShow = true;
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;

  .table {
    :deep(.el-table__row .cell button) {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
  }
}

.subTabeHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-col .el-input {
  width: 60%;
}

.el-select {
  width: 100%;
}

:deep(.el-input-group__append) {
  color: #0096ff;
  border: 1px solid #0096ff;
  cursor: pointer;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}

:deep(.el-col .el-input) {
  width: 100%;
}

.bim-content {
  border: 1px solid #eee;
  height: 60vh;
  margin: 0px 10px 10px 10px;
  border-right: 1px solid #eee;
}

.el-form {
  .el-row {
    margin-bottom: 8px;
  }
}
</style>
