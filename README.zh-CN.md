# EasyGlobe

[English](README.md) | 简体中文

一个围绕交互式网状地球、语言路线和可配置编辑界面制作的艺术性前端学习项目。

![平台](https://img.shields.io/badge/platform-Web-73e7c5)
![技术](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JavaScript-ffcb64)
![依赖](https://img.shields.io/badge/runtime-dependencies-0-lightgrey)

[在线体验](https://andrew-ai-kitchen.github.io/EasyGlobe/) · [GitHub Desktop 上传指南](docs/GITHUB-DESKTOP.zh-CN.md) · [作者主页](https://github.com/Andrew-AI-Kitchen)

![EasyGlobe 交互式网状地球](docs/screenshots/hero-globe.png)

## 为什么做这个项目

EasyGlobe 是一个从零实现的前端学习项目，用来研究高品质产品首页背后的视觉与交互技术。页面采用翻译领域文案作为演示主题，但项目真正关注的是前端表现力：

- 使用 Canvas 绘制正射投影网状地球
- 把国家标签绑定到真实地理坐标
- 在所选语言之间生成动态路线
- 控制排版、留白、动效和响应式构图
- 通过可视化设置面板调整页面表现

这是一个纯静态前端，不包含翻译模型、用户系统、数据库、数据分析或业务后台。

## 主要特性

- **交互式网状地球**：拖动旋转、查看国家并选择语言组合。
- **地理标签系统**：国家标签跟随投影坐标移动，并在地球背面自动隐藏。
- **动态语言路线**：两个国家使用不同颜色高亮，并显示运动连线。
- **可视化设置中心**：修改品牌、链接、主题、颜色、动画、地球速度和国家文案。
- **本地优先**：设置只保存在浏览器中，并支持 JSON 导入与导出。
- **完整页面交互**：滚动显现、标签页、工作空间、自动化流程、FAQ 和移动端菜单。
- **三端启动**：提供 macOS、Windows 和 Linux 启动入口。
- **适配 GitHub Pages**：全部使用相对路径，无须构建，并附带 `.nojekyll`。

## 界面截图

### 地球与整体视觉

![EasyGlobe 首页](docs/screenshots/hero-globe.png)

### 语言选择与动态路线

![EasyGlobe 语言路线](docs/screenshots/language-route.png)

### 可视化设置中心

![EasyGlobe 设置中心](docs/screenshots/settings-panel.png)

### 工作空间与自动化展示

![EasyGlobe 工作空间与自动化](docs/screenshots/workspace-automation.png)

## 本地启动

电脑只需要安装 Python 3。启动器会自动寻找可用端口，并打开默认浏览器。

| 系统 | 启动方法 |
|---|---|
| macOS | 双击 `Start EasyGlobe.command`。首次被系统拦截时，右键文件并选择“打开”。 |
| Windows | 双击 `start-easyglobe.cmd`。 |
| Linux | 运行 `./start-easyglobe.sh`。 |

通用启动方式：

```bash
python3 launcher.py
```

使用期间保持终端窗口打开，结束时按 `Ctrl+C`。不建议直接双击 `index.html`，因为浏览器会限制 `file://` 页面加载模块和配置文件。

## 可视化设置

点击页面右上角的 `⌘` 按钮即可修改：

- 项目名称、页面标题、描述和链接
- 深色、浅色或跟随系统主题
- 路线颜色和原语言颜色
- 页面动态与地球旋转速度
- 国家开关、语言名称、例句与情绪提示

设置只保存在当前浏览器。清除浏览器数据或更换设备前，建议先导出 JSON 文件。

默认配置也可以直接编辑：

```text
config/site.json
config/languages.json
config/content.zh-CN.json
```

## 上传与发布

整理后的文件夹可以直接添加到 GitHub Desktop。完整步骤见 [docs/GITHUB-DESKTOP.zh-CN.md](docs/GITHUB-DESKTOP.zh-CN.md)。

GitHub Pages 选择从 `main` 分支和仓库根目录发布，预计地址为：

```text
https://andrew-ai-kitchen.github.io/EasyGlobe/
```

## 项目结构

```text
EasyGlobe/
├── index.html
├── rebuild.css
├── rebuild.js
├── assets/
├── config/
├── docs/
│   └── screenshots/
├── launcher.py
├── Start EasyGlobe.command
├── start-easyglobe.cmd
├── start-easyglobe.sh
├── README.md
└── README.zh-CN.md
```

## 项目边界与限制

- 这是前端交互概念，不是真正的翻译服务。
- 设置按浏览器保存，不会自动写回仓库配置文件。
- 国家数量有意控制在少量演示范围内。
- Python 只用于在本机提供静态文件，不是业务后台。
- GitHub Pages 可以托管静态体验，但不提供服务器端能力。

## 设计学习说明

EasyGlobe 是一个为前端学习而独立、从零实现的项目。首页的视觉呈现研究参考了 [LangAlpha](https://langalpha.ai/zh-cn/home)。EasyGlobe 不包含对方源代码、Logo、业务身份或服务实现，与 LangAlpha 不存在隶属或官方合作关系。

## 第三方材料

项目使用 D3.js、Geist 字体与公有领域的 Natural Earth 地理数据，具体见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 许可证

EasyGlobe 当前没有授予开源许可证，代码仅公开用于学习和查看。第三方组件继续遵循各自的许可证。
