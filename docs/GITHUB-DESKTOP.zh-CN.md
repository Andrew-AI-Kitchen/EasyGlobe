# 使用 GitHub Desktop 上传 EasyGlobe

[English](GITHUB-DESKTOP.md) | 简体中文

EasyGlobe 是纯静态前端项目。上传过程不需要 Node.js、数据库或后台服务。

## 第一步：添加本地仓库

1. 打开 GitHub Desktop 并登录。
2. 点击 **File → Add Local Repository**。
3. 选择包含 `index.html`、`README.md` 和 `.git` 的 `EasyGlobe` 文件夹。
4. 点击 **Add Repository**。

不要选择外层工作区，也不要把其他项目的原始快照或复核资料一并上传。准备好的 `EasyGlobe` 文件夹已经初始化为 `main` 分支。

## 第二步：检查第一次提交

提交前确认以下内容都在变更列表中：

- 网页文件：`index.html`、`rebuild.css`、`rebuild.js`
- `assets/` 与 `config/`
- `docs/` 中的截图和中英文文档
- `LICENSE`、`NOTICE` 与 `THIRD_PARTY_NOTICES.md`
- macOS、Windows 和 Linux 启动器

提交说明可填写 `Initial EasyGlobe release`，然后点击 **Commit to main**。

## 第三步：发布仓库

1. 点击 **Publish repository**。
2. 仓库名称填写 `EasyGlobe`，也可以填写你最终确定的其他名称。
3. 简介可填写：`An artistic frontend study built around an interactive dotted globe.`
4. 选择仓库所属的个人账号或组织。
5. 如果需要公开开源，取消勾选 **Keep this code private**。
6. 点击 **Publish Repository**。

发布完成后，通过 **Repository → View on GitHub** 打开仓库。

## 第四步：开启 GitHub Pages（可选）

1. 在 GitHub 打开这个仓库。
2. 进入 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. 分支选择 `main`，目录选择 `/(root)`。
5. 保存设置。

部署完成后，GitHub 会在同一个 Pages 页面显示实际访问地址。项目 Pages 只属于当前仓库，不会替代 GitHub 账号主页。

## 以后如何更新

1. 在本地 `EasyGlobe` 文件夹修改文件。
2. 在 GitHub Desktop 中检查变更。
3. 填写本次修改说明并提交。
4. 点击 **Push origin**。

如果已经开启 Pages，GitHub 完成新提交的部署后，网页会自动更新。

## 常见问题

### 网页打开后没有样式

确认 `assets/`、`config/`、`rebuild.css` 和 `rebuild.js` 已提交，并确认 Pages 从仓库根目录发布。

### macOS 不允许打开启动器

右键 `Start EasyGlobe.command`，选择“打开”并确认一次。启动器只会在本机启动静态文件服务。
