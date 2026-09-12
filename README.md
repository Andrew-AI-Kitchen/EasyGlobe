# EasyGlobe

English | [简体中文](README.zh-CN.md)

An artistic frontend study built around an interactive dotted globe, language routes, and a configurable editorial interface.

![Platform](https://img.shields.io/badge/platform-Web-73e7c5)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JavaScript-ffcb64)
![License](https://img.shields.io/badge/license-Apache--2.0-ffcb64)

[Creator](https://github.com/Andrew-AI-Kitchen) · [Reference website](https://langalpha.ai/zh-cn/home) · [Reference repository](https://github.com/ginlix-ai/LangAlpha)

![EasyGlobe interactive dotted globe](docs/screenshots/hero-globe.png)

## About

EasyGlobe explores how a high-end landing page can combine a canvas-rendered globe, geographic labels, animated routes, restrained motion, and responsive editorial layout. Translation-oriented content provides the demonstration scenario; the project itself is a frontend interaction study.

The visual direction and part of the interaction structure were reverse-engineered from the publicly accessible [LangAlpha landing page](https://langalpha.ai/zh-cn/home) and its browser-rendered output. EasyGlobe was not started by forking or cloning LangAlpha's repository. The implementation was rebuilt and adapted into a separate static experience with a different theme, content model, configuration system, and interaction behavior.

LangAlpha's official repository is public, includes its `web/` frontend, and is licensed under Apache License 2.0. EasyGlobe is not affiliated with or endorsed by LangAlpha or Ginlix AI. See [Acknowledgements](#acknowledgements) and [NOTICE](NOTICE) for the complete attribution.

## Highlights

- **Interactive dotted globe** — drag to rotate, inspect countries, and select a language pair.
- **Geographic labels** — labels follow projected coordinates and disappear on the far side.
- **Animated language routes** — selected countries receive distinct colors and a moving connection line.
- **Configurable presentation** — change branding, links, theme, colors, motion, globe speed, and country copy in the browser.
- **Local-first settings** — settings stay in browser storage and can be exported or imported as JSON.
- **Responsive editorial UI** — landing sections, tabs, workspace previews, automation flows, FAQ, and mobile navigation.
- **Portable launchers** — one-click helpers for macOS, Windows, and Linux.
- **Static deployment** — relative paths and `.nojekyll` make the project suitable for GitHub Pages without a build step.

## Screenshots

### Globe and visual direction

![EasyGlobe hero](docs/screenshots/hero-globe.png)

### Language selection and animated route

![EasyGlobe selected language route](docs/screenshots/language-route.png)

### Visual settings panel

![EasyGlobe settings panel](docs/screenshots/settings-panel.png)

### Workspace and automation presentation

![EasyGlobe workspace and automation](docs/screenshots/workspace-automation.png)

## Run locally

Python 3 is the only prerequisite. The launcher starts a local static server on an available port and opens the default browser.

| Platform | Start |
|---|---|
| macOS | Double-click `Start EasyGlobe.command`. If macOS blocks it the first time, right-click and choose **Open**. |
| Windows | Double-click `start-easyglobe.cmd`. |
| Linux | Run `./start-easyglobe.sh`. |

Universal fallback:

```bash
python3 launcher.py
```

Keep the terminal window open while using the site. Press `Ctrl+C` to stop it. Do not open `index.html` through `file://`; browsers restrict the configuration files loaded in that mode.

## Use the globe

1. Drag the globe to rotate it.
2. Select one country as the source language.
3. Select another country as the target language.
4. The two countries are highlighted and an animated route appears between them.
5. Use the swap or reset controls to change the selection.

## Customize

Select the `⌘` control in the top-right corner to open the visual settings panel. It can edit:

- project name, title, description, and links
- light, dark, or system theme
- route and source-language colors
- page motion and globe rotation speed
- visible countries, language names, samples, and tone notes

Settings are stored in the current browser and can be exported or imported as JSON. Repository defaults live in:

```text
config/site.json
config/languages.json
config/content.zh-CN.json
```

## Project structure

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

## Acknowledgements

- [LangAlpha website](https://langalpha.ai/zh-cn/home) — the public page studied for the original visual direction and interaction approach.
- [ginlix-ai/LangAlpha](https://github.com/ginlix-ai/LangAlpha) — the official open-source project, including its public web frontend, released under the [Apache License 2.0](https://github.com/ginlix-ai/LangAlpha/blob/main/LICENSE).
- [D3.js](https://d3js.org/), [Geist](https://vercel.com/font), and [Natural Earth](https://www.naturalearthdata.com/) — libraries, typeface, and geographic data used by EasyGlobe.

LangAlpha and its trademarks belong to their respective owners. Attribution describes the project's origin and does not imply sponsorship, partnership, or endorsement.

## License

EasyGlobe is released under the [Apache License 2.0](LICENSE). Code and modifications authored for this repository are covered by that license. Third-party components and data remain subject to their own terms as listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
