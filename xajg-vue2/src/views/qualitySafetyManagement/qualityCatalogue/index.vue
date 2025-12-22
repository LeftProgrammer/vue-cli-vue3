<template>
  <div class="page-file-directory">
    <TreeTableLayout
      :show-search-btns="false"
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="标段:" size="mini">
            <el-select
              v-model="searchData.sectionId"
              placeholder="请选择"
              @change="reGetTreeData"
            >
              <el-option
                v-for="item in sectionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" icon="el-icon-plus" @click="addDialog">新增</el-button>
        <el-button @click="toggleShowCode">{{
          showCode ? "隐藏编码" : "显示编码"
        }}</el-button>
      </template>
      <template slot="table">
        <div class="content">
          <div class="left-content">
            <div class="tree-wrapper" :style="{ width: treeWidth + 'px' }">
              <el-tree
                ref="tree"
                :highlight-current="true"
                class="tree"
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                node-key="id"
                :expand-on-click-node="false"
                @node-click="handelNodeClick"
              >
                <span
                  slot-scope="{ data }"
                  class="custom-tree-node"
                  :title="
                    showCode && data.code
                      ? `${data.nodeName}-${data.code}`
                      : data.nodeName
                  "
                >
                  <i
                    style="color: #014acb"
                    :class="
                      data && data.children && data.children.length > 0
                        ? 'el-icon-folder-opened'
                        : 'el-icon-folder'
                    "
                  />
                  <el-tooltip
                    effect="dark"
                    class="text-ellipsis"
                    :content="
                      showCode && data.code && data.id !== 0
                        ? `${data.code}-${data.nodeName}`
                        : data.nodeName
                    "
                    placement="top"
                  >
                    <span>{{
                      showCode && data.code && data.id !== 0
                        ? `${data.code}-${data.nodeName}`
                        : data.nodeName
                    }}</span>
                  </el-tooltip>
                </span>
              </el-tree>
            </div>
            <!-- <DragLine @moveEnd="handelMoveEnd" :minMoveX="0"></DragLine> -->
          </div>

          <div class="table-wrapper">
            <el-table :data="tableData" stripe height="100%" border>
              <el-table-column label="序号" align="center" width="80">
                <template #default="{ $index }">
                  {{
                    $index + 1 + (searchData.pageNum - 1) * searchData.pageSize
                  }}
                </template>
              </el-table-column>

              <el-table-column
                prop="nodeName"
                label="节点名称"
                show-overflow-tooltip
                align="left"
                header-align="center"
              >
                <template #default="{ row }">
                  <el-link type="primary" @click="showRow(row)">{{
                    row.nodeName
                  }}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="code"
                label="节点编码"
                align="center"
                width="120"
              />
              <el-table-column
                prop="type"
                label="分类"
                align="center"
                width="150"
              >
                <template slot-scope="{ row }">
                  {{
                    projectTypeList.find((item) => item.value === row.type)
                      ?.name
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="constructionStatus"
                label="工程状态"
                align="center"
                width="120"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  {{
                    row.constructionStatus
                      ? getConstructionStatusName(row.constructionStatus)
                      : "未开始"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="updateUserName"
                label="更新人"
                align="center"
                width="120"
              />
              <el-table-column
                prop="updateDate"
                label="更新时间"
                align="center"
                width="180"
              >
                <template #default="{ row }">
                  {{ row.updateDate?dateFormat(row.updateDate, "yyyy-MM-DD HH:mm"):'' }}
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                align="center"
                width="200px"
                fixed="right"
              >
                <template #default="{ row }">
                  <div>
                    <el-link type="primary" @click="editRow(row)">编辑
                    </el-link>
                    <el-divider direction="vertical" />
                    <el-link
                      type="danger"
                      @click="deleteArchiveFileCatalogueTree(row)"
                    >删除
                    </el-link>
                    <!-- <el-divider direction="vertical"></el-divider>
                    <el-link type="primary" :disabled="$index === 0" @click="moveupArchiveFileCatalogueTree(row)">上移
                    </el-link>
                    <el-divider direction="vertical"></el-divider>
                    <el-link type="primary" @click="movedownArchiveFileCatalogueTree(row)"
                      :disabled="$index + 1 === tableData.length">下移</el-link> -->
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <el-dialog
      v-if="showDialog"
      v-draggable
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="800px"
      :title="title"
    >
      <el-form
        ref="addForm"
        :rules="rules"
        :model="addData"
        label-width="110px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <template v-if="isAdd">
              <el-form-item label="选中的节点">
                <el-input v-model="selectionNode.nodeName" disabled />
              </el-form-item>
            </template>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点名称" prop="nodeName">
              <el-input
                v-model="addData.nodeName"
                :disabled="isSHow"
                placeholder="请输入节点名称"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点编码" prop="code">
              <el-input
                v-model="addData.code"
                :disabled="isSHow"
                placeholder="请输入节点编码"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="form-row-divider" />
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="type">
              <el-select
                v-model="addData.type"
                class="w-100pre"
                :disabled="isSHow"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in projectTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="addData.type === 'fbgc'"
              label="主要分部工程"
              prop="isMain"
            >
              <el-switch v-model="addData.isMain" :disabled="isSHow" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="form-row-divider" />
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工程状态" prop="constructionStatus">
              <el-select
                v-model="addData.constructionStatus"
                class="w-100pre"
                :disabled="isSHow"
                placeholder="请选择工程状态"
              >
                <el-option
                  v-for="item in constructionStatusList"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col v-if="addData.type == 'dwgc'" :span="12">
            <el-form-item label="标段" prop="sectionId">
              <el-select
                v-model="addData.sectionId"
                class="w-100pre"
                :disabled="isSHow"
                placeholder="请选择标段"
              >
                <el-option
                  v-for="item in allSections"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="开工日期" prop="startDate">
              <el-date-picker
                v-model="addData.startDate"
                :disabled="isSHow"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="竣工日期" prop="endDate">
              <el-date-picker
                v-model="addData.endDate"
                :disabled="isSHow"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收日期" prop="inspectionDate">
              <el-date-picker
                v-model="addData.inspectionDate"
                :disabled="isSHow"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="addData.type == 'fbgc'" :span="12">
            <el-form-item label="工程部位" prop="pbsCode">
              <pbs-select v-model="addData.pbsCode" :readonly="isSHow" />
            </el-form-item>
          </el-col>
          <el-col v-if="addData.type == 'fbgc'" :span="12">
            <el-form-item label="单元工程数量" prop="quantity">
              <el-input
                v-model="addData.quantity"
                :disabled="isSHow"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="form-row-divider" />
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="更新人" prop="updateUserName">
              <el-input v-model="addData.updateUserName" disabled placeholder="更新人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间" prop="updateDate">
              <el-input v-model="addData.updateDate" disabled placeholder="更新时间" />
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showDialog = false">{{
          isSHow ? "关闭" : "取消"
        }}</el-button>
        <el-button v-if="!isSHow" type="primary" @click="handelDialogConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArchiveFileCatalogueManagerTree,
  getarchiveFileCatalogueTreeDetailed,
  saveArchiveFileCatalogueTree,
  deleteArchiveFileCatalogueTree,
  updateArchiveFileCatalogueTree,
  movedownArchiveFileCatalogueTree,
  moveupArchiveFileCatalogueTree,
} from "./api";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import { getDictItemList } from "@/api/dict";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import DragLine from "./DragLine";
import { getSectionByCorpId } from "@/api/measure";
import { getAllSection } from "@/api/measure";
import enums from "@/config/enums";
export default {
  name: "QualityCatalogue",
  components: {
    TreeTableLayout,
    DragLine,
  },
  data() {
    return {
      showCode: false,
      projectTypeList: enums.PROJECT_TYPE_ENUM,
      allSections: [],
      queryTree: null,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "nodeName",
      },
      sectionList: [],
      searchData: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        startDate: null,
        endDate: null,
        parentId: "",
        sectionId: "",
      },
      tableData: [],
      showDialog: false,
      addData: {
        mode: 1,
        isFileNode: 0,
        unitType: "",
        unitName: "",
        constructionStatus: "wks",
        isMain: false,
        startDate: "",
        endDate: "",
        inspectionDate: "",
      },
      selectionNode: {},
      title: "",
      // typeList: [],
      rules: {
        type: {
          required: true,
          message: "请选择工程分类",
          trigger: "blur",
        },
        sectionId: {
          required: true,
          message: "请选择标段",
          trigger: "blur",
        },
        nodeName: {
          required: true,
          message: "请输入节点名称",
          trigger: "blur",
        },
        code: {
          required: true,
          message: "请输入节点编码",
          trigger: "blur",
        },
        isMain: {
          required: true,
          message: "请选择是否为主要分部工程",
          trigger: "blur",
        },
        pbsCode: {
          required: true,
          message: "请选择工程部位",
          trigger: "change",
        },
        quantity: {
          required: true,
          message: "请输入工程数量",
          trigger: "blur",
        },
      },
      isAdd: false,
      isSHow: false,
      date: [],
      modalShow: false,
      baseTreeWidth: 300, // 基础树宽度
      extraWidth: 100, // 显示编码时额外增加的宽度
      treeWidth: 300, // 实际树宽度
    };
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
  },
  watch: {
    queryTree(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.getCurrent();
    this.getDictItemList();
    this.getAllSection();
  },
  methods: {
    dateFormat,
    /* 获取当前登录人信息*/
    async getCurrent() {
      console.log("this.currentSection", this.$getStorage("userInfo"));
      this.current = this.$getStorage("userInfo");
      console.log("获取当前登陆人的单位", this.current);
      await this.getSectionList(this.current.corpId);
      if (this.sectionList.length === 0) {
        this.$message.error("查询标段失败");
        return;
      }
      this.searchData.sectionId = this.sectionList[0].id; // 必须选择一个标段
      this.searchData.parentId = "";
      const sectionIds = this.searchData.sectionId; // this.sectionList.map((item) => item.id).join(",");
      await this.getTree(sectionIds); //默认搜索 sectionList
    },
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSectionByCorpId({
          corpId: corporateId,
        });

        if (!success) {
          this.$message.error("查询标段失败：" + message);
          return false;
        }
        this.sectionList = data;
        console.log("this.sectionList", this.sectionList);
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询标段失败");
        return false;
      }
    },
    /**获取字典 */
    async getDictItemList() {
      // const typeCategory = await getDictItemList("xmhffl");
      // this.typeList = typeCategory.data;
      const constructionStatusCategory = await getDictItemList("sgzt");
      this.constructionStatusList = constructionStatusCategory.data;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /**
     *
     * @param sectionIds 标段字符串 xxx,xxx
     */
    async getTree(sectionIds) {
      let params = {};
      params.sectionIds = sectionIds;
      const res = await this.getArchiveFileCatalogueManagerTree(params);
      console.log("获取树", res);
      if (res?.length > 0) {
        const defaultNode = res[0];
        this.selectionNode = defaultNode;
        this.$nextTick(() => {
          const node = this.$refs.tree.getNode(defaultNode.id);
          this.$refs.tree.setCurrentNode(node.data);
          this.getarchiveFileCatalogueTreeDetailed();
        });
      } else {
        console.log("树为空，清空表格");
        this.searchData.parentId = null;
        this.selectionNode = null;
        this.treeData = [];
        this.tableData = [];
      }
    },
    async reGetTreeData() {
      let sectionIds = this.searchData.sectionId;
      if (!this.searchData.sectionId) {
        sectionIds = this.sectionList.map((e) => e.id).join(",");
      }
      this.getTree(sectionIds);
    },
    async getArchiveFileCatalogueManagerTree(params) {
      try {
        const { data, success, message } =
          await getArchiveFileCatalogueManagerTree(params);
        if (!success) {
          this.$message.error("获取目录树失败：" + message);
          return false;
        }
        this.treeData = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取目录树失败");
        return false;
      }
    },
    async getAllSection() {
      const { data, success, message } = await getAllSection({});
      if (!success) {
        this.$message.error("获取标段失败：" + message);
        return false;
      }
      this.allSections = data;
      return data;
    },
    // 点击搜索按按钮
    handelSearchButtonClick() {
      this.searchData.pageNum = 1;
      this.getarchiveFileCatalogueTreeDetailed();
    },
    // 查表格数据
    async getarchiveFileCatalogueTreeDetailed() {
      this.tableData = [];
      //需要提供id(父节点)必选,sectionId,可空
      try {
        const searchData = { ...this.searchData };
        searchData.parentId = this.selectionNode.id;
        searchData.sectionId = this.searchData.sectionId;
        if (!searchData.sectionId) {
          searchData.sectionId = this.sectionList
            .map((item) => item.id)
            .join(",");
        }
        const { data, success, message } =
          await getarchiveFileCatalogueTreeDetailed(searchData);
        if (!success) {
          this.$message.error("查询表格数据失败：" + message);
          return false;
        }
        this.tableData = data?.records || [];
        this.searchData.total = data?.total || 0;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询表格数据失败");
        return false;
      }
    },

    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.date = metaData.date;
      // this.query.pageNum = 1;
      // this.query.pageSize = 20;
      this.getarchiveFileCatalogueTreeDetailed();
    },
    // 点击左侧树形节点，查询表格数据
    handelNodeClick(data, node, own) {
      //   console.log(data, node, own);
      this.selectionNode = data;
      this.searchData.parentId = data.id;
      this.searchData.pageNum = 1;
      console.log("点击节点", this.selectionNode);
      this.getarchiveFileCatalogueTreeDetailed();
    },
    // 点击添加按钮
    addDialog() {
      this.title = "新增";
      this.showDialog = true;
      this.isAdd = true;
      this.isSHow = false;
      // this.$refs["addForm"] ? this.$refs["addForm"].resetFields() : "";
      this.addData = {
        mode: 0,
        nodeName: "",
        code: "",
        type: "",
        isFileNode: 0,
        unitType: "",
        unitName: "",
        constructionStatus: "wks",
        isMain: false,
        startDate: "",
        endDate: "",
        inspectionDate: "",
        updateUserName: this.userInfo.username,
        unitType: this.selectionNode.unitType || "",
        unitName: this.selectionNode.unitName || "",
        // updateDate: this.dateFormat(new Date(),"yyyy-MM-DD HH:mm"),
        updateUser: this.userInfo.userId,
      };
    },
    // 添加节点
    async saveArchiveFileCatalogueTree() {
      if (!this.selectionNode) {
        this.$message.error("请先选择左侧节点！");
        return;
      }
      try {
        if (this.addData.mode === 1) {
          // 添加根节点
          this.addData.parentId = 0;
        } else {
          this.addData.parentId = this.selectionNode.id;
        }
        this.addData.sectionId = this.searchData.sectionId
        const { data, success, message } = await saveArchiveFileCatalogueTree(
          this.addData
        );
        if (!success) {
          this.$message.error("添加失败：" + message);
          return false;
        }

        this.reGetTreeData();
        this.showDialog = false;
        return true;
      } catch (err) {
        console.error(err);
        this.$message.error("添加失败");
        return false;
      }
    },
    handelPageSizeChange(page) {
      this.searchData.pageNum = 1;
      this.searchData.pageSize = page.pageSize;
      this.getarchiveFileCatalogueTreeDetailed();
    },
    // 切换页数
    handelCurrentChange(page) {
      this.searchData.pageNum = page.current;
      this.getarchiveFileCatalogueTreeDetailed();
    },
    // 修改节点
    async updateArchiveFileCatalogueTree() {
      try {
        const { data, success, message } = await updateArchiveFileCatalogueTree(
          this.addData
        );
        if (!success) {
          this.$message.error("修改失败：" + message);
          return false;
        }
        this.$message.success("修改成功");
        this.showDialog = false;
        this.reGetTreeData();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("修改失败");
        return false;
      }
    },
    // 点击查看节点
    showRow(row) {
      this.title = "详情";
      this.addData = row;
      this.addData.isFileNode = this.addData.isFileNode
        ? parseInt(this.addData.isFileNode)
        : 0;
      // this.addData.updateDate = this.addData.updateDate
      //   ? this.dateFormat(this.addData.updateDate,"yyyy-MM-DD HH:mm")
      //   : null;
      this.addData.startDate = this.addData.startDate
        ? this.dateFormat(this.addData.startDate)
        : null;
      this.addData.endDate = this.addData.endDate
        ? this.dateFormat(this.addData.endDate)
        : null;
      this.addData.inspectionDate = this.addData.inspectionDate
        ? this.dateFormat(this.addData.inspectionDate)
        : null;
      this.isAdd = false;
      this.isSHow = true;
      this.showDialog = true;
    },
    // 关闭dialog
    handelDialogConfirm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            // 添加
            this.saveArchiveFileCatalogueTree();
          } else if (!this.isAdd && !this.isSHow) {
            // 编辑
            this.updateArchiveFileCatalogueTree();
          } else {
            // 查看
            this.showDialog = false;
          }
        }
      });
    },
    // 点击编辑按钮
    editRow(row) {
      this.addData = JSON.parse(JSON.stringify(row));
      this.addData.isFileNode = this.addData.isFileNode
        ? parseInt(this.addData.isFileNode)
        : 0;
      // this.addData.updateDate = this.addData.updateDate
      //   ? this.dateFormat(this.addData.updateDate,"yyyy-MM-DD HH:mm")
      //   : null;
      this.addData.updateUserName = this.userInfo.realName;
      this.addData.startDate = this.addData.startDate
        ? this.dateFormat(this.addData.startDate)
        : null;
      this.addData.endDate = this.addData.endDate
        ? this.dateFormat(this.addData.endDate)
        : null;
      this.addData.inspectionDate = this.addData.inspectionDate
        ? this.dateFormat(this.addData.inspectionDate)
        : null;
      this.showDialog = true;
      this.title = "编辑";
      this.isAdd = false;
      this.isSHow = false;
    },
    beforeDelete() {
      return this.$confirm("是否要删除这条数据 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
    },
    // 删除数据
    async deleteArchiveFileCatalogueTree(row) {
      try {
        await this.beforeDelete();
        const { data, success, message } = await deleteArchiveFileCatalogueTree(
          [row.id]
        );
        if (!success) {
          this.$message.error("删除失败：" + message);
          return false;
        }
        this.$message.success("删除成功!");
        this.reGetTreeData();
        return true;
      } catch (error) {
        console.error(error);
        if (error !== "cancel") {
          this.$message.error("删除失败");
        }
        return false;
      }
    },
    // 向下移动一行
    async movedownArchiveFileCatalogueTree(row) {
      try {
        const { data, success, message } =
          await movedownArchiveFileCatalogueTree(row.id);
        if (!success) {
          this.$message.error("移动失败：" + message);
          return false;
        }
        this.$message.success("移动成功");
        this.reGetTreeData();
        return true;
      } catch (error) {
        console.error(error);
        this.$message.error("移动失败");
        return false;
      }
    },
    // 向上移动一行
    async moveupArchiveFileCatalogueTree(row) {
      try {
        const { data, success, message } = await moveupArchiveFileCatalogueTree(
          row.id
        );
        if (!success) {
          this.$message.error("移动失败：" + message);
          return false;
        }
        this.$message.success("移动成功");
        this.reGetTreeData();
        return true;
      } catch (error) {
        console.error(error);
        this.$message.error("移动失败");
        return false;
      }
    },
    handelCreateCorpClick() {
      if (!this.isSHow) {
        this.modalShow = true;
      }
    },
    modalEvt({ data }) {
      this.modalShow = false;
      this.addData.unitName = (data || [])
        .map((item) => item.corpName)
        .join(",");
      this.addData.unitType = (data || []).map((item) => item.corpId).join(",");
      this.$refs.addForm.validateField("unitName");
    },
    modalEvtCancel() {
      this.modalShow = false;
    },
    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
    getConstructionStatusName(code) {
      const item = this.constructionStatusList.find(
        (item) => item.dictCode === code
      );
      return item ? item.dictName : "";
    },
    getSectionName(id) {
      const item = this.allSections.find((item) => item.id === id);
      return item ? item.name : "";
    },
    async toggleShowCode() {
      this.showCode = !this.showCode;
      // 调整树的宽度
      this.treeWidth = this.showCode
        ? this.baseTreeWidth + this.extraWidth
        : this.baseTreeWidth;
    },
  },
};
</script>

<style scoped lang="scss">
.page-file-directory {
  height: 100%;
  overflow: hidden;
  color: #fff;

  .content {
    width: 100%;
    display: flex;
    height: 100%;
    gap: 16px;

    .left-content {
      //   width: 267px;
      height: 100%;
      position: relative;
      .el-tree {
        /deep/ .el-tree-node__content {
          .custom-tree-node {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            span {
              flex: 1;
            }
          }
        }
      }
      &:hover {
        .drag-line {
          width: 5px;
          background-color: #e4e1e1;
        }
      }
    }

    .tree-wrapper {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      //   resize: horizontal;
    }

    .table-wrapper {
      flex: 1;
      width: 0;
    }
  }

  .tree-wrapper {
    // width: 267px;
    height: 100%;
    border: #e5e5e5 1px solid;
    overflow: auto;

    .tree-inner-wrapper {
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      height: 100%;
      overflow-y: hidden;

      .tree {
        overflow: auto;
        height: calc(100% - 80px);
        background-color: unset;
        color: #515b81;
        margin-top: 10px;

        .tree-icon {
          margin-right: 5px;

          &.el-icon-folder {
            color: #35a5ff;
          }

          &.el-icon-tickets {
            color: #ff6601;
          }
        }
      }
    }
  }

  .main {
    float: right;
    width: calc(100% - 289px);
    height: 100%;
    overflow: auto;
    padding: 20px 20px 20px 0;

    .table-btn {
      button[type="button"] {
        padding: 0px !important;
      }
    }
  }
}

.form-row-divider {
  display: none;
  margin: 10px 0; /* 上下边距10px，左右边距0 */
}
</style>
