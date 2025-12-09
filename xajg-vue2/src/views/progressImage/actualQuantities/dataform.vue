<template>
  <div>
    <el-dialog
      :title="title"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      v-draggable
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="70%"
      @closed="closedHandle"
    >
      <el-row>
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          label-width="120px"
          :disabled="readonly"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="记录人员" prop="createUserName">
                <el-input
                  disabled
                  v-model="formData.createUserName"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!-- departName -->
              <el-form-item label="施工单位" prop="unitId">
                <el-select @visible-change="$visibleChange($event, 'el-popper')"
                           class="w-100pre"
                           v-model="formData.unitId"
                           placeholder="请选择"
                           @change="belongUnitChange"
                >
                  <el-option
                    v-for="item in belongUnit"
                    :key="item.corpId"
                    :label="item.corpName"
                    :value="item.corpId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="施工日期" prop="constructionDate">
                <el-date-picker
                  v-model="formData.constructionDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="施工标段" prop="sectionId" align="center">
                <el-select @visible-change="$visibleChange($event, 'el-popper')"
                           class="w-100pre"
                           v-model="formData.sectionId"
                           @change="sectionChange"
                           placeholder="请选择"
                           clearable
                >
                  <el-option
                    v-for="item in sectionOptionsFilter"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属工程" prop="belongProjectId" align="center">
                <el-select @visible-change="$visibleChange($event, 'el-popper')"
                           class="w-100pre"
                           v-model="formData.belongProjectId"
                           placeholder="请选择"
                           @change="belongProjectChange"
                           clearable
                >
                  <el-option
                    v-for="item in projectOptionsFilter"
                    :key="item.id"
                    :label="item.belongProject"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <p class="sub-title">
                <span>实际工程量</span>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  :disabled="!formData.belongProjectId||readonly"
                  @click="handelDetailAdd()"
                >
                  新增
                </el-button>
              </p>
            </el-col>
          </el-row>
          <el-row style="height: 400px">
            <el-table
              ref="multipleTable"
              :data="formData.detailList"
              height="100%"
              border

            >
              <el-table-column
                label="序号"
                type="index"
                :width="$calculateWidth(50)"
                align="center"
              />
              <el-table-column
                label="工程部位"
                prop="pbsId"
                header-align="center"
                align="left"
                :min-width="$calculateWidth(220)"
              >
                <template slot-scope="{ row }">
                  <el-cascader :props="{
                            label:'name',
                            value:'id',
                            leaf:'leaf',
                            emitPath:false,
                          }"
                         :show-all-levels="false"
                         filterable
                         clearable
                         v-model="row.pbsId"
                         :options="pbsOptions"
                         @change="pbsChange"
                  ></el-cascader>
                </template>
              </el-table-column>

              <el-table-column v-if="isShowFiled('DSKW')" label="洞身开挖(m)" prop="code" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.dskw" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('DSZH')" label="洞身支护(m)" prop="dszh" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.dszh" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('DSCC')" label="洞身衬砌(m)" prop="dscc" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.dscc" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('DDWYJ')" label="多点位移计（套）" prop="ddwyj" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.ddwyj" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('MGYLJ_T')" label="锚杆应力计(套)" prop="mgyljT" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.mgyljT" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('TSFKW')" label="土石方开挖（m³）" prop="tsfkw" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.tsfkw" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('BPZH_MG')" label="边坡支护-锚杆（根）" prop="bpzhMg" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.bpzhMg" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('BPZH_MGS')" label="边坡支护-锚杆束（束）" prop="bpzhMgs" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.bpzhMgs" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('BPZH_MS')" label="边坡支护-锚索（束)" prop="bpzhMs" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.bpzhMs" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('LMDCJYJLM')" label="路面垫层及永久路面（m）" prop="lmdcjyjlm" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.lmdcjyjlm" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('ECCC')" label="二次衬砌（m）" prop="eccc" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.eccc" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('QBQW')" label="清表清危（m³）" prop="qbqw" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.qbqw" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('ZDW')" label="主动网（m²）" prop="zdw" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.zdw" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('BDW')" label="被动网（m）" prop="bdw" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.bdw" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('MG')" label="锚杆（根）" prop="mg" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.mg" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('MGS')" label="锚杆束（束）" prop="mgs" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.mgs" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('MS')" label="锚索（束）" prop="ms" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.ms" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('WXZ')" label="微芯桩（套）" prop="wxz" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.wxz" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('GNSS')" label="GNSS（套）" prop="gnss" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.gnss" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('MGYLJ_Z')" label="锚杆应力计（支）" prop="mgyljZ" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.mgyljZ" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('MSCLJ')" label="锚索测力计（支）" prop="msclj" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.msclj" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('ZJKW')" label="桩基开挖（m）" prop="zjkw" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.zjkw" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('ZJJZ')" label="桩基浇筑（m）" prop="zjjz" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.zjjz" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('QTJZ')" label="桥台浇筑（m³）" prop="qtjz" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.qtjz" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('JJDJZ')" label="交界墩浇筑（m）" prop="jjdjz" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.jjdjz" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('GJGZZ')" label="钢结构制作（吨）" prop="gjgzz" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.gjgzz" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('GXBZ')" label="空心板制（块）" prop="gxbz" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.gxbz" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('GZJZ')" label="拱座浇筑（m³）" prop="gzjz" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.gzjz" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('TFKW')" label="土方开挖（m³）" prop="tfkw" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.tfkw" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('ZJSG')" label="桩基施工（m）" prop="zjsg" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.zjsg" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('ZTJGHNT')" label="主体结构混凝土（m³）" prop="ztjghnt" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.ztjghnt" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('ECJGQZ')" label="二次结构砌筑（m³）" prop="ecjgqz" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.ecjgqz" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('JGGC')" label="机电工程（%）" prop="jggc" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.jggc" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('ZXGC')" label="装修工程（%）" prop="zxgc" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.zxgc" type="number" />
                </template>
              </el-table-column>
              <el-table-column v-if="isShowFiled('YLGC')" label="园林工程（%）" prop="ylgc" header-align="center" align="left" :width="$calculateWidth(200)" >
                <template slot-scope="{ row }">
                  <el-input v-model="row.ylgc" type="number" />
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                width="100"
                align="center"
              >
                <template #default="{ row,$index }">
                  <el-link
                    @click="deleteData(row,$index)"
                    type="danger"
                    plain
                    :disabled="readonly"
                  >
                    删除
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-row>

        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="childEvtHandle" v-if="type != 'view'">
          确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { save, BelongTo, getPbsTree } from './api';
import { dateFormat } from "@/utils";
import { getDictItemList } from "@/api/dict";
import { FormMixin } from "@/mixins/FormMixin";
import { sectionList } from '@/views/progress/ConstructionLog/api-v2';
import { getConfigureList } from '@/views/progressImage/designQuantities/api';
import FlowButton from '@/components/FlowHandle/Button/index.vue';
import FlowStatus from '@/components/FlowHandle/Status/index.vue';
export default {
  name: "dataform",
  components: { FlowStatus, FlowButton },
  mixins: [FormMixin],
  data() {
    return {
      /**施工标段 */
      sectionOptionsFilter: [],
      sectionOptions: [],
      /**所属工程 */
      projectOptions: [],
      projectOptionsFilter: [],
      cover: "",
      baseUrl: "",
      // readonly: false,
      imgShow: false,
      imgUrl: "",
      component: "MonthlyPlan",
      uploadFileList1: [],
      uploadFileList3: [],
      dialogPlanVisible: false,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },

      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        detailList:[]
      },
      formDataRules: {
        createUserName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        unitId: [{ required: true, message: "请选择", trigger: "change" }],
        constructionDate: [{ required: true, message: "请选择", trigger: "change" }],
        sectionId: [{ required: true, validator: this.checkSection, trigger: "blur" }],
        belongProjectId: [{ required: true, validator: this.checkProjectValidator, trigger: "blur" }],
      },

      /**部门选择 */
      deptDialog: {
        selection: [],
        show: false,

        /**业务数据 */
        data: {},
        /**业务字段 */
        fields: []
      },
      deptTypes: [],

      /**组织机构选择 */
      deptShow: false,

      belongUnitSouce: [], //备份 源所属机构
      belongUnit: [], //过滤出重复的单位
      checkProject:'',
      pbsOptions: []
    };
  },
  computed: {

  },
  async created() {
    // this.getSectionList();
    // await this.getProject();
  },
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    selectDateStr: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    checkSection(rule,value,callback){
      value=this.formData.sectionId;
      if(!value){
        callback(new Error("请选择"))
      }else{
        callback()
      }
    },
    checkProjectValidator(rule,value,callback){
      value=this.formData.belongProjectId;
      if(!value){
        callback(new Error("请选择"))
      }else{
        callback()
      }
    },
    sectionChange(id){
      console.log(this.projectOptions,id)
      this.projectOptionsFilter = this.projectOptions.filter(item=>(item.pbsSectionId+'')===(id+''))
      console.log(this.projectOptionsFilter)
      if(this.projectOptionsFilter.findIndex(item=>(item.id+'')===(this.formData.belongProjectId+''))===-1){
        this.formData.belongProjectId = '';
      }
    },
    belongUnitChange(id){
      console.log(this.sectionOptions,id)
      this.sectionOptionsFilter = this.sectionOptions.filter(item=>(item.secondUnit+'')===(id+''))
      console.log(this.sectionOptionsFilter)
      if(this.sectionOptionsFilter.findIndex(item=>(item.id+'')===(this.formData.sectionId+''))===-1){
        this.formData.sectionId = '';
      }
    },
    isShowFiled(field){
      return this.checkProject?.quantityTarget?.split(",").includes(field);
    },
    handelDetailAdd(){
      this.formData.detailList.push({});
    },
    deleteData(data,index){
      this.formData.detailList.splice(index,1)
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    belongProjectChange(isInit) {
      this.checkProject = ''
      this.pbsOptions = []
      if(isInit!==true) {
        this.formData.detailList = []
      }

      let project = this.projectOptions.find(item => (item.id+'') === (this.formData.belongProjectId+''));
      if (project) {
        this.checkProject = project;
        this.getPbsOption(project.pbsId);
      }
    },
    pbsChange(){
      console.log(this.pbs)
    },
    /* 获取字典 */
    async getProject() {
      const { data } = await getConfigureList();
      this.projectOptions = data
      console.log("projectOptions",this.projectOptions);
    },
    async getPbsOption(pbsId) {
      const { data } = await getPbsTree({id:pbsId});
      this.setIsChild(data)
      this.pbsOptions = data
      console.log("pbsOptions",this.pbsOptions);
    },
    setIsChild(data){
      data.forEach(item=>{
        if(item.children && item.children.length===0){
          item.children=''
        }else {
          this.setIsChild(item.children)
        }
      });
    },
    /**获取施工标段 */
    async getSectionList() {
      this.sectionOptions = [];
      let res = await sectionList({});
      if (res.success) {
        console.log("sectionList", res.data);
        this.sectionOptions = res.data;
      }
    },
    //获取监测项目字典
    async jcxmDictItem(code) {
      const { data } = await getDictItemList(code);
      this.DitSpeciality = data;
    },

    // 获取当前人的所属机构
    async getBelongTo(row) {
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: row.createUser || userInfo.userId
      };
      try {
        const res = await BelongTo(params);
        const { data, success } = res;

        if (!success) {
          this.$message.error("获取当前人的所属机构错误");
          // 源数据
          this.belongUnit = [];
          return;
        }

        if (Array.isArray(data) && data?.length > 0) {
          this.belongUnitSouce = data;
          // 从源数据中过滤出重复的单位
          this.belongUnit = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.corpId === item.corpId)
          );
          console.log("this.belongUnitSouce", this.belongUnitSouce, row);
          // 从源数据中过滤出默认单位
          if (row?.unitId) {
            // await this.unitChangeHandle(row.unit);
          } else {
            let defaultUnit = this.belongUnitSouce.find((x) => x.defaultOrg);
            if (defaultUnit) {
              this.$set(this.formData, "unitId", defaultUnit.corpId);
            } else {
              this.formData.unitId = "";
              this.$refs.dataFormRef.clearValidate("contractId");
            }
          }
        } else {
          this.belongUnit = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },

    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      console.log(this.formData)
      //做业务数据的保存,修改。
      this.$refs["dataFormRef"].validate((valid) => {
        // if (this.formData.sectionId) {
        //   this.$refs.dataFormRef.clearValidate('sectionId');
        // }
        // if (this.formData.belongProjectId) {
        //   this.$refs.dataFormRef.clearValidate('belongProjectId');
        // }
        if (valid) {
          if (this.type == "view") {
            this.dialogShow = false;
            return;
          }
          let fields = { ...this.formData };

          console.log(fields)

          save(fields)
            .then((res) => {
              const { success, message } = res;
              if (!success) {
                return this.$message.error("保存失败：" + message);
              } else {
                this.$message.success(this.type == "add"?"新增成功":"更新成功");
                this.$emit("ok");
              }
              this.closedHandle();
            })
            .catch((err) => {
              console.error(err);
              this.$message.error(this.type == "add"?"新增失败":"更新失败");
            });

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    // 初始化
    async init() {
      if (this.type === "edit" || this.type === "view") {
        // await this.getProject();
        this.formData = JSON.parse(JSON.stringify(this.data));
        this.formData.belongProjectId = Number(this.formData.belongProjectId)
        let constructionDate = dateFormat(this.formData.constructionDate, "YYYY-MM-DD");
        this.$set(this.formData, "constructionDate", constructionDate);

        // this.$set(this.formData, "belongProjectId", this.formData.belongProjectId);
        this.belongProjectChange(true);

      } else {
        this.formData = {detailList: []}
        let userInfo = this.$getStorage("userInfo");
        this.formData.createUserName = userInfo.realName;
        this.$set(this.formData, "constructionDate", this.selectDateStr);
      }

    }
  },
  watch: {
    visible: {
      async handler(newValue) {
        let newData = { ...this.data };
        await this.getSectionList();
        await this.getProject();
        if (newValue) {
          console.log(this.selectDateStr)
          this.init();
        } else {
          this.formData = {detailList: []};
        }

        await this.getBelongTo(newData);
        console.log(this.formData)
        this.belongUnitChange(this.formData.unitId)
        this.sectionChange(this.formData.sectionId)
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  .table {
    /deep/ .el-table__row .cell button {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
  }
}

.el-select {
  width: 100%;
}

.subTabeHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}

::v-deep {
  .el-col .el-input {
    width: 100%;
  }
}

/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/deep/.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  display: block;
}

/deep/.avatar-uploader .el-upload-list__item {
  height: 70px;
  width: 70px;
}

/deep/.avatar-uploader .el-upload--picture-card {
  height: 70px;
  width: 70px;
  line-height: 70px;
}
</style>
<style scoped lang="scss">
.el-form {
  .el-row {
    margin-bottom: 8px;
  }
}


.sub-title{
  font-weight: 1000;
  color: #282424;
  font-size: 15px;
  display: flex;
  /* padding: 0 0 8px 8px; */
  /* margin-bottom: 14px; */
  /* border-bottom: 1px #ccc solid; */
  justify-content: space-between;
  align-items: baseline;
}

/deep/ .el-table__header-wrapper{
  border-radius: 5px;
}

/deep/ .el-table__header .el-table__cell{
  text-align: center;
  background-color: #1298fa;
  .cell{
    color: #fff;
  }
}

/deep/ .el-table__body-wrapper{
  height: 355px !important;
}
</style>
