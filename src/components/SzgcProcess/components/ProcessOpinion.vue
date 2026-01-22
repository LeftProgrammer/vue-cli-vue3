<template>
  <div class="process-opinion">
    <div class="opinion-section">
      <el-radio-group v-model="optionKey" class="opinion-radio">
        <el-radio label="agree">同意</el-radio>
        <el-radio label="disagree">不同意</el-radio>
      </el-radio-group>

      <div class="phrases-btn">
        <el-popover v-model:visible="phrasesVisible" placement="bottom" :width="340" trigger="click">
          <template #reference>
            <el-button type="primary">常用语</el-button>
          </template>
          <div class="phrases-panel">
            <div class="phrases-table">
              <div v-if="phrases.length" class="phrases-list">
                <div
                  v-for="(item, index) in phrases"
                  :key="item.phraseId || index"
                  class="phrase-row"
                >
                  <span class="phrase-index">{{ index + 1 }}</span>
                  <span class="phrase-content">{{ item.phrase }}</span>
                  <span class="phrase-actions">
                    <el-button type="primary" link @click="selectPhrase(item)">选择</el-button>
                    <el-button type="danger" link @click="handleDeletePhrase(item)">删除</el-button>
                  </span>
                </div>
              </div>
              <div v-else class="no-phrases">暂无常用语</div>
            </div>
            <div class="phrases-add">
              <el-input v-model="newPhrase" placeholder="添加常用语" size="small" />
              <el-button type="primary" size="small" @click="handleAddPhrase">添加</el-button>
            </div>
          </div>
        </el-popover>
      </div>

      <el-input
        v-model="idea"
        type="textarea"
        :rows="5"
        placeholder="请输入处理意见"
        class="opinion-input"
      />

      <div class="idea-tip" :style="{ visibility: !idea.trim() ? 'visible' : 'hidden' }">处理意见不能为空</div>

      <div class="action-buttons">
        <el-button
          v-if="showSubmit"
          type="primary"
          :loading="submitting"
          @click="handleSubmit"
        >
          <el-icon><Check /></el-icon> 提交
        </el-button>
        <el-button v-if="showTransfer" type="primary" @click="handleTransfer">
          <el-icon><Switch /></el-icon> 转发
        </el-button>
        <el-button v-if="showCountersign" type="primary" @click="handleCountersign">
          <el-icon><User /></el-icon> 会签
        </el-button>
      </div>
    </div>

    <!-- 人员选择器 -->
    <UserSelect
      :show="userSelectVisible"
      :multi-enable="true"
      @update:show="userSelectVisible = $event"
      @user-checked="onUserChecked"
    />

    <!-- 转发弹窗 -->
    <el-dialog
      v-model="transferVisible"
      title="流程转发"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="transfer-content">
        <div class="transfer-title">{{ businessTitle }}</div>
        <el-input
          v-model="transferUser"
          placeholder="请选择转发接收人"
          readonly
          @click="selectTransferUser"
        >
          <template #suffix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
        <el-input
          v-model="transferReason"
          type="textarea"
          :rows="4"
          placeholder="请输入转发意见"
          class="transfer-reason"
        />
      </div>
      <template #footer>
        <el-button type="primary" :loading="transferring" @click="confirmTransfer">确定</el-button>
        <el-button @click="transferVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Check, Switch, User } from "@element-plus/icons-vue";
import { getPhrases, addPhrase, deletePhrase, submitTodo, forwardTask } from "@/api/flow";
import UserSelect from "@/components/newUserSelect/index.vue";

export default {
  name: "ProcessOpinion",
  components: {
    Check,
    Switch,
    User,
    UserSelect,
  },
  props: {
    businessId: {
      type: String,
      default: "",
    },
    businessName: {
      type: String,
      default: "",
    },
    procTaskId: {
      type: String,
      default: "",
    },
    procTaskName: {
      type: String,
      default: "",
    },
    nodeName: {
      type: String,
      default: "",
    },
    nodeUser: {
      type: String,
      default: "",
    },
    page: {
      type: String,
      default: "todo",
    },
    saveApi: {
      type: Function,
      default: null,
    },
    dataAll: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["submit", "transfer", "countersign", "success", "error"],
  data() {
    return {
      optionKey: "agree",
      idea: "",
      phrases: [],
      submitting: false,
      newPhrase: "",
      phrasesVisible: false,
      transferVisible: false,
      transferUser: "",
      transferUserId: "",
      transferReason: "",
      transferring: false,
      userSelectVisible: false,
    };
  },
  computed: {
    businessTitle() {
      return this.dataAll?.name || this.dataAll?.businessName || "";
    },
    showSubmit() {
      return ["todo", "wait", "mine"].includes(this.page);
    },
    showTransfer() {
      return ["todo", "wait", "mine"].includes(this.page);
    },
    showCountersign() {
      return ["todo", "wait", "mine"].includes(this.page);
    },
  },
  created() {
    this.loadPhrases();
  },
  methods: {
    async loadPhrases() {
      try {
        const res = await getPhrases();
        if (res && res.success) {
          this.phrases = res.data || [];
        }
      } catch (e) {
        console.error("加载常用语失败", e);
      }
    },
    selectPhrase(item) {
      this.idea = item.phrase;
      this.phrasesVisible = false;
    },
    async handleAddPhrase() {
      if (!this.newPhrase.trim()) {
        this.$message.warning("请输入常用语内容");
        return;
      }
      try {
        const res = await addPhrase(this.newPhrase.trim());
        if (res && res.success) {
          this.$message.success("添加成功");
          this.newPhrase = "";
          this.loadPhrases();
        } else {
          this.$message.error(res?.message || "添加失败");
        }
      } catch (e) {
        this.$message.error("添加失败");
      }
    },
    async handleDeletePhrase(item) {
      try {
        const res = await deletePhrase(item.phraseId);
        if (res && res.success) {
          this.$message.success("删除成功");
          this.loadPhrases();
        } else {
          this.$message.error(res?.message || "删除失败");
        }
      } catch (e) {
        this.$message.error("删除失败");
      }
    },
    generateReqToken() {
      return Math.random().toString(36).substring(2, 12);
    },
    async handleSubmit() {
      if (!this.idea.trim()) {
        this.$message.warning("请输入处理意见");
        return;
      }

      try {
        this.submitting = true;

        // 先保存业务数据
        if (this.saveApi && typeof this.saveApi === "function") {
          await this.saveApi(this.dataAll);
        }

        // 提交流程
        const submitData = {
          businessId: this.businessId,
          procTaskId: this.procTaskId,
          idea: this.idea,
          optionKey: this.optionKey,
          optionName: this.optionKey === "agree" ? "同意" : "不同意",
          nextCus: [],
          ccs: null,
          attIds: null,
          fields: {},
          reqToken: this.generateReqToken(),
        };

        const res = await submitTodo(submitData);
        if (res && res.success) {
          this.$message.success("提交成功");
          this.$emit("success", { type: "submit", data: res.data });
          this.$emit("submit", res.data);
        } else {
          this.$message.error(res?.message || "提交失败");
          this.$emit("error", { type: "submit", message: res?.message });
        }
      } catch (e) {
        console.error("提交失败", e);
        this.$message.error("提交失败");
        this.$emit("error", { type: "submit", error: e });
      } finally {
        this.submitting = false;
      }
    },
    handleTransfer() {
      this.transferVisible = true;
      this.transferUser = "";
      this.transferUserId = "";
      this.transferReason = "";
    },
    selectTransferUser() {
      this.userSelectVisible = true;
    },
    onUserChecked(data) {
      this.userSelectVisible = false;
      if (data && data.source && data.source.length > 0) {
        this.transferUser = data.source[0].realName;
        this.transferUserId = data.source[0].userId;
      }
    },
    async confirmTransfer() {
      if (!this.transferUser) {
        this.$message.warning("请选择转发接收人");
        return;
      }
      if (!this.transferReason.trim()) {
        this.$message.warning("请输入转发意见");
        return;
      }
      try {
        this.transferring = true;
        const data = {
          businessName: this.businessName,
          businessId: this.businessId,
          ccs: [{ realName: this.transferUser, userId: this.transferUserId }],
          idea: this.transferReason,
          proTaskId: this.procTaskId,
          procTaskName: this.procTaskName,
          utKey: "UT_default",
        };
        const res = await forwardTask(data);
        if (res && res.success) {
          this.$message.success("转发成功");
          this.transferVisible = false;
          this.$emit("success", { type: "transfer", data: res.data });
          this.$emit("transfer", res.data);
        } else {
          this.$message.error(res?.message || "转发失败");
        }
      } catch (e) {
        this.$message.error("转发失败");
      } finally {
        this.transferring = false;
      }
    },
    handleCountersign() {
      this.$emit("countersign");
      this.$message.info("会签功能待实现");
    },
    reset() {
      this.idea = "";
      this.optionKey = "agree";
    },
    getSubmitData() {
      return {
        idea: this.idea,
        optionKey: this.optionKey,
        optionName: this.optionKey === "agree" ? "同意" : "不同意",
      };
    },
  },
};
</script>

<style scoped lang="scss">
.process-opinion {
  padding: 0;

  .opinion-radio {
    margin-bottom: 12px;
  }

  .opinion-input {
    margin-top: 8px;
  }

  .idea-tip {
    font-size: 12px;
    color: #f56c6c;
    margin-top: 4px;
  }

  .phrases-btn {
    margin-bottom: 12px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    margin-top: 12px;

    .el-button {
      min-width: 70px;
      padding: 8px 12px;
    }
  }
}

.phrases-panel {
  display: flex;
  flex-direction: column;
  max-height: 280px;

  .phrases-table {
    flex: 1;
    min-height: 220px;
    max-height: 220px;
    overflow-y: auto;
    margin-bottom: 10px;
  }

  .phrases-list {
    .phrase-row {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #ebeef5;

    }

    .phrase-index {
      width: 30px;
      flex-shrink: 0;
      text-align: center;
      color: #909399;
    }

    .phrase-content {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-right: 8px;
    }

    .phrase-actions {
      flex-shrink: 0;
      display: flex;
      gap: 4px;
    }
  }

  .no-phrases {
    text-align: center;
    color: #909399;
    padding: 20px;
  }

  .phrases-add {
    flex-shrink: 0;
    display: flex;
    gap: 8px;
    padding-top: 8px;

    .el-input {
      flex: 1;
    }
  }
}

.transfer-content {
  .transfer-title {
    padding: 10px 12px;
    background: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #303133;
  }

  .el-input {
    margin-bottom: 12px;
  }

  .transfer-reason {
    margin-bottom: 0;
  }
}
</style>
