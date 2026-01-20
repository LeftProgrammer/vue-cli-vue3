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
  </div>
</template>

<script>
import { Check, Switch, User } from "@element-plus/icons-vue";
import { getPhrases, addPhrase, deletePhrase, submitTodo } from "@/api/flow";

export default {
  name: "ProcessOpinion",
  components: {
    Check,
    Switch,
    User,
  },
  props: {
    businessId: {
      type: String,
      default: "",
    },
    procTaskId: {
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
    };
  },
  computed: {
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
      this.$emit("transfer");
      this.$message.info("转发功能待实现");
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
</style>
