import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLang, langs, type Lang } from './ui';

type Name = 'blog' | 'projects';

export type Localized<C extends Name> = {
  slug: string;
  entry: CollectionEntry<C>;
  /** true 表示请求的语言没有这篇，显示的是其他语言版本 */
  fallback: boolean;
};

/**
 * 内容按语言分目录存放：src/content/<collection>/<lang>/<slug>.md
 * 每个 slug 优先取请求的语言，没有则回退到默认语言，再回退到任意语言，
 * 这样每个 slug 在所有语言下都有页面，语言切换不会 404。
 */
export async function getLocalized<C extends Name>(collection: C, lang: Lang): Promise<Localized<C>[]> {
  const all = (await getCollection(collection)) as CollectionEntry<C>[];
  const order = [lang, defaultLang, ...langs];
  const best = new Map<string, CollectionEntry<C>>();
  for (const entry of all) {
    const [l, ...rest] = entry.id.split('/');
    const slug = rest.join('/');
    const current = best.get(slug);
    if (!current || order.indexOf(l as Lang) < order.indexOf(current.id.split('/')[0] as Lang)) {
      best.set(slug, entry);
    }
  }
  return [...best].map(([slug, entry]) => ({ slug, entry, fallback: !entry.id.startsWith(`${lang}/`) }));
}

export const byDateDesc = (a: { entry: { data: { date: Date } } }, b: { entry: { data: { date: Date } } }) =>
  b.entry.data.date.valueOf() - a.entry.data.date.valueOf();
