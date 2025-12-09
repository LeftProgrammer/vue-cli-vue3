import request from "@/utils/request";

/**
 * 从视频URL中提取首帧图像
 * @param {string} videoUrl - 视频URL地址
 * @returns {Promise<string>} - 返回base64格式的图片数据
 */
export function extractVideoThumbnail(videoUrl) {
  console.log("extractVideoThumbnail", videoUrl);
  return new Promise((resolve, reject) => {
    // 获取视频文件并强制指定为视频MIME类型
    fetch(videoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // 创建新的视频Blob对象，强制指定为视频格式
        const videoBlob = new Blob([blob], { type: "video/mp4" });
        const blobUrl = URL.createObjectURL(videoBlob);
        // 创建视频元素
        const video = document.createElement("video");
        video.crossOrigin = "anonymous"; // 允许跨域
        video.src = blobUrl;
        video.preload = "auto"; // 完整加载视频
        video.muted = true;
        video.playsInline = true;

        // 清理资源函数，防止内存泄漏
        function cleanupResources() {
          try {
            video.pause();
            video.removeAttribute("src");
            video.load();
            URL.revokeObjectURL(blobUrl); // 释放Blob URL
          } catch (e) {
            console.error("清理资源失败:", e);
          }
        }

        // 在视频元数据加载完成后的处理
        video.onloadedmetadata = function () {
          console.log("视频元数据加载完成，视频时长:", video.duration);

          video.play().catch((err) => {
            console.warn("视频自动播放失败(这在某些浏览器中是正常的):", err);
          });

          function extractAtTime() {
            video.ontimeupdate = function () {
              if (video.currentTime > 0) {
                video.ontimeupdate = null;
                extractFrame(true); // 直接强制使用当前帧
              }
            };
            const targetTime = 1;
            video.currentTime = targetTime;
          }
          extractAtTime();
        };

        // 捕获当前帧并生成缩略图
        // 不再需要这些参数，但为了向后兼容保留参数定义
        function extractFrame(
          forceAccept = false,
          callback = null,
          retryCount = 0
        ) {
          try {
            const maxRetries = 3;
            if (video.videoWidth === 0 || video.videoHeight === 0) {
              if (retryCount >= maxRetries) {
                console.warn(
                  `[提取缩略图] 重试${maxRetries}次后视频尺寸仍然无效，${
                    forceAccept ? "强制继续" : "放弃提取"
                  }`
                );

                if (forceAccept) {
                  // 强制继续，使用默认尺寸
                } else {
                  // 放弃提取，返回错误
                  throw new Error("视频尺寸无效，无法提取缩略图");
                }
              } else {
                console.log(
                  `[提取缩略图] 视频尺寸无效 (重试 ${
                    retryCount + 1
                  }/${maxRetries})`
                );
                setTimeout(
                  () => extractFrame(forceAccept, callback, retryCount + 1),
                  100
                ); // 递增重试计数
                return;
              }
            }

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.9);

            clearTimeout(timeoutId);
            video.ontimeupdate = null;
            video.oncanplay = null;

            cleanupResources();
            if (callback) callback(false); // 保留回调兼容性
            resolve(thumbnailUrl);
          } catch (error) {
            console.error("提取缩略图失败:", error);
            // 清除超时定时器
            clearTimeout(timeoutId);
            // 清除事件监听
            video.ontimeupdate = null;
            video.oncanplay = null;

            cleanupResources();
            reject(error);
          }
        }

        video.onerror = function () {
          console.error("视频加载失败:", video.error);
          clearTimeout(timeoutId);
          video.ontimeupdate = null;
          video.oncanplay = null;
          video.ontimeupdate = null;
          video.oncanplay = null;

          cleanupResources();
          reject(new Error("视频加载失败"));
        };

        const timeoutId = setTimeout(() => {
          console.warn("提取缩略图超时，尝试取当前帧");
          extractFrame(true);
        }, 100);

        video.oncanplay = function () {
          clearTimeout(timeoutId);
        };

        video.load();
      })
      .catch((err) => {
        console.error("获取视频文件失败:", err);
        reject(err);
      });
  });
}

/**
 * 批量处理视频，为每个视频提取首图
 * @param {Array} videoList - 视频列表
 * @returns {Promise<Array>} - 返回带有首图的视频列表
 */
export function processVideosWithThumbnails(videoList) {
  const promises = videoList.map(async (video) => {
    try {
      // 只为类型为视频且没有缩略图的项目生成缩略图
      if (video.type == 1 && !video.thumbnail) {
        const thumbnail = await extractVideoThumbnail(video.file);
        video.thumbnail = thumbnail;
        return video;
      }
      return video;
    } catch (error) {
      console.error(`无法为视频ID ${video.id} 生成缩略图:`, error);
      return video;
    }
  });

  return Promise.all(promises);
}

export function getVideoList(params) {
  return request({
    url: "/api/project/video/list",
    method: "get",
    params,
  });
}

export function addVideo(data) {
  return request({
    url: "/api/project/video/add",
    method: "post",
    data,
  });
}

export function updateVideo(data) {
  return request({
    url: "/api/project/video/update",
    method: "post",
    data,
  });
}

export function deleteVideo(data) {
  return request({
    url: "/api/project/video/delete",
    method: "post",
    data,
  });
}
