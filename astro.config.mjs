// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://coolgenerator.github.io',
  markdown: {
    // 双主题代码高亮，颜色由 global.css 按当前主题选择
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
});
