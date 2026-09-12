# Upload EasyGlobe with GitHub Desktop

English | [简体中文](GITHUB-DESKTOP.zh-CN.md)

EasyGlobe is a static frontend project. Uploading it does not require Node.js, a database, or a backend deployment.

## 1. Add the local repository

1. Open GitHub Desktop and sign in.
2. Choose **File → Add Local Repository**.
3. Select the `EasyGlobe` folder containing `index.html`, `README.md`, and `.git`.
4. Choose **Add Repository**.

Do not select a parent workspace or upload audit/source folders from another project. The prepared `EasyGlobe` folder is already initialized on the `main` branch.

## 2. Review the first commit

Before committing, confirm that these items are present:

- the webpage files: `index.html`, `rebuild.css`, and `rebuild.js`
- `assets/` and `config/`
- screenshots and bilingual documentation under `docs/`
- `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`
- the macOS, Windows, and Linux launchers

Enter a concise summary such as `Initial EasyGlobe release`, then choose **Commit to main**.

## 3. Publish the repository

1. Choose **Publish repository**.
2. Set the repository name to `EasyGlobe`, or another final name of your choice.
3. Add a short description, for example: `An artistic frontend study built around an interactive dotted globe.`
4. Choose the intended owner or organization.
5. Clear **Keep this code private** if it should be open source.
6. Choose **Publish Repository**.

After publishing, use **Repository → View on GitHub** to open the repository.

## 4. Enable GitHub Pages (optional)

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/(root)`.
5. Save the setting.

GitHub displays the real deployment address on the same Pages screen when publishing finishes. A project Pages site is attached to this repository and does not replace an account profile page.

## Future updates

1. Edit files in the local `EasyGlobe` folder.
2. Review the changes in GitHub Desktop.
3. Commit with a description of the change.
4. Choose **Push origin**.

If Pages is enabled, the site is updated after GitHub finishes deploying the new commit.

## Troubleshooting

### The webpage has no styling

Confirm that `assets/`, `config/`, `rebuild.css`, and `rebuild.js` were committed, and that Pages publishes from the repository root.

### macOS blocks the launcher

Right-click `Start EasyGlobe.command`, choose **Open**, and confirm once. The launcher only starts a local static file server.
