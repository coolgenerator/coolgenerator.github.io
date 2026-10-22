import type { Lang } from '../i18n/ui';

type Link = {
  label: string;
  /** 留空则不显示 */
  href: string;
  /** 只在某种语言下显示，例如中文平台只放中文版 */
  only?: Lang;
};

// 个人信息的唯一来源：首页、终端命令、页脚都从这里读取。
const shared = {
  name: 'Jason Wang',
  nameZh: '王劼辰',
  handle: 'jason@wang',
  location: 'San Diego, CA',
  email: 'jason.jc.wang@outlook.com',
  links: [
    { label: 'github', href: 'https://github.com/coolgenerator' },
    { label: 'linkedin', href: 'https://www.linkedin.com/in/jasonw196' },
    // 填上账号后显示，格式 https://x.com/<用户名>
    { label: 'x', href: '' },
    { label: 'instagram', href: 'https://www.instagram.com/jasonwang4509' },
    // 填上主页链接后显示，在小红书 App 里「我 → 分享主页 → 复制链接」
    { label: '小红书', href: '', only: 'zh' },
  ] as Link[],
  // 终端里轮换的文字，两种语言都用英文保持终端味道
  roles: [
    'training ML models',
    'fine-tuning language models',
    'wrangling messy data',
    'building dashboards',
    'shipping side projects',
  ],
  // 0-10，用于技能条
  skills: [
    ['Python', 9],
    ['SQL', 8],
    ['PyTorch', 7],
    ['scikit-learn', 8],
    ['Pandas', 9],
    ['Spark', 6],
    ['Tableau', 6],
    ['TypeScript', 5],
  ] as [string, number][],
};

const localized = {
  en: {
    displayName: 'Jason Wang',
    aboutName: 'Jason Wang',
    // 留空则不显示，例如 'Open to Data Science / ML internships · Summer 2027'
    status: '',
    title: 'M.S. Data Science @ UC San Diego',
    bio: [
      'M.S. Data Science student at UC San Diego (Halıcıoğlu Data Science Institute).',
      'B.S. in Math-Computer Science from UCSD, with a minor in Finance.',
      'I work on machine learning, NLP and analytics, and I like turning ideas into things that run.',
    ],
    meta: [
      { k: 'now', v: 'M.S. Data Science · UCSD' },
      { k: 'prev', v: 'B.S. Math-CS · Finance minor' },
      { k: 'focus', v: 'ML · NLP · Analytics' },
    ],
  },
  zh: {
    displayName: '王劼辰 Jason Wang',
    aboutName: '王劼辰 · Jason Wang',
    status: '',
    title: 'UC San Diego 数据科学硕士',
    bio: [
      'UC San Diego 数据科学硕士在读（Halıcıoğlu Data Science Institute）。',
      '本科毕业于 UCSD 数学-计算机科学专业，辅修金融。',
      '关注机器学习、NLP 与数据分析，喜欢把想法做成能跑的东西。',
    ],
    meta: [
      { k: 'now', v: 'UCSD 数据科学硕士' },
      { k: 'prev', v: 'UCSD 数学-计算机本科 · 辅修金融' },
      { k: 'focus', v: '机器学习 · NLP · 数据分析' },
    ],
  },
} satisfies Record<Lang, unknown>;

export function getProfile(lang: Lang) {
  const links = shared.links.filter((l) => l.href && (!l.only || l.only === lang));
  return { ...shared, ...localized[lang], links };
}

export const nav = [
  { label: 'about', href: '/#about' },
  { label: 'projects', href: '/projects/' },
  { label: 'blog', href: '/blog/' },
  { label: 'contact', href: '/contact/' },
];
