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
    'tuning RL policies',
    'building AI agents',
    'untangling cause and effect',
    'modeling markets',
    'reading about qubits',
    'practicing the trumpet',
  ],
  // 按方向分组，显示为 skills.json
  skills: [
    { group: 'languages', items: ['Python', 'Go', 'TypeScript', 'SQL'] },
    { group: 'ml', items: ['PyTorch', 'scikit-learn', 'SciPy'] },
    { group: 'rl', items: ['Gymnasium', 'PyTorch'] },
    // 智能体按能力分类，而不是按工具
    { group: 'agents', items: ['RSI', 'memory', 'tool use', 'planning', 'multi-agent', 'LLM-as-judge'] },
    { group: 'causal', items: ['PCMCI', 'causal-learn', 'DAGMA', 'Granger'] },
    { group: 'infra', items: ['FastAPI', 'PostgreSQL', 'Docker', 'AWS'] },
  ] as { group: string; items: string[] }[],
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
      'I focus on machine learning, reinforcement learning, AI agents, causal analysis and quantitative finance, and I like turning ideas into things that run.',
      'Outside of that: quantum computing, robotics and music — I play the trumpet.',
    ],
    meta: [
      { k: 'now', v: 'M.S. Data Science · UCSD' },
      { k: 'prev', v: 'B.S. Math-CS · Finance minor' },
      { k: 'focus', v: 'ML · RL · AI Agents · Causal · Quant' },
      { k: 'hobby', v: 'Quantum · Robotics · Music (trumpet)' },
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
      '主要关注机器学习、强化学习、AI 智能体、因果分析和量化金融，喜欢把想法做成能跑的东西。',
      '业余时间喜欢量子计算、机器人和音乐，平时吹小号。',
    ],
    meta: [
      { k: 'now', v: 'UCSD 数据科学硕士' },
      { k: 'prev', v: 'UCSD 数学-计算机本科 · 辅修金融' },
      { k: 'focus', v: '机器学习 · 强化学习 · AI 智能体 · 因果分析 · 量化' },
      { k: 'hobby', v: '量子计算 · 机器人 · 音乐（小号）' },
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
