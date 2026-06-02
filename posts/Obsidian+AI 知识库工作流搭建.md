

## 概述

将 **Claude Code + DeepSeek V4 + Obsidian** 串联成一套完整的 AI 知识库工作流，覆盖从环境配置、AI 插件接入、网页内容采集到白板自动生成的全流程。

### 工作流全景

![[Obsidian+AI 工作流示意图.excalidraw]]

### 涉及工具一览

| 工具 | 用途 | 类型 |
|------|------|------|
| Claude Code | AI 命令行客户端 | CLI 工具 |
| DeepSeek V4 | 第三方大语言模型 API | API 服务 |
| CCSwitch | 将第三方模型接入 Claude Code | 开源工具 |
| Terminal (Obsidian 插件) | 在 Obsidian 内嵌终端调用 Claude Code | Obsidian 插件 |
| Claudian (Obsidian 插件) | 在 Obsidian 内进行 AI 对话 ⭐ | Obsidian 插件 |
| Obsidian Web Clipper | 网页内容采集为 Markdown | 浏览器扩展 |
| Excalidraw | 手绘风格白板/绘图 | Obsidian 插件 |
| excalidraw-diagram | 让 AI 自动生成 Excalidraw 画布 | Claude Code Skill |

---

## 一、环境配置

### 1.1 安装 Claude Code

1. 前往 Claude Code 官网，复制对应操作系统的一键安装命令（支持 macOS / Linux / Windows）
2. Windows 用户需先安装 Git → [Git 官网](https://git-scm.com/) 下载安装包
3. 打开终端，粘贴命令执行，完成后通过 `claude` 命令启动

### 1.2 接入 DeepSeek API（通过 CCSwitch）

> CCSwitch 是一个开源工具，用于将第三方大模型接入 Claude Code。

**操作步骤：**

1. 到 DeepSeek API 官网购买额度，创建 API Key
2. 下载安装 CCSwitch
3. 打开 CCSwitch → 右上角 `+` → 选择 DeepSeek 供应商
4. 粘贴 API Key → 填写模型名称 → 保存 → 测试模型 → 启用
5. 终端输入 `claude`，即可用 DeepSeek 模型驱动 Claude Code

---

## 二、Obsidian AI 插件

在 Obsidian 中接入 Claude Code 有两款插件可选，推荐 Claudian。

### 2.1 Terminal 插件

在 Obsidian 内嵌终端窗口，可直接执行 `claude` 命令。

- **安装：** 第三方插件市场搜索 `terminal`
- **使用：** 左侧点击 Open Terminal → 选择**整合式**模式 → 右侧出现终端

| 模式 | 说明 | 推荐 |
|------|------|:----:|
| 外部模式 | 在 Obsidian 外部打开独立终端窗口 | ❌ |
| 整合式 | 在 Obsidian 内部嵌入终端 | ✅ |
| 开发者控制台 | 用于插件调试 | ❌ |

终端工作目录自动指向当前知识库根目录，使用体验与普通终端一致，优点是无需切换窗口。

### 2.2 Claudian 插件 ⭐ 推荐

专为 Claude Code 设计的对话界面，比 Terminal 适配度更高、界面更美观。

**安装方式：**

- **方式一（推荐）：** 第三方插件市场搜索 `claudian` 直接安装（已上架）
- **方式二（手动）：**
  1. 打开 Claudian 的 GitHub 仓库 → Release 页面
  2. 下载 `main.js`、`manifest.json`、`styles.css` 三个文件
  3. 在 Obsidian 插件目录下新建 `claudian` 文件夹，将文件移入
  4. 重启 Obsidian → 第三方插件中启用 Claudian

**功能特点：**

- 无需额外设置，本地有 Claude Code 即可使用
- 对话时自动关联当前打开的 Markdown 文件
- 底部三个功能按钮：新 Tab · 新对话 · 历史记录

---

## 三、知识采集与整理

### 3.1 配置 CLAUDE.md

Claude Code 在每个项目文件夹中通过 `CLAUDE.md` 指导 AI 工作。个人知识库场景下，只需轻量配置：

- 仓库定位与目录结构说明
- 输出格式与排版规范
- 翻译规范（如有英文内容处理需求）

> 每个人的 CLAUDE.md 应根据实际使用场景持续迭代。

### 3.2 网页内容采集

使用 **Obsidian Web Clipper** 浏览器扩展：

- 将网页内容一键保存为 Markdown，存入 Obsidian
- 自动保留章节结构、配图等核心内容
- 也可用于获取视频字幕文件

### 3.3 AI 整理工作流

采集到的内容（如英文视频字幕）往往口语化、不易查阅，可借助 AI 自动整理：

1. 在 Claudian 中对当前文档发送指令："请帮我翻译并格式化这篇文档"
2. AI 按 CLAUDE.md 规范自动执行：
   - 翻译为中文
   - 格式化内容排版
   - 移动到指定目录
   - 原文档归档

整理后的文档可直接用于后续写作——例如让 AI 从知识库中筛选特定主题的所有内容，汇总为一篇完整文档。

> 💡 Web Clipper 不支持 B 站字幕下载。作者为此开发了一个专用插件，可获取 B 站视频字幕并一键保存到 Obsidian，已开源到 GitHub。

---

## 四、Excalidraw 画布绘制

### 4.1 基础使用

安装 Obsidian 插件 **Excalidraw** 后，可新建白板文件，手动编排内容、插入图片、输入手绘风格文字。

### 4.2 AI 自动生成画布

通过安装 Claude Code Skill `excalidraw-diagram`，实现一句话生成手绘风格画布：

1. 将 Skill 仓库地址发给 Claude Code，输入"请帮我安装这个 Skill"
2. 安装后通过 `/` 命令调用该 Skill
3. 提供内容（如 DeepSeek V4 任务表现数据），AI 自动生成 Excalidraw 画布
4. 生成后可在画布中直接编辑调整
