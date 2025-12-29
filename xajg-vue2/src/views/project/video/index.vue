<template>
  <div class="page-list">
    <table-layout
      :show-search-btns="false"
      :show-page="false"
      title="影像列表"
      @query="handleQuery"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="类型:">
            <el-select v-model="query.type" @change="handleTypeChange">
              <el-option label="工程概览" :value="1" />
              <el-option label="工程面貌" :value="0" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <!-- <div class="media-grid-container"> -->
        <div class="media-grid">
          <div v-for="item in mediaList" :key="item.id" class="media-item">
            <div class="media-preview" :style="getBackgroundStyle(item)">
              <div class="media-actions">
                <span class="action-icon view-icon" @click="previewMedia(item)">
                  <i class="el-icon-view" />
                </span>
                <span class="action-icon edit-icon" @click="handleEdit(item)">
                  <i class="el-icon-edit" />
                </span>
                <span
                  class="action-icon delete-icon"
                  @click="deleteMedia(item)"
                >
                  <i class="el-icon-delete" />
                </span>
              </div>
            </div>
          </div>
          <div class="media-item add-item" @click="handleAdd">
            <div class="add-icon">
              <i class="el-icon-plus" />
            </div>
          </div>
        </div>
        <!-- </div> -->
      </template>
    </table-layout>

    <!-- 图片使用el-image组件进行预览 -->
    <div style="display: none">
      <el-image
        v-if="currentPreview && currentPreview.type === 0"
        ref="imagePreview"
        style="width: 0; height: 0"
        :src="currentPreview?.url"
        :preview-src-list="imagePreviewList"
        :initial-index="initialIndex"
      />
    </div>

    <!-- 上传对话框 -->
    <el-dialog
      v-draggable
      :visible.sync="uploadVisible"
      :title="title"
      width="50%"
    >
      <el-form
        ref="uploadFormRef"
        :model="uploadForm"
        :rules="rules"
        label-width="80px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="uploadForm.type" disabled style="width: 100%">
                <el-option label="工程概览" :value="1" />
                <el-option label="工程面貌" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="dialogType === 'edit'" label="排序" prop="sort">
              <el-input-number
                v-model="uploadForm.sort"
                :min="1"
                :max="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="dialogType === 'add'" label="文件" prop="file">
          <uploadFile
            :key="acceptValue"
            v-model="uploadForm.file"
            :limit="5"
            :accept="accept"
            :max-size="500"
            @change="handleFileChange"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import {
  processVideosWithThumbnails,
  getVideoList,
  addVideo,
  updateVideo,
  deleteVideo,
} from "./api";
import { getFilePath } from "@/api/user";
export default {
  components: {
    TableLayout,
  },
  data() {
    return {
      title: "添加视频",
      dialogType: "add",
      query: {
        type: 0, // 1-工程概览 0-工程面貌
      },
      accept:
        ".png,.jpg,.jpeg,.pdf,.txt,.doc,.docx,.rtf.mp4,.flv,.flvx,.mvb,ppt,.xls,.xlsx,.pptx",
      mediaList: [],
      currentPreview: null,
      previewTitle: "",
      imagePreviewList: [],
      initialIndex: 0,
      uploadVisible: false,
      uploadForm: {
        type: "1",
        title: "",
        sort: "",
      },
      fileList: [],
      rules: {
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
        file: [{ required: true, message: "请上传文件", trigger: "change" }],
      },
      acceptValue: 0,
    };
  },
  async mounted() {
    // 生成模拟数据
    // await this.generateMockData();
    this.getTableData();
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    editMedia(item) {
      this.uploadVisible = true;
      this.uploadForm = {
        type: item.type,
        title: item.title,
        sort: item.sort,
      };
      this.fileList = [
        {
          name: item.title,
          url: item.url,
        },
      ];
    },
    handleTypeChange() {
      if (this.uploadForm.type == 1) {
        this.accept =
          ".mp4,.avi,.mov,.wmv,.flv,.mkv,.webm,.m4v,.mpg,.mpeg,.3gp,.rm,.rmvb,.asf,.dat,.f4v";
      } else {
        this.accept = ".png,.jpg,.jpeg,.gif,.bmp,.webp,.svg,.ico,.tiff,.tif";
      }
      this.acceptValue++; //强制刷新组件,修改accept属性
      this.getTableData();
    },
    async generateThumbnails() {
      try {
        // 仅处理前几个视频，避免处理过多导致性能问题
        const processedList = await processVideosWithThumbnails(this.mediaList);
        console.log("获取视频首帧processedList", processedList);
        // 替换已处理的前几个视频
        this.mediaList = [...processedList];
        console.log("已为视频生成缩略图", this.mediaList);
      } catch (error) {
        console.error("生成视频缩略图失败:", error);
      }
    },

    getTableData() {
      getVideoList({ type: this.query.type }).then((res) => {
        const data = res.data;
        if (this.query.type == 1) {
          this.generateThumbnails(); // 生成缩略图
          this.mediaList = data;
        } else {
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            getFilePath({
              fileInfoId: element.file,
              isDownload: 0,
            }).then((res) => {
              const url = new URL(res.data);
              this.$set(data[index], "url", url.pathname + url.search);
              if (index === data.length - 1) {
                this.mediaList = data;
              }
            });
          }
        }
      });
    },
    getBackgroundStyle(item) {
      // 为视频和图片提供不同的背景样式
      if (item.type === 1) {
        // 视频
        return {
          backgroundImage: `url(${item.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        };
      } else {
        return {
          backgroundImage: `url(${item.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      }
    },
    previewMedia(item) {
      console.log("previewMedia", item);
      this.currentPreview = item;
      this.previewTitle = item.title;

      if (item.type == 1) {
        // 创建视频元素并全屏播放
        const video = document.createElement("video");
        video.src = item.file;
        video.controls = true;
        video.autoplay = true;
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.backgroundColor = "#000";

        // 全屏容器
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.backgroundColor = "#000";
        container.style.zIndex = "9999";
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";

        // 关闭按钮
        const closeBtn = document.createElement("div");
        closeBtn.innerHTML = "×";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "20px";
        closeBtn.style.right = "30px";
        closeBtn.style.color = "#fff";
        closeBtn.style.fontSize = "40px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.zIndex = "10000";
        closeBtn.style.width = "40px";
        closeBtn.style.height = "40px";
        closeBtn.style.display = "flex";
        closeBtn.style.justifyContent = "center";
        closeBtn.style.alignItems = "center";
        closeBtn.style.borderRadius = "50%";
        closeBtn.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        closeBtn.onclick = () => {
          if (video.requestFullscreen) {
            document.exitFullscreen();
          }
          document.body.removeChild(container);
        };

        // 点击背景关闭
        container.onclick = (e) => {
          if (e.target === container) {
            if (video.requestFullscreen) {
              document.exitFullscreen();
            }
            document.body.removeChild(container);
          }
        };

        // 添加元素到页面
        container.appendChild(video);
        container.appendChild(closeBtn);
        document.body.appendChild(container);

        // 进入全屏
        if (container.requestFullscreen) {
          container.requestFullscreen().catch((err) => {
            console.error("全屏请求失败:", err);
          });
        }

        // 监听全屏变化
        const handleFullscreenChange = () => {
          if (!document.fullscreenElement) {
            document.body.removeChild(container);
            video.pause();
            video.remove();
            document.removeEventListener(
              "fullscreenchange",
              handleFullscreenChange
            );
          }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        // 视频结束处理
        video.onended = () => {
          if (container.requestFullscreen) {
            document.exitFullscreen();
          }
          document.body.removeChild(container);
        };
      } else if (item.type == 0) {
        this.imagePreviewList = this.mediaList.map((item) => item.url);
        console.log("this.imagePreviewList", this.imagePreviewList);
        this.initialIndex = this.mediaList.findIndex(
          (media) => media.id === item.id
        );
        this.$nextTick(() => {
          if (this.$refs.imagePreview) {
            this.$refs.imagePreview.clickHandler();
          } else {
            console.error("imagePreview is not defined");
          }
        });
      }
    },
    deleteMedia(item) {
      this.$confirm(`确认删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteVideo(item)
          .then((res) => {
            if (res.success) {
              this.$message.success("删除成功");
              this.getTableData();
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      });
    },
    handleAdd() {
      this.uploadVisible = true;
      this.dialogType = "add";
      this.title = "新增    ";
      this.uploadForm = {
        type: this.query.type,
        title: "",
      };
      this.fileList = [];
    },

    handleEdit(item) {
      this.uploadVisible = true;
      this.dialogType = "edit";
      this.title = "编辑";
      this.uploadForm = {
        id: item.id,
        type: item.type,
        title: item.title,
        sort: item.sort,
      };
    },
    handleFileChange(file) {
      // console.log("handleFileChange============1", file, typeof file);
      // console.log("handleFileChange============", file[0]?.url);
      if (typeof file === "string") {
        let arr = JSON.parse(file);
        this.fileList = arr.map((item) => item.fileId);
      } else {
        this.fileList = [];
      }
    },
    submitUpload() {
      // 校验表单
      this.$refs.uploadFormRef.validate((valid) => {
        if (!valid) {
          this.$message.warning("请完善表单信息");
          return false;
        }

        // 新增时检查文件
        if (this.dialogType === "add") {
          if (this.fileList.length === 0) {
            this.$message.warning("请选择文件");
            return false;
          }
          addVideo({
            type: this.uploadForm.type,
            fileList: this.fileList,
          }).then((res) => {
            if (res.success) {
              this.$message.success("新增成功");
              this.uploadVisible = false;
              this.getTableData();
              return true;
            } else {
              this.$message.error(res.message);
              return false;
            }
          });
        }
        // 编辑时检查文件
        if (this.dialogType === "edit") {
          updateVideo({
            id: this.uploadForm.id,
            type: this.uploadForm.type,
            sort: this.uploadForm.sort,
          }).then((res) => {
            if (res.success) {
              this.$message.success("更新成功");
              this.uploadVisible = false;
              this.getTableData();
              return true;
            } else {
              this.$message.error(res.message);
              return false;
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;
}

.media-grid-container {
  width: 100%;
  padding: 10px;
}

.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.media-item {
  width: 310px;
  height: 220px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.media-item:hover {
  transform: translateY(0px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.media-preview {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.media-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.media-preview:hover .media-actions {
  opacity: 1;
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-icon:hover {
  background-color: #fff;
  transform: scale(1.1);
}

.view-icon i {
  color: #409eff;
  font-size: 20px;
}

.delete-icon i {
  color: #f56c6c;
  font-size: 20px;
}

.add-item {
  border: 2px dashed #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.add-item:hover {
  border-color: #409eff;
}

.add-icon {
  font-size: 40px;
  color: #909399;
}

.add-item:hover .add-icon {
  color: #409eff;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  margin: 0;
  padding: 0;
}

.media-preview-dialog {
  padding: 0 !important;
  background: transparent;
  box-shadow: none;
}

.media-preview-dialog .el-dialog__header {
  padding: 10px 20px;
  background: #409eff;
  border-radius: 4px 4px 0 0;
}

.media-preview-dialog .el-dialog__title {
  color: #fff;
  font-size: 16px;
}

.media-preview-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}

.media-preview-dialog .el-dialog__body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
}

.preview-video {
  width: 100%;
  height: auto;
  display: block;
  margin: 0;
  padding: 0;
  background: #000;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  margin: 0 auto;
  padding: 0;
}

/* 视频预览对话框样式 */
.video-preview-dialog {
  .el-dialog__body {
    padding: 0;
    background: #000;
  }

  .el-dialog__header {
    background: #000;
    margin: 0;
    padding: 10px 20px;
    border-bottom: 1px solid #333;

    .el-dialog__title {
      color: #fff;
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        color: #fff;

        &:hover {
          color: #409eff;
        }
      }
    }
  }

  .video-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    background: #000;

    video {
      max-width: 100%;
      max-height: 80vh;
      outline: none;
    }
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .video-preview-dialog {
    width: 90% !important;
    margin: 10px auto !important;

    .video-container {
      video {
        max-height: 60vh;
      }
    }
  }
}
</style>
