# 使用 GitHub Desktop 上传 EasyGlobe

[English](GITHUB-DESKTOP.md) | 简体中文

这份指南对应已经整理好的 `EasyGlobe` 文件夹。网页是纯静态项目，上传不需要安装 Node.js，也不需要配置服务器。

## 第一步：确认文件夹

需要选择的本地路径是：

```text
langalpha-home-rebuild/github-upload/EasyGlobe
```

不要选择外层的 `langalpha-home-rebuild`，也不要上传 `00-source`、`01-audit` 或 `03-qa`。

## 第二步：添加到 GitHub Desktop

1. 打开 GitHub Desktop 并登录 `Andrew-AI-Kitchen`。
2. 点击菜单 **File → Add Local Repository**。
3. 点击 **Choose**，选择上面的 `EasyGlobe` 文件夹。
4. 点击 **Add Repository**。

发布文件夹已经初始化为本地 Git 仓库，所以不需要再次创建目录。

## 第三步：建立第一次提交

1. 打开左侧 **Changes**。
2. 确认网页文件、`assets`、`config`、`docs` 和 README 都被选中。
3. 在 **Summary** 填写：

```text
Initial EasyGlobe release
```

4. **Description** 可以留空。
5. 点击 **Commit to main**。

## 第四步：发布仓库

1. 点击顶部的 **Publish repository**。
2. **Name** 填写 `EasyGlobe`。
3. **Description** 建议填写：

```text
An artistic frontend study built around an interactive dotted globe.
```

4. **Organization** 选择 `None`，发布到你的个人账号。
5. 如果希望别人看到代码，取消勾选 **Keep this code private**。
6. 点击 **Publish Repository**。

发布完成后，仓库地址应为：

```text
https://github.com/Andrew-AI-Kitchen/EasyGlobe
```

## 第五步：开启 GitHub Pages（可选）

1. 在 GitHub Desktop 中选择 **Repository → View on GitHub**。
2. 进入仓库网页的 **Settings**。
3. 在左侧找到 **Pages**。
4. **Source** 选择 **Deploy from a branch**。
5. **Branch** 选择 `main`。
6. 目录选择 `/(root)`。
7. 点击 **Save**。

部署通常需要几分钟。完成后的地址预计为：

```text
https://andrew-ai-kitchen.github.io/EasyGlobe/
```

这个项目页面不会替代你的账号主页；每个仓库都可以单独拥有一个项目页面。

## 以后如何更新

1. 在本地修改文件。
2. 回到 GitHub Desktop 的 **Changes**。
3. 填写本次修改说明。
4. 点击 **Commit to main**。
5. 点击 **Push origin**。

开启 Pages 后，推送到 `main` 的修改会自动更新网站。

## 常见问题

### GitHub 链接暂时打开 404

第一次发布仓库前，`https://github.com/Andrew-AI-Kitchen/EasyGlobe` 还不存在，因此这是正常现象。完成 **Publish repository** 后链接就会生效。

### Pages 打开后样式丢失

确认 Pages 的发布目录是 `/(root)`，并确认 `assets`、`config`、`rebuild.css` 和 `rebuild.js` 已经提交。

### macOS 不允许打开启动器

右键 `Start EasyGlobe.command`，选择“打开”，再确认一次。启动器只会在本机启动静态网页服务。
