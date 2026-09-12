# Upload EasyGlobe with GitHub Desktop

English | [简体中文](GITHUB-DESKTOP.zh-CN.md)

This guide is for the prepared `EasyGlobe` folder. The project is fully static, so uploading it does not require Node.js or a server deployment.

## 1. Select the prepared folder

Use this local path:

```text
langalpha-home-rebuild/github-upload/EasyGlobe
```

Do not select the outer `langalpha-home-rebuild` folder, and do not upload `00-source`, `01-audit`, or `03-qa`.

## 2. Add it to GitHub Desktop

1. Open GitHub Desktop and sign in to `Andrew-AI-Kitchen`.
2. Choose **File → Add Local Repository**.
3. Select the prepared `EasyGlobe` folder.
4. Choose **Add Repository**.

The prepared folder is already initialized as a local Git repository.

## 3. Create the first commit

1. Open **Changes**.
2. Confirm that the web files, `assets`, `config`, `docs`, and READMEs are selected.
3. Enter `Initial EasyGlobe release` as the summary.
4. Leave the description empty if you prefer.
5. Select **Commit to main**.

## 4. Publish the repository

1. Select **Publish repository**.
2. Set **Name** to `EasyGlobe`.
3. Use `An artistic frontend study built around an interactive dotted globe.` as the description.
4. Select `None` under **Organization** to publish under your personal account.
5. Clear **Keep this code private** if the repository should be public.
6. Select **Publish Repository**.

The repository URL will be `https://github.com/Andrew-AI-Kitchen/EasyGlobe`.

## 5. Enable GitHub Pages (optional)

1. In GitHub Desktop, choose **Repository → View on GitHub**.
2. Open the repository **Settings**.
3. Select **Pages** in the sidebar.
4. Set **Source** to **Deploy from a branch**.
5. Select the `main` branch and `/(root)` folder.
6. Select **Save**.

The expected site URL is `https://andrew-ai-kitchen.github.io/EasyGlobe/`. This project site does not replace your account homepage.

## Future updates

1. Edit files locally.
2. Review them under **Changes** in GitHub Desktop.
3. Enter a concise commit summary.
4. Select **Commit to main**.
5. Select **Push origin**.

GitHub Pages will update automatically after changes are pushed to `main`.
