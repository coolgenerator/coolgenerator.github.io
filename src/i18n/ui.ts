export const languages = { en: 'EN', zh: '中文' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];

export const ui = {
  en: {
    'meta.description': 'Jason Wang — M.S. Data Science student at UC San Diego. Machine learning, NLP and analytics projects.',
    'hero.hint': 'Try typing',
    'about.contact': 'Say hi',
    'contact.description': 'Get in touch with Jason Wang — email, GitHub and LinkedIn.',
    'contact.lead': 'The fastest way to reach me is email. I usually reply within a day or two.',
    'contact.copy': 'copy',
    'contact.copied': 'copied!',
    'contact.status': 'status',
    'contact.teaser': 'Want to work together, or just say hi?',
    'contact.more': 'cd ~/contact →',
    'projects.placeholder': '# sample projects, placeholder content',
    'projects.more': 'cd ~/projects →',
    'projects.count': '{n} items · sorted by date desc',
    'projects.description': 'Portfolio of Jason Wang: machine learning, NLP and data analytics projects.',
    'projects.view': 'View',
    'blog.count': '{n} posts',
    'blog.description': 'Notes on data science and machine learning by Jason Wang.',
    'fallback.notice': 'This page is not translated yet — showing the Chinese version.',
    'footer.built': 'built with Astro and too much caffeine',
    'term.help': 'available commands:',
    'term.opening': 'opening {path} ...',
    'term.notFound': '(type <em>help</em> to list commands)',
    'term.hire': '<em>Permission granted.</em> Drop me a line at {email}.',
    'term.lang': 'switching language ...',
    'term.langUsage': 'usage: <em>lang en</em> | <em>lang zh</em>',
  },
  zh: {
    'meta.description': '王劼辰（Jason Wang）— UC San Diego 数据科学硕士在读。机器学习、NLP 与数据分析作品集。',
    'hero.hint': '试试输入',
    'about.contact': '打个招呼',
    'contact.description': '联系王劼辰（Jason Wang）：邮箱、GitHub 与 LinkedIn。',
    'contact.lead': '最快的联系方式是发邮件，一般一两天内回复。',
    'contact.copy': '复制',
    'contact.copied': '已复制',
    'contact.status': '状态',
    'contact.teaser': '想一起做点什么，或者只是打个招呼？',
    'contact.more': 'cd ~/contact →',
    'projects.placeholder': '# 示例作品，内容为占位',
    'projects.more': 'cd ~/projects →',
    'projects.count': '共 {n} 个 · 按时间倒序',
    'projects.description': '王劼辰（Jason Wang）的作品集：机器学习、NLP 与数据分析项目。',
    'projects.view': '查看',
    'blog.count': '共 {n} 篇',
    'blog.description': '王劼辰（Jason Wang）的博客：数据科学与机器学习笔记。',
    'fallback.notice': '本页暂无中文版，以下为英文原文。',
    'footer.built': '用 Astro 和过量咖啡构建',
    'term.help': '可用命令：',
    'term.opening': '正在打开 {path} ...',
    'term.notFound': '（输入 <em>help</em> 查看命令）',
    'term.hire': '<em>Permission granted.</em> 发邮件到 {email} 聊聊吧。',
    'term.lang': '正在切换语言 ...',
    'term.langUsage': '用法：<em>lang en</em> | <em>lang zh</em>',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

export function useTranslations(lang: Lang) {
  return (key: UIKey, vars: Record<string, string | number> = {}) =>
    (ui[lang][key] ?? ui[defaultLang][key]).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

/** '/projects/' + 'zh' -> '/zh/projects/' */
export function localizePath(path: string, lang: Lang) {
  return lang === defaultLang ? path : `/${lang}${path}`;
}

/** '/zh/projects/' -> '/projects/' */
export function stripLang(pathname: string) {
  const [, first, ...rest] = pathname.split('/');
  return langs.includes(first as Lang) && first !== defaultLang ? `/${rest.join('/')}` : pathname;
}
