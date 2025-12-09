<template>
  <!--选择PBS弹窗-->
  <el-dialog
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="960px"
    @closed="closedHandle"
  >
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="80px"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="父级PBS:" prop="pName">
              {{ formData.pName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="编码:" prop="code">
              <el-input
                v-model="formData.code"
                placeholder="请输入"
                width="100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称:" size="mini" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入"
                width="100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="层级:" size="mini" prop="pbsLayer">
              <el-select
                ref="pbsLayerRef"
                v-model="formData.pbsLayer"
                placeholder="请选择"
                disabled
                style="width: 100%"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in pbsLayerOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型:" size="mini" prop="pbsType">
              <el-select
                ref="pbsTypeRef"
                v-model="formData.pbsType"
                placeholder="请选择"
                clearable
                :disabled="formData.pbsLayer === '004'"
                style="width: 100%"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in pbsTypeOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formItemShow">
          <el-col :span="12">
            <el-form-item label="起桩号:" size="mini" prop="startStakeMark">
              <el-input-number
                v-model="formData.startStakeMark"
                placeholder="请输入"
                :precision="3"
                width="100%"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="止桩号:" size="mini" prop="endStakeMark">
              <el-input-number
                v-model="formData.endStakeMark"
                placeholder="请输入"
                :precision="3"
                width="100%"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="directionFormItemShow">
          <el-col :span="24">
            <el-form-item
              label="施工方向:"
              size="mini"
              prop="constructionDirection"
            >
              <el-select
                ref="constructionDirectionRef"
                v-model="formData.constructionDirection"
                placeholder="请选择"
                clearable
                style="width: 100%"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in sgfxType.options"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formItemShow">
          <el-col :span="24">
            <el-form-item label="BIM模型:" size="mini" prop="bimCode">
              <bim-select :bimCode.sync="formData.bimCode" :pbsCode="formData.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" size="mini" prop="remark">
              <el-input
                v-model="formData.remark"
                placeholder="请输入"
                type="textarea"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">取消</el-button>
      <el-button type="primary" @click="childEvtHandle"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save } from "../api";
import { list as sectionList } from "../../section/api";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import BimSelect from "@/components/Bim/Select";
import enums from "@/config/enums";
import { FormMixin } from "@/mixins/FormMixin";
export default {
  components: {
    BimSelect,
  },
  mixins: [FormMixin],
  data() {
    return {
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
      },

      formDataRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        pbsType: [{ required: true, message: "请选择", trigger: "blur" }],
      },

      tableData: [],

      /**部门选择 */
      deptDialog: {
        selection: [],
        show: false,

        /**业务数据 */
        data: {},
        /**业务字段 */
        fields: [],
      },
      deptTypes: [],

      /**组织机构选择 */
      deptShow: false,

      /**单位类型字典 */
      unitType: {
        code: "UNIT_TYPE",
        options: [],
      },
      /**施工方向字典 */
      sgfxType: {
        code: "sgfx",
        options: [],
      },

      /**层级 */
      pbsLayerOptions: enums.PBS_LAYER_ENUM,
      /**类型 */

      /**施工标段 */
      sectionOptions: [],
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    formItemShow() {
      if (this.formData.pbsLayer === "004") {
        return false;
      }
      return true;
    },
    pbsTypeOptions() {
      // let option = [];
      // if (this.formData.pbsLayer == "003") {
      //   option = enums.PBS_TYPE_ENUM2;
      // } else {
      //   option = enums.PBS_TYPE_ENUM;
      // }
      return enums.PBS_TYPE_ENUM["001"];
    },

    /**施工方向显隐控制 */
    directionFormItemShow() {
      if (this.formData.pbsLayer === "003") {
        return true;
      }
      return false;
    },
    /**标题 */
    title() {
      let data = this.data;
      console.log(data, this.pbsLayerOptions);
      if (data && data.pbsLayer && this.pbsLayerOptions) {
        let layer = this.pbsLayerOptions.find((x) => x.value === data.pbsLayer);
        if (layer) {
          return layer.name;
        }
      }
      return "";
    },
    /**施工标段是否可写 */
    selectionIdEnabled() {
      // if (this.data && this.data.pSectionId) {
      //   return false;
      // }
      return true;
    },
  },
  created() {
    // this.getDictItemList(this.unitType);
    this.getDictItemList(this.sgfxType);
    this.getSectionList();
    console.log("this.$route", this.$route);
  },
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
    },
    /**已经选中pbs信息 */
    data: {
      type: Object,
      default: () => {},
    },
    /**是否只读 */
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
        }
      });
    },
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      let fields = { ...this.formData };

      if (!this.beforeSubmit(this.dataFormRef)) return;
      // console.log("fields", fields);
      //做业务数据的保存,修改。
      fields.hasChild = fields.hasChild ? 0 : 1;
      save(fields)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            return this.$message.error("保存失败：" + message);
          } else {
            // this.$message.success("新增成功");
            /**新增 */
            if (!fields.id) {
              fields = Object.assign(fields, res.data);
            }
            this.$emit("ok", fields);
          }
          this.closedHandle();
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /**删除子级 */
    async deleteRow(index, rows) {
      try {
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        //删除数据
        rows.splice(index, 1);
      } catch (e) {
        console.error(e);
      }
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          this.formData = { ...this.data };
          if (this.formData.pbsLayer === "004") {
            this.formData.pbsType = "40001";
          }
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-input-number {
  width: 100%;

  .el-input {
    input {
      text-align: left;
    }
  }
}
</style>
