# EasyGlobe

[English](README.md) | 简体中文

一个围绕交互式网状地球、语言路线和可配置编辑界面制作的艺术性前端学习项目。

![平台](https://img.shields.io/badge/platform-Web-73e7c5)
![技术](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JavaScript-ffcb64)
![许可证](https://img.shields.io/badge/license-Apache--2.0-ffcb64)

[作者主页](https://github.com/Andrew-AI-Kitchen) · [参考网页](https://langalpha.ai/zh-cn/home) · [参考项目](https://github.com/ginlix-ai/LangAlpha)

![EasyGlobe 交互式网状地球](docs/screenshots/hero-globe.png)

## 项目介绍

EasyGlobe 用来研究高品质产品首页如何组合 Canvas 网状地球、地理标签、动态路线、克制的动画与响应式编辑排版。翻译领域内容只是演示场景，项目本身是一项前端视觉与交互研究。

本项目的视觉方向和部分交互结构，来自对公开可访问的 [LangAlpha 首页](https://langalpha.ai/zh-cn/home)及其浏览器渲染结果的逆向分析。EasyGlobe 并不是从 LangAlpha 官方仓库 fork 或 clone 后开始开发的；页面交互经过重新实现，并被改造成一个拥有不同主题、内容模型、配置系统和交互行为的独立静态项目。

LangAlpha 官方仓库现已公开，其中包含 `web/` 前端源码，并采用 Apache License 2.0。EasyGlobe 与 LangAlpha 或 Ginlix AI 没有隶属、合作或官方背书关系。完整来源说明见[致谢](#致谢)和 [NOTICE](NOTICE)。

## 主要特性

- **交互式网状地球**：拖动旋转、查看国家并选择语言组合。
- **地理标签系统**：国家标签跟随投影坐标移动，并在地球背面自动隐藏。
- **动态语言路线**：两个国家使用不同颜色高亮，并显示运动连线。
- **可视化设置中心**：修改品牌、链接、主题、颜色、动画、地球速度和国家文案。
- **本地优先设置**：配置保存在浏览器中，并支持 JSON 导入与导出。
- **完整页面交互**：滚动显现、标签页、工作空间、自动化流程、FAQ 和移动端菜单。
- **三端启动**：提供 macOS、Windows 和 Linux 启动入口。
- **静态部署**：使用相对路径并附带 `.nojekyll`，无须构建即可部署到 GitHub Pages。

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

电脑只需要安装 Python 3。启动器会寻找可用端口、启动本地静态服务并打开默认浏览器。

| 系统 | 启动方法 |
|---|---|
| macOS | 双击 `Start EasyGlobe.command`。首次被系统拦截时，右键文件并选择“打开”。 |
| Windows | 双击 `start-easyglobe.cmd`。 |
| Linux | 运行 `./start-easyglobe.sh`。 |

通用启动方式：

```bash
python3 launcher.py
```

使用期间保持终端窗口打开，结束时按 `Ctrl+C`。不要通过 `file://` 直接打开 `index.html`，浏览器会限制这种模式下的配置文件加载。

## 地球交互

1. 拖动地球进行旋转。
2. 选择一个国家作为源语言。
3. 再选择一个国家作为目标语言。
4. 两个国家会分别高亮，并出现动态连接路线。
5. 使用交换或重置按钮改变当前选择。

## 可视化设置

点击页面右上角的 `⌘` 按钮即可修改：

- 项目名称、页面标题、描述和链接
- 深色、浅色或跟随系统主题
- 路线颜色和源语言颜色
- 页面动态与地球旋转速度
- 国家开关、语言名称、例句与情绪提示

设置保存在当前浏览器中，并可以导出或导入 JSON。仓库默认配置位于：

```text
config/site.json
config/languages.json
config/content.zh-CN.json
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
├── LICENSE
├── NOTICE
├── THIRD_PARTY_NOTICES.md
├── README.md
└── README.zh-CN.md
```

## 致谢

- [LangAlpha 官网](https://langalpha.ai/zh-cn/home)：本项目最初研究的公开网页，也是视觉方向与交互思路的主要参考。
- [ginlix-ai/LangAlpha](https://github.com/ginlix-ai/LangAlpha)：LangAlpha 官方开源项目，仓库包含公开的 Web 前端，采用 [Apache License 2.0](https://github.com/ginlix-ai/LangAlpha/blob/main/LICENSE)。
- [D3.js](https://d3js.org/)、[Geist](https://vercel.com/font) 与 [Natural Earth](https://www.naturalearthdata.com/)：EasyGlobe 使用的程序库、字体和地理数据。

LangAlpha 及其商标归各自权利人所有。这里的来源说明仅用于讲清项目的学习与重建过程，不代表赞助、合作或官方认可。

## 开源许可证

EasyGlobe 采用 [Apache License 2.0](LICENSE) 开源。本仓库自行编写的代码和修改内容受该许可证约束；第三方组件与数据继续遵循各自的许可条款，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
