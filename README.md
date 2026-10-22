# coolgenerator.github.io

Jason Wang 的个人网站，用 Astro 构建，终端风格。

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # 输出到 dist/
```

## 改内容

英文是默认语言（`/`），中文在 `/zh/`，导航栏右上角可切换，终端里也可以输入 `lang zh` / `lang en`。

- 个人信息、技能、链接、终端里轮换的文字：`src/data/profile.ts`（简介等文字分 `en` / `zh` 两份）
- 界面文字（按钮、提示、终端输出）：`src/i18n/ui.ts`
- 作品：`src/content/projects/<en|zh>/<slug>.md`，同一个作品两种语言用同一个文件名
  （字段见 `src/content.config.ts`，`featured: true` 会显示在首页）
- 博客：`src/content/blog/<en|zh>/<slug>.md`
- 只写了一种语言也没关系：另一种语言的页面会自动显示已有版本，并提示未翻译
- 终端命令：`src/components/TerminalHero.astro` 里的 `commands`

## 部署

推送到 `main` 后由 `.github/workflows/deploy.yml` 构建并发布到 GitHub Pages
（仓库 Settings → Pages → Source 需设为 “GitHub Actions”）。
旧的 Jekyll 站点保存在 `legacy-jekyll` 分支。
