# 档案文件 Excel 模板下载/导入/导出 设计文档

## 1. 功能概述

在「档案文件（文件管理）」页面提供 Excel 模板下载、批量导入、批量导出功能，用于对「案卷下文件」进行结构化数据维护。

### 1.1 功能范围

- **模板下载**：下载固定 Excel 模板文件
- **导入**：上传 Excel 解析写入数据库，返回成功/失败统计及错误行号
- **导出**：导出当前案卷下全部文件数据为 Excel

### 1.2 按钮布局

从左到右：`[新增] [模板下载] [导入] [导出] [批量删除]`

### 1.3 按钮状态控制

- 当 `volumeId` 为空时，「导入」「导出」按钮置灰禁用
- 当前页面进入时必须携带 volumeId，否则自动返回

---

## 2. 模板下载

### 2.1 交互流程

1. 用户点击「模板下载」按钮
2. 浏览器直接下载模板文件

### 2.2 实现方式

```javascript
// 模板文件路径（public 目录下，构建后可直接访问）
const templateUrl = '/static/template/文件管理导入模板.xls';

handleDownloadTemplate() {
  const link = document.createElement('a');
  link.href = templateUrl;
  link.download = '文件管理导入模板.xls';
  link.click();
}
```

### 2.3 按钮样式

- 普通按钮（非 primary）
- 图标：`el-icon-document`

---

## 3. 导入功能

### 3.1 交互流程

1. 用户点击「导入」按钮，弹出文件选择框
2. 选择 `.xls` 或 `.xlsx` 文件（≤10MB）
3. 自动上传至后端接口
4. 后端返回结果后，前端显示 Message 提示：
   - 全部成功：`导入成功，共 X 条`
   - 部分成功：`导入完成：成功 X 条，失败 Y 条（第 2、5、8 行）`
   - 全部失败：`导入失败：共 X 条（第 1、2、3... 行）`
5. 有成功记录时，刷新列表

### 3.2 接口定义

```
POST /api/archives/document/import
Content-Type: multipart/form-data

参数：
- file: Excel 文件
- volumeId: 案卷 ID（必传）
```

### 3.3 返回格式

```json
{
  "success": true,
  "data": {
    "successCount": 10,
    "failCount": 3,
    "failRows": [
      { "rowIndex": 2, "reason": "文件题名不能为空" },
      { "rowIndex": 5, "reason": "日期格式不正确" },
      { "rowIndex": 8, "reason": "密级值无效" }
    ]
  }
}
```

### 3.4 前端提示逻辑

```javascript
handleImportSuccess(response) {
  this.importLoading = false;
  if (response.success) {
    const { successCount, failCount, failRows } = response.data;
    if (failCount === 0) {
      this.$message.success(`导入成功，共 ${successCount} 条`);
    } else if (successCount === 0) {
      const rows = failRows.map(r => r.rowIndex).join('、');
      this.$message.error(`导入失败：共 ${failCount} 条（第 ${rows} 行）`);
    } else {
      const rows = failRows.map(r => r.rowIndex).join('、');
      this.$message.warning(`导入完成：成功 ${successCount} 条，失败 ${failCount} 条（第 ${rows} 行）`);
    }
    if (successCount > 0) {
      this.getList();
    }
  } else {
    this.$message.error(response.message || '导入失败');
  }
}
```

---

## 4. 导出功能

### 4.1 交互流程

1. 用户点击「导出」按钮
2. 弹出确认对话框：「确定导出当前案卷下所有文件数据？」
3. 用户点击「确定」后，调用导出接口
4. 浏览器下载 Excel 文件

### 4.2 接口定义

```
GET /api/archives/document/export

参数：
- volumeId: 案卷 ID（必传）
- X-Token: 认证令牌

返回：Excel 文件流
```

### 4.3 实现方式

```javascript
handleExport() {
  this.$confirm('确定导出当前案卷下所有文件数据？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  })
    .then(() => {
      this.exportLoading = true;
      const token = getToken();
      const volumeId = this.volumeInfo.volumeId;
      const url = `/api/archives/document/export?volumeId=${volumeId}&X-Token=${token}`;
      window.open(url, '_blank');
      this.exportLoading = false;
    })
    .catch(() => {});
}
```

### 4.4 导出规则

- 只导出指定 volumeId 下的文件（不分页）
- 字段顺序与模板一致（17 个字段）
- 文件名：`文件数据_案卷名称_日期.xlsx`

---

## 5. 模板字段定义

字段顺序（导入/导出一致）：

| 序号 | 字段名 | 来源 | 导入处理 |
|------|--------|------|----------|
| 1 | 全宗号 | 项目 | 忽略，后端自动补齐 |
| 2 | 档号 | 案卷 | 忽略，后端自动补齐 |
| 3 | 分类号 | 案卷 | 忽略，后端自动补齐 |
| 4 | 项目名称 | 项目 | 忽略，后端自动补齐 |
| 5 | 案卷顺序号 | 案卷 | 忽略，后端自动补齐 |
| 6 | 套数 | 案卷 | 忽略，后端自动补齐 |
| 7 | 卷内顺序号 | Excel | **必填**，以 Excel 为准 |
| 8 | 文件题名 | Excel | **必填**，以 Excel 为准 |
| 9 | 附件 | Excel | 选填 |
| 10 | 文件编号 | Excel | 选填 |
| 11 | 责任者 | Excel | **必填** |
| 12 | 日期 | Excel | **必填**，格式 yyyy-MM-dd |
| 13 | 页号 | Excel | 选填 |
| 14 | 立卷单位 | 案卷 | 忽略，后端自动补齐 |
| 15 | 保管期限 | Excel | 选填 |
| 16 | 密级 | Excel | 选填，默认"无" |
| 17 | 备注 | Excel | 选填 |

---

## 6. 导入校验规则

| 校验项 | 规则 | 失败原因示例 |
|--------|------|--------------|
| 卷内顺序号 | 必填，同案卷下不可重复 | "卷内顺序号不能为空" / "卷内顺序号已存在" |
| 文件题名 | 必填，同案卷下不可重复 | "文件题名不能为空" / "文件题名已存在" |
| 责任者 | 必填 | "责任者不能为空" |
| 日期 | 必填，格式校验 | "日期不能为空" / "日期格式不正确" |
| 密级 | 需匹配枚举值 | "密级值无效" |

---

## 7. 文件改动清单

### 7.1 前端（Vue）

| 文件 | 改动内容 |
|------|----------|
| `src/views/archives/archive_document/index.vue` | 1. 添加「模板下载」按钮<br>2. 导入/导出按钮增加 disabled 判断<br>3. 修改导入成功回调，解析结构化返回数据<br>4. 导出增加确认对话框 |

### 7.2 后端（Java）

| 文件 | 改动内容 |
|------|----------|
| `controller/ArchiveDocumentController.java` | 导入/导出接口增加 `volumeId` 参数 |
| `api/IArchiveDocumentService.java` | 修改方法签名，增加 `volumeId` |
| `service/ArchiveDocumentServiceImpl.java` | 重写导入/导出逻辑 |
| `model/vo/ImportResultVo.java` | 新增：导入结果 VO |
| `model/vo/FailRowVo.java` | 新增：失败行 VO |

---

## 8. 验收标准

1. **模板下载**：下载成功且表头正确
2. **导入**：
   - 未选中案卷时按钮置灰
   - 导入后数据写库成功，列表刷新可见
   - 失败时返回明确行号
3. **导出**：
   - 未选中案卷时按钮置灰
   - 导出文件可打开
   - 字段/表头/顺序与模板一致
   - 导出为案卷下所有数据（不分页）
