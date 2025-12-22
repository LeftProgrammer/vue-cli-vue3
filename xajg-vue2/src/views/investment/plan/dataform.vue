<template>
  <div class="data-form-container">
    <el-row class="form-content">
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <div v-if="!readonly" class="button-container">
          <el-button type="primary" @click="save"> 确定 </el-button>
        </div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="计划名称" prop="name" label-width="120px">
              <el-input
                v-model="formData.name"
                :disabled="readonly"
                style="width: 100%"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划年度" prop="year" label-width="120px">
              <el-date-picker
                v-model="formData.year"
                type="year"
                :disabled="readonly || formData.id"
                style="width: 100%"
                placeholder="选择年"
                @change="yearChangeHandle"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
            <span class="title"> 计划明细 </span>
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
                导入计划
              </el-button>
            </div>
          </div>
        </el-row>
        <el-row class="table-container">
          <el-col :span="24" class="table-wrapper">
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
                fixed="left"
                width="120"
              />
              <el-table-column
                label="概算项"
                fixed="left"
                prop="estimateName"
                header-align="center"
                min-width="180"
              />
              <el-table-column
                label="单位"
                prop="unit"
                align="center"
                width="120"
              />
              <el-table-column
                label="工程量"
                prop="quantity"
                align="center"
                width="140"
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
                v-for="(item, index) in month"
                :key="item"
                :label="`${
                  formData.year ? dateFormat(formData.year, 'YYYY') : 'xxxx'
                }年${index + 1}月`"
                align="center"
                width="120"
              >
                <el-table-column
                  label="工程量"
                  :prop="`quantity${item}`"
                  align="center"
                  width="140"
                >
                  <template #default="{ row }">
                    <el-input-number
                      v-if="!readonly"
                      v-model="row[`quantity${item}`]"
                      style="width: 100%"
                      :controls="false"
                      :precision="2"
                    />
                    <span v-else>{{ row[`quantity${item}`] }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="投资"
                  :prop="`invest${item}`"
                  align="center"
                  width="150"
                >
                  <template #default="{ row }">
                    <el-input-number
                      v-if="!readonly"
                      v-model="row[`invest${item}`]"
                      style="width: 100%"
                      :controls="false"
                      :precision="2"
                    />
                    <span v-else>{{ row[`invest${item}`] }}</span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="!readonly"
                label="操作"
                align="center"
                width="80"
              >
                <template #default="{ row }">
                  <el-link type="danger" @click="deleteRow(row)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      @change="handleFileUpload"
    >

    <!-- 概算选择对话框 -->
    <estimate-selector
      v-if="estimateSelectorVisible"
      :estimate-list="existingEstimates"
      :visible="estimateSelectorVisible"
      @confirm="handleEstimateConfirm"
      @close="estimateSelectorVisible = false"
    />
  </div>
</template>

<script>
import { save, update } from "./api";
import {
  getEstimateList,
  deleteInvestmentPlanDetailList,
} from "@/api/estimate.js";
const Decimal = require("decimal.js");
Decimal.set({ precision: 50 });
import { dateFormat } from "@/utils";
import * as XLSX from "xlsx";
import EstimateSelector from "@/components/EstimateSelector";

export default {
  name: "DataForm",
  components: {
    EstimateSelector,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      estimateList: [],
      isFormApp: false,
      showHiddenDangerRectifier: false,
      //合同信息字典
      ntkoClose: false, //签章组件关闭状态
      formData: {},
      formDataRules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        year: [{ required: true, message: "请选择", trigger: "change" }],
        contractId: [{ required: true, message: "请选择", trigger: "change" }],
        supervisionReviewer: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        ownerEngineeringReviewer: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        ownerContractDepartment: [
          { required: true, message: "请选择", trigger: "change" },
        ],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/investment/plan/page",
      },
      contractList: [],
      detailData: [],
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
      // 概算选择器相关数据
      estimateSelectorVisible: false,
      existingEstimates: [],
      selectedEstimates: [],
    };
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
  },
  created() {},
  mounted() {},
  // 页面离开时触发
  beforeDestroy() {
    if (this.fromapp) {
      const titleElement = document.getElementById("dynamicTitle");
      // 设置动态标题
      titleElement.textContent = "雄安调蓄工程建设管理系统";
    }
  },
  methods: {
    dateFormat,
    deleteRow(row) {
      console.log("删除行", row);
      const idList = [];

      this.month.forEach((y, i) => {
        let id = row[y + "Id"]; // 这里把原来的 obj 改成了 row
        if (id) {
          idList.push(String(id));
        }
      });

      if (idList.length == 0) {
        // 如果没有需要删除的ID，直接从表格中移除
        const index = this.detailData.findIndex(
          (item) => item.estimateCode === row.estimateCode
        );
        if (index !== -1) {
          this.detailData.splice(index, 1);
          this.$message.success("删除成功");
        }
      } else {
        console.log("idList", idList);
        // 当需要删除后端数据时，先提示用户
        this.$confirm("此操作将永久删除该条记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 用户确认删除，调用API删除后端数据
            deleteInvestmentPlanDetailList(idList)
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

    /**
     * @description 获取概算项list
     */
    async getEstimateList() {
      try {
        this.loading = true;
        console.log("获取概算项列表");
        const res = await getEstimateList();
        if (res.success) {
          this.estimateList = res.data || [];
          console.log("this.estimateList", this.estimateList);
          return this.estimateList;
        } else {
          this.$message.error("获取概算项列表失败：" + res.message);
          return [];
        }
      } catch (error) {
        console.error("获取概算项列表出错", error);
        this.$message.error("获取概算项列表失败");
        return [];
      } finally {
        this.loading = false;
      }
    },
    /**
     * 通过ref接收父组件传递的数据
     * @param {Object} row 行数据
     */
    async setFormData(row) {
      await this.getEstimateList();
      if (row) {
        // 将数据设置到表单中
        this.formData = JSON.parse(JSON.stringify(row || {}));
        // 如果有日期字段，进行格式化
        if (this.formData.createDate) {
          this.formData.createDate = dateFormat(
            this.formData.createDate,
            "YYYY-MM-DD"
          );
        }
        console.log("row", row);
        // 如果有明细数据，处理明细数据
        if (row.investmentPlanDetails && row.investmentPlanDetails.length > 0) {
          let estimateIdList = [];
          row.investmentPlanDetails.forEach((x) => {
            estimateIdList.push(x.estimateId);
          });
          estimateIdList = [...new Set(estimateIdList)];
          console.log(estimateIdList, "estimateIdList", this.estimateList);
          let detailObj = {};
          estimateIdList.forEach((eid) => {
            let tmpList = row.investmentPlanDetails.filter(
              (detail) => detail.estimateId == eid
            );
            detailObj[eid] = tmpList.sort((a, b) => a.month - b.month);
          });
          console.log(detailObj, "detailObj");
          this.detailData = estimateIdList.map((x) => {
            let estimate = this.estimateList.find((item) => item.id == x);
            let obj = {};
            this.month.forEach((y, i) => {
              obj["quantity" + y] = detailObj[x][i].quantity;
              obj["invest" + y] = detailObj[x][i].planInvestmentAmount;
              obj[y + "Id"] = detailObj[x][i].id;
            });
            return {
              estimateId: estimate.id,
              estimateCode: estimate.code,
              estimateName: estimate.name,
              unit: estimate.unit,
              quantity: estimate.quantity,
              price: estimate.estimateUnitPrice,
              totalPrice: estimate.estimateTotalPrice,
              ...obj,
            };
          });
          console.log(this.detailData, "this.detailData");
        }
      } else {
        // 初始化空表单
        this.formData = {
          createUsername: this.userInfo.realName,
          createDate: dateFormat(new Date(), "YYYY-MM-DD"),
        };
        this.detailData = [];
      }
    },

    /**
     * @description 合同切换
     * @param val
     */
    yearChangeHandle(val) {
      console.log("切换年度");
      if (!this.formData.year) this.$message.info("请先选择年份");
      // this.detailData = [];
      // this.estimateList.forEach((x) => {
      //   this.detailData.push({
      //     estimateId: x.id,
      //     estimateCode: x.code,
      //     estimateName: x.name,
      //     unit: x.unit,
      //     price: x.estimateUnitPrice,
      //     totalPrice: x.estimateTotalPrice,
      //     quantity: x.quantity,
      //     baseId: this.formData.id,
      //   });
      // });
    },
    /**
     * @description 下载模版
     */
    downloadTemp() {
      if (!this.formData.year) {
        this.$message.info("请选择计划年度");
        return;
      }
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
          "2025年1月",
          "",
          "2025年2月",
          "",
          "2025年3月",
          "",
          "2025年4月",
          "",
          "2025年5月",
          "",
          "2025年6月",
          "",
          "2025年7月",
          "",
          "2025年8月",
          "",
          "2025年9月",
          "",
          "2025年10月",
          "",
          "2025年11月",
          "",
          "2025年12月",
        ], // 第一行表头（多级）
        [
          "概算编码",
          "概算名称",
          "单位",
          "工程量",
          "单价",
          "合价",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
          "工程量",
          "投资",
        ], // 第二行表头
        ...data.map((row) => [
          row.estimateCode,
          row.estimateName,
          row.unit,
          row.quantity,
          row.price,
          row.totalPrice,
        ]),
      ];

      // 将数据转换为工作表
      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      // 设置合并单元格，合并多级表头的单元格
      ws["!merges"] = [
        { s: { r: 0, c: 6 }, e: { r: 0, c: 7 }},
        { s: { r: 0, c: 8 }, e: { r: 0, c: 9 }},
        { s: { r: 0, c: 10 }, e: { r: 0, c: 11 }},
        { s: { r: 0, c: 12 }, e: { r: 0, c: 13 }},
        { s: { r: 0, c: 14 }, e: { r: 0, c: 15 }},
        { s: { r: 0, c: 16 }, e: { r: 0, c: 17 }},
        { s: { r: 0, c: 18 }, e: { r: 0, c: 19 }},
        { s: { r: 0, c: 20 }, e: { r: 0, c: 21 }},
        { s: { r: 0, c: 22 }, e: { r: 0, c: 23 }},
        { s: { r: 0, c: 24 }, e: { r: 0, c: 25 }},
        { s: { r: 0, c: 26 }, e: { r: 0, c: 27 }},
        { s: { r: 0, c: 28 }, e: { r: 0, c: 29 }},
      ];

      // 创建一个工作簿
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // 导出 Excel 文件
      XLSX.writeFile(wb, "计划投资结算明细模版.xlsx");
    },
    /**
     * @description 导入计划
     */
    triggerFileInput() {
      this.$nextTick(() => {
        this.$refs.fileInput.click();
      });
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
        estimateCode: "概算编码",
        estimateName: "概算名称",
        unit: "单位",
        quantity: "工程量",
        price: "单价",
        totalPrice: "合价",
        quantityJan: "工程量_1",
        quantityFeb: "工程量_2",
        quantityMar: "工程量_3",
        quantityApr: "工程量_4",
        quantityMay: "工程量_5",
        quantityJun: "工程量_6",
        quantityJul: "工程量_7",
        quantityAug: "工程量_8",
        quantitySep: "工程量_9",
        quantityOct: "工程量_10",
        quantityNov: "工程量_11",
        quantityDec: "工程量_12",
        investJan: "投资",
        investFeb: "投资_1",
        investMar: "投资_2",
        investApr: "投资_3",
        investMay: "投资_4",
        investJun: "投资_5",
        investJul: "投资_6",
        investAug: "投资_7",
        investSep: "投资_8",
        investOct: "投资_9",
        investNov: "投资_10",
        investDec: "投资_11",
      };

      reader.onload = (e) => {
        let that = this;
        const data = new Uint8Array(e.target.result);
        console.log(XLSX);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { range: 1 }); //加上{header:1}会把第一行作为表头
        console.log("🚀 ~ handleFileUpload ~ jsonData:", jsonData);

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
              quantityJan: item[fieldMap.quantityJan],
              quantityFeb: item[fieldMap.quantityFeb],
              quantityMar: item[fieldMap.quantityMar],
              quantityApr: item[fieldMap.quantityApr],
              quantityMay: item[fieldMap.quantityMay],
              quantityJun: item[fieldMap.quantityJun],
              quantityJul: item[fieldMap.quantityJul],
              quantityAug: item[fieldMap.quantityAug],
              quantitySep: item[fieldMap.quantitySep],
              quantityOct: item[fieldMap.quantityOct],
              quantityNov: item[fieldMap.quantityNov],
              quantityDec: item[fieldMap.quantityDec],
              investJan: item[fieldMap.investJan],
              investFeb: item[fieldMap.investFeb],
              investMar: item[fieldMap.investMar],
              investApr: item[fieldMap.investApr],
              investMay: item[fieldMap.investMay],
              investJun: item[fieldMap.investJun],
              investJul: item[fieldMap.investJul],
              investAug: item[fieldMap.investAug],
              investSep: item[fieldMap.investSep],
              investOct: item[fieldMap.investOct],
              investNov: item[fieldMap.investNov],
              investDec: item[fieldMap.investDec],
            });
          });
        that.detailData = newArr;
        newArr.forEach((x) => {
          x.estimateCode;
          let tmp = that.detailData.find(
            (detail) => detail.estimateCode == x.estimateCode
          );
          if (tmp) {
            tmp.update(x);
          } else {
            tmp.add(x);
          }
        });
        that.$refs.fileInput.value = ""; // 清空input方便下次继续上传
      };
      reader.readAsArrayBuffer(file);
    },
    save() {
      // 先进行表单校验
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          return;
        }

        // // 验证每月投资数据
        // let hasError = false;
        // for (let i = 0; i < this.detailData.length; i++) {
        //   const item = this.detailData[i];
        //   for (let j = 0; j < this.month.length; j++) {
        //     const monthKey = this.month[j];
        //     if (
        //       item["invest" + monthKey] === undefined ||
        //       item["quantity" + monthKey] === undefined
        //     ) {
        //       this.$message.error(
        //         `${item.estimateName || ""}的${j + 1}月数据不完整`
        //       );
        //       hasError = true;
        //       break;
        //     }
        //   }
        //   if (hasError) break;
        // }

        // if (hasError) return;

        // 计划计划投资金额
        let totalInvestmentAmount = 0;
        this.detailData.forEach((x) => {
          this.month.forEach((y) => {
            totalInvestmentAmount += Number(x["invest" + y]) || 0;
          });
        });
        this.formData.totalInvestmentAmount = totalInvestmentAmount;
        this.formData.year = dateFormat(this.formData.year, "YYYY");

        const tmpDetailArr = [];
        for (let i = 0; i < this.detailData.length; i++) {
          for (let j = 0; j < this.month.length; j++) {
            const monthKey = this.month[j];
            tmpDetailArr.push({
              baseId: this.formData.id,
              estimateId: this.detailData[i].estimateId,
              estimateCode: this.detailData[i].estimateCode,
              month: j + 1,
              quantity: this.detailData[i]["quantity" + monthKey],
              planInvestmentAmount: this.detailData[i]["invest" + monthKey],
              id: this.detailData[i][monthKey + "Id"],
            });
          }
        }
        this.formData.investmentPlanDetails = tmpDetailArr;

        // 根据是否有ID决定使用save还是update
        const apiMethod = this.formData.id ? update : save;

        apiMethod(this.formData)
          .then((res) => {
            const { success, message } = res;
            if (!success) {
              return this.$message.error("保存失败：" + message);
            } else {
              this.$message.success(this.formData.id ? "更新成功" : "保存成功");
              this.$emit("save-success");
            }
          })
          .catch((err) => {
            console.error(err);
            this.$message.error("保存失败");
          });
      });
    },
    // 显示概算选择器
    showEstimateSelector() {
      if (!this.formData.year) {
        this.$message.warning("请先选择计划年度");
        return;
      }

      // 获取已有的概算编码
      const existingEstimateCodes = this.detailData.map(
        (item) => item.estimateCode
      );
      this.existingEstimates = this.estimateList.filter(
        (e) => !existingEstimateCodes.includes(e.code)
      );
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
            key: item.code, // 添加key属性，使用estimateCode作为唯一标识
            estimateId: item.id,
            estimateCode: item.code,
            estimateName: item.name,
            unit: item.unit || "",
            quantity: item.quantity || 0,
            price: item.estimateUnitPrice || 0,
            totalPrice: item.estimateTotalPrice || 0,
            baseId: this.formData.id,
          };

          // 初始化每月数据
          this.month.forEach((monthKey) => {
            newRow[`quantity${monthKey}`] = null;
            newRow[`invest${monthKey}`] = null;
          });

          this.detailData.push(newRow);
        }
      });

      this.estimateSelectorVisible = false;
      this.$message.success(`已添加${selectedItems.length}个概算项目到表格中`);
    },
  },
};
</script>

<style scoped lang="scss">
// 单独处理  上传样式
.data-form-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.button-container {
  margin-bottom: 16px;
}

.form-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; // 解决flex布局嵌套滚动问题
  margin-bottom: 10px;
  position: relative; // 添加相对定位
  overflow: hidden; // 防止溢出
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: visible; // 修改为可见，让滚动条可以溢出
  min-height: 0;
}

.detail-table {
  max-height: 100%;
  height: calc(100% - 17px) !important; // 为滚动条预留精确空间
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
  overflow-x: auto !important;
  height: calc(100% - 15px) !important; // 减少高度以显示横向滚动条
  padding-bottom: 5px; // 底部添加内边距确保滚动条完全可见
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

/deep/.el-upload {
  text-align: left;
}
/deep/ .el-table {
  width: 100%;
  display: flex;
  flex-direction: column;

  .el-table__header-wrapper {
    flex-shrink: 0; // 表头不压缩
  }

  .el-table__body-wrapper {
    flex: 1; // 表体占据剩余空间
    overflow-y: auto !important;
    overflow-x: auto !important;
    min-height: 0; // 重要：允许flex项目正确滚动
  }

  table {
    width: 100%;
    min-width: 100%;
  }
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
</style>
