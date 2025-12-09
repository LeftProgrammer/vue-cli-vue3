<template>
  <div class="data-form-container" ref="formContainer">
    <div class="button-container" v-if="!readonly">
      <el-button type="primary" @click="save"> 确定 </el-button>
    </div>
    <div class="form-content">
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="概算类型" prop="type">
              <el-select
                v-model="formData.type"
                placeholder="请选择"
                style="width: 100%"
                @change="generateTable"
              >
                <el-option label="合同预算" value="1" />
                <el-option label="非合同预算" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="投资月份" prop="month">
              <el-date-picker
                v-model="formData.month"
                type="month"
                :disabled="readonly || !!formData.id"
                style="width: 100%"
                format="yyyy年MM月"
                value-format="yyyy-MM"
                @change="monthChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划投资:" prop="planInvestmentAmount">
              <el-input v-model="formData.planInvestmentAmount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="本月投资金额:" prop="actualInvestmentAmount">
              <el-input v-model="formData.actualInvestmentAmount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="upload-container">
            <el-form-item label="文件上传" prop="attachment">
              <uploadFile
                v-model="formData.attachment"
                accept=".png,.jpg,.jpeg"
                :limit="5"
                :max-size="50"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div v-if="!readonly" class="cotntainer">
            <span class="title"> 实际投资明细 </span>
            <div>
              <el-button
                type="primary"
                :disabled="readonly"
                @click="showEstimateSelector"
              >
                新增明细
              </el-button>
              <el-button :disabled="readonly" @click="downloadTemp">
                下载模版
              </el-button>
              <el-button :disabled="readonly" @click="triggerFileInput">
                导入明细
              </el-button>
            </div>
          </div>
        </el-row>
      </el-form>

      <input
        type="file"
        ref="fileInput"
        style="display: none"
        @change="handleFileUpload"
      />

      <!-- 概算选择对话框 -->
      <estimate-selector
        v-if="estimateSelectorVisible"
        :key="dialogKey"
        :estimateList="existingEstimates"
        :visible="estimateSelectorVisible"
        @confirm="handleEstimateConfirm"
        @close="estimateSelectorVisible = false"
      ></estimate-selector>
    </div>
    <div class="table-wrapper">
      <el-table
        ref="multipleTable"
        border
        :data="detailData"
        class="detail-table"
      >
        <el-table-column
          label="概算编码"
          prop="estimateCode"
          header-align="center"
          width="120"
        />
        <el-table-column
          label="概算名称"
          header-align="center"
          prop="estimateName"
          min-width="180"
        />
        <el-table-column label="单位" prop="unit" align="center" width="120" />
        <el-table-column
          label="工程量"
          prop="quantity"
          align="center"
          width="120"
        />
        <el-table-column
          label="单价"
          prop="price"
          header-align="center"
          align="right"
          width="120"
        />
        <el-table-column
          label="合价"
          prop="totalPrice"
          header-align="center"
          align="right"
          width="120"
        />
        <el-table-column
          prop="quantity"
          align="center"
          label="计划工程量"
          width="120"
        />
        <el-table-column
          prop="planInvestmentAmount"
          label="计划投资"
          header-align="center"
          align="right"
          width="120"
        >
          <template #default="{ row }">
            <div v-if="!readonly">
              <el-input-number
                v-model="row.planInvestmentAmount"
                style="width: 100%"
                :controls="false"
                @blur="tableParValueChange(row)"
              />
            </div>
            <span v-else>{{ row.planInvestmentAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="actualInvestmentAmount"
          label="实际投资"
          align="center"
          width="120"
        >
          <template #default="{ row }">
            <div v-if="!readonly">
              <el-input-number
                v-model="row.actualInvestmentAmount"
                style="width: 100%"
                :controls="false"
                @blur="tableParValueChange(row)"
              />
              <div v-if="row.amountError" class="el-form-item__error">
                {{ row.amountError }}
              </div>
            </div>
            <span v-else>{{ row.actualInvestmentAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" align="left" label="备注">
          <template #default="{ row }">
            <el-input
              v-if="!readonly"
              v-model="row.remark"
              style="width: 100%"
            />
            <span v-else>{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          v-if="!readonly"
          width="80"
        >
          <template #default="{ row }">
            <el-link type="danger" @click="deleteRow(row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { save, update, getTotalAmountByMonth } from "./api";
// Removed workflow mixin import
const Decimal = require("decimal.js");
Decimal.set({ precision: 50 });
import { page as planPage } from "../plan/api";
import { dateFormat } from "@/utils";
import * as XLSX from "xlsx";
import { deleteRealDetail } from "@/api/estimate.js";
import {
  getEstimateList,
  getInvestmentPlanDetailList,
} from "@/views/investment/plan/api";
import EstimateSelector from "@/components/EstimateSelector";
export default {
  name: "DataForm",
  components: {
    EstimateSelector,
  },
  // Workflow mixin removed
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogKey: 0, // 用于强制更新选择器组件
      finalData: {
        0: [],
        1: [],
      },
      activeName: "first",
      isFormApp: false,
      showHiddenDangerRectifier: false,
      //合同信息字典
      ntkoClose: false, //签章组件关闭状态
      // 本地保存表单数据的副本
      formData: {},
      formDataRules: {
        type: [
          { required: true, message: "请选择预算类型", trigger: "change" },
        ],
        month: [
          { required: true, message: "请选择投资月份", trigger: "change" },
        ],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/investment/real/page",
      },
      estimateList: [], //预算项目
      type0EstimateList: [],
      type1EstimateList: [],
      investmentPlanDetailList: [], //当月的计划投资
      detailData: [], //表格数据
      // 概算选择器相关数据
      estimateSelectorVisible: false,
      existingEstimates: [],
      type: "1",
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
  },

  created() {
    if (!this.formData || Object.keys(this.formData).length === 0) {
      this.formData = {
        createName: this.userInfo?.realName,
        createDate: dateFormat(new Date(), "YYYY-MM-DD"),
      };
    }
  },

  // 页面离开时触发
  beforeDestroy() {
    if (this.fromapp) {
      const titleElement = document.getElementById("dynamicTitle");
      // 设置动态标题
      titleElement.textContent = "雄安调蓄工程建设管理系统";
    }
  },
  methods: {
    deleteRow(row) {
      console.log("删除行", row);
      if (!row.id) {
        // 如果没有需要删除的ID，直接从表格中移除
        const index = this.detailData.findIndex(
          (item) => item.estimateCode === row.estimateCode
        );
        if (index !== -1) {
          this.detailData.splice(index, 1);
          this.$message.success("删除成功");
        }
      } else {
        this.$confirm("此操作将永久删除该条记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 用户确认删除，调用API删除后端数据
            deleteRealDetail(row)
              .then((res) => {
                if (res.success) {
                  // 删除成功，从表格中移除该行
                  const index = this.detailData.findIndex(
                    (item) => item.estimateCode === row.estimateCode
                  );
                  if (index !== -1) {
                    this.detailData.splice(index, 1);
                  }
                  this.$message.success("删除成功");
                } else {
                  this.$message.error(res.message || "删除失败");
                }
              })
              .catch((err) => {
                console.error("删除失败:", err);
                this.$message.error("删除失败");
              });
          })
          .catch(() => {
            // 用户取消删除操作
            this.$message.info("删除失败");
          });
      }
    },
    async setFormData(row, type) {
      await this.getEstimateList();
      // 重置 finalData
      this.finalData = {
        0: [],
        1: [],
      };

      // 初始化表单数据
      if (type === "add") {
        // 新增模式 - 初始化空表单
        this.formData = {
          type: "1",
          name: "",
          attachment: "",
          month: undefined,
          actualInvestmentAmount: undefined,
          planInvestmentAmount: undefined,
        };
        this.detailData = [];
      } else {
        // 编辑或查看模式 - 填充表单数据
        this.formData = { ...row };
        this.formData["type"] = "1";
        // 处理子表数据，按类型分类存储
        console.log("编辑,查看", row.investmentRealDetails, this.estimateList);
        if (row.investmentRealDetails && row.investmentRealDetails.length > 0) {
          row.investmentRealDetails.forEach((detail) => {
            // 查找对应的概算项
            const estimateItem = this.estimateList.find(
              (x) => x.id == detail.estimateId
            );
            console.log("estimateItem", estimateItem);
            if (estimateItem) {
              let obj = { ...detail };
              Object.assign(obj, {
                estimateId: estimateItem.id,
                estimateCode: estimateItem.code,
                estimateName: estimateItem.name,
                unit: estimateItem.unit,
                quantity: estimateItem.quantity,
                price: estimateItem.estimateUnitPrice,
                totalPrice: estimateItem.estimateTotalPrice,
                baseId: this.formData.id,
              });
              // 按类型存储到 finalData
              if (estimateItem.type == 0) {
                this.finalData["0"].push(obj);
              } else {
                this.finalData["1"].push(obj);
              }
            }
          });

          // 默认显示当前选中类型的数据
          this.detailData = [...this.finalData[this.formData.type]];
          console.log("this.detailData", this.detailData);
        }
      }
    },
    /**
     * @description 获取计划list
     */
    async getEstimateList() {
      try {
        const res = await getEstimateList();
        this.estimateList = res.data || [];
        this.type0EstimateList = this.estimateList.filter((e) => e.type == 0);
        this.type1EstimateList = this.estimateList.filter((e) => e.type == 1);
        console.log("获取概算列表成功", this.estimateList);
        return this.estimateList;
      } catch (error) {
        console.error("获取概算列表失败:", error);
        this.$message.error("获取概算列表失败");
        return [];
      }
    },
    async getInvestmentPlanDetailList() {
      const res = await getInvestmentPlanDetailList({
        yearMonth: dateFormat(this.formData.month, "YYYY-MM"),
      });
      this.investmentPlanDetailList = res.data;
      console.log("investmentPlanDetailList", this.investmentPlanDetailList);
    },
    /**
     * @description 选中计划和月份生成表格
     */
    // 显示概算选择器对话框
    showEstimateSelector() {
      if (!this.formData.month) {
        this.$message.warning("请先选择投资月份");
        return;
      }
      // 每次打开对话框时更新dialogKey，强制重新创建组件
      this.dialogKey++;

      // 获取已有的概算编码
      const existingEstimateCodes = this.detailData.map(
        (item) => item.estimateCode
      );
      console.log("已有概算编码", existingEstimateCodes);
      this.existingEstimates = this.estimateList.filter(
        (e) =>
          !existingEstimateCodes.includes(e.code) &&
          e.type == this.formData.type
      );
      console.log("可选概算编码", this.existingEstimates);
      this.estimateSelectorVisible = true;
    },

    // 处理概算选择确认
    handleEstimateConfirm(selectedItems) {
      if (selectedItems.length === 0) {
        this.$message.warning("请至少选择一项概算");
        return;
      }

      // 处理选中的概算项，将其添加到表格中
      selectedItems.forEach((item) => {
        // 检查是否已存在相同编码的概算
        const existIndex = this.detailData.findIndex(
          (row) => row.estimateCode === item.code
        );
        if (existIndex === -1) {
          // 如果不存在，则添加新行
          const newRow = {
            estimateId: item.id,
            estimateCode: item.code,
            estimateName: item.name,
            unit: item.unit || "",
            quantity: item.quantity || 0,
            price: item.estimateUnitPrice || 0,
            totalPrice: item.estimateTotalPrice || 0,
            planInvestmentAmount: 0,
            actualInvestmentAmount: 0,
            remark: "",
            baseId: this.formData.id,
          };

          this.detailData.push(newRow);
        }
      });

      this.estimateSelectorVisible = false;
      this.$message.success(`已添加${selectedItems.length}个概算项目到表格中`);
    },

    validateForm() {
      let formValid = false;
      this.$refs.dataFormRef.validate((valid) => {
        formValid = valid;
      });
      if (!formValid) {
        return false;
      }
      // 检查是否有概算明细
      const totalDetails = Object.values(this.finalData).flat().length;
      if (totalDetails === 0) {
        this.$message.warning("请至少添加一项概算明细");
        return false;
      }
      // 检查各类型数据是否有效
      for (const type in this.finalData) {
        if (this.finalData[type].length > 0) {
          const hasError = this.finalData[type].some(
            (item) => item.amountError
          );

          if (hasError) {
            this.$message.error(
              `请正确填写${
                type === "0" ? "非合同预算" : "合同预算"
              }的实际投资金额`
            );
            return false;
          }
        }
      }
      return true;
    },

    // 额外添加一个只验证当前表格数据的方法
    validateCurrentData() {
      if (this.detailData.length === 0) {
        return true; // 空数据不需要验证
      }
      const hasError = this.detailData.some((item) => !!item.amountError);
      if (hasError) {
        this.$message.error("请正确填写当前表格中的实际投资金额");
        return false;
      }
      return true;
    },
    // 触发文件选择输入框
    triggerFileInput() {
      if (!this.formData.month) {
        this.$message.warning("请先选择投资月份");
        return;
      }
      this.$refs.fileInput.click();
    },

    generateTable(type) {
      console.log("切换预算类型", type);
      // 更精确的判断，只有 "0" 和 "1" 是有效值
      if (type !== "0" && type !== "1") return;

      // 保存原来的类型，以便必要时恢复
      const oldType = type == "0" ? "1" : "0";

      // 在切换前验证并保存当前数据
      if (this.validateCurrentData()) {
        console.log("切换预算类型,ok");
        this.finalData[oldType] = [...this.detailData];
      } else {
        console.log("切换预算类型,fail");
        // 验证失败，回退选择
        this.$nextTick(() => {
          this.formData.type = oldType; // 恢复到原来的类型
        });
        return;
      }
      if (this.finalData[type] && this.finalData[type].length > 0) {
        // 如果已有该类型的数据，直接加载
        this.detailData = [...this.finalData[type]];
      } else {
        // 否则清空表格
        this.detailData = [];
      }
      this.calculateTotalAmount();
    },
    /**
     * @description table校验 并计算总和
     * @param row
     */

    monthChange(val) {
      // 设置投资名称
      this.formData.name =
        dateFormat(this.formData.month, "YYYY-MM") + "实际投资结算明细";
      // 存储格式化后的年月字符串，供提交表单时使用
      this.formData.monthString = dateFormat(this.formData.month, "YYYY-MM");
    },
    tableParValueChange(row) {
      if (
        row.actualInvestmentAmount === undefined ||
        row.actualInvestmentAmount === null ||
        row.actualInvestmentAmount === ""
      ) {
        this.$set(row, "amountError", "实际投资不能为空！");
        return;
      } else {
        this.$set(row, "amountError", null);
        this.calculatedAmount();
      }
    },
    /**
     * @description 计算金额
     */
    calculatedAmount() {
      const amount = this.detailData.reduce(
        (acc, current) => acc + (Number(current.actualInvestmentAmount) || 0),
        0
      );
      const planAmount = this.detailData.reduce(
        (acc, current) => acc + (Number(current.planInvestmentAmount) || 0),
        0
      );
      this.$set(this.formData, "actualInvestmentAmount", amount);
      this.$set(this.formData, "planInvestmentAmount", planAmount);
    },
    /**
     * @description 合同切换
     * @param val
     */
    contractIdChangeHandle(val) {
      if (val) {
        let contract = this.contractList.find((x) => x.code === val);
        this.detailData = contract.detailVos;
      }
    },
    /**
     * @description 保存表单数据
     */
    calculateTotalAmount() {
      // 计算所有 finalData 中的总金额
      let actualTotal = new Decimal(0);
      let planTotal = new Decimal(0);

      // 遍历所有类型的数据
      for (const type in this.finalData) {
        if (this.finalData[type] && this.finalData[type].length > 0) {
          this.finalData[type].forEach((item) => {
            // 计算实际投资总额
            if (item.actualInvestmentAmount) {
              actualTotal = actualTotal.plus(item.actualInvestmentAmount);
            }
            // 计算计划投资总额
            if (item.planInvestmentAmount) {
              planTotal = planTotal.plus(item.planInvestmentAmount);
            }
          });
        }
      }
      // 更新表单中的总金额
      this.formData.actualInvestmentAmount = actualTotal.toNumber();
      this.formData.planInvestmentAmount = planTotal.toNumber();

      return {
        actualTotal: actualTotal.toNumber(),
        planTotal: planTotal.toNumber(),
      };
    },

    save() {
      // 首先保存当前正在编辑的类型数据到finalData
      if (this.formData.type) {
        if (this.validateCurrentData()) {
          this.finalData[this.formData.type] = [...this.detailData];
        } else {
          return; // 当前数据验证失败，终止保存
        }
      }

      // 验证整个表单
      if (!this.validateForm()) {
        return;
      }

      // 计算并更新总金额
      this.calculateTotalAmount();

      // 组装提交数据 - 合并所有类型的明细
      const allDetails = [
        ...(this.finalData["0"] || []),
        ...(this.finalData["1"] || []),
      ].filter((x) => x); // 过滤掉可能的空值

      // 处理月份格式 - 确保提交的是字符串格式而不是Date对象
      const submitData = {
        ...this.formData,
        month:
          this.formData.month instanceof Date
            ? dateFormat(this.formData.month, "YYYY-MM")
            : this.formData.month,
        investmentRealDetails: allDetails,
      };

      console.log("提交表单数据:", submitData);

      // 根据是否有ID决定调用更新或新增方法
      const saveMethod = submitData.id ? update : save;

      // 提交数据
      saveMethod(submitData)
        .then((res) => {
          if (res.success) {
            this.$message.success("保存成功");
            this.$emit("save-success");
          } else {
            this.$message.error(res.message || "保存失败");
          }
        })
        .catch((err) => {
          console.error("保存异常:", err);
          this.$message.error("系统异常，请稍后重试");
        });
    },

    /**
     * @description 下载模版
     */
    downloadTemp() {
      if (!this.formData.planId || !this.formData.month) {
        this.$message.error("请先选择计划和月份");
        return;
      }
      console.log(this.detailData, "00000");
      // 示例数据
      const data = this.detailData;
      // 创建一个包含多级表头的工作表
      const ws_data = [
        [
          "",
          "",
          "",
          "",
          "",
          "",
          dateFormat(this.formData.month, "yyyy年MM月"),
          "",
          "",
        ], // 第一行表头（多级）
        [
          "预算编号",
          "预算名称",
          "单位",
          "工程量",
          "单价",
          "合价",
          "计划工程量",
          "计划投资",
          "实际投资",
          "备注",
        ], // 第二行表头
        ...data.map((row) => [
          row.estimateCode,
          row.estimateName,
          row.unit,
          row.quantity,
          row.price,
          row.totalPrice,
          row.quantity,
          row.investmentAmount,
          row.remark,
          "",
        ]),
      ];
      // 将数据转换为工作表
      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      // 设置合并单元格，合并多级表头的单元格
      ws["!merges"] = [{ s: { r: 0, c: 6 }, e: { r: 0, c: 8 } }];

      // 创建一个工作簿
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // 导出 Excel 文件
      XLSX.writeFile(wb, "实际投资结算明细模版.xlsx");
    },

    /**
     * @description 读取文件
     * @param event
     */
    handleFileUpload(event) {
      const files = event.target.files;
      if (files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();
      const fieldMap = {
        estimateCode: "预算编号",
        estimateName: "预算名称",
        unit: "单位",
        quantity: "工程量",
        price: "单价",
        totalPrice: "合价",
        actualInvestmentAmount: "实际投资",
        planInvestmentAmount: "计划投资",
      };

      reader.onload = (e) => {
        let that = this;
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { range: 1 }); //加上{header:1}会把第一行作为表头
        let newArr = [];
        jsonData &&
          jsonData.length &&
          jsonData.forEach((item) => {
            newArr.push({
              estimateCode: item[fieldMap.estimateCode],
              estimateName: item[fieldMap.estimateName],
              unit: item[fieldMap.unit],
              quantity: item[fieldMap.quantity],
              price: item[fieldMap.price],
              totalPrice: item[fieldMap.totalPrice],
              investmentAmount: item[fieldMap.investmentAmount],
              realInvestmentAmount: item[fieldMap.realInvestmentAmount],
            });
          });
        that.detailData = newArr;
        that.$refs.fileInput.value = ""; // 清空input方便下次继续上传
      };
      reader.readAsArrayBuffer(file);
    },
  },
};
</script>
<style scoped lang="scss">
.data-form-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.button-container {
  flex-shrink: 0; // 不压缩按钮区域
  margin-bottom: 16px;
}

.form-content {
  flex-shrink: 0; // 不压缩表单区域
  width: 100%;
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex-grow: 1; // 占据所有剩余空间
  min-height: 300px; // 设置最小高度，确保表格始终可见
  display: flex;
  flex-direction: column;
  overflow: hidden; // 只在.table-wrapper上设置一次overflow属性
}

.detail-table {
  height: 100%;
  width: 100%;
  // 移除overflow: auto，让el-table组件自己控制滚动
}

.upload-container {
  flex-shrink: 0; // 不压缩上传区域高度
  margin-top: 10px;
}

/deep/ .el-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/deep/ .el-table__body-wrapper {
  overflow-y: auto !important;
  overflow-x: hidden !important; /* 强制隐藏横向滚动条 */
  height: 100% !important;
  margin-bottom: 0;
  border-right: 0;
}

/deep/.custom-disabled {
  .upload-demo {
    display: none;
  }
}

/deep/ .taskname {
  .el-form-item__content {
    top: 8px !important;

    .el-input__count {
      height: 25px;
      line-height: 25px;
      bottom: 3px;
      // background: transparent;
      // bottom: -3px;
    }
  }
}

/deep/ .taskname .cell {
  // overflow: auto;
  overflow: visible;
  display: flex;
  justify-content: center;
}

/deep/ .el-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .el-table__header-wrapper {
    flex-shrink: 0; // 表头不压缩
  }

  .el-table__body-wrapper {
    flex: 1; // 表体占据剩余空间
    overflow-y: auto !important;
    overflow-x: auto !important;
    min-height: 0; // 允许内容溢出时收缩
  }

  table {
    width: 100%;
    min-width: 100%;
  }
}
/deep/.el-upload {
  text-align: left;
}
/deep/ .file-list {
  margin-top: 3px !important;

  .icon {
    background-color: transparent !important;
    margin-right: 5px;
  }
}

::v-deep .el-divider--horizontal {
  margin: 18px 0;
}

::v-deep .el-table__row {
  .el-form-item__content {
    margin-left: 0px !important;
  }
}

/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
}

.cotntainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.title {
  font-weight: bold;
}

/* 对话框高度设置 */
/deep/ .estimate-dialog {
  .el-dialog {
    margin-top: 5vh !important;
    display: flex;
    flex-direction: column;
    height: 80vh;
    max-height: 80vh;
  }

  .el-dialog__body {
    flex: 1;
    overflow-y: auto;
    padding: 10px 20px;
  }
}
</style>
